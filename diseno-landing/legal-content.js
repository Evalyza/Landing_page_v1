// Ozmetra legal texts (Terms of Service + Privacy Policy) in es, en, fr, de, it.
// Block types: string = paragraph, array = bullet list.
// Tokens: {{COMPANY}} {{NIF}} {{ADDRESS}} {{EMAIL}} {{PROVIDERS}} are pending legal data (rendered highlighted);
// {{PRIVACY}} and {{TERMS}} become links to the other legal page.
window.LEGAL = {
  placeholders: {
    es: { COMPANY: "[RAZÓN SOCIAL]", NIF: "[NIF Y DATOS REGISTRALES]", ADDRESS: "[DOMICILIO SOCIAL]", EMAIL: "[EMAIL DE CONTACTO LEGAL]", PROVIDERS: "[LISTA DE PROVEEDORES]", PRIVACY: "Política de Privacidad", TERMS: "Términos de Servicio" },
    en: { COMPANY: "[LEGAL COMPANY NAME]", NIF: "[TAX ID AND REGISTRATION DETAILS]", ADDRESS: "[REGISTERED ADDRESS]", EMAIL: "[LEGAL CONTACT EMAIL]", PROVIDERS: "[LIST OF PROVIDERS]", PRIVACY: "Privacy Policy", TERMS: "Terms of Service" },
    fr: { COMPANY: "[RAISON SOCIALE]", NIF: "[NUMÉRO FISCAL ET IMMATRICULATION]", ADDRESS: "[SIÈGE SOCIAL]", EMAIL: "[E-MAIL DE CONTACT JURIDIQUE]", PROVIDERS: "[LISTE DES PRESTATAIRES]", PRIVACY: "Politique de confidentialité", TERMS: "Conditions d'utilisation" },
    de: { COMPANY: "[FIRMENNAME]", NIF: "[STEUERNUMMER UND REGISTERANGABEN]", ADDRESS: "[FIRMENSITZ]", EMAIL: "[RECHTLICHE KONTAKT-E-MAIL]", PROVIDERS: "[LISTE DER DIENSTLEISTER]", PRIVACY: "Datenschutzerklärung", TERMS: "Nutzungsbedingungen" },
    it: { COMPANY: "[RAGIONE SOCIALE]", NIF: "[PARTITA IVA E DATI DI REGISTRAZIONE]", ADDRESS: "[SEDE LEGALE]", EMAIL: "[EMAIL DI CONTATTO LEGALE]", PROVIDERS: "[ELENCO DEI FORNITORI]", PRIVACY: "Informativa sulla privacy", TERMS: "Termini di servizio" },
  },

  /* =====================================================================
     TERMS OF SERVICE
     ===================================================================== */
  terms: {
    es: {
      title: "Términos de Servicio",
      intro: [
        "Estos Términos de Servicio («Términos») regulan el acceso y el uso de Ozmetra, una plataforma de software como servicio basada en inteligencia artificial operada por {{COMPANY}} («nosotros»).",
        "Al unirte a nuestra lista de espera, solicitar una llamada, acceder a nuestro sitio web o usar nuestros servicios cuando estén disponibles, aceptas estos Términos. Si no estás de acuerdo, no uses el sitio web ni los servicios.",
      ],
      sections: [
        { h: "El Servicio", b: [
          "Ozmetra es una plataforma basada en inteligencia artificial diseñada para evaluar los procesos internos de las empresas, en particular de las startups. El Servicio se configura para cada cliente y puede, entre otras cosas:",
          ["recopilar información de la empresa mediante entrevistas con su equipo y a partir de los documentos y herramientas que el cliente decida compartir;",
           "analizar esa información según un marco de evaluación;",
           "utilizar inteligencia artificial para clasificar, resumir, puntuar o analizar de otro modo esa información;",
           "presentar los resultados mediante visualizaciones que identifican fortalezas, áreas críticas y recomendaciones de mejora."],
          "El Servicio no garantiza que las recomendaciones produzcan una mejora concreta en la empresa.",
          "Los resultados generados por IA pueden ser inexactos, incompletos, estar desactualizados o interpretarse de forma incorrecta. Eres responsable de revisarlos antes de actuar.",
        ]},
        { h: "Lista de espera y solicitudes de llamada", b: [
          "Antes de que el Servicio esté disponible públicamente, podemos gestionar una lista de espera. Al unirte, recogemos tu email de trabajo y, de forma opcional, el nombre de tu empresa, tu rol y tus respuestas a la prueba rápida, con la finalidad de:",
          ["avisarte cuando el Servicio esté disponible;", "informarte sobre el acceso al Servicio;", "comunicarte información relevante relacionada con el lanzamiento."],
          "Si solicitas una llamada, recogemos tu nombre, tu número de teléfono y la franja horaria que prefieras, con el único fin de que nuestro equipo de atención al cliente se ponga en contacto contigo.",
          "Formar parte de la lista de espera no garantiza el acceso al Servicio, una fecha de lanzamiento, un precio, unas funciones o una disponibilidad determinados. Podemos modificar o cerrar la lista de espera en cualquier momento.",
          "Cuando lo exija la ley aplicable, solo enviaremos comunicaciones comerciales ajenas al lanzamiento del Servicio si existe una base legal adecuada.",
        ]},
        { h: "Privacidad", b: [
          "Tus datos personales se tratarán conforme a nuestra {{PRIVACY}}, que forma parte de estos Términos.",
          "Para las personas del Espacio Económico Europeo o protegidas de otro modo por el RGPD, los datos personales se tratarán conforme a la legislación de protección de datos aplicable, incluido el Reglamento (UE) 2016/679 («RGPD»).",
          "En la lista de espera y en las solicitudes de llamada solo pediremos la información razonablemente necesaria para las finalidades indicadas.",
        ]},
        { h: "Uso aceptable", b: [
          "Te comprometes a no usar el Servicio:",
          ["con fines ilícitos o fraudulentos;", "para vulnerar los derechos de otras personas;", "para acosar, amenazar, engañar o suplantar a otra persona;", "para distribuir spam o comunicaciones no solicitadas;", "para eludir restricciones técnicas, mecanismos de autenticación, límites de uso o controles de acceso;", "para interferir en el Servicio o interrumpirlo;", "para intentar acceder sin autorización a nuestros sistemas o a los de terceros;", "mediante métodos automatizados, salvo que lo permitamos expresamente;", "para compartir información de terceros (incluidos empleados, clientes o proveedores) sin una base legal adecuada o sin haberles informado cuando sea obligatorio;", "para usar los resultados del Servicio de forma contraria a la normativa de protección de datos, laboral o de otro tipo."],
          "Eres responsable de que tu uso del Servicio cumpla la ley aplicable y de contar con las autorizaciones necesarias para compartir la información de tu empresa y de las personas que participen en las entrevistas.",
        ]},
        { h: "Herramientas y fuentes de terceros", b: [
          "El Servicio puede conectarse con herramientas de terceros que decidas utilizar, como sistemas de gestión documental, de gestión de proyectos, CRM o herramientas financieras.",
          "Esas herramientas pertenecen a terceros independientes que no son de nuestra propiedad ni están bajo nuestro control. Su uso sigue sujeto a sus propios términos, políticas y prácticas de privacidad.",
          "Ozmetra no está afiliada, respaldada ni patrocinada por ningún proveedor de esas herramientas, salvo que se indique expresamente.",
          "No garantizamos la disponibilidad, exactitud, accesibilidad o compatibilidad continuas de los datos obtenidos de herramientas de terceros. Los cambios en sus API, políticas o restricciones técnicas pueden afectar o limitar el funcionamiento del Servicio.",
        ]},
        { h: "Propiedad intelectual", b: [
          "Todos los derechos sobre el Servicio, incluidos su software, tecnología, diseño, marca, interfaces, documentación y sistemas subyacentes, son de nuestra titularidad o nos han sido licenciados.",
          "Salvo que estos Términos lo permitan expresamente, no puedes:",
          ["copiar, reproducir, modificar o distribuir el Servicio;", "aplicar ingeniería inversa ni intentar obtener el código fuente;", "crear obras derivadas basadas en el Servicio;", "revender, sublicenciar o explotar comercialmente el Servicio sin nuestro permiso por escrito;", "eliminar avisos de propiedad o de propiedad intelectual."],
          "Conservas la titularidad de la información y el contenido que aportes lícitamente al Servicio, incluida la información de tu empresa, sin perjuicio de los derechos necesarios para que podamos prestar y operar el Servicio.",
        ]},
        { h: "Información generada por IA", b: [
          "El Servicio utiliza tecnologías de inteligencia artificial y aprendizaje automático.",
          "Las evaluaciones, puntuaciones y recomendaciones generadas por IA se ofrecen solo con fines informativos y de apoyo. No deben tratarse como hechos garantizados, como asesoramiento profesional (jurídico, financiero, fiscal o laboral) ni como sustituto de tu propio criterio.",
          "Eres responsable de revisar las recomendaciones antes de usarlas para tomar decisiones de negocio. En particular, los resultados no deben ser la única base para decisiones que afecten a personas concretas, como contrataciones, evaluaciones del desempeño o despidos.",
          "No garantizamos que los resultados generados por IA sean:",
          ["exactos;", "completos;", "pertinentes;", "imparciales;", "actuales;", "libres de errores; ni", "adecuados para un fin concreto."],
        ]},
        { h: "Sin garantía de resultados empresariales", b: [
          "El Servicio está pensado para ayudarte a identificar oportunidades de mejora en tus procesos internos. Sin embargo, no garantizamos:",
          ["mejoras de eficiencia o productividad;", "crecimiento;", "ventas;", "ingresos o rentabilidad;", "financiación o valoración; ni", "ningún otro resultado empresarial."],
          "Los resultados dependen de numerosos factores ajenos a nuestro control.",
        ]},
        { h: "Disponibilidad y cambios en el Servicio", b: [
          "Podemos modificar, suspender o interrumpir cualquier parte del Servicio en cualquier momento, así como añadir, eliminar o modificar funciones, integraciones, precios o requisitos técnicos.",
          "Haremos esfuerzos razonables para mantener la disponibilidad del Servicio, pero no garantizamos un funcionamiento ininterrumpido ni libre de errores.",
        ]},
        { h: "Cuentas", b: [
          "Cuando sea necesario registrarse, eres responsable de facilitar información exacta y de mantener la confidencialidad de tus credenciales.",
          "Eres responsable de la actividad realizada a través de tu cuenta, salvo que se deba a circunstancias fuera de tu control razonable.",
          "Nos reservamos el derecho de suspender o cancelar las cuentas que incumplan estos Términos o la ley aplicable.",
        ]},
        { h: "Precios y pagos", b: [
          "Si se introducen planes de pago, los precios, periodos de facturación, condiciones de cancelación y demás condiciones de pago se mostrarán antes de la compra.",
          "Salvo que se indique lo contrario, los importes no son reembolsables, excepto cuando lo exija la ley aplicable o se indique expresamente.",
          "Nos reservamos el derecho de cambiar los precios de futuras compras o periodos de suscripción. Los suscriptores existentes recibirán los avisos que exija la ley aplicable.",
        ]},
        { h: "Exención de garantías", b: [
          "En la máxima medida permitida por la ley aplicable, el Servicio se presta «tal cual» y «según disponibilidad».",
          "No ofrecemos garantías, expresas ni implícitas, sobre el Servicio, incluidas garantías de:",
          ["comerciabilidad;", "idoneidad para un fin concreto;", "disponibilidad;", "exactitud;", "fiabilidad;", "no infracción; ni", "adecuación a tus necesidades concretas."],
          "Nada de lo dispuesto en estos Términos excluye ni limita los derechos de los consumidores u otros derechos que no puedan excluirse o limitarse legalmente.",
        ]},
        { h: "Limitación de responsabilidad", b: [
          "En la máxima medida permitida por la ley aplicable, no seremos responsables de daños indirectos, incidentales, especiales, consecuentes o punitivos, ni de la pérdida de beneficios, ingresos, oportunidades de negocio, datos o reputación derivados del uso del Servicio o relacionados con él.",
          "Cuando la ley lo permita, nuestra responsabilidad total derivada del Servicio o relacionada con él se limitará al importe que nos hayas pagado por el Servicio durante los 12 meses anteriores al hecho que origine la reclamación o, si no nos has realizado ningún pago, a 100 €.",
          "Nada de lo dispuesto en estos Términos limita la responsabilidad que no pueda limitarse o excluirse legalmente.",
        ]},
        { h: "Indemnización", b: [
          "En la medida permitida por la ley aplicable, te comprometes a mantener indemne a {{COMPANY}}, a sus administradores, directivos, empleados y colaboradores frente a reclamaciones, daños, responsabilidades, pérdidas y gastos derivados de:",
          ["un uso ilícito del Servicio;", "el incumplimiento de estos Términos;", "la vulneración de derechos de terceros;", "el incumplimiento de leyes o normativas aplicables; o", "el contenido o la información que aportes al Servicio."],
        ]},
        { h: "Terminación", b: [
          "Puedes dejar de usar el Servicio en cualquier momento.",
          "Podemos suspender o cancelar tu acceso cuando sea razonablemente necesario, por ejemplo si incumples gravemente estos Términos, usas el Servicio de forma ilícita o generas un riesgo de seguridad o legal.",
          "Tras la terminación, seguirán vigentes las disposiciones que por su naturaleza deban mantenerse, incluidas las relativas a propiedad intelectual, exención de garantías, limitación de responsabilidad y ley aplicable.",
        ]},
        { h: "Ley aplicable", b: [
          "Estos Términos se rigen por la legislación española, salvo que las disposiciones imperativas de la ley que te resulte aplicable establezcan otra cosa.",
          "Cualquier controversia se someterá a los juzgados y tribunales competentes de España, sin perjuicio de los derechos imperativos de protección de los consumidores que puedan corresponder.",
        ]},
        { h: "Cambios en estos Términos", b: [
          "Podemos actualizar estos Términos periódicamente. Cuando realicemos cambios importantes, tomaremos medidas razonables para avisarte cuando lo exija la ley aplicable.",
          "Los Términos actualizados entrarán en vigor en la fecha indicada al principio de la versión actualizada.",
        ]},
        { h: "Contacto", b: [
          "Si tienes preguntas sobre estos Términos, puedes contactar con nosotros en:",
          ["{{COMPANY}}", "Email: {{EMAIL}}", "Domicilio: {{ADDRESS}}", "NIF y datos registrales: {{NIF}}"],
        ]},
      ],
    },

    en: {
      title: "Terms of Service",
      intro: [
        "These Terms of Service (“Terms”) govern your access to and use of Ozmetra, an AI-powered software-as-a-service platform operated by {{COMPANY}} (“we”, “us”, “our”).",
        "By joining our waitlist, requesting a call, accessing our website, or using our services once available, you agree to these Terms. If you do not agree, please do not use the website or services.",
      ],
      sections: [
        { h: "The Service", b: [
          "Ozmetra is an AI-powered platform designed to assess the internal processes of companies, in particular startups. The Service is configured for each client and may, among other things:",
          ["gather information about the company through interviews with its team and from the documents and tools the client chooses to share;",
           "analyse that information against an evaluation framework;",
           "use artificial intelligence to classify, summarise, score, or otherwise analyse that information;",
           "present the results through visualisations that identify strengths, critical areas, and recommendations for improvement."],
          "The Service does not guarantee that any recommendation will lead to a specific improvement in the company.",
          "AI-generated results may be inaccurate, incomplete, outdated, or incorrectly interpreted. You are responsible for reviewing results before taking action.",
        ]},
        { h: "Waitlist and call requests", b: [
          "Before the Service is publicly available, we may operate a waitlist. When you join, we collect your work email and, optionally, your company name, your role, and your answers to the quick self-check, for the purpose of:",
          ["notifying you when the Service becomes available;", "providing information about access to the Service;", "communicating material information relating to the launch."],
          "If you request a call, we collect your name, phone number, and preferred time slot solely so that our customer information team can contact you.",
          "Joining the waitlist does not guarantee access to the Service, a particular launch date, pricing, features, or availability. We may discontinue or change the waitlist at any time.",
          "Where required by applicable law, marketing communications unrelated to the launch of the Service will only be sent where an appropriate legal basis exists.",
        ]},
        { h: "Privacy", b: [
          "Your personal data will be processed in accordance with our {{PRIVACY}}, which forms part of these Terms.",
          "For individuals in the European Economic Area or otherwise protected by the GDPR, personal data will be processed in accordance with applicable data protection legislation, including Regulation (EU) 2016/679 (“GDPR”).",
          "For the waitlist and call requests, we will only request the information reasonably necessary for the stated purposes.",
        ]},
        { h: "Acceptable use", b: [
          "You agree not to use the Service:",
          ["for any unlawful or fraudulent purpose;", "to violate the rights of others;", "to harass, threaten, deceive, or impersonate another person;", "to distribute spam or unsolicited communications;", "to circumvent technical restrictions, authentication mechanisms, rate limits, or access controls;", "to interfere with or disrupt the Service;", "to attempt to gain unauthorised access to our systems or those of third parties;", "to use automated methods to access the Service except where expressly permitted by us;", "to share third-party information (including employees, customers, or suppliers) without an appropriate legal basis or without informing them where required;", "to use the Service's results in a manner inconsistent with data protection, employment, or other applicable laws."],
          "You are responsible for ensuring that your use of the Service complies with applicable law and that you have the authorisations needed to share information about your company and the people who take part in interviews.",
        ]},
        { h: "Third-party tools and sources", b: [
          "The Service may connect to third-party tools you choose to use, such as document management, project management, CRM, or financial tools.",
          "These tools are provided by independent third parties that are not owned, controlled, or operated by us. Your use of them remains subject to their respective terms, policies, and privacy practices.",
          "Ozmetra is not affiliated with, endorsed by, or sponsored by any provider of those tools unless expressly stated otherwise.",
          "We do not guarantee the continued availability, accuracy, accessibility, or compatibility of data obtained from third-party tools. Changes to their APIs, policies, or technical restrictions may affect or limit the functionality of the Service.",
        ]},
        { h: "Intellectual property", b: [
          "All rights, title, and interest in and to the Service, including its software, technology, design, branding, interfaces, documentation, and underlying systems, are owned by or licensed to us.",
          "Except as expressly permitted under these Terms, you may not:",
          ["copy, reproduce, modify, or distribute the Service;", "reverse engineer or attempt to derive the source code;", "create derivative works based on the Service;", "resell, sublicense, or commercially exploit the Service without our written permission;", "remove proprietary or intellectual property notices."],
          "You retain ownership of the content and information you lawfully provide to the Service, including information about your company, subject to the rights necessary for us to provide and operate the Service.",
        ]},
        { h: "AI-generated information", b: [
          "The Service uses artificial intelligence and machine-learning technologies.",
          "AI-generated assessments, scores, and recommendations are provided for informational and assistance purposes only. They should not be treated as guaranteed facts, professional advice (legal, financial, tax, or employment), or a substitute for your own judgment.",
          "You are responsible for reviewing recommendations before using them to make business decisions. In particular, results should not be the sole basis for decisions affecting specific individuals, such as hiring, performance reviews, or dismissals.",
          "We do not guarantee that AI-generated results will be:",
          ["accurate;", "complete;", "relevant;", "unbiased;", "current;", "free from errors; or", "suitable for a particular purpose."],
        ]},
        { h: "No guarantee of business results", b: [
          "The Service is intended to help you identify opportunities to improve your internal processes. However, we make no guarantee regarding:",
          ["efficiency or productivity gains;", "growth;", "sales;", "revenue or profitability;", "funding or valuation; or", "any other business result."],
          "Results depend on numerous factors outside our control.",
        ]},
        { h: "Availability and changes to the Service", b: [
          "We may modify, suspend, or discontinue any part of the Service at any time, and add, remove, or modify features, integrations, pricing, or technical requirements.",
          "We will make reasonable efforts to maintain the availability of the Service but do not guarantee uninterrupted or error-free operation.",
        ]},
        { h: "Accounts", b: [
          "Where account registration is required, you are responsible for providing accurate information and keeping your credentials confidential.",
          "You are responsible for activity conducted through your account unless caused by circumstances outside your reasonable control.",
          "We reserve the right to suspend or terminate accounts that violate these Terms or applicable law.",
        ]},
        { h: "Fees and payments", b: [
          "If paid plans are introduced, applicable prices, billing periods, cancellation terms, and other payment conditions will be presented before purchase.",
          "Unless otherwise stated, fees are non-refundable except where required by applicable law or expressly stated otherwise.",
          "We reserve the right to change pricing for future purchases or subscription periods. Existing subscribers will receive any notices required by applicable law.",
        ]},
        { h: "Disclaimer of warranties", b: [
          "To the maximum extent permitted by applicable law, the Service is provided “as is” and “as available”.",
          "We make no warranties, express or implied, regarding the Service, including warranties of:",
          ["merchantability;", "fitness for a particular purpose;", "availability;", "accuracy;", "reliability;", "non-infringement; or", "suitability for your particular requirements."],
          "Nothing in these Terms excludes or limits any consumer rights or other rights that cannot legally be excluded or limited under applicable law.",
        ]},
        { h: "Limitation of liability", b: [
          "To the maximum extent permitted by applicable law, we will not be liable for indirect, incidental, special, consequential, or punitive damages, or for loss of profits, revenue, business opportunities, data, or goodwill arising from or relating to your use of the Service.",
          "Where permitted by applicable law, our aggregate liability arising out of or relating to the Service will be limited to the amount you paid us for the Service during the 12 months preceding the event giving rise to the claim, or €100 where you have not made any payment to us.",
          "Nothing in these Terms limits liability that cannot legally be limited or excluded under applicable law.",
        ]},
        { h: "Indemnification", b: [
          "To the extent permitted by applicable law, you agree to indemnify and hold harmless {{COMPANY}}, its officers, directors, employees, and contractors from claims, damages, liabilities, losses, and expenses arising from:",
          ["your unlawful use of the Service;", "your violation of these Terms;", "your violation of third-party rights;", "your violation of applicable laws or regulations; or", "content or information you submit to the Service."],
        ]},
        { h: "Termination", b: [
          "You may stop using the Service at any time.",
          "We may suspend or terminate your access where reasonably necessary, including where you materially violate these Terms, use the Service unlawfully, or create a security or legal risk.",
          "Upon termination, provisions that by their nature should survive will remain in effect, including those relating to intellectual property, disclaimers, limitations of liability, and governing law.",
        ]},
        { h: "Governing law", b: [
          "These Terms are governed by the laws of Spain, unless mandatory provisions of the law applicable to you provide otherwise.",
          "Any disputes will be subject to the jurisdiction of the competent courts in Spain, without prejudice to any mandatory consumer protection rights that may apply.",
        ]},
        { h: "Changes to these Terms", b: [
          "We may update these Terms from time to time. When we make material changes, we will take reasonable steps to notify users where required by applicable law.",
          "The updated Terms will become effective on the date stated at the beginning of the updated version.",
        ]},
        { h: "Contact", b: [
          "If you have questions regarding these Terms, you can contact us at:",
          ["{{COMPANY}}", "Email: {{EMAIL}}", "Address: {{ADDRESS}}", "Tax ID and registration details: {{NIF}}"],
        ]},
      ],
    },

    fr: {
      title: "Conditions d'utilisation",
      intro: [
        "Les présentes Conditions d'utilisation (les « Conditions ») régissent l'accès à Ozmetra et son utilisation. Ozmetra est une plateforme logicielle en tant que service fondée sur l'intelligence artificielle, exploitée par {{COMPANY}} (« nous »).",
        "En rejoignant notre liste d'attente, en demandant un appel, en accédant à notre site web ou en utilisant nos services lorsqu'ils seront disponibles, vous acceptez les présentes Conditions. Si vous ne les acceptez pas, veuillez ne pas utiliser le site web ni les services.",
      ],
      sections: [
        { h: "Le Service", b: [
          "Ozmetra est une plateforme fondée sur l'intelligence artificielle, conçue pour évaluer les processus internes des entreprises, en particulier des startups. Le Service est configuré pour chaque client et peut notamment :",
          ["recueillir des informations sur l'entreprise au moyen d'entretiens avec son équipe et à partir des documents et outils que le client choisit de partager ;",
           "analyser ces informations selon un cadre d'évaluation ;",
           "utiliser l'intelligence artificielle pour classer, résumer, noter ou analyser autrement ces informations ;",
           "présenter les résultats sous forme de visualisations identifiant les points forts, les domaines critiques et des recommandations d'amélioration."],
          "Le Service ne garantit pas que les recommandations entraîneront une amélioration précise dans l'entreprise.",
          "Les résultats générés par l'IA peuvent être inexacts, incomplets, obsolètes ou mal interprétés. Il vous appartient de les vérifier avant d'agir.",
        ]},
        { h: "Liste d'attente et demandes d'appel", b: [
          "Avant que le Service ne soit accessible au public, nous pouvons gérer une liste d'attente. Lorsque vous vous inscrivez, nous recueillons votre e-mail professionnel et, de manière facultative, le nom de votre entreprise, votre rôle et vos réponses au test rapide, afin de :",
          ["vous prévenir lorsque le Service sera disponible ;", "vous informer sur l'accès au Service ;", "vous communiquer des informations importantes relatives au lancement."],
          "Si vous demandez un appel, nous recueillons votre nom, votre numéro de téléphone et le créneau horaire de votre choix, dans le seul but que notre service d'information client vous contacte.",
          "L'inscription sur la liste d'attente ne garantit ni l'accès au Service, ni une date de lancement, ni un prix, ni des fonctionnalités ou une disponibilité particulières. Nous pouvons modifier ou clore la liste d'attente à tout moment.",
          "Lorsque la loi applicable l'exige, les communications commerciales sans lien avec le lancement du Service ne seront envoyées que sur une base juridique appropriée.",
        ]},
        { h: "Confidentialité", b: [
          "Vos données personnelles seront traitées conformément à notre {{PRIVACY}}, qui fait partie intégrante des présentes Conditions.",
          "Pour les personnes situées dans l'Espace économique européen ou autrement protégées par le RGPD, les données personnelles seront traitées conformément à la législation applicable en matière de protection des données, notamment le Règlement (UE) 2016/679 (« RGPD »).",
          "Pour la liste d'attente et les demandes d'appel, nous ne demanderons que les informations raisonnablement nécessaires aux finalités indiquées.",
        ]},
        { h: "Utilisation acceptable", b: [
          "Vous vous engagez à ne pas utiliser le Service :",
          ["à des fins illicites ou frauduleuses ;", "pour porter atteinte aux droits d'autrui ;", "pour harceler, menacer, tromper ou usurper l'identité d'une autre personne ;", "pour diffuser du spam ou des communications non sollicitées ;", "pour contourner des restrictions techniques, des mécanismes d'authentification, des limites d'utilisation ou des contrôles d'accès ;", "pour perturber ou interrompre le Service ;", "pour tenter d'accéder sans autorisation à nos systèmes ou à ceux de tiers ;", "au moyen de méthodes automatisées, sauf autorisation expresse de notre part ;", "pour partager des informations sur des tiers (y compris des salariés, clients ou fournisseurs) sans base juridique appropriée ou sans les en informer lorsque cela est obligatoire ;", "pour utiliser les résultats du Service d'une manière contraire à la législation sur la protection des données, au droit du travail ou à toute autre loi applicable."],
          "Il vous appartient de veiller à ce que votre utilisation du Service respecte la loi applicable et de disposer des autorisations nécessaires pour partager les informations de votre entreprise et des personnes qui participent aux entretiens.",
        ]},
        { h: "Outils et sources tiers", b: [
          "Le Service peut se connecter à des outils tiers que vous choisissez d'utiliser, tels que des outils de gestion documentaire, de gestion de projet, de CRM ou de finance.",
          "Ces outils sont fournis par des tiers indépendants qui ne nous appartiennent pas et que nous ne contrôlons pas. Leur utilisation reste soumise à leurs propres conditions, politiques et pratiques en matière de confidentialité.",
          "Ozmetra n'est ni affiliée, ni approuvée, ni sponsorisée par un fournisseur de ces outils, sauf mention expresse contraire.",
          "Nous ne garantissons pas la disponibilité, l'exactitude, l'accessibilité ou la compatibilité continues des données obtenues à partir d'outils tiers. Les modifications de leurs API, politiques ou restrictions techniques peuvent affecter ou limiter le fonctionnement du Service.",
        ]},
        { h: "Propriété intellectuelle", b: [
          "Tous les droits relatifs au Service, y compris ses logiciels, sa technologie, son design, sa marque, ses interfaces, sa documentation et ses systèmes sous-jacents, nous appartiennent ou nous sont concédés sous licence.",
          "Sauf autorisation expresse prévue par les présentes Conditions, vous ne pouvez pas :",
          ["copier, reproduire, modifier ou distribuer le Service ;", "procéder à de l'ingénierie inverse ou tenter d'obtenir le code source ;", "créer des œuvres dérivées fondées sur le Service ;", "revendre, sous-licencier ou exploiter commercialement le Service sans notre autorisation écrite ;", "supprimer les mentions de propriété ou de propriété intellectuelle."],
          "Vous conservez la propriété des contenus et informations que vous fournissez licitement au Service, y compris les informations relatives à votre entreprise, sous réserve des droits nécessaires pour que nous puissions fournir et exploiter le Service.",
        ]},
        { h: "Informations générées par l'IA", b: [
          "Le Service utilise des technologies d'intelligence artificielle et d'apprentissage automatique.",
          "Les évaluations, notes et recommandations générées par l'IA sont fournies uniquement à titre informatif et d'assistance. Elles ne doivent pas être considérées comme des faits garantis, comme un conseil professionnel (juridique, financier, fiscal ou en droit du travail) ni comme un substitut à votre propre jugement.",
          "Il vous appartient d'examiner les recommandations avant de les utiliser pour prendre des décisions commerciales. En particulier, les résultats ne doivent pas constituer la seule base de décisions concernant des personnes déterminées, telles que des recrutements, des évaluations de performance ou des licenciements.",
          "Nous ne garantissons pas que les résultats générés par l'IA seront :",
          ["exacts ;", "complets ;", "pertinents ;", "impartiaux ;", "à jour ;", "exempts d'erreurs ; ou", "adaptés à un usage particulier."],
        ]},
        { h: "Absence de garantie de résultats commerciaux", b: [
          "Le Service vise à vous aider à identifier des possibilités d'amélioration de vos processus internes. Toutefois, nous ne garantissons pas :",
          ["des gains d'efficacité ou de productivité ;", "la croissance ;", "les ventes ;", "le chiffre d'affaires ou la rentabilité ;", "un financement ou une valorisation ; ni", "tout autre résultat commercial."],
          "Les résultats dépendent de nombreux facteurs indépendants de notre volonté.",
        ]},
        { h: "Disponibilité et modifications du Service", b: [
          "Nous pouvons modifier, suspendre ou interrompre tout ou partie du Service à tout moment, et ajouter, supprimer ou modifier des fonctionnalités, intégrations, prix ou exigences techniques.",
          "Nous ferons des efforts raisonnables pour maintenir la disponibilité du Service, sans garantir un fonctionnement ininterrompu ou exempt d'erreurs.",
        ]},
        { h: "Comptes", b: [
          "Lorsqu'une inscription est nécessaire, il vous appartient de fournir des informations exactes et de préserver la confidentialité de vos identifiants.",
          "Vous êtes responsable de l'activité réalisée via votre compte, sauf si elle résulte de circonstances échappant à votre contrôle raisonnable.",
          "Nous nous réservons le droit de suspendre ou de résilier les comptes qui enfreignent les présentes Conditions ou la loi applicable.",
        ]},
        { h: "Tarifs et paiements", b: [
          "Si des offres payantes sont proposées, les prix, périodes de facturation, conditions de résiliation et autres conditions de paiement seront présentés avant l'achat.",
          "Sauf indication contraire, les sommes versées ne sont pas remboursables, sauf lorsque la loi applicable l'exige ou lorsque cela est expressément indiqué.",
          "Nous nous réservons le droit de modifier les prix des achats ou périodes d'abonnement futurs. Les abonnés existants recevront les notifications requises par la loi applicable.",
        ]},
        { h: "Exclusion de garanties", b: [
          "Dans toute la mesure permise par la loi applicable, le Service est fourni « en l'état » et « selon disponibilité ».",
          "Nous n'offrons aucune garantie, expresse ou implicite, concernant le Service, notamment en matière de :",
          ["qualité marchande ;", "adéquation à un usage particulier ;", "disponibilité ;", "exactitude ;", "fiabilité ;", "absence de contrefaçon ; ou", "adéquation à vos besoins particuliers."],
          "Aucune disposition des présentes Conditions n'exclut ni ne limite les droits des consommateurs ou tout autre droit qui ne peut être légalement exclu ou limité.",
        ]},
        { h: "Limitation de responsabilité", b: [
          "Dans toute la mesure permise par la loi applicable, nous ne serons pas responsables des dommages indirects, accessoires, spéciaux, consécutifs ou punitifs, ni de toute perte de bénéfices, de chiffre d'affaires, d'opportunités commerciales, de données ou de réputation découlant de votre utilisation du Service ou liée à celle-ci.",
          "Lorsque la loi le permet, notre responsabilité totale découlant du Service ou liée à celui-ci sera limitée au montant que vous nous avez versé pour le Service au cours des 12 mois précédant l'événement à l'origine de la réclamation ou, si vous ne nous avez effectué aucun paiement, à 100 €.",
          "Aucune disposition des présentes Conditions ne limite une responsabilité qui ne peut être légalement limitée ou exclue.",
        ]},
        { h: "Indemnisation", b: [
          "Dans la mesure permise par la loi applicable, vous acceptez d'indemniser et de garantir {{COMPANY}}, ses dirigeants, administrateurs, salariés et prestataires contre toute réclamation, tout dommage, toute responsabilité, perte et dépense découlant :",
          ["d'une utilisation illicite du Service ;", "d'une violation des présentes Conditions ;", "d'une atteinte aux droits de tiers ;", "d'une violation des lois ou réglementations applicables ; ou", "des contenus ou informations que vous fournissez au Service."],
        ]},
        { h: "Résiliation", b: [
          "Vous pouvez cesser d'utiliser le Service à tout moment.",
          "Nous pouvons suspendre ou résilier votre accès lorsque cela est raisonnablement nécessaire, notamment en cas de violation grave des présentes Conditions, d'utilisation illicite du Service ou de création d'un risque juridique ou de sécurité.",
          "Après la résiliation, les dispositions qui, par nature, doivent perdurer restent en vigueur, notamment celles relatives à la propriété intellectuelle, aux exclusions de garanties, aux limitations de responsabilité et au droit applicable.",
        ]},
        { h: "Droit applicable", b: [
          "Les présentes Conditions sont régies par le droit espagnol, sauf si des dispositions impératives de la loi qui vous est applicable en disposent autrement.",
          "Tout litige relèvera de la compétence des juridictions espagnoles compétentes, sans préjudice des droits impératifs de protection des consommateurs éventuellement applicables.",
        ]},
        { h: "Modifications des présentes Conditions", b: [
          "Nous pouvons mettre à jour les présentes Conditions de temps à autre. En cas de modification importante, nous prendrons des mesures raisonnables pour en informer les utilisateurs lorsque la loi applicable l'exige.",
          "Les Conditions mises à jour entreront en vigueur à la date indiquée au début de la nouvelle version.",
        ]},
        { h: "Contact", b: [
          "Pour toute question concernant les présentes Conditions, vous pouvez nous contacter :",
          ["{{COMPANY}}", "E-mail : {{EMAIL}}", "Adresse : {{ADDRESS}}", "Numéro fiscal et immatriculation : {{NIF}}"],
        ]},
      ],
    },

    de: {
      title: "Nutzungsbedingungen",
      intro: [
        "Diese Nutzungsbedingungen („Bedingungen“) regeln den Zugang zu und die Nutzung von Ozmetra, einer KI-gestützten Software-as-a-Service-Plattform, die von {{COMPANY}} („wir“, „uns“) betrieben wird.",
        "Indem du dich auf unsere Warteliste einträgst, einen Anruf anforderst, unsere Website aufrufst oder unsere Dienste nutzt, sobald sie verfügbar sind, stimmst du diesen Bedingungen zu. Wenn du nicht einverstanden bist, nutze die Website und die Dienste bitte nicht.",
      ],
      sections: [
        { h: "Der Dienst", b: [
          "Ozmetra ist eine KI-gestützte Plattform zur Bewertung der internen Prozesse von Unternehmen, insbesondere von Startups. Der Dienst wird für jeden Kunden konfiguriert und kann unter anderem:",
          ["Informationen über das Unternehmen durch Interviews mit dem Team sowie aus den Dokumenten und Tools erheben, die der Kunde teilen möchte;",
           "diese Informationen anhand eines Bewertungsrahmens analysieren;",
           "künstliche Intelligenz nutzen, um diese Informationen zu klassifizieren, zusammenzufassen, zu bewerten oder anderweitig zu analysieren;",
           "die Ergebnisse in Visualisierungen darstellen, die Stärken, kritische Bereiche und Verbesserungsempfehlungen aufzeigen."],
          "Der Dienst garantiert nicht, dass die Empfehlungen zu einer bestimmten Verbesserung im Unternehmen führen.",
          "KI-generierte Ergebnisse können ungenau, unvollständig, veraltet oder falsch interpretiert sein. Du bist dafür verantwortlich, die Ergebnisse zu prüfen, bevor du handelst.",
        ]},
        { h: "Warteliste und Rückrufanfragen", b: [
          "Bevor der Dienst öffentlich verfügbar ist, können wir eine Warteliste führen. Wenn du dich einträgst, erheben wir deine geschäftliche E-Mail-Adresse und optional den Namen deines Unternehmens, deine Rolle und deine Antworten auf den Schnelltest, um:",
          ["dich zu benachrichtigen, sobald der Dienst verfügbar ist;", "dich über den Zugang zum Dienst zu informieren;", "dir wesentliche Informationen zum Start mitzuteilen."],
          "Wenn du einen Anruf anforderst, erheben wir deinen Namen, deine Telefonnummer und dein bevorzugtes Zeitfenster ausschließlich, damit unser Kundeninformationsteam dich kontaktieren kann.",
          "Die Aufnahme in die Warteliste garantiert weder den Zugang zum Dienst noch ein bestimmtes Startdatum, bestimmte Preise, Funktionen oder eine bestimmte Verfügbarkeit. Wir können die Warteliste jederzeit ändern oder beenden.",
          "Soweit das anwendbare Recht es verlangt, versenden wir Werbemitteilungen, die nicht mit dem Start des Dienstes zusammenhängen, nur auf einer geeigneten Rechtsgrundlage.",
        ]},
        { h: "Datenschutz", b: [
          "Deine personenbezogenen Daten werden gemäß unserer {{PRIVACY}} verarbeitet, die Bestandteil dieser Bedingungen ist.",
          "Für Personen im Europäischen Wirtschaftsraum oder anderweitig durch die DSGVO geschützte Personen werden personenbezogene Daten gemäß den geltenden Datenschutzvorschriften verarbeitet, einschließlich der Verordnung (EU) 2016/679 („DSGVO“).",
          "Für die Warteliste und Rückrufanfragen erfragen wir nur die Informationen, die für die genannten Zwecke vernünftigerweise erforderlich sind.",
        ]},
        { h: "Zulässige Nutzung", b: [
          "Du verpflichtest dich, den Dienst nicht zu nutzen:",
          ["für rechtswidrige oder betrügerische Zwecke;", "um die Rechte anderer zu verletzen;", "um andere Personen zu belästigen, zu bedrohen, zu täuschen oder dich als jemand anderes auszugeben;", "um Spam oder unerwünschte Mitteilungen zu verbreiten;", "um technische Beschränkungen, Authentifizierungsmechanismen, Nutzungslimits oder Zugangskontrollen zu umgehen;", "um den Dienst zu stören oder zu unterbrechen;", "um unbefugten Zugriff auf unsere Systeme oder die Dritter zu erlangen;", "mit automatisierten Methoden, sofern wir dies nicht ausdrücklich erlauben;", "um Informationen über Dritte (einschließlich Mitarbeitender, Kunden oder Lieferanten) ohne geeignete Rechtsgrundlage oder ohne die erforderliche Information der Betroffenen zu teilen;", "um die Ergebnisse des Dienstes in einer Weise zu verwenden, die gegen Datenschutz-, Arbeits- oder sonstiges geltendes Recht verstößt."],
          "Du bist dafür verantwortlich, dass deine Nutzung des Dienstes dem geltenden Recht entspricht und dass du über die erforderlichen Befugnisse verfügst, um Informationen über dein Unternehmen und die an Interviews teilnehmenden Personen zu teilen.",
        ]},
        { h: "Tools und Quellen Dritter", b: [
          "Der Dienst kann sich mit Tools Dritter verbinden, die du nutzen möchtest, etwa Dokumentenmanagement, Projektmanagement, CRM oder Finanztools.",
          "Diese Tools werden von unabhängigen Dritten bereitgestellt, die nicht uns gehören und nicht von uns kontrolliert werden. Ihre Nutzung unterliegt weiterhin deren eigenen Bedingungen, Richtlinien und Datenschutzpraktiken.",
          "Ozmetra ist mit keinem Anbieter dieser Tools verbunden und wird von keinem unterstützt oder gesponsert, sofern nicht ausdrücklich anders angegeben.",
          "Wir garantieren nicht die fortlaufende Verfügbarkeit, Richtigkeit, Zugänglichkeit oder Kompatibilität von Daten aus Tools Dritter. Änderungen an deren APIs, Richtlinien oder technischen Beschränkungen können die Funktion des Dienstes beeinträchtigen oder einschränken.",
        ]},
        { h: "Geistiges Eigentum", b: [
          "Alle Rechte am Dienst, einschließlich Software, Technologie, Design, Marke, Oberflächen, Dokumentation und zugrunde liegender Systeme, liegen bei uns oder wurden uns lizenziert.",
          "Soweit diese Bedingungen es nicht ausdrücklich erlauben, darfst du nicht:",
          ["den Dienst kopieren, vervielfältigen, verändern oder verbreiten;", "Reverse Engineering betreiben oder versuchen, den Quellcode zu ermitteln;", "abgeleitete Werke auf Grundlage des Dienstes erstellen;", "den Dienst ohne unsere schriftliche Zustimmung weiterverkaufen, unterlizenzieren oder kommerziell verwerten;", "Eigentums- oder Urheberrechtshinweise entfernen."],
          "Du behältst das Eigentum an den Inhalten und Informationen, die du dem Dienst rechtmäßig bereitstellst, einschließlich der Informationen über dein Unternehmen, vorbehaltlich der Rechte, die wir benötigen, um den Dienst bereitzustellen und zu betreiben.",
        ]},
        { h: "KI-generierte Informationen", b: [
          "Der Dienst nutzt Technologien der künstlichen Intelligenz und des maschinellen Lernens.",
          "KI-generierte Bewertungen, Punktzahlen und Empfehlungen dienen ausschließlich Informations- und Unterstützungszwecken. Sie sind weder garantierte Tatsachen noch professionelle Beratung (rechtlich, finanziell, steuerlich oder arbeitsrechtlich) noch ein Ersatz für dein eigenes Urteil.",
          "Du bist dafür verantwortlich, Empfehlungen zu prüfen, bevor du sie für geschäftliche Entscheidungen verwendest. Insbesondere dürfen die Ergebnisse nicht die alleinige Grundlage für Entscheidungen über einzelne Personen sein, etwa Einstellungen, Leistungsbeurteilungen oder Kündigungen.",
          "Wir garantieren nicht, dass KI-generierte Ergebnisse:",
          ["richtig;", "vollständig;", "relevant;", "unvoreingenommen;", "aktuell;", "fehlerfrei; oder", "für einen bestimmten Zweck geeignet sind."],
        ]},
        { h: "Keine Garantie für Geschäftsergebnisse", b: [
          "Der Dienst soll dir helfen, Verbesserungsmöglichkeiten in deinen internen Prozessen zu erkennen. Wir übernehmen jedoch keine Garantie für:",
          ["Effizienz- oder Produktivitätsgewinne;", "Wachstum;", "Umsätze;", "Erträge oder Rentabilität;", "Finanzierung oder Bewertung; oder", "sonstige Geschäftsergebnisse."],
          "Die Ergebnisse hängen von zahlreichen Faktoren ab, die außerhalb unserer Kontrolle liegen.",
        ]},
        { h: "Verfügbarkeit und Änderungen des Dienstes", b: [
          "Wir können Teile des Dienstes jederzeit ändern, aussetzen oder einstellen sowie Funktionen, Integrationen, Preise oder technische Anforderungen hinzufügen, entfernen oder ändern.",
          "Wir bemühen uns in angemessener Weise um die Verfügbarkeit des Dienstes, garantieren jedoch keinen unterbrechungs- oder fehlerfreien Betrieb.",
        ]},
        { h: "Konten", b: [
          "Wenn eine Registrierung erforderlich ist, bist du für die Angabe korrekter Informationen und die Vertraulichkeit deiner Zugangsdaten verantwortlich.",
          "Du bist für Aktivitäten über dein Konto verantwortlich, sofern sie nicht auf Umständen beruhen, die außerhalb deiner zumutbaren Kontrolle liegen.",
          "Wir behalten uns vor, Konten zu sperren oder zu kündigen, die gegen diese Bedingungen oder geltendes Recht verstoßen.",
        ]},
        { h: "Preise und Zahlungen", b: [
          "Falls kostenpflichtige Tarife eingeführt werden, werden Preise, Abrechnungszeiträume, Kündigungsbedingungen und sonstige Zahlungsbedingungen vor dem Kauf angezeigt.",
          "Sofern nicht anders angegeben, sind Gebühren nicht erstattungsfähig, es sei denn, das geltende Recht schreibt dies vor oder es ist ausdrücklich angegeben.",
          "Wir behalten uns vor, die Preise für künftige Käufe oder Abonnementzeiträume zu ändern. Bestehende Abonnenten erhalten die gesetzlich vorgeschriebenen Mitteilungen.",
        ]},
        { h: "Gewährleistungsausschluss", b: [
          "Soweit gesetzlich zulässig, wird der Dienst „wie besehen“ und „wie verfügbar“ bereitgestellt.",
          "Wir übernehmen keine ausdrücklichen oder stillschweigenden Gewährleistungen für den Dienst, einschließlich Gewährleistungen der:",
          ["Marktgängigkeit;", "Eignung für einen bestimmten Zweck;", "Verfügbarkeit;", "Richtigkeit;", "Zuverlässigkeit;", "Nichtverletzung von Rechten Dritter; oder", "Eignung für deine besonderen Anforderungen."],
          "Nichts in diesen Bedingungen schließt Verbraucherrechte oder sonstige Rechte aus oder beschränkt sie, die gesetzlich nicht ausgeschlossen oder beschränkt werden können.",
        ]},
        { h: "Haftungsbeschränkung", b: [
          "Soweit gesetzlich zulässig, haften wir nicht für indirekte, zufällige, besondere, Folge- oder Strafschäden oder für entgangenen Gewinn, Umsatz, Geschäftschancen, Daten oder Ansehen, die aus deiner Nutzung des Dienstes entstehen oder damit zusammenhängen.",
          "Soweit gesetzlich zulässig, ist unsere Gesamthaftung im Zusammenhang mit dem Dienst auf den Betrag begrenzt, den du uns in den 12 Monaten vor dem anspruchsbegründenden Ereignis für den Dienst gezahlt hast, oder auf 100 €, wenn du keine Zahlung an uns geleistet hast.",
          "Nichts in diesen Bedingungen beschränkt eine Haftung, die gesetzlich nicht beschränkt oder ausgeschlossen werden kann.",
        ]},
        { h: "Freistellung", b: [
          "Soweit gesetzlich zulässig, stellst du {{COMPANY}}, deren Geschäftsführung, Führungskräfte, Mitarbeitende und Auftragnehmer von Ansprüchen, Schäden, Verbindlichkeiten, Verlusten und Kosten frei, die entstehen aus:",
          ["deiner rechtswidrigen Nutzung des Dienstes;", "deinem Verstoß gegen diese Bedingungen;", "deiner Verletzung von Rechten Dritter;", "deinem Verstoß gegen geltende Gesetze oder Vorschriften; oder", "Inhalten oder Informationen, die du dem Dienst bereitstellst."],
        ]},
        { h: "Beendigung", b: [
          "Du kannst die Nutzung des Dienstes jederzeit beenden.",
          "Wir können deinen Zugang sperren oder beenden, wenn dies vernünftigerweise erforderlich ist, insbesondere bei einem wesentlichen Verstoß gegen diese Bedingungen, einer rechtswidrigen Nutzung oder einem Sicherheits- oder Rechtsrisiko.",
          "Nach der Beendigung bleiben Bestimmungen, die ihrer Natur nach fortgelten sollen, in Kraft, insbesondere zu geistigem Eigentum, Gewährleistungsausschlüssen, Haftungsbeschränkungen und anwendbarem Recht.",
        ]},
        { h: "Anwendbares Recht", b: [
          "Diese Bedingungen unterliegen spanischem Recht, sofern zwingende Bestimmungen des für dich geltenden Rechts nichts anderes vorsehen.",
          "Für Streitigkeiten sind die zuständigen Gerichte in Spanien zuständig, unbeschadet zwingender Verbraucherschutzrechte, die gelten können.",
        ]},
        { h: "Änderungen dieser Bedingungen", b: [
          "Wir können diese Bedingungen von Zeit zu Zeit aktualisieren. Bei wesentlichen Änderungen ergreifen wir angemessene Maßnahmen, um die Nutzer zu informieren, soweit das anwendbare Recht es verlangt.",
          "Die aktualisierten Bedingungen treten zu dem am Anfang der neuen Fassung angegebenen Datum in Kraft.",
        ]},
        { h: "Kontakt", b: [
          "Bei Fragen zu diesen Bedingungen erreichst du uns unter:",
          ["{{COMPANY}}", "E-Mail: {{EMAIL}}", "Anschrift: {{ADDRESS}}", "Steuernummer und Registerangaben: {{NIF}}"],
        ]},
      ],
    },

    it: {
      title: "Termini di servizio",
      intro: [
        "I presenti Termini di servizio (i «Termini») disciplinano l'accesso e l'utilizzo di Ozmetra, una piattaforma software-as-a-service basata sull'intelligenza artificiale gestita da {{COMPANY}} («noi»).",
        "Iscrivendoti alla nostra lista d'attesa, richiedendo una chiamata, accedendo al nostro sito web o utilizzando i nostri servizi quando saranno disponibili, accetti i presenti Termini. Se non li accetti, non utilizzare il sito web né i servizi.",
      ],
      sections: [
        { h: "Il Servizio", b: [
          "Ozmetra è una piattaforma basata sull'intelligenza artificiale progettata per valutare i processi interni delle aziende, in particolare delle startup. Il Servizio viene configurato per ciascun cliente e può, tra l'altro:",
          ["raccogliere informazioni sull'azienda tramite interviste al team e a partire dai documenti e dagli strumenti che il cliente decide di condividere;",
           "analizzare tali informazioni secondo un framework di valutazione;",
           "utilizzare l'intelligenza artificiale per classificare, riassumere, valutare o analizzare in altro modo tali informazioni;",
           "presentare i risultati tramite visualizzazioni che individuano punti di forza, aree critiche e raccomandazioni di miglioramento."],
          "Il Servizio non garantisce che le raccomandazioni producano un miglioramento specifico nell'azienda.",
          "I risultati generati dall'IA possono essere inesatti, incompleti, non aggiornati o interpretati in modo errato. Sei responsabile di verificarli prima di agire.",
        ]},
        { h: "Lista d'attesa e richieste di chiamata", b: [
          "Prima che il Servizio sia disponibile al pubblico, possiamo gestire una lista d'attesa. Quando ti iscrivi, raccogliamo la tua email di lavoro e, facoltativamente, il nome della tua azienda, il tuo ruolo e le risposte al test rapido, allo scopo di:",
          ["avvisarti quando il Servizio sarà disponibile;", "informarti sull'accesso al Servizio;", "comunicarti informazioni rilevanti relative al lancio."],
          "Se richiedi una chiamata, raccogliamo il tuo nome, il numero di telefono e la fascia oraria preferita al solo scopo di farti contattare dal nostro team informazioni clienti.",
          "L'iscrizione alla lista d'attesa non garantisce l'accesso al Servizio, né una data di lancio, un prezzo, delle funzionalità o una disponibilità specifici. Possiamo modificare o chiudere la lista d'attesa in qualsiasi momento.",
          "Ove richiesto dalla legge applicabile, le comunicazioni commerciali non legate al lancio del Servizio saranno inviate solo in presenza di un'adeguata base giuridica.",
        ]},
        { h: "Privacy", b: [
          "I tuoi dati personali saranno trattati in conformità con la nostra {{PRIVACY}}, che costituisce parte integrante dei presenti Termini.",
          "Per le persone che si trovano nello Spazio economico europeo o che sono comunque tutelate dal GDPR, i dati personali saranno trattati in conformità con la normativa applicabile in materia di protezione dei dati, incluso il Regolamento (UE) 2016/679 («GDPR»).",
          "Per la lista d'attesa e le richieste di chiamata chiederemo solo le informazioni ragionevolmente necessarie per le finalità indicate.",
        ]},
        { h: "Uso consentito", b: [
          "Ti impegni a non utilizzare il Servizio:",
          ["per scopi illeciti o fraudolenti;", "per violare i diritti altrui;", "per molestare, minacciare, ingannare o impersonare un'altra persona;", "per diffondere spam o comunicazioni non richieste;", "per aggirare restrizioni tecniche, meccanismi di autenticazione, limiti di utilizzo o controlli di accesso;", "per interferire con il Servizio o interromperlo;", "per tentare di accedere senza autorizzazione ai nostri sistemi o a quelli di terzi;", "mediante metodi automatizzati, salvo nostra espressa autorizzazione;", "per condividere informazioni su terzi (inclusi dipendenti, clienti o fornitori) senza un'adeguata base giuridica o senza averli informati quando obbligatorio;", "per utilizzare i risultati del Servizio in modo contrario alla normativa sulla protezione dei dati, del lavoro o ad altre leggi applicabili."],
          "Sei responsabile di garantire che il tuo utilizzo del Servizio sia conforme alla legge applicabile e di disporre delle autorizzazioni necessarie per condividere le informazioni della tua azienda e delle persone che partecipano alle interviste.",
        ]},
        { h: "Strumenti e fonti di terzi", b: [
          "Il Servizio può collegarsi a strumenti di terzi che decidi di utilizzare, come sistemi di gestione documentale, di gestione dei progetti, CRM o strumenti finanziari.",
          "Tali strumenti sono forniti da terzi indipendenti che non sono di nostra proprietà né sotto il nostro controllo. Il loro utilizzo resta soggetto ai rispettivi termini, politiche e pratiche sulla privacy.",
          "Ozmetra non è affiliata, approvata o sponsorizzata da alcun fornitore di tali strumenti, salvo diversa indicazione espressa.",
          "Non garantiamo la disponibilità, l'accuratezza, l'accessibilità o la compatibilità continue dei dati ottenuti da strumenti di terzi. Modifiche alle loro API, politiche o restrizioni tecniche possono influire sul funzionamento del Servizio o limitarlo.",
        ]},
        { h: "Proprietà intellettuale", b: [
          "Tutti i diritti sul Servizio, inclusi software, tecnologia, design, marchio, interfacce, documentazione e sistemi sottostanti, sono di nostra proprietà o ci sono concessi in licenza.",
          "Salvo quanto espressamente consentito dai presenti Termini, non puoi:",
          ["copiare, riprodurre, modificare o distribuire il Servizio;", "effettuare reverse engineering o tentare di ricavarne il codice sorgente;", "creare opere derivate basate sul Servizio;", "rivendere, concedere in sublicenza o sfruttare commercialmente il Servizio senza il nostro permesso scritto;", "rimuovere avvisi di proprietà o di proprietà intellettuale."],
          "Mantieni la titolarità dei contenuti e delle informazioni che fornisci lecitamente al Servizio, incluse le informazioni sulla tua azienda, fatti salvi i diritti necessari per consentirci di fornire e gestire il Servizio.",
        ]},
        { h: "Informazioni generate dall'IA", b: [
          "Il Servizio utilizza tecnologie di intelligenza artificiale e apprendimento automatico.",
          "Le valutazioni, i punteggi e le raccomandazioni generati dall'IA sono forniti solo a scopo informativo e di supporto. Non devono essere considerati fatti garantiti, consulenza professionale (legale, finanziaria, fiscale o giuslavoristica) né un sostituto del tuo giudizio.",
          "Sei responsabile di esaminare le raccomandazioni prima di utilizzarle per decisioni aziendali. In particolare, i risultati non devono costituire l'unica base per decisioni che riguardano singole persone, come assunzioni, valutazioni delle prestazioni o licenziamenti.",
          "Non garantiamo che i risultati generati dall'IA siano:",
          ["accurati;", "completi;", "pertinenti;", "imparziali;", "aggiornati;", "privi di errori; o", "adatti a uno scopo specifico."],
        ]},
        { h: "Nessuna garanzia di risultati aziendali", b: [
          "Il Servizio ha lo scopo di aiutarti a individuare opportunità di miglioramento nei tuoi processi interni. Tuttavia, non garantiamo:",
          ["aumenti di efficienza o produttività;", "crescita;", "vendite;", "ricavi o redditività;", "finanziamenti o valutazione; né", "qualsiasi altro risultato aziendale."],
          "I risultati dipendono da numerosi fattori al di fuori del nostro controllo.",
        ]},
        { h: "Disponibilità e modifiche del Servizio", b: [
          "Possiamo modificare, sospendere o interrompere qualsiasi parte del Servizio in qualsiasi momento, nonché aggiungere, rimuovere o modificare funzionalità, integrazioni, prezzi o requisiti tecnici.",
          "Ci impegneremo in modo ragionevole per mantenere la disponibilità del Servizio, ma non ne garantiamo un funzionamento ininterrotto o privo di errori.",
        ]},
        { h: "Account", b: [
          "Qualora sia necessaria la registrazione, sei responsabile di fornire informazioni accurate e di mantenere riservate le tue credenziali.",
          "Sei responsabile delle attività svolte tramite il tuo account, salvo che derivino da circostanze al di fuori del tuo ragionevole controllo.",
          "Ci riserviamo il diritto di sospendere o chiudere gli account che violano i presenti Termini o la legge applicabile.",
        ]},
        { h: "Prezzi e pagamenti", b: [
          "Qualora vengano introdotti piani a pagamento, prezzi, periodi di fatturazione, condizioni di recesso e altre condizioni di pagamento saranno indicati prima dell'acquisto.",
          "Salvo diversa indicazione, gli importi non sono rimborsabili, tranne ove previsto dalla legge applicabile o espressamente indicato.",
          "Ci riserviamo il diritto di modificare i prezzi per acquisti o periodi di abbonamento futuri. Gli abbonati esistenti riceveranno gli avvisi previsti dalla legge applicabile.",
        ]},
        { h: "Esclusione di garanzie", b: [
          "Nella misura massima consentita dalla legge applicabile, il Servizio è fornito «così com'è» e «come disponibile».",
          "Non forniamo alcuna garanzia, espressa o implicita, relativa al Servizio, incluse garanzie di:",
          ["commerciabilità;", "idoneità a uno scopo specifico;", "disponibilità;", "accuratezza;", "affidabilità;", "non violazione; o", "adeguatezza alle tue esigenze specifiche."],
          "Nessuna disposizione dei presenti Termini esclude o limita i diritti dei consumatori o altri diritti che non possono essere legalmente esclusi o limitati.",
        ]},
        { h: "Limitazione di responsabilità", b: [
          "Nella misura massima consentita dalla legge applicabile, non saremo responsabili per danni indiretti, incidentali, speciali, consequenziali o punitivi, né per perdita di profitti, ricavi, opportunità commerciali, dati o reputazione derivanti dall'uso del Servizio o ad esso connessi.",
          "Ove consentito dalla legge, la nostra responsabilità complessiva derivante dal Servizio o ad esso connessa sarà limitata all'importo da te pagato per il Servizio nei 12 mesi precedenti l'evento che ha dato origine al reclamo oppure, se non ci hai effettuato alcun pagamento, a 100 €.",
          "Nessuna disposizione dei presenti Termini limita una responsabilità che non può essere legalmente limitata o esclusa.",
        ]},
        { h: "Manleva", b: [
          "Nella misura consentita dalla legge applicabile, accetti di manlevare e tenere indenne {{COMPANY}}, i suoi amministratori, dirigenti, dipendenti e collaboratori da reclami, danni, responsabilità, perdite e spese derivanti da:",
          ["un tuo utilizzo illecito del Servizio;", "una tua violazione dei presenti Termini;", "una tua violazione dei diritti di terzi;", "una tua violazione di leggi o regolamenti applicabili; o", "contenuti o informazioni che fornisci al Servizio."],
        ]},
        { h: "Cessazione", b: [
          "Puoi smettere di utilizzare il Servizio in qualsiasi momento.",
          "Possiamo sospendere o chiudere il tuo accesso quando ragionevolmente necessario, ad esempio in caso di grave violazione dei presenti Termini, uso illecito del Servizio o creazione di un rischio legale o di sicurezza.",
          "Dopo la cessazione, restano in vigore le disposizioni che per loro natura devono sopravvivere, incluse quelle relative a proprietà intellettuale, esclusioni di garanzia, limitazioni di responsabilità e legge applicabile.",
        ]},
        { h: "Legge applicabile", b: [
          "I presenti Termini sono disciplinati dalla legge spagnola, salvo che disposizioni imperative della legge a te applicabile stabiliscano diversamente.",
          "Qualsiasi controversia sarà sottoposta alla giurisdizione dei tribunali competenti in Spagna, fatti salvi i diritti imperativi di tutela dei consumatori eventualmente applicabili.",
        ]},
        { h: "Modifiche ai presenti Termini", b: [
          "Possiamo aggiornare periodicamente i presenti Termini. In caso di modifiche rilevanti, adotteremo misure ragionevoli per informare gli utenti ove richiesto dalla legge applicabile.",
          "I Termini aggiornati entreranno in vigore alla data indicata all'inizio della versione aggiornata.",
        ]},
        { h: "Contatti", b: [
          "Per domande sui presenti Termini puoi contattarci a:",
          ["{{COMPANY}}", "Email: {{EMAIL}}", "Indirizzo: {{ADDRESS}}", "Partita IVA e dati di registrazione: {{NIF}}"],
        ]},
      ],
    },
  },

  /* =====================================================================
     PRIVACY POLICY
     ===================================================================== */
  privacy: {
    es: {
      title: "Política de Privacidad",
      intro: [
        "Esta Política de Privacidad explica cómo {{COMPANY}} trata los datos personales que recogemos a través del sitio web de Ozmetra, conforme al Reglamento (UE) 2016/679 («RGPD») y a la Ley Orgánica 3/2018 de Protección de Datos Personales y garantía de los derechos digitales.",
      ],
      sections: [
        { h: "Responsable del tratamiento", b: [
          ["Responsable: {{COMPANY}}", "NIF y datos registrales: {{NIF}}", "Domicilio: {{ADDRESS}}", "Email de contacto: {{EMAIL}}"],
        ]},
        { h: "Qué datos recogemos", b: [
          "Solo recogemos los datos que nos facilitas directamente o que son necesarios para mostrar el sitio web:",
          ["Lista de espera: tu email de trabajo y, de forma opcional, el nombre de tu empresa, tu rol y tus respuestas a la prueba rápida (fase, tamaño del equipo y principal dificultad).",
           "Solicitud de llamada: tu nombre, tu número de teléfono con prefijo y la franja horaria que prefieras.",
           "Preferencias del sitio: el idioma que eliges se guarda en el almacenamiento local de tu navegador. No usamos cookies de analítica ni de publicidad.",
           "Datos técnicos: al cargar las tipografías y los iconos del sitio desde servidores de terceros (Google Fonts y unpkg), esos proveedores reciben tu dirección IP."],
        ]},
        { h: "Para qué los usamos", b: [
          ["gestionar tu inscripción en la lista de espera y avisarte cuando el Servicio esté disponible;", "enviarte información relevante sobre el lanzamiento;", "atender tu solicitud de llamada a través de nuestro equipo de atención al cliente;", "adaptar la primera orientación que te mostramos según tus respuestas a la prueba rápida;", "mostrar correctamente el sitio web en el idioma que elijas."],
          "No tomamos decisiones automatizadas con efectos jurídicos sobre ti a partir de estos datos.",
        ]},
        { h: "Base legal", b: [
          ["Consentimiento (art. 6.1.a RGPD): cuando marcas la casilla de aceptación y envías el formulario de la lista de espera o de solicitud de llamada. Puedes retirarlo en cualquier momento.", "Aplicación de medidas precontractuales a petición tuya (art. 6.1.b RGPD): cuando nos pides que te llamemos para informarte sobre el Servicio.", "Interés legítimo (art. 6.1.f RGPD): para cargar los recursos técnicos necesarios para mostrar el sitio web correctamente."],
        ]},
        { h: "Cuánto tiempo los conservamos", b: [
          "Conservamos los datos de la lista de espera mientras sigas inscrito o hasta que retires tu consentimiento. Los datos de las solicitudes de llamada se conservan el tiempo necesario para atenderlas y después se suprimen, salvo que a raíz de la llamada se inicie una relación contractual.",
          "Después, los datos pueden conservarse bloqueados durante los plazos legales aplicables para atender posibles responsabilidades.",
        ]},
        { h: "Con quién los compartimos", b: [
          "No vendemos tus datos. Pueden acceder a ellos los proveedores que nos prestan servicios (por ejemplo, alojamiento web, envío de emails o herramientas de gestión) como encargados del tratamiento, con contrato y solo para prestarnos esos servicios: {{PROVIDERS}}.",
          "También podemos comunicarlos a autoridades públicas cuando exista una obligación legal.",
        ]},
        { h: "Transferencias internacionales", b: [
          "Si algún proveedor trata datos fuera del Espacio Económico Europeo, lo hará con garantías adecuadas, como una decisión de adecuación de la Comisión Europea o cláusulas contractuales tipo.",
        ]},
        { h: "Tus derechos", b: [
          "Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad, así como retirar tu consentimiento, escribiendo a {{EMAIL}}.",
          "Si consideras que no hemos tratado tus datos correctamente, puedes presentar una reclamación ante la Agencia Española de Protección de Datos (www.aepd.es) o ante la autoridad de control de tu país.",
        ]},
        { h: "Seguridad", b: [
          "Aplicamos medidas técnicas y organizativas adecuadas para proteger tus datos frente a accesos no autorizados, pérdida o alteración.",
        ]},
        { h: "Menores", b: [
          "Este sitio está dirigido a profesionales y empresas. No está destinado a menores de 18 años y no recogemos conscientemente sus datos.",
        ]},
        { h: "Datos que tu empresa comparta con el Servicio", b: [
          "Cuando el Servicio esté disponible, el tratamiento de la información que tu empresa comparta para el diagnóstico (entrevistas, documentos y herramientas) se regirá por el contrato y, cuando corresponda, por el acuerdo de encargo del tratamiento firmado con cada cliente.",
        ]},
        { h: "Cambios en esta política", b: [
          "Podemos actualizar esta Política de Privacidad. La versión vigente será siempre la publicada en esta página, con su fecha de actualización. Consulta también nuestros {{TERMS}}.",
        ]},
      ],
    },

    en: {
      title: "Privacy Policy",
      intro: [
        "This Privacy Policy explains how {{COMPANY}} processes the personal data we collect through the Ozmetra website, in accordance with Regulation (EU) 2016/679 (“GDPR”) and Spanish Organic Law 3/2018 on the Protection of Personal Data and the Guarantee of Digital Rights.",
      ],
      sections: [
        { h: "Data controller", b: [
          ["Controller: {{COMPANY}}", "Tax ID and registration details: {{NIF}}", "Address: {{ADDRESS}}", "Contact email: {{EMAIL}}"],
        ]},
        { h: "What data we collect", b: [
          "We only collect the data you give us directly or that is necessary to display the website:",
          ["Waitlist: your work email and, optionally, your company name, your role, and your answers to the quick self-check (stage, team size, and main pain point).",
           "Call request: your name, your phone number with country code, and your preferred time slot.",
           "Site preferences: the language you choose is stored in your browser's local storage. We do not use analytics or advertising cookies.",
           "Technical data: when the site's fonts and icons load from third-party servers (Google Fonts and unpkg), those providers receive your IP address."],
        ]},
        { h: "How we use it", b: [
          ["to manage your place on the waitlist and let you know when the Service is available;", "to send you relevant information about the launch;", "to handle your call request through our customer information team;", "to tailor the first hint we show you based on your self-check answers;", "to display the website correctly in the language you choose."],
          "We do not make automated decisions with legal effects on you based on this data.",
        ]},
        { h: "Legal basis", b: [
          ["Consent (Art. 6(1)(a) GDPR): when you tick the acceptance box and submit the waitlist or call request form. You can withdraw it at any time.", "Steps taken at your request prior to entering into a contract (Art. 6(1)(b) GDPR): when you ask us to call you about the Service.", "Legitimate interest (Art. 6(1)(f) GDPR): to load the technical resources needed to display the website correctly."],
        ]},
        { h: "How long we keep it", b: [
          "We keep waitlist data for as long as you remain on the list or until you withdraw your consent. Call request data is kept for as long as needed to handle the request and is then deleted, unless the call leads to a contractual relationship.",
          "Afterwards, data may be kept blocked for the applicable legal periods in order to address possible liabilities.",
        ]},
        { h: "Who we share it with", b: [
          "We do not sell your data. Providers that deliver services to us (for example, web hosting, email delivery, or management tools) may access it as data processors, under contract and only to provide those services: {{PROVIDERS}}.",
          "We may also disclose it to public authorities where there is a legal obligation.",
        ]},
        { h: "International transfers", b: [
          "If any provider processes data outside the European Economic Area, it will do so with appropriate safeguards, such as a European Commission adequacy decision or standard contractual clauses.",
        ]},
        { h: "Your rights", b: [
          "You can exercise your rights of access, rectification, erasure, objection, restriction of processing, and portability, and withdraw your consent, by writing to {{EMAIL}}.",
          "If you believe we have not handled your data correctly, you can lodge a complaint with the Spanish Data Protection Agency (www.aepd.es) or with the supervisory authority in your country.",
        ]},
        { h: "Security", b: [
          "We apply appropriate technical and organisational measures to protect your data against unauthorised access, loss, or alteration.",
        ]},
        { h: "Minors", b: [
          "This site is aimed at professionals and companies. It is not intended for people under 18, and we do not knowingly collect their data.",
        ]},
        { h: "Data your company shares with the Service", b: [
          "Once the Service is available, the processing of the information your company shares for the diagnosis (interviews, documents, and tools) will be governed by the contract and, where applicable, the data processing agreement signed with each client.",
        ]},
        { h: "Changes to this policy", b: [
          "We may update this Privacy Policy. The version in force will always be the one published on this page, with its update date. See also our {{TERMS}}.",
        ]},
      ],
    },

    fr: {
      title: "Politique de confidentialité",
      intro: [
        "La présente Politique de confidentialité explique comment {{COMPANY}} traite les données personnelles recueillies via le site web d'Ozmetra, conformément au Règlement (UE) 2016/679 (« RGPD ») et à la loi organique espagnole 3/2018 relative à la protection des données personnelles et à la garantie des droits numériques.",
      ],
      sections: [
        { h: "Responsable du traitement", b: [
          ["Responsable : {{COMPANY}}", "Numéro fiscal et immatriculation : {{NIF}}", "Adresse : {{ADDRESS}}", "E-mail de contact : {{EMAIL}}"],
        ]},
        { h: "Données recueillies", b: [
          "Nous recueillons uniquement les données que vous nous fournissez directement ou qui sont nécessaires à l'affichage du site :",
          ["Liste d'attente : votre e-mail professionnel et, de manière facultative, le nom de votre entreprise, votre rôle et vos réponses au test rapide (stade, taille de l'équipe et principale difficulté).",
           "Demande d'appel : votre nom, votre numéro de téléphone avec indicatif et le créneau horaire de votre choix.",
           "Préférences du site : la langue choisie est enregistrée dans le stockage local de votre navigateur. Nous n'utilisons pas de cookies d'analyse ni de publicité.",
           "Données techniques : lorsque les polices et icônes du site sont chargées depuis des serveurs tiers (Google Fonts et unpkg), ces prestataires reçoivent votre adresse IP."],
        ]},
        { h: "Finalités", b: [
          ["gérer votre inscription sur la liste d'attente et vous prévenir lorsque le Service sera disponible ;", "vous envoyer des informations pertinentes sur le lancement ;", "traiter votre demande d'appel par l'intermédiaire de notre service d'information client ;", "adapter la première piste affichée en fonction de vos réponses au test rapide ;", "afficher correctement le site dans la langue de votre choix."],
          "Nous ne prenons aucune décision automatisée produisant des effets juridiques à votre égard sur la base de ces données.",
        ]},
        { h: "Base juridique", b: [
          ["Consentement (art. 6.1.a du RGPD) : lorsque vous cochez la case d'acceptation et envoyez le formulaire de liste d'attente ou de demande d'appel. Vous pouvez le retirer à tout moment.", "Mesures précontractuelles prises à votre demande (art. 6.1.b du RGPD) : lorsque vous nous demandez de vous appeler au sujet du Service.", "Intérêt légitime (art. 6.1.f du RGPD) : pour charger les ressources techniques nécessaires au bon affichage du site."],
        ]},
        { h: "Durée de conservation", b: [
          "Nous conservons les données de la liste d'attente tant que vous y restez inscrit ou jusqu'au retrait de votre consentement. Les données des demandes d'appel sont conservées le temps nécessaire à leur traitement puis supprimées, sauf si l'appel donne lieu à une relation contractuelle.",
          "Les données peuvent ensuite être conservées de manière bloquée pendant les délais légaux applicables afin de répondre à d'éventuelles responsabilités.",
        ]},
        { h: "Destinataires", b: [
          "Nous ne vendons pas vos données. Les prestataires qui nous fournissent des services (par exemple l'hébergement web, l'envoi d'e-mails ou des outils de gestion) peuvent y accéder en tant que sous-traitants, sous contrat et uniquement pour fournir ces services : {{PROVIDERS}}.",
          "Nous pouvons également les communiquer aux autorités publiques en cas d'obligation légale.",
        ]},
        { h: "Transferts internationaux", b: [
          "Si un prestataire traite des données en dehors de l'Espace économique européen, il le fera avec des garanties appropriées, telles qu'une décision d'adéquation de la Commission européenne ou des clauses contractuelles types.",
        ]},
        { h: "Vos droits", b: [
          "Vous pouvez exercer vos droits d'accès, de rectification, d'effacement, d'opposition, de limitation du traitement et de portabilité, ainsi que retirer votre consentement, en écrivant à {{EMAIL}}.",
          "Si vous estimez que vos données n'ont pas été traitées correctement, vous pouvez introduire une réclamation auprès de l'Agence espagnole de protection des données (www.aepd.es) ou de l'autorité de contrôle de votre pays.",
        ]},
        { h: "Sécurité", b: [
          "Nous appliquons des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, toute perte ou altération.",
        ]},
        { h: "Mineurs", b: [
          "Ce site s'adresse aux professionnels et aux entreprises. Il n'est pas destiné aux personnes de moins de 18 ans et nous ne recueillons pas sciemment leurs données.",
        ]},
        { h: "Données partagées par votre entreprise avec le Service", b: [
          "Lorsque le Service sera disponible, le traitement des informations que votre entreprise partage pour le diagnostic (entretiens, documents et outils) sera régi par le contrat et, le cas échéant, par l'accord de sous-traitance signé avec chaque client.",
        ]},
        { h: "Modifications de la présente politique", b: [
          "Nous pouvons mettre à jour la présente Politique de confidentialité. La version en vigueur est toujours celle publiée sur cette page, avec sa date de mise à jour. Consultez également nos {{TERMS}}.",
        ]},
      ],
    },

    de: {
      title: "Datenschutzerklärung",
      intro: [
        "Diese Datenschutzerklärung erläutert, wie {{COMPANY}} die personenbezogenen Daten verarbeitet, die wir über die Website von Ozmetra erheben, gemäß der Verordnung (EU) 2016/679 („DSGVO“) und dem spanischen Organgesetz 3/2018 über den Schutz personenbezogener Daten und die Gewährleistung digitaler Rechte.",
      ],
      sections: [
        { h: "Verantwortlicher", b: [
          ["Verantwortlicher: {{COMPANY}}", "Steuernummer und Registerangaben: {{NIF}}", "Anschrift: {{ADDRESS}}", "Kontakt-E-Mail: {{EMAIL}}"],
        ]},
        { h: "Welche Daten wir erheben", b: [
          "Wir erheben nur Daten, die du uns direkt mitteilst oder die zur Anzeige der Website erforderlich sind:",
          ["Warteliste: deine geschäftliche E-Mail-Adresse und optional der Name deines Unternehmens, deine Rolle und deine Antworten auf den Schnelltest (Phase, Teamgröße und größte Herausforderung).",
           "Rückrufanfrage: dein Name, deine Telefonnummer mit Vorwahl und dein bevorzugtes Zeitfenster.",
           "Website-Einstellungen: die gewählte Sprache wird im lokalen Speicher deines Browsers gespeichert. Wir verwenden keine Analyse- oder Werbe-Cookies.",
           "Technische Daten: Wenn Schriften und Icons der Website von Servern Dritter (Google Fonts und unpkg) geladen werden, erhalten diese Anbieter deine IP-Adresse."],
        ]},
        { h: "Wofür wir sie verwenden", b: [
          ["um deine Eintragung in die Warteliste zu verwalten und dich zu benachrichtigen, sobald der Dienst verfügbar ist;", "um dir relevante Informationen zum Start zu senden;", "um deine Rückrufanfrage über unser Kundeninformationsteam zu bearbeiten;", "um den ersten Hinweis, den wir dir zeigen, an deine Antworten im Schnelltest anzupassen;", "um die Website in der gewählten Sprache korrekt anzuzeigen."],
          "Wir treffen auf Grundlage dieser Daten keine automatisierten Entscheidungen mit rechtlicher Wirkung für dich.",
        ]},
        { h: "Rechtsgrundlage", b: [
          ["Einwilligung (Art. 6 Abs. 1 lit. a DSGVO): wenn du das Zustimmungsfeld ankreuzt und das Formular für die Warteliste oder die Rückrufanfrage absendest. Du kannst sie jederzeit widerrufen.", "Vorvertragliche Maßnahmen auf deine Anfrage (Art. 6 Abs. 1 lit. b DSGVO): wenn du uns bittest, dich wegen des Dienstes anzurufen.", "Berechtigtes Interesse (Art. 6 Abs. 1 lit. f DSGVO): um die technischen Ressourcen zu laden, die für die korrekte Anzeige der Website erforderlich sind."],
        ]},
        { h: "Wie lange wir sie speichern", b: [
          "Daten der Warteliste speichern wir, solange du eingetragen bist oder bis du deine Einwilligung widerrufst. Daten aus Rückrufanfragen werden so lange gespeichert, wie es für die Bearbeitung nötig ist, und danach gelöscht, sofern aus dem Anruf keine Vertragsbeziehung entsteht.",
          "Anschließend können die Daten für die geltenden gesetzlichen Fristen gesperrt aufbewahrt werden, um mögliche Haftungsansprüche zu erfüllen.",
        ]},
        { h: "An wen wir sie weitergeben", b: [
          "Wir verkaufen deine Daten nicht. Dienstleister, die für uns tätig sind (zum Beispiel Webhosting, E-Mail-Versand oder Verwaltungstools), können als Auftragsverarbeiter vertraglich gebunden und nur zur Erbringung dieser Leistungen darauf zugreifen: {{PROVIDERS}}.",
          "Bei einer gesetzlichen Verpflichtung können wir sie auch an Behörden weitergeben.",
        ]},
        { h: "Internationale Übermittlungen", b: [
          "Verarbeitet ein Dienstleister Daten außerhalb des Europäischen Wirtschaftsraums, geschieht dies mit geeigneten Garantien, etwa einem Angemessenheitsbeschluss der Europäischen Kommission oder Standardvertragsklauseln.",
        ]},
        { h: "Deine Rechte", b: [
          "Du kannst deine Rechte auf Auskunft, Berichtigung, Löschung, Widerspruch, Einschränkung der Verarbeitung und Datenübertragbarkeit ausüben sowie deine Einwilligung widerrufen, indem du an {{EMAIL}} schreibst.",
          "Wenn du der Ansicht bist, dass wir deine Daten nicht korrekt verarbeitet haben, kannst du Beschwerde bei der spanischen Datenschutzbehörde (www.aepd.es) oder bei der Aufsichtsbehörde deines Landes einlegen.",
        ]},
        { h: "Sicherheit", b: [
          "Wir setzen geeignete technische und organisatorische Maßnahmen ein, um deine Daten vor unbefugtem Zugriff, Verlust oder Veränderung zu schützen.",
        ]},
        { h: "Minderjährige", b: [
          "Diese Website richtet sich an Fachleute und Unternehmen. Sie ist nicht für Personen unter 18 Jahren bestimmt, und wir erheben wissentlich keine Daten von ihnen.",
        ]},
        { h: "Daten, die dein Unternehmen mit dem Dienst teilt", b: [
          "Sobald der Dienst verfügbar ist, richtet sich die Verarbeitung der Informationen, die dein Unternehmen für die Diagnose teilt (Interviews, Dokumente und Tools), nach dem Vertrag und gegebenenfalls nach der mit jedem Kunden geschlossenen Vereinbarung zur Auftragsverarbeitung.",
        ]},
        { h: "Änderungen dieser Erklärung", b: [
          "Wir können diese Datenschutzerklärung aktualisieren. Maßgeblich ist stets die auf dieser Seite veröffentlichte Fassung mit ihrem Aktualisierungsdatum. Siehe auch unsere {{TERMS}}.",
        ]},
      ],
    },

    it: {
      title: "Informativa sulla privacy",
      intro: [
        "La presente Informativa sulla privacy spiega come {{COMPANY}} tratta i dati personali raccolti tramite il sito web di Ozmetra, in conformità con il Regolamento (UE) 2016/679 («GDPR») e con la Legge organica spagnola 3/2018 sulla protezione dei dati personali e la garanzia dei diritti digitali.",
      ],
      sections: [
        { h: "Titolare del trattamento", b: [
          ["Titolare: {{COMPANY}}", "Partita IVA e dati di registrazione: {{NIF}}", "Indirizzo: {{ADDRESS}}", "Email di contatto: {{EMAIL}}"],
        ]},
        { h: "Quali dati raccogliamo", b: [
          "Raccogliamo solo i dati che ci fornisci direttamente o che sono necessari per visualizzare il sito web:",
          ["Lista d'attesa: la tua email di lavoro e, facoltativamente, il nome della tua azienda, il tuo ruolo e le risposte al test rapido (fase, dimensione del team e principale difficoltà).",
           "Richiesta di chiamata: il tuo nome, il numero di telefono con prefisso e la fascia oraria preferita.",
           "Preferenze del sito: la lingua scelta viene salvata nella memoria locale del browser. Non utilizziamo cookie di analisi né pubblicitari.",
           "Dati tecnici: quando i caratteri e le icone del sito vengono caricati da server di terzi (Google Fonts e unpkg), tali fornitori ricevono il tuo indirizzo IP."],
        ]},
        { h: "Per cosa li utilizziamo", b: [
          ["gestire la tua iscrizione alla lista d'attesa e avvisarti quando il Servizio sarà disponibile;", "inviarti informazioni rilevanti sul lancio;", "gestire la tua richiesta di chiamata tramite il nostro team informazioni clienti;", "adattare il primo indizio che ti mostriamo in base alle risposte al test rapido;", "visualizzare correttamente il sito nella lingua scelta."],
          "Non adottiamo decisioni automatizzate che producano effetti giuridici nei tuoi confronti sulla base di questi dati.",
        ]},
        { h: "Base giuridica", b: [
          ["Consenso (art. 6.1.a GDPR): quando selezioni la casella di accettazione e invii il modulo della lista d'attesa o della richiesta di chiamata. Puoi revocarlo in qualsiasi momento.", "Misure precontrattuali adottate su tua richiesta (art. 6.1.b GDPR): quando ci chiedi di chiamarti per avere informazioni sul Servizio.", "Legittimo interesse (art. 6.1.f GDPR): per caricare le risorse tecniche necessarie a visualizzare correttamente il sito."],
        ]},
        { h: "Per quanto tempo li conserviamo", b: [
          "Conserviamo i dati della lista d'attesa finché resti iscritto o fino alla revoca del consenso. I dati delle richieste di chiamata sono conservati per il tempo necessario a gestirle e poi cancellati, salvo che dalla chiamata nasca un rapporto contrattuale.",
          "Successivamente, i dati possono essere conservati in forma bloccata per i periodi previsti dalla legge, al fine di far fronte a eventuali responsabilità.",
        ]},
        { h: "Con chi li condividiamo", b: [
          "Non vendiamo i tuoi dati. I fornitori che ci prestano servizi (ad esempio hosting web, invio di email o strumenti di gestione) possono accedervi in qualità di responsabili del trattamento, sulla base di un contratto e solo per fornirci tali servizi: {{PROVIDERS}}.",
          "Possiamo inoltre comunicarli alle autorità pubbliche in presenza di un obbligo di legge.",
        ]},
        { h: "Trasferimenti internazionali", b: [
          "Se un fornitore tratta dati al di fuori dello Spazio economico europeo, lo farà con garanzie adeguate, come una decisione di adeguatezza della Commissione europea o clausole contrattuali tipo.",
        ]},
        { h: "I tuoi diritti", b: [
          "Puoi esercitare i diritti di accesso, rettifica, cancellazione, opposizione, limitazione del trattamento e portabilità, nonché revocare il consenso, scrivendo a {{EMAIL}}.",
          "Se ritieni che i tuoi dati non siano stati trattati correttamente, puoi presentare un reclamo all'Agenzia spagnola per la protezione dei dati (www.aepd.es) o all'autorità di controllo del tuo Paese.",
        ]},
        { h: "Sicurezza", b: [
          "Applichiamo misure tecniche e organizzative adeguate per proteggere i tuoi dati da accessi non autorizzati, perdita o alterazione.",
        ]},
        { h: "Minori", b: [
          "Questo sito è rivolto a professionisti e aziende. Non è destinato a persone di età inferiore ai 18 anni e non raccogliamo consapevolmente i loro dati.",
        ]},
        { h: "Dati che la tua azienda condivide con il Servizio", b: [
          "Quando il Servizio sarà disponibile, il trattamento delle informazioni che la tua azienda condivide per la diagnosi (interviste, documenti e strumenti) sarà disciplinato dal contratto e, ove applicabile, dall'accordo sul trattamento dei dati firmato con ciascun cliente.",
        ]},
        { h: "Modifiche alla presente informativa", b: [
          "Possiamo aggiornare la presente Informativa sulla privacy. La versione in vigore è sempre quella pubblicata su questa pagina, con la relativa data di aggiornamento. Consulta anche i nostri {{TERMS}}.",
        ]},
      ],
    },
  },
};
