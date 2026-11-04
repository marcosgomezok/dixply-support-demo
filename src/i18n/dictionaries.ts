import type {
  GeneralTopic,
  Locale,
  OrderId,
  ProductCategory,
  ProductId,
  ScenarioId,
  TechnicalCategory,
  WorkflowStage
} from "../lib/types";

type ProductCopy = {
  name: string;
  description: string;
  price: string;
  availability: string;
};

type Copy = {
  meta: { title: string; description: string };
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    tryAgent: string;
    exploreWorkflow: string;
  };
  nav: {
    chat: string;
    automation: string;
    language: string;
    menu: string;
  };
  brand: { tagline: string; demo: string; attribution: string };
  chat: {
    eyebrow: string;
    title: string;
    description: string;
    supportHeadline: string;
    assistant: string;
    online: string;
    demoNote: string;
    welcome: string;
    menuPrompt: string;
    menuOptions: Record<ScenarioId, string>;
    invoicePrompt: string;
    invoiceProductPrompt: string;
    invoiceQuantityPrompt: string;
    invoiceQuantityInvalid: string;
    invoiceNamePrompt: string;
    invoiceEmailPrompt: string;
    invoiceEmailInvalid: string;
    invoiceSummary: string;
    invoiceConfirmationPrompt: string;
    invoiceConfirm: string;
    invoiceCancel: string;
    invoiceGenerated: string;
    invoiceCancelled: string;
    invoiceNew: string;
    invoiceDownload: string;
    invoiceDownloaded: string;
    invoiceItemLabel: string;
    invoiceQuantityLabel: string;
    invoiceNameLabel: string;
    invoiceEmailLabel: string;
    invoiceUnitPriceLabel: string;
    invoiceSubtotalLabel: string;
    invoiceTotalLabel: string;
    invoiceNumberLabel: string;
    invoiceDateLabel: string;
    invoiceDisclaimer: string;
    invoiceWatermark: string;
    currencyCode: string;
    humanRestart: string;
    generalPrompt: string;
    generalOptions: Record<GeneralTopic, string>;
    generalAnswers: Record<GeneralTopic, string>;
    productCategoryPrompt: string;
    productCategories: Record<ProductCategory, string>;
    productItemPrompt: string;
    productMore: string;
    productPriceLabel: string;
    productAvailabilityLabel: string;
    products: Record<ProductId, ProductCopy>;
    orderPrompt: string;
    orderInvalid: string;
    orderNotFound: string;
    orders: Record<OrderId, { status: string; eta: string }>;
    technicalCategoryPrompt: string;
    technicalCategories: Record<TechnicalCategory, string>;
    technicalDescribePrompt: string;
    technicalAcknowledgement: string;
    technicalSteps: Record<TechnicalCategory, string>;
    technicalFeedbackPrompt: string;
    technicalResolved: string;
    technicalUnresolved: string;
    humanPrompt: string;
    humanInvalid: string;
    humanConfirmation: string;
    humanDisclaimer: string;
    fallback: string;
    backToMenu: string;
    typing: string;
    placeholder: string;
    send: string;
    restart: string;
    restartLabel: string;
    timeNow: string;
    emptyLabel: string;
    messageLabel: string;
    messagesLabel: string;
    inputHint: string;
    quickReplies: string;
    menuAction: string;
    contactPlaceholder: string;
    messageAnnouncement: string;
    attachFile: string;
    attachmentNotice: string;
    phoneStatus: string;
    messageDelivered: string;
    today: string;
  };
  automation: {
    eyebrow: string;
    title: string;
    description: string;
    simulation: string;
    chooseFlow: string;
    workflow: string;
    stages: Record<WorkflowStage, string>;
    stageDescriptions: Record<
      ScenarioId,
      Partial<Record<WorkflowStage, string>>
    >;
    scenarioSummaries: Record<ScenarioId, string>;
    liveNote: string;
    selectedLabel: string;
    stepLabel: string;
    stepsCount: string;
    numberedStep: string;
    diagramTitle: string;
    zoomIn: string;
    zoomOut: string;
    resetZoom: string;
    dragToPan: string;
    selectedNode: string;
    activeNode: string;
    nodeLabels: Record<string, string>;
    nodeKinds: Record<string, string>;
    nodeOperations: Record<string, string>;
    nodeDescriptions: Record<string, string>;
    capabilityCards: { title: string; description: string }[];
  };
  footer: { attribution: string };
};

