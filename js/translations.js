// ════════════════════════════════════════════════════════════
//  SSC TRANSLATIONS
//  Usage: every element with data-i18n="key" gets its text
//         swapped when the language changes.
//
//  Keys are dot-namespaced: page.section.element
//  HTML is allowed in values (use sparingly — mainly for
//  line breaks or <strong> emphasis within a sentence).
//
//  To add a new page:
//    1. Add keys under a new namespace (e.g. "books.*")
//    2. Add data-i18n attributes to the page fragment
//    3. Done — applyLanguage() handles the rest.
//
//  To add a new language:
//    1. Add a new top-level key to each entry (e.g. "fr")
//    2. Add the language to the toggle in nav.html
// ════════════════════════════════════════════════════════════

var SSC_TRANSLATIONS = {

  // ── Navigation ─────────────────────────────────────────────
  'nav.home'        : { en: 'Home',        es: 'Inicio'      },
  'nav.calculator'  : { en: 'Calculator',  es: 'Calculadora' },
  'nav.books'       : { en: 'Books',       es: 'Libros'      },
  'nav.blog'        : { en: 'Blog',        es: 'Blog'        },
  'nav.about'       : { en: 'About',       es: 'Acerca'      },
  'nav.privacy'     : { en: 'Privacy',     es: 'Privacidad'  },
  'nav.cta'         : { en: '⬡ Download App', es: '⬡ Descargar App' },

  // ── Home — Layer 1 (Hero) ──────────────────────────────────
  'home.hero.title'    : { en: 'Simulation Source Code',     es: 'Simulation Source Code'       },
  'home.hero.subtitle' : { en: 'Decode Your Life Blueprint', es: 'Descifra Tu Plano de Vida'    },
  'home.hero.body'     : {
    en: 'Seven frequencies encoded in your birth and name — the complete blueprint of your simulation, waiting to be read.',
    es: 'Siete frecuencias codificadas en tu nacimiento y tu nombre — el plano completo de tu simulación, esperando ser leído.',
  },
  'home.hero.btn.primary'   : { en: '⬡ Decode Your Blueprint', es: '⬡ Descifra Tu Plano'      },
  'home.hero.btn.secondary' : { en: 'Learn More',              es: 'Saber Más'                 },
  'home.hero.scroll'        : { en: 'Descend',                 es: 'Descender'                 },

  // ── Home — Layer 2 (Physical Substrate) ───────────────────
  'home.layer2.eyebrow' : { en: 'A New System',              es: 'Un Nuevo Sistema'            },
  'home.layer2.title'   : { en: 'Numerology as Source Code', es: 'Numerología como Código Fuente' },
  'home.layer2.body1'   : {
    en: 'Your name and birth date are not coincidences — they are encoded data, parameters set at the moment your simulation began. Simulation Source Code is the practice of decoding the map within it.',
    es: 'Tu nombre y fecha de nacimiento no son coincidencias — son datos codificados, parámetros establecidos en el momento en que tu simulación comenzó. Simulation Source Code es la práctica de descifrar el mapa que contienen.',
  },
  'home.layer2.body2'   : {
    en: 'Simulation Source Code goes deeper than traditional numerology, revealing seven distinct frequencies that together form the complete architecture of your experience — your drives, your gifts, your lessons, your destiny. The Simulation provides conditioning that you are meant to override, and re-member your Self.',
    es: 'Simulation Source Code va más profundo que la numerología tradicional, revelando siete frecuencias distintas que juntas forman la arquitectura completa de tu experiencia — tus impulsos, tus dones, tus lecciones, tu destino. La Simulación provee condicionamiento que estás destinado a superar, y re-cordar tu Ser.',
  },
  'home.layer2.name'    : { en: 'Physical Substrate',        es: 'Sustrato Físico'             },

  // ── Home — Layer 3 (Holographic Field) ────────────────────
  'home.layer3.eyebrow' : { en: 'The Seven Frequencies',  es: 'Las Siete Frecuencias'          },
  'home.layer3.title'   : { en: 'Your Complete Blueprint', es: 'Tu Plano Completo'              },
  'home.layer3.name'    : { en: 'Holographic Field',       es: 'Campo Holográfico'              },

  // Frequency cards
  'home.freq.01.name' : { en: 'Theme',        es: 'Tema'           },
  'home.freq.01.desc' : {
    en: 'The recurring pattern woven through your life — the lesson that keeps returning until integrated.',
    es: 'El patrón recurrente tejido en tu vida — la lección que sigue regresando hasta ser integrada.',
  },
  'home.freq.02.name' : { en: 'Life Path',    es: 'Camino de Vida' },
  'home.freq.02.desc' : {
    en: 'The primary frequency of your journey — the core theme and direction your life is oriented toward.',
    es: 'La frecuencia principal de tu viaje — el tema central y la dirección hacia la que se orienta tu vida.',
  },
  'home.freq.03.name' : { en: 'Achievement',  es: 'Logro'          },
  'home.freq.03.desc' : {
    en: 'Your approach to goals — how you naturally achieve things. Derived from your birth month and day.',
    es: 'Tu enfoque hacia los objetivos — cómo logras las cosas de forma natural. Derivado de tu mes y día de nacimiento.',
  },
  'home.freq.04.name' : { en: 'Expression',   es: 'Expresión'      },
  'home.freq.04.desc' : {
    en: 'How your energies naturally express in the world — your innate talents and the way others experience you.',
    es: 'Cómo tus energías se expresan naturalmente en el mundo — tus talentos innatos y la manera en que otros te experimentan.',
  },
  'home.freq.05.name' : { en: 'Soul',         es: 'Alma'           },
  'home.freq.05.desc' : {
    en: 'Your inner world — the private desires, values, and yearnings that motivate everything you do.',
    es: 'Tu mundo interior — los deseos privados, valores y anhelos que motivan todo lo que haces.',
  },
  'home.freq.06.name' : { en: 'Outer',        es: 'Exterior'       },
  'home.freq.06.desc' : {
    en: 'The face you show the world — your personality, how you are perceived, and your social signature.',
    es: 'El rostro que muestras al mundo — tu personalidad, cómo eres percibido y tu firma social.',
  },
  'home.freq.07.name' : { en: 'Life Calling', es: 'Llamado de Vida' },
  'home.freq.07.desc' : {
    en: 'Your unique mission — combining your Life Path and Expression into a single directive frequency.',
    es: 'Tu misión única — la combinación de tu Camino de Vida y tu Expresión en una sola frecuencia directriz.',
  },

  // ── Home — Layer 4 (Source Code) ──────────────────────────
  'home.layer4.name'        : { en: 'Source Code',               es: 'Código Fuente'               },
  'home.layer4.eyebrow'     : { en: 'How It Works',              es: 'Cómo Funciona'               },
  'home.layer4.title'       : { en: 'Three Steps to Your Reading', es: 'Tres Pasos para Tu Lectura' },

  'home.step1.title' : { en: 'Enter Your Details',          es: 'Ingresa Tus Datos'               },
  'home.step1.body'  : {
    en: 'Provide your full birth name and date of birth. Use the name on your birth certificate.',
    es: 'Proporciona tu nombre completo de nacimiento y fecha de nacimiento. Usa el nombre de tu acta de nacimiento.',
  },
  'home.step2.title' : { en: 'Calculate Your Frequencies',  es: 'Calcula Tus Frecuencias'         },
  'home.step2.body'  : {
    en: 'Our system applies Pythagorean numerology principles to derive each of your seven core numbers.',
    es: 'Nuestro sistema aplica los principios de la numerología pitagórica para derivar cada uno de tus siete números centrales.',
  },
  'home.step3.title' : { en: 'Receive Your Interpretation', es: 'Recibe Tu Interpretación'        },
  'home.step3.body'  : {
    en: 'Each number is decoded with rich layered interpretations — themes, archetypes, strengths, and shadows.',
    es: 'Cada número es descifrado con interpretaciones profundas y en capas — temas, arquetipos, fortalezas y sombras.',
  },

  'home.quote.text' : {
    en: '"Numbers are the language in which the universe was written."',
    es: '"Los números son el idioma en el que el universo fue escrito."',
  },
  'home.quote.attr' : { en: '— Galileo Galilei', es: '— Galileo Galilei' },

  'home.cta.eyebrow' : { en: 'Begin Now',                    es: 'Comienza Ahora'                 },
  'home.cta.title'   : { en: 'Discover Your Frequencies',    es: 'Descubre Tus Frecuencias'       },
  'home.cta.body'    : {
    en: 'Your numerology chart is a map — not of what must happen, but of what is possible.',
    es: 'Tu carta numerológica es un mapa — no de lo que debe ocurrir, sino de lo que es posible.',
  },
  'home.cta.btn.primary'   : { en: '⬡ Open the Calculator', es: '⬡ Abrir la Calculadora'        },
  'home.cta.btn.secondary' : { en: 'Download the App',       es: 'Descargar la App'               },

  // ── Placeholders for other pages (add content as you go) ──
  // 'about.*', 'books.*', 'calculator.*', 'blog.*', 'privacy.*'
  // Follow the same pattern: 'page.section.element': { en: '…', es: '…' }

  // ── Footer ────────────────────────────────────────────────
  'footer.tagline'        : { en: 'Seven frequencies encoded in your birth and name — the complete architecture of your simulation.', es: 'Siete frecuencias codificadas en tu nacimiento y tu nombre — la arquitectura completa de tu simulación.' },
  'footer.nav.title'      : { en: 'Navigate',      es: 'Navegar'        },
  'footer.nav.home'       : { en: 'Home',           es: 'Inicio'         },
  'footer.nav.calculator' : { en: 'Calculator',     es: 'Calculadora'    },
  'footer.nav.books'      : { en: 'Books',          es: 'Libros'         },
  'footer.nav.blog'       : { en: 'Blog',           es: 'Blog'           },
  'footer.nav.about'      : { en: 'About',          es: 'Acerca'         },
  'footer.legal.title'    : { en: 'Legal',          es: 'Legal'          },
  'footer.legal.privacy'  : { en: 'Privacy Policy', es: 'Política de Privacidad' },
  'footer.dl.title'       : { en: 'Download',       es: 'Descargar'      },
  'footer.dl.appstore'    : { en: 'App Store',      es: 'App Store'      },
  'footer.dl.googleplay'  : { en: 'Google Play',    es: 'Google Play'    },
  'footer.copy'           : { en: '© 2025 Simulation Source Code · All Rights Reserved', es: '© 2025 Simulation Source Code · Todos los Derechos Reservados' },
  'footer.tagline2'       : { en: '✦  Life Decoding System', es: '✦  Sistema de Decodificación de Vida' },


  // ── About ──────────────────────────────────────────────────
  'about.eyebrow'           : { en: 'About',                    es: 'Acerca'                       },
  'about.title'             : { en: 'Simulation Source Code',   es: 'Simulation Source Code'       },
  'about.subtitle'          : { en: 'A framework for understanding the numerical architecture encoded in your name, birth, and existence.', es: 'Un marco para comprender la arquitectura numérica codificada en tu nombre, nacimiento y existencia.' },
  'about.s1.title'          : { en: '· The Philosophy ·',       es: '· La Filosofía ·'             },
  'about.s1.body'           : { en: 'Simulation Source Code began with a simple question: what if numerology is not mysticism — what if it is mathematics? Modern physics increasingly suggests that reality is information at its most fundamental level. If this is true, the numerical patterns in your name and birth date are not random — they are parameters set at the moment your simulation was initialised.', es: 'Simulation Source Code comenzó con una pregunta simple: ¿y si la numerología no es misticismo — sino matemáticas? La física moderna sugiere cada vez más que la realidad es información en su nivel más fundamental. Si esto es cierto, los patrones numéricos en tu nombre y fecha de nacimiento no son aleatorios — son parámetros establecidos en el momento en que tu simulación fue inicializada.' },
  'about.s2.title'          : { en: '· Our Approach ·',         es: '· Nuestro Enfoque ·'          },
  'about.s2.body'           : { en: 'We use the Pythagorean system as our foundation, while drawing on deeper esoteric traditions to enrich interpretation. Every reading delivers seven core frequencies, each calculated precisely from your birth data and name. Interpretations are honest, nuanced, and useful — each frequency contains light and shadow, gift and challenge.', es: 'Usamos el sistema pitagórico como fundamento, mientras nos nutrimos de tradiciones esotéricas más profundas para enriquecer la interpretación. Cada lectura entrega siete frecuencias centrales, cada una calculada con precisión a partir de tus datos de nacimiento y nombre. Las interpretaciones son honestas, matizadas y útiles — cada frecuencia contiene luz y sombra, don y desafío.' },
  'about.s3.title'          : { en: '· Our Pillars ·',          es: '· Nuestros Pilares ·'         },
  'about.pillar1.title'     : { en: 'Mathematical Precision',   es: 'Precisión Matemática'         },
  'about.pillar1.text'      : { en: 'Every number is calculated using rigorous, consistent methodology drawn from classical sources.', es: 'Cada número es calculado usando una metodología rigurosa y consistente derivada de fuentes clásicas.' },
  'about.pillar2.title'     : { en: 'Deep Interpretation',      es: 'Interpretación Profunda'      },
  'about.pillar2.text'      : { en: 'Readings go beyond surface descriptions into archetypes, patterns, and the deeper meanings each number carries.', es: 'Las lecturas van más allá de las descripciones superficiales hacia arquetipos, patrones y los significados más profundos que cada número porta.' },
  'about.pillar3.title'     : { en: 'Open Framework',           es: 'Marco Abierto'                },
  'about.pillar3.text'      : { en: 'We approach numerology as a framework for self-understanding, not fixed fate. You are always the author.', es: 'Abordamos la numerología como un marco para el autoconocimiento, no como destino fijo. Tú siempre eres el autor.' },
  'about.pillar4.title'     : { en: 'Continuing Study',         es: 'Estudio Continuo'             },
  'about.pillar4.text'      : { en: 'Our interpretations are continuously refined through research, study, and engagement with traditions worldwide.', es: 'Nuestras interpretaciones se refinan continuamente a través de la investigación, el estudio y el diálogo con tradiciones de todo el mundo.' },
  'about.s4.title'          : { en: '· Connect ·',              es: '· Conectar ·'                 },

  // ── Books ──────────────────────────────────────────────────
  'books.eyebrow'           : { en: 'Knowledge & Study',        es: 'Conocimiento y Estudio'       },
  'books.title'             : { en: 'Recommended Books',        es: 'Libros Recomendados'          },
  'books.subtitle'          : { en: 'A curated library to deepen your understanding of numerology, sacred mathematics, and the language of the universe.', es: 'Una biblioteca curada para profundizar tu comprensión de la numerología, las matemáticas sagradas y el lenguaje del universo.' },
  'books.s1.title'          : { en: '· Numerology Essentials ·',           es: '· Fundamentos de Numerología ·'    },
  'books.s2.title'          : { en: '· Sacred Mathematics ·',              es: '· Matemáticas Sagradas ·'          },
  'books.s3.title'          : { en: '· Consciousness & Simulation Theory ·', es: '· Conciencia y Teoría de la Simulación ·' },
  'books.btn'               : { en: 'View Book →',              es: 'Ver Libro →'                  },
  'books.tag.foundational'  : { en: 'Foundational',             es: 'Fundamental'                  },
  'books.tag.classical'     : { en: 'Classical',                es: 'Clásico'                      },
  'books.tag.practical'     : { en: 'Practical',                es: 'Práctico'                     },
  'books.tag.geometry'      : { en: 'Sacred Geometry',          es: 'Geometría Sagrada'            },
  'books.tag.philosophy'    : { en: 'Philosophy',               es: 'Filosofía'                    },
  'books.tag.consciousness' : { en: 'Consciousness',            es: 'Conciencia'                   },
  'books.tag.theory'        : { en: 'Theory',                   es: 'Teoría'                       },
  'books.b1.desc'           : { en: 'A comprehensive introduction to the Pythagorean system, connecting numerology with Tarot and astrology into a unified framework.', es: 'Una introducción completa al sistema pitagórico, que conecta la numerología con el Tarot y la astrología en un marco unificado.' },
  'books.b2.desc'           : { en: "An in-depth exploration of how numbers shape personality and destiny, written by one of numerology's most respected modern voices.", es: 'Una exploración profunda de cómo los números moldean la personalidad y el destino, escrita por una de las voces modernas más respetadas de la numerología.' },
  'books.b3.desc'           : { en: 'A detailed, practical guide to calculating and interpreting all core numbers, with emphasis on personal and professional application.', es: 'Una guía práctica y detallada para calcular e interpretar todos los números centrales, con énfasis en la aplicación personal y profesional.' },
  'books.b4.desc'           : { en: 'How mathematics and geometry underlie the patterns of nature and consciousness.', es: 'Cómo las matemáticas y la geometría subyacen en los patrones de la naturaleza y la conciencia.' },
  'books.b5.desc'           : { en: 'A monumental encyclopedic work on esoteric philosophy, including Pythagorean number mysticism and its roots in ancient wisdom traditions.', es: 'Una obra enciclopédica monumental sobre filosofía esotérica, que incluye el misticismo numérico pitagórico y sus raíces en las tradiciones de sabiduría antigua.' },
  'books.b6.desc'           : { en: 'A groundbreaking work suggesting that the universe itself may be a kind of hologram and what that means for the nature of reality.', es: 'Una obra innovadora que sugiere que el universo mismo puede ser una especie de holograma y lo que eso significa para la naturaleza de la realidad.' },
  'books.b7.desc'           : { en: 'The philosophical paper that sparked modern simulation theory — a rigorous argument for why our reality may be computational in nature.', es: 'El artículo filosófico que dio origen a la teoría moderna de la simulación — un argumento riguroso sobre por qué nuestra realidad puede ser de naturaleza computacional.' },

  // ── Calculator ─────────────────────────────────────────────
  'calc.eyebrow'            : { en: 'Simulation Source Code',         es: 'Simulation Source Code'         },
  'calc.title'              : { en: 'Frequency Decoder',              es: 'Decodificador de Frecuencias'   },
  'calc.subtitle'           : { en: 'Enter your birth details to reveal your seven encoded frequencies.', es: 'Ingresa tus datos de nacimiento para revelar tus siete frecuencias codificadas.' },
  'calc.label.birthdate'    : { en: '· Birth Date ·',                 es: '· Fecha de Nacimiento ·'        },
  'calc.label.month'        : { en: 'Month',                          es: 'Mes'                            },
  'calc.label.day'          : { en: 'Day',                            es: 'Día'                            },
  'calc.label.year'         : { en: 'Year',                           es: 'Año'                            },
  'calc.label.fullname'     : { en: '· Full Birth Name ·',            es: '· Nombre Completo de Nacimiento ·' },
  'calc.label.namehint'     : { en: 'Full Name (as on birth certificate)', es: 'Nombre completo (como en el acta de nacimiento)' },
  'calc.placeholder.name'   : { en: 'e.g. Jane Marie Smith',          es: 'ej. María Guadalupe López'      },
  'calc.btn'                : { en: '⬡ Decode My Map ⬡',             es: '⬡ Descifrar Mi Mapa ⬡'         },
  'calc.results.placeholder': { en: 'Your reading will appear here',  es: 'Tu lectura aparecerá aquí'      },
  'calc.month.1'            : { en: 'January',    es: 'Enero'      },
  'calc.month.2'            : { en: 'February',   es: 'Febrero'    },
  'calc.month.3'            : { en: 'March',      es: 'Marzo'      },
  'calc.month.4'            : { en: 'April',      es: 'Abril'      },
  'calc.month.5'            : { en: 'May',        es: 'Mayo'       },
  'calc.month.6'            : { en: 'June',       es: 'Junio'      },
  'calc.month.7'            : { en: 'July',       es: 'Julio'      },
  'calc.month.8'            : { en: 'August',     es: 'Agosto'     },
  'calc.month.9'            : { en: 'September',  es: 'Septiembre' },
  'calc.month.10'           : { en: 'October',    es: 'Octubre'    },
  'calc.month.11'           : { en: 'November',   es: 'Noviembre'  },
  'calc.month.12'           : { en: 'December',   es: 'Diciembre'  },

  // ── Blog ───────────────────────────────────────────────────
  'blog.eyebrow'            : { en: 'Insights & Exploration',   es: 'Ideas y Exploración'          },
  'blog.title'              : { en: 'The Blog',                  es: 'El Blog'                      },
  'blog.subtitle'           : { en: 'Deep dives into numerology, sacred mathematics, and the philosophy of simulated reality.', es: 'Exploraciones profundas sobre numerología, matemáticas sagradas y la filosofía de la realidad simulada.' },
  'blog.filter.all'         : { en: 'All Posts',   es: 'Todos'          },
  'blog.filter.numerology'  : { en: 'Numerology',  es: 'Numerología'    },
  'blog.filter.philosophy'  : { en: 'Philosophy',  es: 'Filosofía'      },
  'blog.filter.numbers'     : { en: 'The Numbers', es: 'Los Números'    },
  'blog.filter.practice'    : { en: 'Practice',    es: 'Práctica'       },
  'blog.filter.system'      : { en: 'The System',  es: 'El Sistema'     },
  'blog.read.more'          : { en: 'Read Article →', es: 'Leer Artículo →' },

  // ── Privacy ────────────────────────────────────────────────
  'privacy.eyebrow'         : { en: 'Legal',          es: 'Legal'                 },
  'privacy.title'           : { en: 'Privacy Policy', es: 'Política de Privacidad'},
  'privacy.updated'         : { en: 'Last updated: March 6, 2026', es: 'Última actualización: 6 de marzo de 2026' },
  'privacy.plain'           : { en: 'In plain language:', es: 'En términos simples:' },
  'privacy.plain.body'      : { en: 'We collect minimal data, we do not sell your information, and everything you enter into the calculator stays on your device.', es: 'Recopilamos datos mínimos, no vendemos tu información, y todo lo que ingreses en la calculadora permanece en tu dispositivo.' },
  'privacy.s1.title'        : { en: '1  Who We Are',               es: '1  Quiénes Somos'              },
  'privacy.s1.body'         : { en: 'Simulation Source Code ("SSC") operates the SSC Numerology application and associated website.', es: 'Simulation Source Code ("SSC") opera la aplicación SSC Numerología y el sitio web asociado.' },
  'privacy.s2.title'        : { en: '2  Information We Collect',   es: '2  Información que Recopilamos' },
  'privacy.s2.body'         : { en: 'We collect only what is necessary: calculator inputs (processed locally, never transmitted), anonymised usage analytics, crash reports (device type/OS only), and email address only if voluntarily provided.', es: 'Solo recopilamos lo necesario: entradas de la calculadora (procesadas localmente, nunca transmitidas), análisis de uso anonimizados, informes de fallos (solo tipo de dispositivo/SO), y correo electrónico solo si se proporciona voluntariamente.' },
  'privacy.s3.title'        : { en: '3  How We Use Your Information', es: '3  Cómo Usamos Tu Información' },
  'privacy.s3.body'         : { en: 'Information is used solely to provide and improve the service, send communications if you have an account, and comply with legal obligations. We do not use your data for advertising and do not sell or trade it.', es: 'La información se usa únicamente para proporcionar y mejorar el servicio, enviar comunicaciones si tienes una cuenta y cumplir obligaciones legales. No usamos tus datos para publicidad y no los vendemos ni intercambiamos.' },
  'privacy.s4.title'        : { en: '4  Data Storage & Security',  es: '4  Almacenamiento y Seguridad' },
  'privacy.s4.body'         : { en: 'Your birth name and birth date are never stored on SSC servers. All numerological calculations are performed on-device.', es: 'Tu nombre de nacimiento y fecha de nacimiento nunca se almacenan en los servidores de SSC. Todos los cálculos numerológicos se realizan en el dispositivo.' },
  'privacy.s5.title'        : { en: '5  Third-Party Services',     es: '5  Servicios de Terceros'      },
  'privacy.s5.body'         : { en: 'We use Apple App Store / Google Play for distribution and privacy-focused aggregated analytics. We do not integrate advertising networks or tracking pixels.', es: 'Usamos Apple App Store / Google Play para distribución y análisis agregados centrados en la privacidad. No integramos redes publicitarias ni píxeles de seguimiento.' },
  'privacy.s6.title'        : { en: '6  Your Rights',              es: '6  Tus Derechos'               },
  'privacy.s6.body'         : { en: 'You may have rights to access, correct, delete, or port your data. Contact us — we respond within 30 days.', es: 'Puedes tener derechos para acceder, corregir, eliminar o portar tus datos. Contáctanos — respondemos en 30 días.' },
  'privacy.s7.title'        : { en: "7  Children's Privacy",       es: '7  Privacidad de Menores'      },
  'privacy.s7.body'         : { en: 'The app is not directed at children under 13. We do not knowingly collect their personal information.', es: 'La aplicación no está dirigida a menores de 13 años. No recopilamos conscientemente su información personal.' },
  'privacy.s8.title'        : { en: '8  Changes to This Policy',   es: '8  Cambios a Esta Política'    },
  'privacy.s8.body'         : { en: 'When we update this policy we will revise the date above and notify users of significant changes through the app.', es: 'Cuando actualicemos esta política, revisaremos la fecha anterior y notificaremos a los usuarios sobre cambios significativos a través de la app.' },
  'privacy.s9.title'        : { en: '9  Contact',                  es: '9  Contacto'                   },


  // ── Calculator — Number names & essences ─────────────────
  'calc.root.1.name'    : { en: 'The Initiator', es: 'El Iniciador' },
  'calc.root.1.essence' : { en: 'Original Creative Force', es: 'Fuerza Creativa Original' },
  'calc.root.2.name'    : { en: 'The Harmonizer', es: 'El Armonizador' },
  'calc.root.2.essence' : { en: 'Bridge & Balance', es: 'Puente y Equilibrio' },
  'calc.root.3.name'    : { en: 'The Creator', es: 'El Creador' },
  'calc.root.3.essence' : { en: 'Expression & Joy', es: 'Expresión y Alegría' },
  'calc.root.4.name'    : { en: 'The Builder', es: 'El Constructor' },
  'calc.root.4.essence' : { en: 'Structure & Stability', es: 'Estructura y Estabilidad' },
  'calc.root.5.name'    : { en: 'The Explorer', es: 'El Explorador' },
  'calc.root.5.essence' : { en: 'Freedom Through Embodiment', es: 'Libertad a través de la Encarnación' },
  'calc.root.6.name'    : { en: 'The Nurturer', es: 'El Nutridor' },
  'calc.root.6.essence' : { en: 'Service & Responsibility', es: 'Servicio y Responsabilidad' },
  'calc.root.7.name'    : { en: 'The Seeker', es: 'El Buscador' },
  'calc.root.7.essence' : { en: 'Wisdom & Inner Knowing', es: 'Sabiduría y Conocimiento Interior' },
  'calc.root.8.name'    : { en: 'The Power Master', es: 'El Maestro del Poder' },
  'calc.root.8.essence' : { en: 'Authority & Manifestation', es: 'Autoridad y Manifestación' },
  'calc.root.9.name'    : { en: 'The Humanitarian', es: 'El Humanitario' },
  'calc.root.9.essence' : { en: 'Completion & Universal Service', es: 'Completitud y Servicio Universal' },
  'calc.root.11.name'    : { en: 'The Illuminated Bridge', es: 'El Puente Iluminado' },
  'calc.root.11.essence' : { en: 'Master Channel Between Worlds', es: 'Canal Maestro Entre Mundos' },
  'calc.root.22.name'    : { en: 'The Master Builder', es: 'El Maestro Constructor' },
  'calc.root.22.essence' : { en: 'Cosmic Architect of Material Reality', es: 'Arquitecto Cósmico de la Realidad Material' },
  'calc.root.33.name'    : { en: 'The Master Teacher', es: 'El Maestro Enseñante' },
  'calc.root.33.essence' : { en: 'Unconditional Love & Creative Service', es: 'Amor Incondicional y Servicio Creativo' },
  'calc.root.44.name'    : { en: 'The Master Manifestor', es: 'El Maestro Manifestador' },
  'calc.root.44.essence' : { en: 'Ultimate Material Mastery', es: 'Maestría Material Última' },

  // ── Calculator — ROOT interpretations per frequency ──────
  'calc.root.1.lp' : { en: 'You are here to learn bold self-direction — to move first, pioneer new paths, and lead without waiting for permission. The simulation places you at the beginning of cycles and tests whether you will step forward or shrink back.', es: 'Estás aquí para aprender la autodirección audaz — para moverte primero, abrir nuevos caminos y liderar sin esperar permiso. La simulación te coloca al inicio de los ciclos y pone a prueba si avanzarás o retrocederás.' },
  'calc.root.1.ex' : { en: 'You naturally carry leadership, pioneering instinct, and original thinking. You were made to start things without prompting, blaze new trails, and inspire others through confident action.', es: 'Naturalmente portas liderazgo, instinto pionero y pensamiento original. Fuiste hecho para comenzar cosas sin necesidad de estímulo, abrir nuevas sendas e inspirar a otros mediante la acción confiada.' },
  'calc.root.1.soul' : { en: 'Deep within, you crave autonomy, recognition, and the freedom to lead. Your soul yearns to be the initiator — the original spark that sets things in motion.', es: 'En lo profundo, anhelas autonomía, reconocimiento y la libertad de liderar. Tu alma ansía ser la iniciadora — la chispa original que pone todo en movimiento.' },
  'calc.root.1.outer' : { en: 'The world sees you as confident, self-directed, and independent — a natural leader who moves forward without needing permission or approval.', es: 'El mundo te ve como seguro, autodirigido e independiente — un líder natural que avanza sin necesitar permiso ni aprobación.' },
  'calc.root.1.ach' : { en: 'Your achievement energy centres on initiation and leadership. You accomplish most powerfully when you go first and forge new paths without hesitation.', es: 'Tu energía de logro se centra en la iniciativa y el liderazgo. Logras con mayor poder cuando vas primero y forjas nuevos caminos sin vacilación.' },
  'calc.root.1.theme' : { en: 'The overarching theme of your life involves initiating new cycles, developing independence, and learning that self-reliance is a gift — not a burden.', es: 'El tema central de tu vida implica iniciar nuevos ciclos, desarrollar la independencia y aprender que la autosuficiencia es un don, no una carga.' },

  'calc.root.2.lp' : { en: 'You are here to master connection — to harmonize opposites, bridge divides, and find unity in duality. Every relationship the simulation brings is a mirror of your own inner polarities.', es: 'Estás aquí para dominar la conexión — armonizar opuestos, tender puentes y encontrar unidad en la dualidad. Cada relación que la simulación trae es un espejo de tus propias polaridades internas.' },
  'calc.root.2.ex' : { en: 'You naturally carry diplomatic awareness, relational sensitivity, and dual-perspective vision. You see all sides, bring people together, and create peace from conflict.', es: 'Naturalmente portas conciencia diplomática, sensibilidad relacional y visión de doble perspectiva. Ves todos los lados, unes a las personas y creas paz desde el conflicto.' },
  'calc.root.2.soul' : { en: 'Deep within, you crave harmony, partnership, and the experience of being truly seen. Your soul yearns to belong — to meet and be met in genuine union.', es: 'En lo profundo, anhelas armonía, asociación y la experiencia de ser verdaderamente visto. Tu alma ansía pertenecer — encontrarse y ser encontrada en una unión genuina.' },
  'calc.root.2.outer' : { en: 'The world sees you as gentle, empathetic, and easy to trust — a natural mediator and peacemaker who brings calm to even the most charged situations.', es: 'El mundo te ve como gentil, empático y digno de confianza — un mediador natural y pacificador que aporta calma incluso a las situaciones más cargadas.' },
  'calc.root.2.ach' : { en: 'Your achievement energy centres on collaboration and partnership. You accomplish most powerfully through relationship and cooperative effort.', es: 'Tu energía de logro se centra en la colaboración y la asociación. Logras con mayor poder a través de las relaciones y el esfuerzo cooperativo.' },
  'calc.root.2.theme' : { en: 'The overarching theme of your life involves mastering relationship, learning to receive as well as give, and discovering wholeness through conscious connection.', es: 'El tema central de tu vida implica dominar las relaciones, aprender a recibir tanto como a dar, y descubrir la plenitud a través de la conexión consciente.' },

  'calc.root.3.lp' : { en: 'You are here to learn authentic self-expression — to channel creative force without performing for approval. The simulation blocks creativity until you stop seeking validation and start expressing truth.', es: 'Estás aquí para aprender la autoexpresión auténtica — canalizar la fuerza creativa sin actuar para buscar aprobación. La simulación bloquea la creatividad hasta que dejes de buscar validación y empieces a expresar la verdad.' },
  'calc.root.3.ex' : { en: 'You naturally carry creative flow, expressiveness, and joyful energy. You communicate beautifully, uplift others naturally, and inspire through genuine authenticity.', es: 'Naturalmente portas fluidez creativa, expresividad y energía alegre. Te comunicas con belleza, elevas a otros naturalmente e inspiras a través de la autenticidad genuina.' },
  'calc.root.3.soul' : { en: 'Deep within, you crave expression, joy, and creative freedom. Your soul yearns to be heard — to share its unique voice without apology or diminishment.', es: 'En lo profundo, anhelas expresión, alegría y libertad creativa. Tu alma ansía ser escuchada — compartir su voz única sin disculpas ni menoscabo.' },
  'calc.root.3.outer' : { en: 'The world sees you as charming, expressive, and magnetic — a natural communicator whose presence uplifts any room and inspires others to come alive.', es: 'El mundo te ve como encantador, expresivo y magnético — un comunicador natural cuya presencia eleva cualquier espacio e inspira a otros a despertar.' },
  'calc.root.3.ach' : { en: 'Your achievement energy centres on creative expression. You accomplish most powerfully when you allow authentic creativity to lead, free from the need for applause.', es: 'Tu energía de logro se centra en la expresión creativa. Logras con mayor poder cuando permites que la creatividad auténtica guíe, libre de la necesidad de aplausos.' },
  'calc.root.3.theme' : { en: 'The overarching theme of your life involves discovering and honouring your unique voice, finding joy through creation, and learning to complete what you begin.', es: 'El tema central de tu vida implica descubrir y honrar tu voz única, encontrar alegría a través de la creación y aprender a completar lo que comienzas.' },

  'calc.root.4.lp' : { en: 'You are here to master discipline, order, and patient building. The simulation tests your relationship with structure — too rigid and it shatters you; too loose and chaos forces discipline upon you.', es: 'Estás aquí para dominar la disciplina, el orden y la construcción paciente. La simulación pone a prueba tu relación con la estructura — demasiado rígida y te romperá; demasiado laxa y el caos te impondrá disciplina.' },
  'calc.root.4.ex' : { en: 'You naturally carry organizational instinct, systematic thinking, and grounded presence. You create order from chaos and manifest through disciplined, sustained effort.', es: 'Naturalmente portas instinto organizacional, pensamiento sistemático y presencia fundamentada. Creas orden desde el caos y manifiestas a través del esfuerzo disciplinado y sostenido.' },
  'calc.root.4.soul' : { en: 'Deep within, you crave stability, security, and the satisfaction of building something solid and lasting. Your soul yearns to create foundations that endure.', es: 'En lo profundo, anhelas estabilidad, seguridad y la satisfacción de construir algo sólido y duradero. Tu alma ansía crear cimientos que perduren.' },
  'calc.root.4.outer' : { en: 'The world sees you as reliable, methodical, and dependable — the one others count on to get things done and keep everything steady.', es: 'El mundo te ve como confiable, metódico y seguro — aquel en quien otros cuentan para hacer las cosas y mantener todo en su lugar.' },
  'calc.root.4.ach' : { en: 'Your achievement energy centres on building and consolidation. You accomplish most powerfully through sustained, disciplined effort compounded over time.', es: 'Tu energía de logro se centra en la construcción y la consolidación. Logras con mayor poder a través del esfuerzo sostenido y disciplinado acumulado con el tiempo.' },
  'calc.root.4.theme' : { en: 'The overarching theme of your life involves learning the sacred nature of limitation, discovering that structure creates freedom, and building foundations that serve those who come after.', es: 'El tema central de tu vida implica aprender la naturaleza sagrada de la limitación, descubrir que la estructura crea libertad y construir cimientos que sirvan a quienes vienen después.' },

  'calc.root.5.lp' : { en: 'You are the central vessel — the interface between spirit and matter. Your lesson is full presence in the midst of constant change. The simulation provides endless variety to test whether you stay present or flee.', es: 'Eres el recipiente central — la interfaz entre el espíritu y la materia. Tu lección es la presencia plena en medio del cambio constante. La simulación provee variedad infinita para poner a prueba si te mantienes presente o huyes.' },
  'calc.root.5.ex' : { en: 'You naturally carry adaptability, present-moment awareness, and dynamic responsiveness. You are the interface in the system — embodying freedom through presence, not escape.', es: 'Naturalmente portas adaptabilidad, conciencia del momento presente y respuesta dinámica. Eres la interfaz en el sistema — encarnando libertad a través de la presencia, no de la evasión.' },
  'calc.root.5.soul' : { en: 'Deep within, you crave freedom, variety, and full sensory experience. Your soul yearns to explore — to taste life completely without being caged.', es: 'En lo profundo, anhelas libertad, variedad y experiencia sensorial plena. Tu alma ansía explorar — saborear la vida por completo sin ser enjaulada.' },
  'calc.root.5.outer' : { en: 'The world sees you as adventurous, dynamic, and magnetically alive — someone who inhabits the present moment in a way others aspire to.', es: 'El mundo te ve como aventurero, dinámico y magnéticamente vivo — alguien que habita el momento presente de una manera que otros aspiran a alcanzar.' },
  'calc.root.5.ach' : { en: 'Your achievement energy centres on adaptability and embodied presence. You accomplish most powerfully when you stay fully here and let each moment be enough.', es: 'Tu energía de logro se centra en la adaptabilidad y la presencia encarnada. Logras con mayor poder cuando te quedas completamente aquí y dejas que cada momento sea suficiente.' },
  'calc.root.5.theme' : { en: 'The overarching theme of your life involves mastering presence, discovering that true freedom is found within rather than through escape, and becoming the living interface between worlds.', es: 'El tema central de tu vida implica dominar la presencia, descubrir que la verdadera libertad se encuentra dentro y no a través de la evasión, y convertirte en la interfaz viviente entre mundos.' },

  'calc.root.6.lp' : { en: 'You are here to learn that love requires boundaries — that serving others begins with serving yourself. The simulation places you in caretaking roles and tests whether you enable or empower.', es: 'Estás aquí para aprender que el amor requiere límites — que servir a otros comienza con servirse a uno mismo. La simulación te coloca en roles de cuidado y pone a prueba si habilitas o empoderas.' },
  'calc.root.6.ex' : { en: 'You naturally carry nurturing instinct, compassionate awareness, and integration ability. You are the integrator — nothing completes until it reaches you and becomes sustainable.', es: 'Naturalmente portas instinto nutridor, conciencia compasiva y capacidad de integración. Eres el integrador — nada se completa hasta que llega a ti y se vuelve sostenible.' },
  'calc.root.6.soul' : { en: 'Deep within, you crave love, belonging, and the fulfilment of being genuinely needed. Your soul yearns to nurture — to create a world where everyone feels cared for.', es: 'En lo profundo, anhelas amor, pertenencia y la satisfacción de ser genuinamente necesitado. Tu alma ansía nutrir — crear un mundo donde todos se sientan cuidados.' },
  'calc.root.6.outer' : { en: 'The world sees you as warm, responsible, and caring — someone who shows up reliably and creates environments of safety and unconditional support.', es: 'El mundo te ve como cálido, responsable y compasivo — alguien que aparece con confianza y crea entornos de seguridad y apoyo incondicional.' },
  'calc.root.6.ach' : { en: 'Your achievement energy centres on service and care. You accomplish most powerfully when you serve from wholeness rather than self-sacrifice.', es: 'Tu energía de logro se centra en el servicio y el cuidado. Logras con mayor poder cuando sirves desde la plenitud en lugar del autosacrificio.' },
  'calc.root.6.theme' : { en: 'The overarching theme of your life involves mastering the balance between self-care and service, learning that boundaries are an act of love, and becoming a sustainable source of nurturance.', es: 'El tema central de tu vida implica dominar el equilibrio entre el autocuidado y el servicio, aprender que los límites son un acto de amor y convertirte en una fuente sostenible de nutrición.' },

  'calc.root.7.lp' : { en: 'You are here to seek truth through direct experience — not merely intellectual knowing. The simulation enforces solitude until you stop looking to external authorities and begin trusting your own inner oracle.', es: 'Estás aquí para buscar la verdad a través de la experiencia directa — no solo del conocimiento intelectual. La simulación impone la soledad hasta que dejes de buscar en autoridades externas y empieces a confiar en tu propio oráculo interior.' },
  'calc.root.7.ex' : { en: 'You naturally carry an analytical mind, introspective nature, and deep inner authority. You see beneath the surface and teach wisdom only after you have lived it.', es: 'Naturalmente portas una mente analítica, naturaleza introspectiva y profunda autoridad interior. Ves más allá de la superficie y enseñas sabiduría solo después de haberla vivido.' },
  'calc.root.7.soul' : { en: 'Deep within, you crave truth, understanding, and spiritual depth. Your soul yearns to pierce through illusion — to touch what is actually real beneath all the noise.', es: 'En lo profundo, anhelas verdad, comprensión y profundidad espiritual. Tu alma ansía atravesar la ilusión — tocar lo que es realmente real bajo todo el ruido.' },
  'calc.root.7.outer' : { en: 'The world sees you as introspective, intelligent, and quietly compelling — someone who observes carefully and carries a stillness others find deeply reassuring.', es: 'El mundo te ve como introspectivo, inteligente y silenciosamente convincente — alguien que observa con cuidado y lleva una quietud que otros encuentran profundamente tranquilizadora.' },
  'calc.root.7.ach' : { en: 'Your achievement energy centres on investigation and inner mastery. You accomplish most powerfully when you trust your own knowing above any external validation.', es: 'Tu energía de logro se centra en la investigación y el dominio interior. Logras con mayor poder cuando confías en tu propio conocimiento por encima de cualquier validación externa.' },
  'calc.root.7.theme' : { en: 'The overarching theme of your life involves the sacred quest for truth, learning to embody wisdom rather than merely accumulate knowledge, and finding the divine in the everyday.', es: 'El tema central de tu vida implica la búsqueda sagrada de la verdad, aprender a encarnar la sabiduría en lugar de meramente acumular conocimiento, y encontrar lo divino en lo cotidiano.' },

  'calc.root.8.lp' : { en: 'You are here to master yourself — to discover that true power is self-mastery, not control of others. The simulation will make your temptations inescapable until you demonstrate dominion over impulse.', es: 'Estás aquí para dominarte a ti mismo — para descubrir que el verdadero poder es el autodominio, no el control de otros. La simulación hará que tus tentaciones sean ineludibles hasta que demuestres dominio sobre el impulso.' },
  'calc.root.8.ex' : { en: 'You naturally carry authority, manifestation ability, and achievement drive. You demonstrate power-with rather than power-over, and you lead through earned respect.', es: 'Naturalmente portas autoridad, capacidad de manifestación y impulso de logro. Demuestras poder-con en lugar de poder-sobre, y lideras a través del respeto ganado.' },
  'calc.root.8.soul' : { en: 'Deep within, you crave mastery, influence, and the satisfaction of tangible accomplishment. Your soul yearns to build something that proves what disciplined human will can achieve.', es: 'En lo profundo, anhelas maestría, influencia y la satisfacción del logro tangible. Tu alma ansía construir algo que demuestre lo que la voluntad humana disciplinada puede alcanzar.' },
  'calc.root.8.outer' : { en: 'The world sees you as authoritative, ambitious, and capable — someone who commands respect naturally and consistently delivers results.', es: 'El mundo te ve como autoritario, ambicioso y capaz — alguien que inspira respeto naturalmente y entrega resultados de manera consistente.' },
  'calc.root.8.ach' : { en: 'Your achievement energy centres on mastery and manifestation. You accomplish most powerfully when discipline, vision, and integrity are working in alignment.', es: 'Tu energía de logro se centra en la maestría y la manifestación. Logras con mayor poder cuando la disciplina, la visión y la integridad trabajan en alineación.' },
  'calc.root.8.theme' : { en: 'The overarching theme of your life involves learning the proper use of power, discovering that self-mastery precedes all other authority, and proving that material success is a spiritual test.', es: 'El tema central de tu vida implica aprender el uso adecuado del poder, descubrir que el autodominio precede a toda autoridad, y demostrar que el éxito material es una prueba espiritual.' },

  'calc.root.9.lp' : { en: 'You are here to complete cycles with grace — to release what is finished and serve the greater good. The simulation brings repeated endings; your lesson is letting go with love.', es: 'Estás aquí para completar ciclos con gracia — para liberar lo que ha terminado y servir al bien mayor. La simulación trae finales repetidos; tu lección es soltar con amor.' },
  'calc.root.9.ex' : { en: 'You naturally carry compassionate awareness, universal perspective, and completion orientation. You facilitate endings and serve collective evolution through wisdom freely shared.', es: 'Naturalmente portas conciencia compasiva, perspectiva universal y orientación hacia la completitud. Facilitas los finales y sirves a la evolución colectiva a través de la sabiduría compartida libremente.' },
  'calc.root.9.soul' : { en: 'Deep within, you crave meaning, contribution, and the sense of having served something larger than yourself. Your soul yearns to give — to leave the world measurably better.', es: 'En lo profundo, anhelas significado, contribución y la sensación de haber servido a algo más grande que tú mismo. Tu alma ansía dar — dejar el mundo measurablemente mejor.' },
  'calc.root.9.outer' : { en: 'The world sees you as compassionate, idealistic, and deeply wise — someone who holds all of humanity in their heart with genuine tenderness.', es: 'El mundo te ve como compasivo, idealista y profundamente sabio — alguien que lleva a toda la humanidad en su corazón con genuina ternura.' },
  'calc.root.9.ach' : { en: 'Your achievement energy centres on completion and service to the whole. You accomplish most powerfully when you release attachment to outcomes and give freely.', es: 'Tu energía de logro se centra en la completitud y el servicio al conjunto. Logras con mayor poder cuando sueltas el apego a los resultados y das libremente.' },
  'calc.root.9.theme' : { en: 'The overarching theme of your life involves learning graceful release, completing cycles consciously, and contributing your accumulated wisdom to collective evolution.', es: 'El tema central de tu vida implica aprender la liberación con gracia, completar ciclos conscientemente y contribuir tu sabiduría acumulada a la evolución colectiva.' },

  'calc.root.11.lp' : { en: 'A master number — your lesson is to channel higher wisdom while remaining grounded in human experience. Heightened sensitivity is your gift; rigorous daily grounding and energetic protection are its requirements.', es: 'Un número maestro — tu lección es canalizar sabiduría superior mientras permaneces enraizado en la experiencia humana. La sensibilidad heightened es tu don; el arraigo diario riguroso y la protección energética son sus requisitos.' },
  'calc.root.11.ex' : { en: 'A master expression — you carry gateway frequency. You are literally wired to channel higher consciousness into material reality. Your sensitivity is a tool, not a burden.', es: 'Una expresión maestra — portas frecuencia de umbral. Estás literalmente conectado para canalizar conciencia superior hacia la realidad material. Tu sensibilidad es una herramienta, no una carga.' },
  'calc.root.11.soul' : { en: 'At the soul level, you carry an ancient yearning to bridge worlds — to bring something sacred through from the unseen into lived human experience.', es: 'A nivel del alma, portas un anhelo ancestral de tender puentes entre mundos — de traer algo sagrado desde lo invisible hacia la experiencia humana vivida.' },
  'calc.root.11.outer' : { en: 'The world sees you as inspiring, otherworldly, and deeply intuitive — your presence seems to carry a light others feel but cannot name.', es: 'El mundo te ve como inspirador, etéreo y profundamente intuitivo — tu presencia parece llevar una luz que otros sienten pero no pueden nombrar.' },
  'calc.root.11.ach' : { en: 'Your achievement is in spiritual illumination and practical inspiration. You accomplish by grounding divine insight into real-world service that actually helps people.', es: 'Tu logro está en la iluminación espiritual y la inspiración práctica. Logras al enraizar la perspectiva divina en un servicio real que realmente ayuda a las personas.' },
  'calc.root.11.theme' : { en: 'The overarching theme of your life is being a beacon — receiving higher frequencies and translating them faithfully into guidance that uplifts those around you.', es: 'El tema central de tu vida es ser un faro — recibir frecuencias superiores y traducirlas fielmente en guía que eleve a quienes te rodean.' },

  'calc.root.22.lp' : { en: 'A master number — you are here to manifest spiritual vision into lasting material form. Your mission is multi-generational. You will not see completion in this lifetime — build anyway.', es: 'Un número maestro — estás aquí para manifestar visión espiritual en forma material duradera. Tu misión es multigeneracional. No verás la completitud en esta vida — construye de todas formas.' },
  'calc.root.22.ex' : { en: 'A master expression — you see what could be built and possess the strategic genius to make it real across generations. Patience and delegation are your essential disciplines.', es: 'Una expresión maestra — ves lo que podría construirse y posees el genio estratégico para hacerlo real a través de generaciones. La paciencia y la delegación son tus disciplinas esenciales.' },
  'calc.root.22.soul' : { en: 'At the soul level, you carry a profound drive to create something that outlasts you — structures, movements, or systems that alter the course of what comes after.', es: 'A nivel del alma, portas un profundo impulso de crear algo que te sobreviva — estructuras, movimientos o sistemas que alteren el curso de lo que viene después.' },
  'calc.root.22.outer' : { en: 'The world sees you as visionary, disciplined, and built for achievement at a scale most people cannot yet imagine.', es: 'El mundo te ve como visionario, disciplinado y construido para el logro a una escala que la mayoría aún no puede imaginar.' },
  'calc.root.22.ach' : { en: 'Your achievement is in monumental, lasting creation. You accomplish at a generational scale — your work serves long after your personal involvement ends.', es: 'Tu logro está en la creación monumental y duradera. Logras a escala generacional — tu trabajo sirve mucho después de que tu participación personal haya terminado.' },
  'calc.root.22.theme' : { en: 'The overarching theme of your life is grounding cosmic vision into enduring material form — becoming the living bridge between the ideal and the real.', es: 'El tema central de tu vida es enraizar la visión cósmica en forma material perdurable — convertirte en el puente viviente entre lo ideal y lo real.' },

  'calc.root.33.lp' : { en: 'A master number — you embody unconditional love and creative service. You teach through beauty and heal through compassion. Your shadow is martyrdom; your master lesson is that self-care is not optional.', es: 'Un número maestro — encarnas el amor incondicional y el servicio creativo. Enseñas a través de la belleza y sanas a través de la compasión. Tu sombra es el martirio; tu lección maestra es que el autocuidado no es opcional.' },
  'calc.root.33.ex' : { en: 'A master expression — you carry double creative energy channelled into healing service. You teach through art and embody compassion as a lived demonstration.', es: 'Una expresión maestra — portas doble energía creativa canalizada hacia el servicio sanador. Enseñas a través del arte y encarnas la compasión como demostración vivida.' },
  'calc.root.33.soul' : { en: 'At the soul level, you carry the deepest possible longing to love without limit — to be a vessel through which healing moves into every life it touches.', es: 'A nivel del alma, portas el anhelo más profundo posible de amar sin límites — ser un recipiente a través del cual la sanación llega a cada vida que toca.' },
  'calc.root.33.outer' : { en: 'The world sees you as profoundly compassionate, creatively gifted, and spiritually seasoned — your presence alone carries a quality of healing others feel immediately.', es: 'El mundo te ve como profundamente compasivo, creativamente dotado y espiritualmente maduro — tu sola presencia lleva una cualidad de sanación que otros sienten de inmediato.' },
  'calc.root.33.ach' : { en: 'Your achievement is in teaching and healing through creative love. You accomplish by embodying unconditional compassion while maintaining the wholeness that makes it sustainable.', es: 'Tu logro está en enseñar y sanar a través del amor creativo. Logras encarnando la compasión incondicional mientras mantienes la plenitud que lo hace sostenible.' },
  'calc.root.33.theme' : { en: 'The overarching theme of your life is learning to love sustainably — to be a channel for universal love without losing yourself in the current you are carrying.', es: 'El tema central de tu vida es aprender a amar de manera sostenible — ser un canal para el amor universal sin perderte en la corriente que estás portando.' },

  'calc.root.44.lp' : { en: 'A master number — you carry supreme building and manifestation power. You create structures designed to stand for centuries. Your mission exceeds your lifetime; build knowing others will complete it.', es: 'Un número maestro — portas supremo poder de construcción y manifestación. Creas estructuras diseñadas para resistir siglos. Tu misión supera tu vida; construye sabiendo que otros la completarán.' },
  'calc.root.44.ex' : { en: 'A master expression — you manifest what others call impossible and create systems built to outlast you. Legacy over ego is your north star.', es: 'Una expresión maestra — manifiestas lo que otros llaman imposible y creas sistemas construidos para sobrevivirte. El legado sobre el ego es tu estrella del norte.' },
  'calc.root.44.soul' : { en: 'At the soul level, you carry an unshakeable drive to build — to demonstrate that human will, properly disciplined, can bring anything from spirit into permanent material form.', es: 'A nivel del alma, portas un impulso inquebrantable de construir — de demostrar que la voluntad humana, debidamente disciplinada, puede traer cualquier cosa desde el espíritu hasta la forma material permanente.' },
  'calc.root.44.outer' : { en: 'The world sees you as extraordinarily capable, intensely focused, and built for achievement at a scale few people can comprehend.', es: 'El mundo te ve como extraordinariamente capaz, intensamente enfocado y construido para el logro a una escala que pocas personas pueden comprender.' },
  'calc.root.44.ach' : { en: 'Your achievement is in century-level building. You accomplish by constructing systems and structures designed to function and serve long after your direct involvement ends.', es: 'Tu logro está en la construcción centenaria. Logras construyendo sistemas y estructuras diseñados para funcionar y servir mucho después de que tu participación directa haya terminado.' },
  'calc.root.44.theme' : { en: 'The overarching theme of your life is demonstrating that material mastery and spiritual integrity are not opposites — they are the same act performed at full power.', es: 'El tema central de tu vida es demostrar que la maestría material y la integridad espiritual no son opuestos — son el mismo acto realizado a plena potencia.' },

  // ── Calculator — CALLING interpretations ─────────────────
  'calc.calling.1.name'    : { en: 'The Pioneer Leader',    es: 'El Líder Pionero' },
  'calc.calling.1.essence' : { en: 'Initiating New Realities', es: 'Iniciando Nuevas Realidades' },
  'calc.calling.1.summary' : { en: 'Your mission is to go first — to initiate new realities through bold, authentic leadership. The simulation places you at the beginning of movements and innovations so others can follow your trail.', es: 'Tu misión es ir primero — iniciar nuevas realidades a través de un liderazgo audaz y auténtico. La simulación te coloca al inicio de movimientos e innovaciones para que otros puedan seguir tu senda.' },

  'calc.calling.2.name'    : { en: 'The Sacred Harmonizer',    es: 'El Armonizador Sagrado' },
  'calc.calling.2.essence' : { en: 'Bridging Divides Through Unity', es: 'Tendiendo Puentes a través de la Unidad' },
  'calc.calling.2.summary' : { en: 'Your mission is to bridge divides and create unity from separation. You are the relational glue — positioned exactly where opposites meet and collaboration is the only path forward.', es: 'Tu misión es tender puentes y crear unidad desde la separación. Eres el pegamento relacional — posicionado exactamente donde los opuestos se encuentran y la colaboración es el único camino.' },

  'calc.calling.3.name'    : { en: 'The Creative Catalyst',    es: 'El Catalizador Creativo' },
  'calc.calling.3.essence' : { en: 'Inspiring Through Expression', es: 'Inspirando a través de la Expresión' },
  'calc.calling.3.summary' : { en: 'Your mission is to inspire through authentic creative expression — to translate the unseen into seen and the felt into expressed.', es: 'Tu misión es inspirar a través de la expresión creativa auténtica — traducir lo invisible en visible y lo sentido en expresado.' },

  'calc.calling.4.name'    : { en: 'The Sacred Architect',    es: 'El Arquitecto Sagrado' },
  'calc.calling.4.essence' : { en: 'Building Foundations That Last', es: 'Construyendo Cimientos que Duran' },
  'calc.calling.4.summary' : { en: 'Your mission is to build systems, structures, and foundations that outlast you. You create the containers others inhabit — transforming chaos into order.', es: 'Tu misión es construir sistemas, estructuras y cimientos que te sobrevivan. Creas los contenedores que otros habitan — transformando el caos en orden.' },

  'calc.calling.5.name'    : { en: 'The Freedom Embodier',    es: 'El Encarnador de Libertad' },
  'calc.calling.5.essence' : { en: 'Teaching Presence Through Being', es: 'Enseñando Presencia a través del Ser' },
  'calc.calling.5.summary' : { en: 'Your mission is to experience fully and teach freedom through embodiment. You are the pivot point — demonstrating that true freedom is being completely here.', es: 'Tu misión es experimentar plenamente y enseñar la libertad a través de la encarnación. Eres el punto pivote — demostrando que la verdadera libertad es estar completamente aquí.' },

  'calc.calling.6.name'    : { en: 'The Compassionate Guardian',    es: 'El Guardián Compasivo' },
  'calc.calling.6.essence' : { en: 'Nurturing from Wholeness', es: 'Nutriendo desde la Plenitud' },
  'calc.calling.6.summary' : { en: 'Your mission is to nurture in balanced, sustainable ways. You are the integrator — ensuring growth becomes grounded in reality.', es: 'Tu misión es nutrir de maneras equilibradas y sostenibles. Eres el integrador — asegurando que el crecimiento se enraíce en la realidad.' },

  'calc.calling.7.name'    : { en: 'The Mystic Teacher',    es: 'El Maestro Místico' },
  'calc.calling.7.essence' : { en: 'Revealing Truth Through Wisdom', es: 'Revelando la Verdad a través de la Sabiduría' },
  'calc.calling.7.summary' : { en: 'Your mission is to seek truth and share wisdom born from direct experience.', es: 'Tu misión es buscar la verdad y compartir la sabiduría nacida de la experiencia directa.' },

  'calc.calling.8.name'    : { en: 'The Power Master',    es: 'El Maestro del Poder' },
  'calc.calling.8.essence' : { en: 'Wielding Authority With Wisdom', es: 'Ejerciendo la Autoridad con Sabiduría' },
  'calc.calling.8.summary' : { en: 'Your mission is to master power and demonstrate responsible authority.', es: 'Tu misión es dominar el poder y demostrar una autoridad responsable.' },

  'calc.calling.9.name'    : { en: 'The World Server',    es: 'El Servidor del Mundo' },
  'calc.calling.9.essence' : { en: 'Completing Cycles With Grace', es: 'Completando Ciclos con Gracia' },
  'calc.calling.9.summary' : { en: 'Your mission is to complete cycles and serve humanity.', es: 'Tu misión es completar ciclos y servir a la humanidad.' },

  'calc.calling.11.name'    : { en: 'The Illuminated Channel',    es: 'El Canal Iluminado' },
  'calc.calling.11.essence' : { en: 'Bridging Spirit and Matter', es: 'Tendiendo Puentes entre Espíritu y Materia' },
  'calc.calling.11.summary' : { en: 'A master calling — your mission is to bridge spiritual and material realms.', es: 'Un llamado maestro — tu misión es tender puentes entre los reinos espiritual y material.' },

  'calc.calling.22.name'    : { en: 'The Master Builder',    es: 'El Maestro Constructor' },
  'calc.calling.22.essence' : { en: 'Manifesting Grand Visions', es: 'Manifestando Grandes Visiones' },
  'calc.calling.22.summary' : { en: 'A master calling — your mission is to build at the largest scale.', es: 'Un llamado maestro — tu misión es construir a la mayor escala.' },

  'calc.calling.33.name'    : { en: 'The Master Healer',    es: 'El Maestro Sanador' },
  'calc.calling.33.essence' : { en: 'Embodying Compassionate Service', es: 'Encarnando el Servicio Compasivo' },
  'calc.calling.33.summary' : { en: 'A master calling — your mission is to heal through unconditional love.', es: 'Un llamado maestro — tu misión es sanar a través del amor incondicional.' },

  'calc.calling.44.name'    : { en: 'The Master Organizer',    es: 'El Maestro Organizador' },
  'calc.calling.44.essence' : { en: 'Creating Universal Systems', es: 'Creando Sistemas Universales' },
  'calc.calling.44.summary' : { en: 'A master calling — your mission is to organize chaos at the grandest scale.', es: 'Un llamado maestro — tu misión es organizar el caos a la mayor escala.' },

  'calc.calling.55.name'    : { en: 'The Master Liberator',    es: 'El Maestro Libertador' },
  'calc.calling.55.essence' : { en: 'Embodying Total Freedom', es: 'Encarnando la Libertad Total' },
  'calc.calling.55.summary' : { en: 'A master calling — your mission is to become freedom itself so completely that others remember they can be free in your presence.', es: 'Un llamado maestro — tu misión es convertirte en libertad misma tan completamente que otros recuerden que pueden ser libres en tu presencia.' },

  'calc.calling.66.name'    : { en: 'The Master Heart Healer',    es: 'El Maestro Sanador del Corazón' },
  'calc.calling.66.essence' : { en: 'Loving at Full Capacity', es: 'Amando a Plena Capacidad' },
  'calc.calling.66.summary' : { en: 'A master calling — your mission is to carry and transmit double heart frequency. You hold enough love to heal a room, a lineage, a generation.', es: 'Un llamado maestro — tu misión es llevar y transmitir doble frecuencia cardíaca. Aprender a amar limpiamente, sin martirio.' },

  'calc.calling.77.name'    : { en: 'The Master Mystic',    es: 'El Maestro Místico' },
  'calc.calling.77.essence' : { en: 'Perceiving the Code of Reality', es: 'Percibiendo el Código de la Realidad' },
  'calc.calling.77.summary' : { en: 'A master calling — your mission is to perceive what others cannot and give it voice. Your connection to universal intelligence is not metaphorical.', es: 'Un llamado maestro — tu misión es percibir lo que otros no pueden y darle voz. Tu conexión con la inteligencia universal no es metafórica.' },

  'calc.calling.88.name'    : { en: 'The Master of Power',    es: 'El Maestro del Poder' },
  'calc.calling.88.essence' : { en: 'Wielding Absolute Integrity', es: 'Ejerciendo Integridad Absoluta' },
  'calc.calling.88.summary' : { en: 'A master calling — your mission is to carry double power frequency and demonstrate that true authority and complete integrity are the same thing.', es: 'Un llamado maestro — tu misión es llevar doble frecuencia de poder y demostrar que verdadera autoridad e integridad completa son lo mismo.' },

  'calc.calling.99.name'    : { en: 'The Universal Completer',    es: 'El Completador Universal' },
  'calc.calling.99.essence' : { en: 'Completing What Cannot Be Left', es: 'Completando lo que No Puede Quedar' },
  'calc.calling.99.summary' : { en: 'A master calling — your mission is to close loops so old they predate your awareness of them.', es: 'Un llamado maestro — tu misión es cerrar bucles tan antiguos que preceden tu conciencia de ellos. Portas la frecuencia de la completitud absoluta.' },

  // ── Calculator — FREQ metadata ────────────────────────────
  'calc.freq.label.0' : { en: 'Life Path', es: 'Camino de Vida' },
  'calc.freq.label.1' : { en: 'Expression', es: 'Expresión' },
  'calc.freq.label.2' : { en: 'Life Calling', es: 'Llamado de Vida' },
  'calc.freq.label.3' : { en: 'Soul', es: 'Alma' },
  'calc.freq.label.4' : { en: 'Outer', es: 'Exterior' },
  'calc.freq.label.5' : { en: 'Achievement', es: 'Logro' },
  'calc.freq.label.6' : { en: 'Theme', es: 'Tema' },
  'calc.freq.role.0'  : { en: 'What You Learn', es: 'Lo que Aprendes' },
  'calc.freq.role.1'  : { en: 'What You Carry', es: 'Lo que Portas' },
  'calc.freq.role.2'  : { en: 'Your Mission', es: 'Tu Misión' },
  'calc.freq.role.3'  : { en: 'Your Inner Desire', es: 'Tu Deseo Interior' },
  'calc.freq.role.4'  : { en: 'Your Public Persona', es: 'Tu Persona Pública' },
  'calc.freq.role.5'  : { en: 'How You Accomplish', es: 'Cómo Logras' },
  'calc.freq.role.6'  : { en: 'Your Life Curriculum', es: 'Tu Currículo de Vida' },

  // ── Calculator — results UI strings ─────────────────────
  'calc.results.reading_for' : { en: 'Reading for', es: 'Lectura para' },
  'calc.results.footer'      : { en: 'Download the full app for complete interpretations, archetype analysis, and personal insights.', es: 'Descarga la app completa para interpretaciones completas, análisis de arquetipos e insights personales.' },
  'calc.results.error'       : { en: 'Please fill in all required fields', es: 'Por favor completa todos los campos requeridos' },
  'calc.results.deep_freq'   : { en: 'A deep frequency — download the app for full interpretation.', es: 'Una frecuencia profunda — descarga la app para la interpretación completa.' },
  'calc.results.master_mission' : { en: 'A powerful mission frequency.', es: 'Una poderosa frecuencia de misión.' },
};
