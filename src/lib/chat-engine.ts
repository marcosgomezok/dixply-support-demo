import { dictionaries } from "../i18n/dictionaries";
import type {
  GeneralTopic,
  InvoiceData,
  Locale,
  OrderId,
  ProductCategory,
  ProductId,
  ScenarioId,
  TechnicalCategory,
  WorkflowStage
} from "./types";

type Copy = (typeof dictionaries)[Locale];

export type ChatAction =
  | "menu"
  | `scenario:${ScenarioId}`
  | `general:${GeneralTopic}`
  | `category:${ProductCategory}`
  | `product:${ProductId | "changeCategory"}`
  | `technical:${TechnicalCategory | "resolved" | "unresolved"}`
  | `invoice:product:${ProductId}`
  | "invoice:confirm"
  | "invoice:cancel"
  | "invoice:new";

export type ChatOption = { label: string; action: ChatAction };
export type WorkflowNodeId =
  | "trigger"
  | "normalize"
  | "agent"
  | "router"
  | "business"
  | "invoice"
  | "response"
  | "handoff";

export type ConversationState =
  | { flow: "menu" }
  | { flow: "general-topic" }
  | { flow: "product-category" }
  | {
      flow: "product-item";
      category: ProductCategory;
      selected?: ProductId;
    }
  | { flow: "order-number" }
  | { flow: "technical-category" }
  | { flow: "technical-description"; category: TechnicalCategory }
  | { flow: "technical-feedback"; category: TechnicalCategory; issue: string }
  | { flow: "human-contact" }
  | { flow: "human-confirmed" }
  | { flow: "invoice-product" }
  | { flow: "invoice-quantity"; product: ProductId }
  | { flow: "invoice-name"; product: ProductId; quantity: number }
  | {
      flow: "invoice-email";
      product: ProductId;
      quantity: number;
      customerName: string;
    }
  | { flow: "invoice-review"; data: InvoiceData }
  | { flow: "invoice-generated"; data: InvoiceData };

export type EngineResult = {
  state: ConversationState;
  response: string;
  options: ChatOption[];
  invoice?: InvoiceData;
};

export const initialConversationState: ConversationState = { flow: "menu" };

export const scenarioIds: ScenarioId[] = [
  "general",
  "products",
  "orders",
  "technical",
  "invoice",
  "human"
];

export const workflowStages: Record<ScenarioId, WorkflowStage[]> = {
  general: ["incoming", "intent", "routing", "response"],
  products: ["incoming", "intent", "routing", "customerData", "response"],
  orders: ["incoming", "intent", "customerData", "routing", "response"],
  technical: ["incoming", "intent", "routing", "customerData", "response"],
  invoice: ["incoming", "intent", "customerData", "invoice", "response"],
  human: ["incoming", "intent", "customerData", "handoff"]
};

export const workflowNodePaths: Record<ScenarioId, WorkflowNodeId[]> = {
  general: ["trigger", "normalize", "agent", "router", "response"],
  products: [
    "trigger",
    "normalize",
    "agent",
    "router",
    "business",
    "response"
  ],
  orders: ["trigger", "normalize", "agent", "router", "business", "response"],
  technical: ["trigger", "normalize", "agent", "router", "response"],
  invoice: ["trigger", "normalize", "agent", "router", "invoice", "response"],
  human: ["trigger", "normalize", "agent", "router", "handoff", "response"]
};

const scenarioActions: Record<ScenarioId, ChatAction> = {
  general: "scenario:general",
  products: "scenario:products",
  orders: "scenario:orders",
  technical: "scenario:technical",
  invoice: "scenario:invoice",
  human: "scenario:human"
};

function option(label: string, action: ChatAction): ChatOption {
  return { label, action };
}

function menuOption(copy: Copy): ChatOption {
  return option(copy.chat.backToMenu, "menu");
}

function withMenu(copy: Copy, options: ChatOption[]): ChatOption[] {
  return [...options, menuOption(copy)];
}

