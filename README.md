# Converso

Converso is an independent, bilingual WhatsApp-support and business-automation demonstration built with Astro, React, TypeScript and Tailwind CSS 4. The phone-style conversation, invoice PDF and workflow preview run in the browser; this site is not a live WhatsApp, AI or n8n integration.

## Local development

```sh
npm install
npm run dev
```

The localized application is available at `/en/` and `/es/`. Switch between **Customer chat** and **Automation overview** to try the conversation and inspect its six flows.

## Validation and deployment

```sh
npm run check
npm run build
```

The production build is static and writes to `dist/`. Deploy that directory to Cloudflare Pages with `npm run build` as the build command. No adapter, server runtime, credentials, database or external service is needed.

The localized pages are intentionally excluded from search indexes using `noindex` metadata and an `X-Robots-Tag` response header. `robots.txt` allows crawlers to read that directive; no sitemap is published. Cloudflare Pages applies the security headers in `public/_headers`. When upgrading Astro, verify that its generated inline scripts and styles still match the CSP hashes in that file.

## Browser demonstration

The chat runs a deterministic state machine entirely in the browser. It includes business information, a fictional product catalog, sample order records, category-based troubleshooting, invoice data collection with an actual downloadable sample PDF, and a simulated human-assistance handoff. Conversation state is temporary and is not stored. No AI model, agent, email delivery or support platform is connected; the sample contact address and order records are fictional. The PDF is marked **DEMO — NOT A TAX DOCUMENT** and has no fiscal validity.

English and Spanish copy is maintained in `src/i18n/dictionaries.ts`. Conversation transitions are in `src/lib/chat-engine.ts`; the automation diagram reflects the same simulated intent paths.

## n8n starter

The downloadable `public/converso-n8n-starter.json` is an inactive, credential-free starter workflow with a webhook, message normalization, intent routing, and separate invoice, general-support and fallback responses. It is not connected to this website or to WhatsApp. Before production use, configure a webhook URL and a WhatsApp Business provider; add the appropriate credential, customer-consented delivery, business data source, invoice/document-generation steps, and production error handling. The sample invoice path returns instructions only and does not create or send a real invoice.