const en: Copy = {
  meta: {
    title: "Converso — Customer support, thoughtfully automated",
    description:
      "Explore Converso, a bilingual customer support automation demo with guided product, order, technical and human-assistance flows."
  },
  hero: {
    eyebrow: "CONVERSATIONAL BUSINESS AUTOMATION",
    title: "Your business, automated through WhatsApp.",
    description:
      "Turn everyday conversations into guided customer support, useful business operations and a faster service experience.",
    tryAgent: "Try the interactive chat",
    exploreWorkflow: "Explore the workflow"
  },
  nav: {
    chat: "Chat",
    automation: "Workflow",
    language: "Language",
    menu: "Main navigation"
  },
  brand: {
    tagline: "Support, in good company.",
    demo: "Interactive product demo",
    attribution: "A demonstration by Dixply"
  },
  chat: {
    eyebrow: "CUSTOMER EXPERIENCE",
    title: "A helpful answer is always a good start.",
    description:
      "Explore a support conversation that knows where to go next, from a quick product question to a human handoff.",
    supportHeadline:
      "Support that feels simple, even when the question isn't.",
    assistant: "Ari",
    online: "Available now",
    demoNote:
      "Based on real n8n workflows for WhatsApp support. This demo is not connected to a live n8n instance or support team.",
    welcome:
      "Hi there, I’m Ari from Northstar Goods. What can I help you with today?",
    menuPrompt: "Choose a topic to get started, or tell me what you need.",
    menuOptions: {
      general: "General information",
      products: "Products & pricing",
      orders: "Track an order",
      technical: "Technical help",
      invoice: "Create an invoice",
      human: "Talk to a person"
    },
    invoicePrompt:
      "I can prepare a sample invoice for a product purchase. Which product or service should I include?",
    invoiceProductPrompt: "Choose an item from the sample catalog.",
    invoiceQuantityPrompt: "How many units should the invoice include? Enter a whole number from 1 to 99.",
    invoiceQuantityInvalid: "Enter a whole number from 1 to 99.",
    invoiceNamePrompt: "What customer name should appear on this demo invoice?",
    invoiceEmailPrompt: "What email address should appear on the invoice? It will only be included in the PDF and will not be sent or stored.",
    invoiceEmailInvalid: "That email address does not look valid. Please enter an address like name@example.com.",
    invoiceSummary: "Please review the sample invoice details:",
    invoiceConfirmationPrompt: "Generate this demo PDF invoice?",
    invoiceConfirm: "Generate invoice",
    invoiceCancel: "Cancel invoice",
    invoiceGenerated: "Your sample invoice PDF is ready to download. This is not a tax document.",
    invoiceCancelled: "No invoice was generated. You can start a new sample invoice whenever you’re ready.",
    invoiceNew: "Create another invoice",
    invoiceDownload: "Download invoice PDF",
    invoiceDownloaded: "The demo invoice PDF download has started.",
    invoiceItemLabel: "Product or service",
    invoiceQuantityLabel: "Quantity",
    invoiceNameLabel: "Customer",
    invoiceEmailLabel: "Email",
    invoiceUnitPriceLabel: "Unit price",
    invoiceSubtotalLabel: "Subtotal",
    invoiceTotalLabel: "Total",
    invoiceNumberLabel: "Invoice number",
    invoiceDateLabel: "Issue date",
    invoiceDisclaimer: "DEMO — NOT A TAX DOCUMENT",
    invoiceWatermark: "DEMO",
    currencyCode: "USD",
    humanRestart: "Start over",
    generalPrompt: "What would you like to know?",
    generalOptions: {
      hours: "Business hours",
      services: "What we offer",
      contact: "Contact details",
      company: "About Northstar"
    },
    generalAnswers: {
      hours:
        "Our small team is available Monday to Friday, 9:00 AM–5:00 PM (Pacific Time). The shop is open online around the clock.",
      services:
        "Northstar Goods is a fictional home and everyday goods shop. We offer a curated collection, order tracking and friendly product guidance in this demo.",
      contact:
        "For this demonstration, try hello@northstargoods.example. It is a sample address only and does not receive messages.",
      company:
        "Northstar Goods is a fictional independent shop created to demonstrate thoughtful customer support experiences."
    },
    productCategoryPrompt: "Which collection would you like to browse?",
    productCategories: { home: "Home & lighting", everyday: "Everyday carry" },
    productItemPrompt:
      "Here are a few picks from that collection. Choose one to see its details.",
    productMore:
      "You can choose another item, browse the other collection, or return to the main menu.",
    productPriceLabel: "Price",
    productAvailabilityLabel: "Availability",
    products: {
      "luma-lamp": {
        name: "Luma desk lamp",
        description:
          "A compact, dimmable desk light with a warm, focused glow.",
        price: "$68",
        availability: "In stock"
      },
      "arc-light": {
        name: "Arc wall light",
        description:
          "A sculptural wall light with a soft, adjustable reading beam.",
        price: "$94",
        availability: "Low stock"
      },
      "field-tote": {
        name: "Field tote",
        description:
          "A sturdy recycled-canvas carryall with an easy-access inner pocket.",
        price: "$32",
        availability: "In stock"
      },
      "transit-bottle": {
        name: "Transit bottle",
        description:
          "A leak-resistant insulated bottle made for everyday commutes.",
        price: "$24",
        availability: "Out of stock"
      }
    },
    orderPrompt:
      "Enter a demo order number in the format ORD-1234. Try ORD-1042, ORD-2086 or ORD-3195.",
    orderInvalid:
      "That format doesn’t look right. Use ORD followed by a hyphen and four digits, for example ORD-1042.",
    orderNotFound:
      "I couldn’t find that demo order. Check the number or try ORD-1042, ORD-2086 or ORD-3195.",
    orders: {
      "ORD-1042": { status: "On its way", eta: "Estimated delivery: Nov 8–10" },
      "ORD-2086": { status: "Preparing to ship", eta: "Estimated delivery: Nov 12" },
      "ORD-3195": { status: "Delivered", eta: "Delivered on Oct 29" }
    },
    technicalCategoryPrompt: "What do you need a hand with?",
    technicalCategories: {
      account: "Account access",
      checkout: "Checkout",
      delivery: "Delivery",
      product: "Using a product"
    },
    technicalDescribePrompt:
      "Tell me a little more about what’s happening. A short description is enough.",
    technicalAcknowledgement: "Thanks for describing the issue. Here are some steps to try.",
    technicalSteps: {
      account:
        "Try the password reset link on the sign-in screen, then check your inbox and spam folder. If the reset email does not arrive after a few minutes, make sure you used the email tied to your account.",
      checkout:
        "Refresh your cart and confirm each item is still available. If payment fails, check the billing details with your card provider before trying again; avoid submitting the same payment repeatedly.",
      delivery:
        "Check the latest carrier scan in your order tracking link and allow one business day for a new scan to appear. If the estimated delivery date has passed, you can ask for a simulated human handoff.",
      product:
        "Check the care or setup card included with the item and make sure any removable packaging is cleared. If the issue continues, note the product name and what you have already tried."
    },
    technicalFeedbackPrompt: "Did that help?",
    technicalResolved: "Glad that helped. Is there anything else?",
    technicalUnresolved:
      "I can show the simulated human-assistance flow if you’d like to continue.",
    humanPrompt:
      "Share an email address or phone number to see how a support handoff would collect contact details.",
    humanInvalid:
      "Enter a valid email address or a phone number with at least seven digits.",
    humanConfirmation:
      "Your demo handoff details are ready. In a real project, this step could route to an agent with your permission.",
    humanDisclaimer:
      "This is a simulation only. No person was notified, and your details were not sent or saved.",
    fallback:
      "I’m not sure I understood that. Choose one of the options below, or return to the main menu.",
    backToMenu: "Main menu",
    typing: "Ari is thinking",
    placeholder: "Write a message…",
    send: "Send message",
    restart: "Restart",
    restartLabel: "Restart this conversation",
    timeNow: "Just now",
    emptyLabel: "Your conversation will appear here.",
    messageLabel: "Message",
    messagesLabel: "Conversation messages",
    inputHint: "Press Enter to send. Use Shift+Enter for a new line.",
    quickReplies: "Suggested replies",
    menuAction: "Return to main menu",
    contactPlaceholder: "Email or phone number",
    messageAnnouncement: "New assistant message",
    attachFile: "Attach a file",
    attachmentNotice: "local demo attachment; not transmitted",
    phoneStatus: "Phone status",
    messageDelivered: "Delivered",
    today: "TODAY"
  },
  automation: {
    eyebrow: "BEHIND THE CONVERSATION",
    title: "Clear paths, better support.",
    description:
      "Explore the same six deterministic support flows used in the chat. Each path shows how a message moves through intent, routing and response.",
    simulation:
      "Logic preview — this workflow runs locally in your browser and does not connect to a live service.",
    chooseFlow: "Choose a scenario",
    workflow: "Conversation flow",
    stages: {
      incoming: "Incoming message",
      intent: "Intent identification",
      routing: "Conditional routing",
      response: "Automated response",
      customerData: "Information collection",
      invoice: "Invoice generation",
      handoff: "Human handoff"
    },
    stageDescriptions: {
      general: {
        incoming: "A visitor asks about the shop.",
        intent: "Recognize a general-information request.",
        routing: "Offer hours, services, contact or company details.",
        response: "Return the matching, prewritten answer."
      },
      products: {
        incoming: "A visitor asks to explore products.",
        intent: "Route to the product collection flow.",
        routing: "Branch by collection, then selected product.",
        customerData: "Use the visitor’s category and product choice.",
        response: "Show description, sample price and stock status."
      },
      orders: {
        incoming: "A visitor asks where an order is.",
        intent: "Recognize an order-tracking request.",
        customerData: "Validate the ORD-1234 format and match demo records.",
        routing: "Separate invalid, unknown and known order numbers.",
        response: "Show the matching status and delivery estimate."
      },
      technical: {
        incoming: "A visitor describes a support issue.",
        intent: "Route to the selected support category.",
        routing: "Choose account, checkout, delivery or product guidance.",
        customerData: "Use the category and issue description in this session.",
        response: "Show relevant steps, then ask whether they helped."
      },
      invoice: {
        incoming: "A customer requests an invoice.",
        intent: "Recognize an invoice-generation request.",
        customerData: "Collect item, quantity, customer name and email.",
        invoice: "Calculate the total and generate a sample PDF after confirmation.",
        response: "Offer a downloadable document with a demo watermark."
      },
      human: {
        incoming: "A visitor asks for human assistance.",
        intent: "Recognize a request for a person.",
        customerData: "Validate an email address or phone number.",
        handoff: "Show a simulated confirmation; no agent is contacted."
      }
    },
    scenarioSummaries: {
      general: "Fast answers for common shop questions.",
      products: "A guided browse with category and item branches.",
      orders: "Format validation, record lookup and delivery status.",
      technical: "Category-based troubleshooting with a next step.",
      invoice: "A validated invoice summary and browser-generated sample PDF.",
      human: "Consent-minded contact validation and a clear demo handoff."
    },
    liveNote:
      "The flows shown here mirror the deterministic client-side conversation engine. There is no live AI, database, external messaging service or support platform.",
    selectedLabel: "Selected scenario",
    stepLabel: "Flow step",
    stepsCount: "steps",
    numberedStep: "Step",
    diagramTitle: "Simulated n8n workflow",
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
    resetZoom: "Reset view",
    dragToPan: "Drag to pan",
    selectedNode: "Selected node",
    activeNode: "Current simulated path",
    nodeLabels: {
      trigger: "WhatsApp Trigger",
      normalize: "Normalize Message",
      agent: "Conversational Agent",
      router: "Intent Router",
      business: "Business Data",
      invoice: "Invoice PDF",
      response: "WhatsApp Response",
      handoff: "Human Handoff"
    },
    nodeKinds: {
      trigger: "WhatsApp",
      normalize: "Automation",
      agent: "Conversation logic",
      router: "Automation",
      business: "Data",
      invoice: "Document",
      response: "WhatsApp",
      handoff: "Support"
    },
    nodeOperations: {
      trigger: "On message received",
      normalize: "Map sender and text fields",
      agent: "Intent + conversation context",
      router: "Switch by detected intent",
      business: "Catalog and sample orders",
      invoice: "Build a demo PDF",
      response: "Return reply or document",
      handoff: "Request human review"
    },
    nodeDescriptions: {
      trigger: "Receives a message and sender identity through a configured WhatsApp webhook.",
      normalize: "Cleans the incoming text and maps sender and message fields.",
      agent: "Identifies intent and uses conversation context to choose the next action.",
      router: "Branches into support, products, orders, invoices or human assistance.",
      business: "Looks up sample product, order or customer information.",
      invoice: "Assembles invoice details and creates a downloadable sample document.",
      response: "Returns a localized reply or document link to the customer.",
      handoff: "Routes a request to a configured human support queue."
    },
    capabilityCards: [
      { title: "Customer support", description: "Answer common questions with guided, context-aware conversation paths." },
      { title: "Product inquiries", description: "Browse a sample catalog and check item details, prices and availability." },
      { title: "Order tracking", description: "Validate a sample order reference and return its matching status." },
      { title: "Invoice generation", description: "Collect invoice fields and create a clearly watermarked sample PDF." },
      { title: "Human handoff", description: "Validate contact details and show where a real integration would route a request." },
      { title: "Business automation", description: "Connect conversation intent to the appropriate business process." }
    ]
  },
  footer: {
    attribution: "A demonstration by Dixply"
  }
};