function scenarioOptions(copy: Copy): ChatOption[] {
  return scenarioIds.map((id) =>
    option(copy.chat.menuOptions[id], scenarioActions[id])
  );
}

function invoiceProductOptions(copy: Copy): ChatOption[] {
  return (Object.keys(copy.chat.products) as ProductId[]).map((id) =>
    option(copy.chat.products[id].name, `invoice:product:${id}`)
  );
}

function generalOptions(copy: Copy): ChatOption[] {
  return (Object.keys(copy.chat.generalOptions) as GeneralTopic[]).map((id) =>
    option(copy.chat.generalOptions[id], `general:${id}`)
  );
}

function categoryOptions(copy: Copy): ChatOption[] {
  return (Object.keys(copy.chat.productCategories) as ProductCategory[]).map(
    (id) => option(copy.chat.productCategories[id], `category:${id}`)
  );
}

function productIds(category: ProductCategory): ProductId[] {
  return category === "home"
    ? ["luma-lamp", "arc-light"]
    : ["field-tote", "transit-bottle"];
}

function productOptions(copy: Copy, category: ProductCategory): ChatOption[] {
  return [
    ...productIds(category).map((id) =>
      option(copy.chat.products[id].name, `product:${id}`)
    ),
    option(copy.chat.productCategories[category], `product:changeCategory`)
  ];
}

function technicalOptions(copy: Copy): ChatOption[] {
  return (
    Object.keys(copy.chat.technicalCategories) as TechnicalCategory[]
  ).map((id) => option(copy.chat.technicalCategories[id], `technical:${id}`));
}

function normalized(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}@.-]+/gu, " ")
    .trim();
}

function isMainMenuRequest(value: string): boolean {
  const text = normalized(value);
  return ["menu", "main menu", "start over", "inicio", "menu principal"]
    .includes(text);
}

function detectScenario(value: string): ScenarioId | undefined {
  const text = normalized(value);
  if (
    /\b(person|human|agent|someone|representative|persona|humano|agente|alguien)\b/.test(
      text
    )
  ) {
    return "human";
  }
  if (
    /\b(invoice|billing|bill|factura|facturacion|comprobante)\b/.test(text)
  ) {
    return "invoice";
  }
  if (
    /\b(order|track|tracking|delivery|pedido|rastrear|seguimiento|entrega)\b/.test(
      text
    )
  ) {
    return "orders";
  }
  if (
    /\b(product|price|pricing|stock|available|collection|producto|precio|disponible|coleccion|articulo)\b/.test(
      text
    )
  ) {
    return "products";
  }
  if (
    /\b(technical|support|trouble|problem|issue|technical|tecnico|tecnica|soporte|problema|ayuda)\b/.test(
      text
    )
  ) {
    return "technical";
  }
  if (
    /\b(hours|open|service|contact|company|about|horario|abierto|servicio|contacto|empresa|informacion)\b/.test(
      text
    )
  ) {
    return "general";
  }
  return undefined;
}

function detectGeneralTopic(value: string): GeneralTopic | undefined {
  const text = normalized(value);
  if (/\b(hour|hours|open|schedule|horario|abierto)\b/.test(text)) return "hours";
  if (/\b(service|services|offer|servicio|ofrecen)\b/.test(text)) return "services";
  if (/\b(contact|email|phone|contacto|correo|telefono)\b/.test(text)) return "contact";
  if (/\b(company|about|northstar|empresa|acerca)\b/.test(text)) return "company";
  return undefined;
}

function detectProductCategory(
  value: string,
  copy: Copy
): ProductCategory | undefined {
  const text = normalized(value);
  if (
    text === normalized(copy.chat.productCategories.home) ||
    /\b(home|lighting|hogar|iluminacion|lamp|light|lampara)\b/.test(text)
  ) {
    return "home";
  }
  if (
    text === normalized(copy.chat.productCategories.everyday) ||
    /\b(everyday|carry|accessories|diario|accesorios|bolso|botella)\b/.test(text)
  ) {
    return "everyday";
  }
  return undefined;
}

