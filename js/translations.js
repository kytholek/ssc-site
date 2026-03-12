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


};
