import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
  type RefObject
} from "react";
import { jsPDF } from "jspdf";
import { dictionaries } from "../i18n/dictionaries";
import {
  detectIntent,
  initialConversationState,
  processMessage,
  scenarioIds,
  type ChatAction,
  type ChatOption,
  type ConversationState
} from "../lib/chat-engine";
import WorkflowDiagram from "./WorkflowDiagram";
import type { InvoiceData, Locale, ScenarioId } from "../lib/types";

type View = "chat" | "automation";

type Message = {
  id: number;
  sender: "assistant" | "visitor";
  text: string;
  time: string;
  options?: ChatOption[];
  invoice?: InvoiceData;
  invoiceNumber?: string;
  invoiceDate?: string;
};

function currentTime(locale: Locale): string {
  return new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date());
}

function welcomeMessage(locale: Locale): Message {
  const copy = dictionaries[locale];
  return {
    id: 0,
    sender: "assistant",
    text: copy.chat.welcome,
    time: copy.chat.timeNow,
    options: scenarioIds.map((id) => ({
      label: copy.chat.menuOptions[id],
      action: `scenario:${id}`
    }))
  };
}

function icon(
  name: "arrow" | "restart" | "attachment" | "spark",
  className = "h-5 w-5"
) {
  const paths = {
    arrow: (
      <path d="M4 10h11m-4.5-4.5L15 10l-4.5 4.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    ),
    restart: (
      <path d="M4.2 7.1A6 6 0 1 1 4 12.8M4.2 7.1V3.8m0 3.3h3.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    ),
    attachment: (
      <path d="m7.4 10.7 5.2-5.2a3.1 3.1 0 0 1 4.4 4.4l-7.5 7.5a4.4 4.4 0 0 1-6.2-6.2l7.2-7.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    ),
    spark: (
      <>
        <path d="m10 2 1.5 5.2L17 9l-5.5 1.8L10 16l-1.6-5.2L3 9l5.4-1.8L10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="m15.4 13 .7 2.1 2.1.7-2.1.7-.7 2.1-.7-2.1-2.1-.7 2.1-.7.7-2.1Z" fill="currentColor" />
      </>
    )
  };
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 20 20" fill="none">
      {paths[name]}
    </svg>
  );
}

function createInvoicePdf(
  data: InvoiceData,
  locale: Locale,
  invoiceNumber: string,
  issueDate: string
) {
  const copy = dictionaries[locale];
  const product = copy.chat.products[data.product];
  const unitPrice = Number(product.price.replace(/[^\d.]/g, ""));
  const total = unitPrice * data.quantity;
  const currency = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: copy.chat.currencyCode
  });
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();

  pdf.setFillColor(20, 35, 40);
  pdf.rect(0, 0, pageWidth, 45, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(23);
  pdf.text("Converso", 18, 22);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.text(locale === "en" ? "Business automation demo" : "Demostración de automatización empresarial", 18, 31);

  pdf.setTextColor(30, 43, 46);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(20);
  pdf.text(locale === "en" ? "INVOICE" : "FACTURA", 18, 66);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text(`${copy.chat.invoiceNumberLabel}: ${invoiceNumber}`, 18, 77);
  pdf.text(`${copy.chat.invoiceDateLabel}: ${issueDate}`, 18, 84);

  pdf.setFont("helvetica", "bold");
  pdf.text(copy.chat.invoiceNameLabel.toUpperCase(), 18, 105);
  pdf.setFont("helvetica", "normal");
  pdf.text(data.customerName, 18, 113);
  pdf.text(data.customerEmail, 18, 120);

  pdf.setFillColor(239, 246, 243);
  pdf.roundedRect(18, 137, pageWidth - 36, 12, 2, 2, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  pdf.text(copy.chat.invoiceItemLabel, 23, 145);
  pdf.text(copy.chat.invoiceQuantityLabel, 115, 145);
  pdf.text(copy.chat.invoiceUnitPriceLabel, 137, 145);
  pdf.text(copy.chat.invoiceTotalLabel, 170, 145);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  const itemName = pdf.splitTextToSize(product.name, 80) as string[];
  pdf.text(itemName, 23, 161);
  pdf.text(String(data.quantity), 115, 161);
  pdf.text(currency.format(unitPrice), 137, 161);
  pdf.text(currency.format(total), 170, 161);
  pdf.setDrawColor(224, 232, 228);
  pdf.line(18, 180, pageWidth - 18, 180);

  pdf.setFont("helvetica", "normal");
  pdf.text(copy.chat.invoiceSubtotalLabel, 132, 194);
  pdf.text(currency.format(total), 170, 194);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.text(copy.chat.invoiceTotalLabel, 132, 206);
  pdf.text(currency.format(total), 170, 206);

  pdf.setTextColor(227, 236, 230);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(42);
  pdf.text(copy.chat.invoiceWatermark, pageWidth / 2, 236, {
    align: "center",
    angle: -22
  });
  pdf.setTextColor(174, 76, 67);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(locale === "en" ? 14 : 11);
  pdf.text(copy.chat.invoiceDisclaimer, pageWidth / 2, 266, {
    align: "center",
    maxWidth: pageWidth - 32
  });
  pdf.setTextColor(114, 125, 121);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.text(
    locale === "en"
      ? "Fictional example only. No tax, payment, or fiscal validity is represented."
      : "Ejemplo ficticio. No representa validez fiscal, tributaria ni de pago.",
    pageWidth / 2,
    276,
    { align: "center", maxWidth: pageWidth - 32 }
  );

  pdf.save(`converso-${invoiceNumber.toLowerCase()}.pdf`);
}

export default function ConversoApp({ locale }: { locale: Locale }) {
  const copy = dictionaries[locale];
  const [view, setView] = useState<View>("chat");
  const [showInitialChatPulse, setShowInitialChatPulse] = useState(true);
  const [scenario, setScenario] = useState<ScenarioId>("general");
  const [conversation, setConversation] =
    useState<ConversationState>(initialConversationState);
  const [messages, setMessages] = useState<Message[]>(() => [
    welcomeMessage(locale)
  ]);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const [attachmentName, setAttachmentName] = useState("");
  const messagesEnd = useRef<HTMLDivElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const nextId = useRef(1);
  const invoiceCount = useRef(1);
  const stateRef = useRef(conversation);
  const typingTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const syncView = () => {
      setView(
        new URLSearchParams(window.location.search).get("view") === "automation"
          ? "automation"
          : "chat"
      );
    };
    syncView();
    window.addEventListener("popstate", syncView);
    return () => {
      window.removeEventListener("popstate", syncView);
      if (typingTimer.current !== undefined) window.clearTimeout(typingTimer.current);
    };
  }, []);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, typing]);

  function changeView(next: View) {
    setView(next);
    const url = new URL(window.location.href);
    if (next === "chat") url.searchParams.delete("view");
    else url.searchParams.set("view", "automation");
    window.history.pushState({ view: next }, "", `${url.pathname}${url.search}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function sendMessage(text: string, action?: ChatAction) {
    const cleanText = text.trim();
    if ((!cleanText && !attachmentName) || typing) return;
    const visibleText = attachmentName
      ? `${cleanText ? `${cleanText}\n` : ""}📎 ${attachmentName} — ${copy.chat.attachmentNotice}`
      : cleanText;
    const userMessage: Message = {
      id: nextId.current++,
      sender: "visitor",
      text: visibleText,
      time: currentTime(locale)
    };
    setMessages((existing) => [...existing, userMessage]);
    setDraft("");
    setAttachmentName("");
    setTyping(true);

    if (action?.startsWith("scenario:")) {
      setScenario(action.slice("scenario:".length) as ScenarioId);
    } else if (stateRef.current.flow === "menu") {
      const intent = detectIntent(cleanText);
      if (intent) setScenario(intent);
    } else if (/human|agent|persona|humano|agente/i.test(cleanText)) {
      setScenario("human");
    }

    typingTimer.current = window.setTimeout(() => {
      const result = processMessage(stateRef.current, cleanText, locale, action);
      stateRef.current = result.state;
      setConversation(result.state);
      if (result.state.flow.startsWith("invoice-")) setScenario("invoice");
      if (result.state.flow === "human-contact" || result.state.flow === "human-confirmed") {
        setScenario("human");
      }
      const invoiceNumber = result.invoice
        ? `CV-${new Date().getFullYear()}-${String(invoiceCount.current++).padStart(3, "0")}`
        : undefined;
      const invoiceDate = result.invoice
        ? new Intl.DateTimeFormat(locale, {
            year: "numeric",
            month: "long",
            day: "numeric"
          }).format(new Date())
        : undefined;
      setMessages((existing) => [
        ...existing,
        {
          id: nextId.current++,
          sender: "assistant",
          text: result.response,
          time: currentTime(locale),
          options: result.options,
          invoice: result.invoice,
          invoiceNumber,
          invoiceDate
        }
      ]);
      setTyping(false);
      typingTimer.current = undefined;
    }, 420);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendMessage(draft);
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      sendMessage(draft);
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    if (file) setAttachmentName(file.name);
    event.currentTarget.value = "";
  }

  function restartConversation() {
    if (typingTimer.current !== undefined) {
      window.clearTimeout(typingTimer.current);
      typingTimer.current = undefined;
    }
    stateRef.current = initialConversationState;
    setConversation(initialConversationState);
    setMessages([welcomeMessage(locale)]);
    setDraft("");
    setAttachmentName("");
    setTyping(false);
    setScenario("general");
    nextId.current = 1;
  }

  function downloadInvoice(message: Message) {
    if (!message.invoice || !message.invoiceNumber || !message.invoiceDate) return;
    createInvoicePdf(
      message.invoice,
      locale,
      message.invoiceNumber,
      message.invoiceDate
    );
  }

  const latestAssistantId = [...messages]
    .reverse()
    .find((message) => message.sender === "assistant")?.id;

  return (
    <div className="min-h-screen">
      <header className="page-shell flex min-h-[78px] items-center justify-between gap-5 border-b border-[#e2e8e4]">
        <a
          href={`/${locale}/`}
          className="flex items-center gap-3 rounded-xl no-underline"
          aria-label={`Converso — ${copy.brand.tagline}`}
        >
          <span className="brand-mark" aria-hidden="true">c.</span>
          <span className="block">
            <span className="block text-[17px] font-bold tracking-[-0.045em] text-[#152320]">
              converso
            </span>
            <span className="hidden text-[11px] text-[#65726e] sm:block">
              {copy.brand.tagline}
            </span>
          </span>
        </a>
        <nav className="flex items-center gap-2 sm:gap-4" aria-label={copy.nav.menu}>
          <div
            className="flex items-center rounded-xl border border-[#dfe7e2] bg-white p-1"
            aria-label={copy.nav.menu}
          >
            <button
              type="button"
              aria-pressed={view === "chat"}
              onClick={() => changeView("chat")}
              className={`rounded-lg px-3 py-2 text-xs font-semibold transition sm:px-4 sm:text-sm ${
                view === "chat"
                  ? "bg-[#d9f2e3] text-[#14532d]"
                  : "text-[#4d5e54] hover:bg-[#f5f8f6]"
              }`}
            >
              {copy.nav.chat}
            </button>
            <button
              type="button"
              aria-pressed={view === "automation"}
              onClick={() => changeView("automation")}
              className={`rounded-lg px-3 py-2 text-xs font-semibold transition sm:px-4 sm:text-sm ${
                view === "automation"
                  ? "bg-[#d9f2e3] text-[#14532d]"
                  : "text-[#4d5e54] hover:bg-[#f5f8f6]"
              }`}
            >
              {copy.nav.automation}
            </button>
          </div>
        </nav>
      </header>

      <main className="page-shell pb-14 pt-8 sm:pt-12">
        {view === "chat" ? (
          <ChatExperience
            locale={locale}
            showInitialChatPulse={showInitialChatPulse}
            onPhoneInteraction={() => setShowInitialChatPulse(false)}
            messages={messages}
            latestAssistantId={latestAssistantId}
            typing={typing}
            draft={draft}
            attachmentName={attachmentName}
            conversation={conversation}
            messagesEnd={messagesEnd}
            fileInput={fileInput}
            setDraft={setDraft}
            setAttachmentName={setAttachmentName}
            onSubmit={handleSubmit}
            onInputKeyDown={handleInputKeyDown}
            onQuickReply={sendMessage}
            onRestart={restartConversation}
            onFileChange={handleFileChange}
            onDownloadInvoice={downloadInvoice}
            onOpenWorkflow={() => changeView("automation")}
          />
        ) : (
          <AutomationExperience
            locale={locale}
            scenario={scenario}
            onSelect={setScenario}
          />
        )}
      </main>
      <footer className="page-shell flex flex-col gap-3 border-t border-[#e2e8e4] py-6 text-xs text-[#7b8983] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between gap-5 sm:justify-end">
          <span className="font-medium">{copy.footer.attribution}</span>
          <nav className="flex items-center gap-2 border-l border-[#dfe7e2] pl-3" aria-label={copy.nav.language}>
            {(["en", "es"] as Locale[]).map((target) => (
              <a
                key={target}
                href={`/${target}/${view === "automation" ? "?view=automation" : ""}`}
                lang={target}
                aria-current={locale === target ? "page" : undefined}
                className={`rounded-md px-1 py-1 font-bold tracking-wide no-underline transition ${
                  locale === target ? "text-[#215d43]" : "text-[#89948f] hover:text-[#152320]"
                }`}
              >
                {target.toUpperCase()}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}

function ChatExperience({
  locale,
  showInitialChatPulse,
  onPhoneInteraction,
  messages,
  latestAssistantId,
  typing,
  draft,
  attachmentName,
  conversation,
  messagesEnd,
  fileInput,
  setDraft,
  setAttachmentName,
  onSubmit,
  onInputKeyDown,
  onQuickReply,
  onRestart,
  onFileChange,
  onDownloadInvoice,
  onOpenWorkflow
}: {
  locale: Locale;
  showInitialChatPulse: boolean;
  onPhoneInteraction: () => void;
  messages: Message[];
  latestAssistantId: number | undefined;
  typing: boolean;
  draft: string;
  attachmentName: string;
  conversation: ConversationState;
  messagesEnd: RefObject<HTMLDivElement | null>;
  fileInput: RefObject<HTMLInputElement | null>;
  setDraft: (value: string) => void;
  setAttachmentName: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onInputKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  onQuickReply: (text: string, action?: ChatAction) => void;
  onRestart: () => void;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onDownloadInvoice: (message: Message) => void;
  onOpenWorkflow: () => void;
}) {
  const copy = dictionaries[locale];

  return (
    <>
      <section className="hero-grid">
        <div className="hero-copy">
          <p className="mb-4 text-[11px] font-bold tracking-[0.17em] text-[#26815b]">
            {copy.hero.eyebrow}
          </p>
          <h1 className="max-w-[620px] text-[clamp(2.4rem,5vw,4.35rem)] font-semibold leading-[1.04] tracking-[-0.065em] text-[#152320]">
            {copy.hero.title}
          </h1>
          <p className="mt-5 max-w-[540px] text-[16px] leading-7 text-[#62706b] sm:text-lg">
            {copy.hero.description}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="#agent"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#1f7652] px-5 py-3 text-sm font-semibold text-white no-underline transition hover:bg-[#185f41]"
            >
              {copy.hero.tryAgent}
              {icon("arrow", "h-4 w-4")}
            </a>
            <button
              type="button"
              onClick={onOpenWorkflow}
              className="min-h-11 rounded-xl border border-[#d8e2dc] bg-white px-5 py-3 text-sm font-semibold text-[#29443a] transition hover:border-[#93b5a1] hover:bg-[#f4faf6]"
            >
              {copy.hero.exploreWorkflow}
            </button>
          </div>
          <p className="mt-5 max-w-[470px] border-l-2 border-[#44b88a] pl-3 text-xs leading-5 text-[#65736d]">
            {copy.chat.demoNote}
          </p>
          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-[#57665f]">
            {scenarioIds.map((id) => (
              <span key={id} className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#39a579]" aria-hidden="true" />
                {copy.chat.menuOptions[id]}
              </span>
            ))}
          </div>
        </div>
        <div id="agent" className="flex justify-center scroll-mt-6 lg:justify-end">
          <div className="w-full max-w-[382px]">
            <PhoneChat
              locale={locale}
              showInitialChatPulse={showInitialChatPulse}
              onPhoneInteraction={onPhoneInteraction}
              messages={messages}
              latestAssistantId={latestAssistantId}
              typing={typing}
              draft={draft}
              attachmentName={attachmentName}
              conversation={conversation}
              messagesEnd={messagesEnd}
              fileInput={fileInput}
              setDraft={setDraft}
              setAttachmentName={setAttachmentName}
              onSubmit={onSubmit}
              onInputKeyDown={onInputKeyDown}
              onQuickReply={onQuickReply}
              onRestart={onRestart}
              onFileChange={onFileChange}
              onDownloadInvoice={onDownloadInvoice}
            />
          </div>
        </div>
      </section>

      <section className="mt-16 border-t border-[#e2e8e4] pt-10">
        <div className="mb-6 max-w-[650px]">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#26815b]">
            {copy.automation.eyebrow}
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#152320]">
            {copy.automation.title}
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {copy.automation.capabilityCards.map((card, index) => (
            <article key={card.title} className="rounded-2xl border border-[#e2e8e4] bg-white p-5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#eef8f3] text-sm font-bold text-[#267857]">
                {["↗", "◇", "⌕", "▤", "◎", "⑂"][index]}
              </span>
              <h3 className="mt-4 text-sm font-bold text-[#21372e]">{card.title}</h3>
              <p className="mt-1.5 text-sm leading-6 text-[#64736b]">{card.description}</p>
            </article>
          ))}
        </div>
        <button
          type="button"
          onClick={onOpenWorkflow}
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#1f7652] hover:text-[#154f38]"
        >
          {copy.hero.exploreWorkflow}
          {icon("arrow", "h-4 w-4")}
        </button>
      </section>
    </>
  );
}

function PhoneChat({
  locale,
  showInitialChatPulse,
  onPhoneInteraction,
  messages,
  latestAssistantId,
  typing,
  draft,
  attachmentName,
  conversation,
  messagesEnd,
  fileInput,
  setDraft,
  setAttachmentName,
  onSubmit,
  onInputKeyDown,
  onQuickReply,
  onRestart,
  onFileChange,
  onDownloadInvoice
}: {
  locale: Locale;
  showInitialChatPulse: boolean;
  onPhoneInteraction: () => void;
  messages: Message[];
  latestAssistantId: number | undefined;
  typing: boolean;
  draft: string;
  attachmentName: string;
  conversation: ConversationState;
  messagesEnd: RefObject<HTMLDivElement | null>;
  fileInput: RefObject<HTMLInputElement | null>;
  setDraft: (value: string) => void;
  setAttachmentName: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onInputKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  onQuickReply: (text: string, action?: ChatAction) => void;
  onRestart: () => void;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onDownloadInvoice: (message: Message) => void;
}) {
  const copy = dictionaries[locale];

  return (
    <section
      className="phone-frame soft-shadow"
      aria-label={copy.chat.messagesLabel}
      onClickCapture={(event) => {
        if (
          event.target instanceof HTMLElement &&
          event.target.closest("button, textarea")
        ) {
          onPhoneInteraction();
        }
      }}
      onKeyDownCapture={(event) => {
        if (
          (event.key === "Enter" || event.key === " ") &&
          event.target instanceof HTMLElement &&
          event.target.closest("button, textarea")
        ) {
          onPhoneInteraction();
        }
      }}
    >
      <div className="phone-camera" aria-hidden="true"><span /></div>
      <div className="phone-status" aria-label={copy.chat.phoneStatus}>
        <span>9:41</span>
        <span className="flex items-center gap-1" aria-hidden="true">
          <span className="phone-signal">▂▅▇</span>
          <span className="phone-wifi">⌁</span>
          <span className="phone-battery"><i /></span>
        </span>
      </div>
      <header className="phone-header">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="text-lg text-white/85" aria-hidden="true">‹</span>
          <span className="phone-avatar" aria-hidden="true">N</span>
          <span className="min-w-0">
            <span className="block truncate text-[13px] font-semibold text-white">
              Northstar Goods
            </span>
            <span className="block text-[10px] text-white/75">{copy.chat.online}</span>
          </span>
        </div>
        <div className="flex items-center gap-3 text-white/85" aria-hidden="true">
          <span>⌕</span>
          <span>⋮</span>
        </div>
      </header>
      <button
        type="button"
        className="phone-restart"
        aria-label={copy.chat.restartLabel}
        onClick={onRestart}
      >
        {icon("restart", "h-3.5 w-3.5")}
        {copy.chat.restart}
      </button>

      <div className="phone-screen">
        <div
          className="phone-messages"
          role="log"
          aria-label={copy.chat.messagesLabel}
          aria-live="polite"
          aria-relevant="additions text"
        >
          <p className="phone-day-label">
            {copy.chat.today}
          </p>
          <ol className="space-y-2.5">
            {messages.map((message) => {
              const isAssistant = message.sender === "assistant";
              return (
                <li
                  key={message.id}
                  className={`message-enter flex ${isAssistant ? "justify-start" : "justify-end"}`}
                >
                  <div className={`max-w-[91%] ${isAssistant ? "" : "text-right"}`}>
                    <div className={`phone-bubble ${isAssistant ? "phone-bubble-agent" : "phone-bubble-customer"}`}>
                      <p className="whitespace-pre-line">{message.text}</p>
                      {message.invoice && (
                        <div className="mt-2 rounded-lg border border-[#e8d4a9] bg-[#fff9eb] p-2 text-left text-[10px] leading-4 text-[#635338]">
                          <strong className="block">{copy.chat.invoiceDisclaimer}</strong>
                          <span>{message.invoiceNumber} · {copy.chat.products[message.invoice.product].name} · ×{message.invoice.quantity}</span>
                        </div>
                      )}
                      <div className="mt-1.5 flex items-center justify-end gap-1 text-[9px] text-[#77827d]">
                        <span>{message.time}</span>
                        {!isAssistant && (
                          <span className="text-[#2982a1]" aria-label={copy.chat.messageDelivered}>✓✓</span>
                        )}
                      </div>
                    </div>
                    {isAssistant && message.id === latestAssistantId && (
                      <>
                        {message.invoice && (
                          <button
                            type="button"
                            onClick={() => onDownloadInvoice(message)}
                            className="invoice-download mt-2"
                          >
                            {copy.chat.invoiceDownload}
                          </button>
                        )}
                        {message.options && message.options.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5" aria-label={copy.chat.quickReplies}>
                            {message.options.map((reply, index) => (
                              <button
                                key={`${reply.action}-${index}`}
                                type="button"
                                disabled={typing}
                                onClick={() => onQuickReply(reply.label, reply.action)}
                                className={`phone-quick-reply${showInitialChatPulse && index === 0 ? " phone-quick-reply-pulse" : ""}`}
                              >
                                {reply.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
          {typing && (
            <div className="mt-3 flex items-center gap-2" role="status">
              <span className="phone-bubble phone-bubble-agent flex gap-1 px-3 py-3">
                <i className="typing-dot" /><i className="typing-dot" /><i className="typing-dot" />
              </span>
              <span className="sr-only">{copy.chat.typing}</span>
            </div>
          )}
          <div ref={messagesEnd} />
        </div>
        <div className="phone-composer">
          {attachmentName && (
            <div className="mb-2 flex items-center justify-between rounded-lg bg-[#edf6f1] px-2.5 py-1.5 text-[10px] text-[#375c49]">
              <span className="truncate">📎 {attachmentName}</span>
              <button
                type="button"
                onClick={() => setAttachmentName("")}
                aria-label={locale === "en" ? "Remove attachment" : "Quitar archivo adjunto"}
              >
                ×
              </button>
            </div>
          )}
          <form onSubmit={onSubmit} className="flex items-end gap-2">
            <input
              ref={fileInput}
              type="file"
              className="sr-only"
              aria-label={copy.chat.attachFile}
              onChange={onFileChange}
            />
            <button
              type="button"
              className="grid h-9 w-8 shrink-0 place-items-center text-[#76827d]"
              aria-label={copy.chat.attachFile}
              onClick={() => fileInput.current?.click()}
            >
              {icon("attachment", "h-[18px] w-[18px]")}
            </button>
            <label className="sr-only" htmlFor="converso-message">
              {copy.chat.messageLabel}
            </label>
            <textarea
              id="converso-message"
              rows={1}
              maxLength={500}
              value={draft}
              onChange={(event) => setDraft(event.currentTarget.value)}
              onKeyDown={onInputKeyDown}
              placeholder={
                conversation.flow === "human-contact"
                  ? copy.chat.contactPlaceholder
                  : copy.chat.placeholder
              }
              disabled={typing}
              aria-describedby="converso-input-hint"
              className="phone-input"
            />
            <button
              type="submit"
              disabled={typing || (!draft.trim() && !attachmentName)}
              aria-label={copy.chat.send}
              className="phone-send"
            >
              {icon("arrow", "h-4 w-4")}
            </button>
          </form>
          <p id="converso-input-hint" className="mt-1.5 px-1 text-[9px] text-[#7a8580]">
            {copy.chat.inputHint}
          </p>
        </div>
      </div>
      <div className="phone-home-indicator" aria-hidden="true"><span /></div>
    </section>
  );
}

function AutomationExperience({
  locale,
  scenario,
  onSelect
}: {
  locale: Locale;
  scenario: ScenarioId;
  onSelect: (id: ScenarioId) => void;
}) {
  const copy = dictionaries[locale];

  return (
    <section id="workflow" className="scroll-mt-6">
      <div className="mb-8 max-w-[820px]">
        <p className="mb-3 text-[11px] font-bold tracking-[0.17em] text-[#26815b]">
          {copy.automation.eyebrow}
        </p>
        <h1 className="page-heading max-w-[740px]">{copy.automation.title}</h1>
        <p className="mt-4 max-w-[750px] text-[15px] leading-7 text-[#62706b] sm:text-base">
          {copy.automation.description}
        </p>
      </div>
      <div className="mb-5 flex flex-wrap gap-2" aria-label={copy.automation.chooseFlow}>
        {scenarioIds.map((id) => (
          <button
            key={id}
            type="button"
            aria-pressed={scenario === id}
            onClick={() => onSelect(id)}
            className={`rounded-full border px-3.5 py-2 text-xs font-semibold transition ${
              scenario === id
                ? "border-[#1f7652] bg-[#1f7652] text-white"
                : "border-[#dfe7e2] bg-white text-[#52645b] hover:border-[#8db39c]"
            }`}
          >
            {copy.chat.menuOptions[id]}
          </button>
        ))}
      </div>
      <WorkflowDiagram
        locale={locale}
        scenario={scenario}
        active
      />
    </section>
  );
}