function detectTechnicalCategory(
  value: string,
  copy: Copy
): TechnicalCategory | undefined {
  const text = normalized(value);
  const categoryTerms: Record<TechnicalCategory, RegExp> = {
    account: /\b(account|login|sign in|password|cuenta|acceso|contrasena)\b/,
    checkout: /\b(checkout|payment|cart|purchase|pago|compra|carrito)\b/,
    delivery: /\b(delivery|shipping|package|entrega|envio|paquete)\b/,
    product: /\b(product|item|setup|producto|articulo|instalacion)\b/
  };
  return (
    (Object.keys(categoryTerms) as TechnicalCategory[]).find(
      (id) =>
        text === normalized(copy.chat.technicalCategories[id]) ||
        categoryTerms[id].test(text)
    )
  );
}

function productFor(value: string, category: ProductCategory, copy: Copy) {
  const text = normalized(value);
  return productIds(category).find(
    (id) =>
      text === normalized(copy.chat.products[id].name) ||
      text.includes(normalized(copy.chat.products[id].name))
  );
}

function invoiceProductFor(value: string, copy: Copy): ProductId | undefined {
  const text = normalized(value);
  return (Object.keys(copy.chat.products) as ProductId[]).find(
    (id) =>
      text === normalized(copy.chat.products[id].name) ||
      text.includes(normalized(copy.chat.products[id].name))
  );
}

function invoiceSummary(data: InvoiceData, copy: Copy): string {
  const product = copy.chat.products[data.product];
  const unit = Number(product.price.replace(/[^\d.]/g, ""));
  const subtotal = new Intl.NumberFormat(copy === dictionaries.es ? "es" : "en", {
    style: "currency",
    currency: copy.chat.currencyCode
  }).format(unit * data.quantity);
  return [
    copy.chat.invoiceSummary,
    `${copy.chat.invoiceItemLabel}: ${product.name}`,
    `${copy.chat.invoiceQuantityLabel}: ${data.quantity}`,
    `${copy.chat.invoiceNameLabel}: ${data.customerName}`,
    `${copy.chat.invoiceEmailLabel}: ${data.customerEmail}`,
    `${copy.chat.invoiceSubtotalLabel}: ${subtotal}`,
    copy.chat.invoiceConfirmationPrompt
  ].join("\n");
}

function generalAnswer(topic: GeneralTopic, copy: Copy): EngineResult {
  return {
    state: { flow: "general-topic" },
    response: copy.chat.generalAnswers[topic],
    options: withMenu(copy, generalOptions(copy))
  };
}

function beginScenario(
  scenario: ScenarioId,
  copy: Copy,
  text: string
): EngineResult {
  switch (scenario) {
    case "general": {
      const topic = detectGeneralTopic(text);
      return topic
        ? generalAnswer(topic, copy)
        : {
            state: { flow: "general-topic" },
            response: copy.chat.generalPrompt,
            options: withMenu(copy, generalOptions(copy))
          };
    }
    case "products": {
      const category = detectProductCategory(text, copy);
      return category
        ? {
            state: { flow: "product-item", category },
            response: copy.chat.productItemPrompt,
            options: withMenu(copy, productOptions(copy, category))
          }
        : {
            state: { flow: "product-category" },
            response: copy.chat.productCategoryPrompt,
            options: withMenu(copy, categoryOptions(copy))
          };
    }
    case "orders":
      return {
        state: { flow: "order-number" },
        response: copy.chat.orderPrompt,
        options: withMenu(copy, [])
      };
    case "technical":
      return {
        state: { flow: "technical-category" },
        response: copy.chat.technicalCategoryPrompt,
        options: withMenu(copy, technicalOptions(copy))
      };
    case "invoice": {
      const product = invoiceProductFor(text, copy);
      if (product) {
        return {
          state: { flow: "invoice-quantity", product },
          response: copy.chat.invoiceQuantityPrompt,
          options: withMenu(copy, [])
        };
      }
      return {
        state: { flow: "invoice-product" },
        response: copy.chat.invoicePrompt,
        options: withMenu(copy, invoiceProductOptions(copy))
      };
    }
    case "human":
      return {
        state: { flow: "human-contact" },
        response: copy.chat.humanPrompt,
        options: withMenu(copy, [])
      };
  }
}