const es: Copy = {
  meta: {
    title: "Converso — Atención al cliente con automatización útil",
    description:
      "Explora Converso, una demostración bilingüe de automatización de atención al cliente con flujos guiados para productos, pedidos, soporte técnico y asistencia humana."
  },
  hero: {
    eyebrow: "AUTOMATIZACIÓN CONVERSACIONAL PARA EMPRESAS",
    title: "Tu negocio, automatizado a través de WhatsApp.",
    description:
      "Convierte conversaciones cotidianas en atención guiada, operaciones útiles y una experiencia de servicio más ágil.",
    tryAgent: "Probar el chat interactivo",
    exploreWorkflow: "Explorar el flujo"
  },
  nav: {
    chat: "Chat",
    automation: "Flujo",
    language: "Idioma",
    menu: "Navegación principal"
  },
  brand: {
    tagline: "Atención que acompaña.",
    demo: "Demostración interactiva",
    attribution: "Una demostración de Dixply"
  },
  chat: {
    eyebrow: "EXPERIENCIA DEL CLIENTE",
    title: "Una respuesta útil siempre es un buen comienzo.",
    description:
      "Explora una conversación de soporte que sabe qué hacer después, desde una consulta rápida sobre productos hasta una derivación humana.",
    supportHeadline:
      "Una atención sencilla, incluso cuando la consulta no lo es.",
    assistant: "Ari",
    online: "Disponible ahora",
    demoNote:
      "Basado en flujos reales de n8n para atención por WhatsApp. Esta demostración no está conectada a una instancia activa de n8n ni a un equipo de soporte.",
    welcome:
      "¡Hola! Soy Ari de Northstar Goods. ¿En qué puedo ayudarte hoy?",
    menuPrompt: "Elige un tema para comenzar o cuéntame qué necesitas.",
    menuOptions: {
      general: "Información general",
      products: "Productos y precios",
      orders: "Rastrear un pedido",
      technical: "Ayuda técnica",
      invoice: "Crear una factura",
      human: "Hablar con una persona"
    },
    invoicePrompt:
      "Puedo preparar una factura de muestra para una compra. ¿Qué producto o servicio quieres incluir?",
    invoiceProductPrompt: "Elige un artículo del catálogo de muestra.",
    invoiceQuantityPrompt: "¿Cuántas unidades debe incluir la factura? Escribe un número entero del 1 al 99.",
    invoiceQuantityInvalid: "Escribe un número entero del 1 al 99.",
    invoiceNamePrompt: "¿Qué nombre de cliente debe aparecer en esta factura de muestra?",
    invoiceEmailPrompt: "¿Qué correo debe aparecer en la factura? Solo se incluirá en el PDF; no se enviará ni guardará.",
    invoiceEmailInvalid: "Ese correo no parece válido. Escribe una dirección como nombre@ejemplo.com.",
    invoiceSummary: "Revisa los datos de la factura de muestra:",
    invoiceConfirmationPrompt: "¿Generar esta factura PDF de demostración?",
    invoiceConfirm: "Generar factura",
    invoiceCancel: "Cancelar factura",
    invoiceGenerated: "Tu factura PDF de muestra está lista para descargar. No es un documento fiscal.",
    invoiceCancelled: "No se generó ninguna factura. Puedes comenzar otra factura de muestra cuando quieras.",
    invoiceNew: "Crear otra factura",
    invoiceDownload: "Descargar factura PDF",
    invoiceDownloaded: "Se inició la descarga de la factura de demostración.",
    invoiceItemLabel: "Producto o servicio",
    invoiceQuantityLabel: "Cantidad",
    invoiceNameLabel: "Cliente",
    invoiceEmailLabel: "Correo",
    invoiceUnitPriceLabel: "Precio unitario",
    invoiceSubtotalLabel: "Subtotal",
    invoiceTotalLabel: "Total",
    invoiceNumberLabel: "Número de factura",
    invoiceDateLabel: "Fecha de emisión",
    invoiceDisclaimer: "DEMOSTRACIÓN — NO ES UN DOCUMENTO FISCAL",
    invoiceWatermark: "DEMOSTRACIÓN",
    currencyCode: "USD",
    humanRestart: "Volver a empezar",
    generalPrompt: "¿Qué te gustaría saber?",
    generalOptions: {
      hours: "Horario de atención",
      services: "Qué ofrecemos",
      contact: "Datos de contacto",
      company: "Sobre Northstar"
    },
    generalAnswers: {
      hours:
        "Nuestro pequeño equipo está disponible de lunes a viernes, de 9:00 a 17:00 (hora del Pacífico). La tienda en línea está abierta todo el día.",
      services:
        "Northstar Goods es una tienda ficticia de artículos para el hogar y uso diario. En esta demostración ofrecemos una colección seleccionada, seguimiento de pedidos y orientación sobre productos.",
      contact:
        "Para esta demostración, puedes probar hello@northstargoods.example. Es una dirección de muestra y no recibe mensajes.",
      company:
        "Northstar Goods es una tienda independiente ficticia creada para mostrar experiencias de atención al cliente bien pensadas."
    },
    productCategoryPrompt: "¿Qué colección quieres explorar?",
    productCategories: {
      home: "Hogar e iluminación",
      everyday: "Accesorios diarios"
    },
    productItemPrompt:
      "Estas son algunas opciones de la colección. Elige una para ver sus detalles.",
    productMore:
      "Puedes elegir otro artículo, explorar la otra colección o volver al menú principal.",
    productPriceLabel: "Precio",
    productAvailabilityLabel: "Disponibilidad",
    products: {
      "luma-lamp": {
        name: "Lámpara de escritorio Luma",
        description:
          "Una lámpara compacta y regulable con una luz cálida y enfocada.",
        price: "USD 68",
        availability: "Disponible"
      },
      "arc-light": {
        name: "Aplique de pared Arc",
        description:
          "Una lámpara de pared escultural con luz de lectura suave y ajustable.",
        price: "USD 94",
        availability: "Pocas unidades"
      },
      "field-tote": {
        name: "Bolso Field",
        description:
          "Bolso resistente de lona reciclada con un práctico bolsillo interior.",
        price: "USD 32",
        availability: "Disponible"
      },
      "transit-bottle": {
        name: "Botella Transit",
        description:
          "Botella térmica antiderrames para los desplazamientos diarios.",
        price: "USD 24",
        availability: "Agotado"
      }
    },
    orderPrompt:
      "Escribe un número de pedido de prueba con el formato ORD-1234. Prueba ORD-1042, ORD-2086 u ORD-3195.",
    orderInvalid:
      "El formato no parece correcto. Usa ORD, un guion y cuatro dígitos; por ejemplo, ORD-1042.",
    orderNotFound:
      "No encontré ese pedido de prueba. Revisa el número o prueba ORD-1042, ORD-2086 u ORD-3195.",
    orders: {
      "ORD-1042": {
        status: "En camino",
        eta: "Entrega estimada: del 8 al 10 de noviembre"
      },
      "ORD-2086": {
        status: "Preparando el envío",
        eta: "Entrega estimada: 12 de noviembre"
      },
      "ORD-3195": { status: "Entregado", eta: "Entregado el 29 de octubre" }
    },
    technicalCategoryPrompt: "¿Con qué necesitas ayuda?",
    technicalCategories: {
      account: "Acceso a la cuenta",
      checkout: "Pago y compra",
      delivery: "Entrega",
      product: "Uso de un producto"
    },
    technicalDescribePrompt:
      "Cuéntame un poco más sobre lo que ocurre. Basta con una breve descripción.",
    technicalAcknowledgement:
      "Gracias por describir el problema. Prueba estos pasos.",
    technicalSteps: {
      account:
        "Prueba el enlace para restablecer la contraseña en la pantalla de inicio de sesión y revisa también la carpeta de correo no deseado. Si el mensaje no llega en unos minutos, confirma que usaste el correo asociado a tu cuenta.",
      checkout:
        "Actualiza el carrito y confirma que cada artículo siga disponible. Si falla el pago, verifica los datos de facturación con tu proveedor de tarjeta antes de volver a intentarlo; evita enviar el mismo pago repetidamente.",
      delivery:
        "Consulta el último registro del transportista en el enlace de seguimiento y espera un día hábil para que aparezca una nueva actualización. Si ya pasó la fecha estimada, puedes probar la derivación humana simulada.",
      product:
        "Revisa la guía de cuidado o instalación incluida con el artículo y comprueba que hayas retirado el embalaje desmontable. Si el problema continúa, anota el nombre del producto y lo que ya intentaste."
    },
    technicalFeedbackPrompt: "¿Te sirvió?",
    technicalResolved: "¡Qué bueno que te sirvió! ¿Necesitas algo más?",
    technicalUnresolved:
      "Si quieres continuar, puedo mostrarte el flujo simulado de asistencia humana.",
    humanPrompt:
      "Comparte un correo electrónico o teléfono para ver cómo se recopilarían los datos de contacto antes de una derivación.",
    humanInvalid:
      "Escribe un correo válido o un número de teléfono con al menos siete dígitos.",
    humanConfirmation:
      "Los datos para la derivación de demostración están listos. En un proyecto real, este paso podría asignarte a un agente con tu autorización.",
    humanDisclaimer:
      "Esto es solo una simulación. No se notificó a ninguna persona; tus datos no se enviaron ni guardaron.",
    fallback:
      "No estoy segura de haber entendido. Elige una de las opciones o vuelve al menú principal.",
    backToMenu: "Menú principal",
    typing: "Ari está pensando",
    placeholder: "Escribe un mensaje…",
    send: "Enviar mensaje",
    restart: "Reiniciar",
    restartLabel: "Reiniciar esta conversación",
    timeNow: "Ahora",
    emptyLabel: "Tu conversación aparecerá aquí.",
    messageLabel: "Mensaje",
    messagesLabel: "Mensajes de la conversación",
    inputHint: "Pulsa Enter para enviar. Usa Mayús+Enter para una nueva línea.",
    quickReplies: "Respuestas sugeridas",
    menuAction: "Volver al menú principal",
    contactPlaceholder: "Correo o teléfono",
    messageAnnouncement: "Nuevo mensaje del asistente",
    attachFile: "Adjuntar un archivo",
    attachmentNotice: "archivo adjunto local de demostración; no se envía",
    phoneStatus: "Estado del teléfono",
    messageDelivered: "Entregado",
    today: "HOY"
  },
  automation: {
    eyebrow: "ASÍ FUNCIONA LA CONVERSACIÓN",
    title: "Rutas claras para una mejor atención.",
    description:
      "Explora los mismos seis flujos deterministas que utiliza el chat. Cada ruta muestra cómo un mensaje pasa por la identificación de intención, el enrutamiento y la respuesta.",
    simulation:
      "Vista de lógica: este flujo se ejecuta localmente en tu navegador y no se conecta a ningún servicio real.",
    chooseFlow: "Elige un escenario",
    workflow: "Flujo de conversación",
    stages: {
      incoming: "Mensaje entrante",
      intent: "Identificación de intención",
      routing: "Enrutamiento condicional",
      response: "Respuesta automatizada",
      customerData: "Recopilación de datos",
      invoice: "Generación de factura",
      handoff: "Derivación humana"
    },
    stageDescriptions: {
      general: {
        incoming: "Una persona consulta sobre la tienda.",
        intent: "Reconoce una consulta de información general.",
        routing: "Ofrece horario, servicios, contacto o información de la tienda.",
        response: "Devuelve la respuesta predefinida correspondiente."
      },
      products: {
        incoming: "Una persona quiere explorar los productos.",
        intent: "Dirige a la experiencia de productos.",
        routing: "Separa por colección y luego por artículo.",
        customerData: "Usa la colección y el producto elegidos.",
        response: "Muestra descripción, precio de muestra y disponibilidad."
      },
      orders: {
        incoming: "Una persona pregunta dónde está su pedido.",
        intent: "Reconoce una solicitud de seguimiento.",
        customerData: "Valida el formato ORD-1234 y busca en datos de muestra.",
        routing: "Distingue números inválidos, desconocidos y existentes.",
        response: "Muestra el estado y la fecha estimada correspondientes."
      },
      technical: {
        incoming: "Una persona describe un problema de soporte.",
        intent: "Dirige a la categoría de soporte elegida.",
        routing: "Elige orientación para cuenta, compra, entrega o producto.",
        customerData: "Usa la categoría y descripción durante esta sesión.",
        response: "Muestra pasos relevantes y pregunta si fueron útiles."
      },
      invoice: {
        incoming: "Un cliente solicita una factura.",
        intent: "Reconoce una solicitud de generación de factura.",
        customerData: "Recopila artículo, cantidad, nombre y correo.",
        invoice: "Calcula el total y genera un PDF de muestra tras confirmar.",
        response: "Ofrece un documento descargable con marca de demostración."
      },
      human: {
        incoming: "Una persona solicita hablar con alguien.",
        intent: "Reconoce una solicitud de asistencia humana.",
        customerData: "Valida un correo electrónico o teléfono.",
        handoff: "Muestra una confirmación simulada; no contacta a nadie."
      }
    },
    scenarioSummaries: {
      general: "Respuestas rápidas a consultas frecuentes de la tienda.",
      products: "Exploración guiada por colección y artículo.",
      orders: "Validación de formato, búsqueda y estado de entrega.",
      technical: "Solución guiada por categoría y un siguiente paso.",
      invoice: "Resumen de factura validado y PDF de muestra generado en el navegador.",
      human: "Validación de contacto y una derivación de demostración clara."
    },
    liveNote:
      "Los flujos mostrados reflejan el motor determinista que funciona en el navegador. No hay IA en vivo, base de datos, mensajería externa ni plataforma de soporte conectada.",
    selectedLabel: "Escenario seleccionado",
    stepLabel: "Paso del flujo",
    stepsCount: "pasos",
    numberedStep: "Paso",
    diagramTitle: "Flujo de n8n simulado",
    zoomIn: "Acercar",
    zoomOut: "Alejar",
    resetZoom: "Restablecer vista",
    dragToPan: "Arrastra para desplazar",
    selectedNode: "Nodo seleccionado",
    activeNode: "Ruta simulada actual",
    nodeLabels: {
      trigger: "Disparador de WhatsApp",
      normalize: "Normalizar mensaje",
      agent: "Agente conversacional",
      router: "Enrutador de intención",
      business: "Datos del negocio",
      invoice: "PDF de factura",
      response: "Respuesta de WhatsApp",
      handoff: "Derivación humana"
    },
    nodeKinds: {
      trigger: "WhatsApp",
      normalize: "Automatización",
      agent: "Lógica conversacional",
      router: "Automatización",
      business: "Datos",
      invoice: "Documento",
      response: "WhatsApp",
      handoff: "Soporte"
    },
    nodeOperations: {
      trigger: "Al recibir un mensaje",
      normalize: "Mapear remitente y texto",
      agent: "Intención + contexto",
      router: "Separar por intención",
      business: "Catálogo y pedidos de muestra",
      invoice: "Crear PDF de demostración",
      response: "Devolver respuesta o documento",
      handoff: "Solicitar revisión humana"
    },
    nodeDescriptions: {
      trigger: "Recibe un mensaje y la identidad del remitente mediante un webhook de WhatsApp configurado.",
      normalize: "Limpia el texto entrante y organiza los campos del remitente y el mensaje.",
      agent: "Identifica la intención y usa el contexto de la conversación para elegir la siguiente acción.",
      router: "Separa soporte, productos, pedidos, facturas o asistencia humana.",
      business: "Consulta información de muestra sobre productos, pedidos o clientes.",
      invoice: "Prepara los datos de factura y crea un documento de muestra descargable.",
      response: "Devuelve una respuesta localizada o un enlace al documento.",
      handoff: "Deriva la solicitud a una cola de soporte humano configurada."
    },
    capabilityCards: [
      { title: "Atención al cliente", description: "Responde consultas frecuentes con flujos guiados y contextualizados." },
      { title: "Consultas de productos", description: "Explora un catálogo de muestra y consulta detalles, precios y disponibilidad." },
      { title: "Seguimiento de pedidos", description: "Valida una referencia de muestra y devuelve su estado correspondiente." },
      { title: "Generación de facturas", description: "Recopila los datos y crea un PDF de muestra con marca visible." },
      { title: "Derivación humana", description: "Valida el contacto y muestra cómo se derivaría una solicitud real." },
      { title: "Automatización empresarial", description: "Conecta la intención de una conversación con el proceso adecuado." }
    ]
  },
  footer: {
    attribution: "Una demostración de Dixply"
  }
};

export const dictionaries: Record<Locale, Copy> = { en, es };