function orderResult(value: string, copy: Copy): EngineResult {
  const id = value.trim().toUpperCase();
  if (!/^ORD-\d{4}$/.test(id)) {
    return {
      state: { flow: "order-number" },
      response: copy.chat.orderInvalid,
      options: withMenu(copy, [])
    };
  }
  if (!(id in copy.chat.orders)) {
    return {
      state: { flow: "order-number" },
      response: copy.chat.orderNotFound,
      options: withMenu(copy, [])
    };
  }
  const orderId = id as OrderId;
  const order = copy.chat.orders[orderId];
  return {
    state: { flow: "order-number" },
    response: `${orderId} — ${order.status}. ${order.eta}`,
    options: withMenu(copy, [])
  };
}

function validContact(value: string): boolean {
  const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const digits = value.replace(/\D/g, "").length;
  const phone = digits >= 7 && /^[+\d\s().-]+$/.test(value);
  return email || phone;
}

function confirmInvoice(data: InvoiceData, copy: Copy): EngineResult {
  return {
    state: { flow: "invoice-generated", data },
    response: copy.chat.invoiceGenerated,
    options: withMenu(copy, [option(copy.chat.invoiceNew, "invoice:new")]),
    invoice: data
  };
}

export function processMessage(
  state: ConversationState,
  text: string,
  locale: Locale,
  action?: ChatAction
): EngineResult {
  const copy = dictionaries[locale];
  const input = text.trim();

  if (action === "invoice:new") {
    return beginScenario("invoice", copy, input);
  }
  if (action === "invoice:cancel") {
    return {
      state: { flow: "menu" },
      response: copy.chat.invoiceCancelled,
      options: scenarioOptions(copy)
    };
  }
  if (state.flow === "invoice-review" && action === "invoice:confirm") {
    return confirmInvoice(state.data, copy);
  }

  if (action === "menu" || isMainMenuRequest(input)) {
    return {
      state: { flow: "menu" },
      response: copy.chat.menuPrompt,
      options: scenarioOptions(copy)
    };
  }

  if (
    action === "scenario:human" ||
    (detectScenario(input) === "human" && state.flow !== "human-contact")
  ) {
    return beginScenario("human", copy, input);
  }

  if (
    (action === "scenario:invoice" || detectScenario(input) === "invoice") &&
    state.flow !== "invoice-product" &&
    state.flow !== "invoice-quantity" &&
    state.flow !== "invoice-name" &&
    state.flow !== "invoice-email" &&
    state.flow !== "invoice-review"
  ) {
    return beginScenario("invoice", copy, input);
  }

  if (
    (state.flow === "human-confirmed" ||
      state.flow === "invoice-generated") &&
    (action?.startsWith("scenario:") || detectScenario(input))
  ) {
    const scenario =
      action?.startsWith("scenario:")
        ? (action.slice("scenario:".length) as ScenarioId)
        : detectScenario(input);
    if (!scenario) {
      return {
        state: { flow: "menu" },
        response: copy.chat.menuPrompt,
        options: scenarioOptions(copy)
      };
    }
    return beginScenario(
      scenario,
      copy,
      input
    );
  }

  switch (state.flow) {
    case "menu": {
      const scenario =
        action?.startsWith("scenario:")
          ? (action.slice("scenario:".length) as ScenarioId)
          : detectScenario(input);
      if (scenario) return beginScenario(scenario, copy, input);
      return {
        state,
        response: copy.chat.fallback,
        options: scenarioOptions(copy)
      };
    }
    case "general-topic": {
      const topic =
        action?.startsWith("general:")
          ? (action.slice("general:".length) as GeneralTopic)
          : detectGeneralTopic(input);
      return topic
        ? generalAnswer(topic, copy)
        : {
            state,
            response: copy.chat.fallback,
            options: withMenu(copy, generalOptions(copy))
          };
    }
    case "product-category": {
      const category =
        action?.startsWith("category:")
          ? (action.slice("category:".length) as ProductCategory)
          : detectProductCategory(input, copy);
      return category
        ? {
            state: { flow: "product-item", category },
            response: copy.chat.productItemPrompt,
            options: withMenu(copy, productOptions(copy, category))
          }
        : {
            state,
            response: copy.chat.fallback,
            options: withMenu(copy, categoryOptions(copy))
          };
    }
    case "product-item": {
      if (action === "product:changeCategory") {
        return {
          state: { flow: "product-category" },
          response: copy.chat.productCategoryPrompt,
          options: withMenu(copy, categoryOptions(copy))
        };
      }
      const productId =
        action?.startsWith("product:")
          ? (action.slice("product:".length) as ProductId)
          : productFor(input, state.category, copy);
      if (!productId && state.selected) {
        const query = normalized(input);
        const product = copy.chat.products[state.selected];
        if (/\b(price|cost|pricing|how much|precio|cuanto|vale)\b/.test(query)) {
          return {
            state,
            response: `${product.name}: ${copy.chat.productPriceLabel} ${product.price}.`,
            options: withMenu(copy, productOptions(copy, state.category))
          };
        }
        if (
          /\b(available|availability|stock|in stock|disponibilidad|disponible|agotado)\b/.test(
            query
          )
        ) {
          return {
            state,
            response: `${product.name}: ${copy.chat.productAvailabilityLabel}: ${product.availability}.`,
            options: withMenu(copy, productOptions(copy, state.category))
          };
        }
      }
      if (!productId || !productIds(state.category).includes(productId)) {
        return {
          state,
          response: copy.chat.fallback,
          options: withMenu(copy, productOptions(copy, state.category))
        };
      }
      const product = copy.chat.products[productId];
      return {
        state: { ...state, selected: productId },
        response: `${product.name} — ${copy.chat.productPriceLabel}: ${product.price}. ${copy.chat.productAvailabilityLabel}: ${product.availability}. ${product.description}`,
        options: withMenu(copy, productOptions(copy, state.category))
      };
    }
    case "order-number":
      return orderResult(input, copy);
    case "technical-category": {
      const category =
        action?.startsWith("technical:") &&
        action !== "technical:resolved" &&
        action !== "technical:unresolved"
          ? (action.slice("technical:".length) as TechnicalCategory)
          : detectTechnicalCategory(input, copy);
      return category
        ? {
            state: { flow: "technical-description", category },
            response: copy.chat.technicalDescribePrompt,
            options: withMenu(copy, [])
          }
        : {
            state,
            response: copy.chat.fallback,
            options: withMenu(copy, technicalOptions(copy))
          };
    }
    case "technical-description": {
      if (!input) {
        return {
          state,
          response: copy.chat.technicalDescribePrompt,
          options: withMenu(copy, [])
        };
      }
      return {
        state: {
          flow: "technical-feedback",
          category: state.category,
          issue: input
        },
        response: `${copy.chat.technicalAcknowledgement} ${copy.chat.technicalSteps[state.category]}`,
        options: withMenu(copy, [
          option(copy.chat.technicalResolved, "technical:resolved"),
          option(copy.chat.technicalUnresolved, "technical:unresolved")
        ])
      };
    }
    case "technical-feedback": {
      if (
        action === "technical:unresolved" ||
        /\b(no|not really|nope|no gracias|no funciona|no se resolvio)\b/.test(
          normalized(input)
        )
      ) {
        return beginScenario("human", copy, input);
      }
      if (
        action === "technical:resolved" ||
        /\b(yes|it did|thanks|si|sí|resuelto|funciono)\b/.test(input.toLowerCase())
      ) {
        return {
          state: { flow: "menu" },
          response: copy.chat.technicalResolved,
          options: scenarioOptions(copy)
        };
      }
      return {
        state,
        response: copy.chat.technicalFeedbackPrompt,
        options: withMenu(copy, [
          option(copy.chat.technicalResolved, "technical:resolved"),
          option(copy.chat.technicalUnresolved, "technical:unresolved")
        ])
      };
    }
    case "human-contact":
      if (!validContact(input)) {
        return {
          state,
          response: copy.chat.humanInvalid,
          options: withMenu(copy, [])
        };
      }
      return {
        state: { flow: "human-confirmed" },
        response: `${copy.chat.humanConfirmation} ${copy.chat.humanDisclaimer}`,
        options: scenarioOptions(copy)
      };
    case "human-confirmed":
      return {
        state: { flow: "menu" },
        response: copy.chat.menuPrompt,
        options: scenarioOptions(copy)
      };
    case "invoice-product": {
      const product =
        action?.startsWith("invoice:product:")
          ? (action.slice("invoice:product:".length) as ProductId)
          : invoiceProductFor(input, copy);
      if (!product || !copy.chat.products[product]) {
        return {
          state,
          response: copy.chat.invoiceProductPrompt,
          options: withMenu(copy, invoiceProductOptions(copy))
        };
      }
      return {
        state: { flow: "invoice-quantity", product },
        response: copy.chat.invoiceQuantityPrompt,
        options: withMenu(copy, [])
      };
    }
    case "invoice-quantity": {
      if (!/^\d{1,2}$/.test(input) || Number(input) < 1 || Number(input) > 99) {
        return {
          state,
          response: copy.chat.invoiceQuantityInvalid,
          options: withMenu(copy, [])
        };
      }
      return {
        state: {
          flow: "invoice-name",
          product: state.product,
          quantity: Number(input)
        },
        response: copy.chat.invoiceNamePrompt,
        options: withMenu(copy, [])
      };
    }
    case "invoice-name":
      if (input.length < 2 || input.length > 80) {
        return {
          state,
          response: copy.chat.invoiceNamePrompt,
          options: withMenu(copy, [])
        };
      }
      return {
        state: {
          flow: "invoice-email",
          product: state.product,
          quantity: state.quantity,
          customerName: input
        },
        response: copy.chat.invoiceEmailPrompt,
        options: withMenu(copy, [])
      };
    case "invoice-email": {
      const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
      if (!email) {
        return {
          state,
          response: copy.chat.invoiceEmailInvalid,
          options: withMenu(copy, [])
        };
      }
      const data: InvoiceData = {
        product: state.product,
        quantity: state.quantity,
        customerName: state.customerName,
        customerEmail: input
      };
      return {
        state: { flow: "invoice-review", data },
        response: invoiceSummary(data, copy),
        options: withMenu(copy, [
          option(copy.chat.invoiceConfirm, "invoice:confirm"),
          option(copy.chat.invoiceCancel, "invoice:cancel")
        ])
      };
    }
    case "invoice-review": {
      const answer = normalized(input);
      const localizedAnswer = input.toLocaleLowerCase(locale);
      if (
        ["yes", "confirm", "generate", "si", "confirmar", "generar"].includes(
          answer
        ) ||
        localizedAnswer === "sí"
      ) {
        return confirmInvoice(state.data, copy);
      }
      if (/\b(no|cancel|cancelar)\b/.test(normalized(input))) {
        return {
          state: { flow: "menu" },
          response: copy.chat.invoiceCancelled,
          options: scenarioOptions(copy)
        };
      }
      return {
        state,
        response: copy.chat.invoiceConfirmationPrompt,
        options: withMenu(copy, [
          option(copy.chat.invoiceConfirm, "invoice:confirm"),
          option(copy.chat.invoiceCancel, "invoice:cancel")
        ])
      };
    }
    case "invoice-generated":
      return {
        state: { flow: "menu" },
        response: copy.chat.menuPrompt,
        options: scenarioOptions(copy)
      };
  }
}

export function detectIntent(value: string): ScenarioId | undefined {
  return detectScenario(value);
}
