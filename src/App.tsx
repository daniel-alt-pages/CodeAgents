import { useEffect, useState, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import './landing.css'
import Antigravity from './Antigravity'

/* ═══ REACT BITS COMPONENTS ═══ */
import SplitText from './components/SplitText'
import BlurText from './components/BlurText'
import SpotlightCard from './components/SpotlightCard'
import CountUp from './components/CountUp'
import ShinyText from './components/ShinyText'

gsap.registerPlugin(ScrollTrigger)

/* ═══ BRAND LOGO — CodeAgents (Prompt /> ) Design ═══ */
const BrandLogo = ({ size = 28 }: { size?: number }) => (
  <svg viewBox="0 0 64 64" fill="none" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
    <path d="M16 20L32 32L16 44" stroke="url(#code-grad)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M36 44H50" stroke="url(#code-grad)" strokeWidth="8" strokeLinecap="round"/>
    <defs>
      <linearGradient id="code-grad" x1="16" y1="20" x2="50" y2="44" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00E5FF"/><stop offset="1" stopColor="#7B61FF"/>
      </linearGradient>
    </defs>
  </svg>
)

/* ═══ FEATURE LIST ═══ */
const featureList = [
  {
    title: 'IDE con IA de Última Generación',
    desc: 'Autocompletado avanzado con Gemini 3.1 Pro, comandos en lenguaje natural y un agente que entiende todo tu proyecto.',
    videoSrc: 'https://antigravity.google/assets/video/landing/an-ai-ide-core.mp4'
  },
  {
    title: 'Flujos de Trabajo Inteligentes',
    desc: 'Resultados claros y verificación automática que construyen confianza real en cada línea de código generado.',
    videoSrc: 'https://antigravity.google/assets/video/landing/higher-level-abstractions.mp4'
  },
  {
    title: 'Agentes Sincronizados',
    desc: 'Controla agentes IA a través de editor, terminal y navegador simultáneamente para máxima eficiencia.',
    videoSrc: 'https://antigravity.google/assets/video/landing/cross-surface-agents.mp4'
  },
  {
    title: 'Retroalimentación Natural',
    desc: 'Guía al agente con feedback intuitivo a través de múltiples herramientas para resultados cada vez más precisos.',
    videoSrc: 'https://antigravity.google/assets/video/landing/user-feedback.mp4'
  },
  {
    title: 'Centro de Control de Misiones',
    desc: 'Gestiona múltiples agentes IA simultáneamente en cualquier espacio de trabajo desde un único panel de control.',
    videoSrc: 'https://antigravity.google/assets/video/landing/an-agent-first-experience.mp4'
  }
]

/* ═══ TOOL ICONS ═══ */
const toolIconsList = [
  'movie', 'image', 'magic_button', 'psychology', 'save', 'link', 'bolt', 'palette',
  'bar_chart', 'lock', 'cloud', 'rocket_launch', 'ads_click', 'lightbulb', 'build',
  'public', 'folder', 'shield', 'music_note', 'computer', 'smart_toy', 'search', 'language', 'terminal'
]

/* ═══ BLOG / NOVEDADES ═══ */
const novedades = [
  {
    title: 'Gemini 3.1 Pro ya disponible',
    date: '19 Feb 2026',
    category: 'Producto',
    imageSrc: 'https://antigravity.google/assets/image/blog/blog-gemini-3-1-pro-square.png',
    href: 'https://antigravity.google/blog/gemini-3-1-pro-in-google-antigravity'
  },
  {
    title: 'Gemini 3 Flash: velocidad extrema',
    date: '17 Dic 2025',
    category: 'Producto',
    imageSrc: 'https://antigravity.google/assets/image/blog/blog-gemini-3-flash-square.png',
    href: 'https://antigravity.google/blog/gemini-3-flash-in-google-antigravity'
  },
  {
    title: 'Nano Banana Pro llega al plan Ultra',
    date: '20 Nov 2025',
    category: 'Producto',
    imageSrc: 'https://antigravity.google/assets/image/blog/blog-nano-banana-pro-square.png',
    href: 'https://antigravity.google/blog/nano-banana-pro-in-google-antigravity'
  },
  {
    title: 'Presentando CodeAgents',
    date: '18 Nov 2025',
    category: 'Lanzamiento',
    imageSrc: 'https://antigravity.google/assets/image/blog/blog-feature-introducing-google-antigravity.png',
    href: 'https://antigravity.google/blog/introducing-google-antigravity'
  }
]

/* ═══ BRANCHING QUIZ SYSTEM ═══ */
type QuizOption = { value: string; icon: string; label: string; desc?: string }

const STEP1_PROFILES: QuizOption[] = [
  { value: 'dev', icon: 'terminal', label: 'Desarrollador / Programador', desc: 'Accede a IDEs con IA, Claude Opus 4.6, Gemini Code Assist y más' },
  { value: 'creator', icon: 'movie', label: 'Creador de contenido', desc: 'Videos con Veo 3.1, imágenes 4K, diseño con IA generativa' },
  { value: 'student', icon: 'school', label: 'Estudiante / Aprendiz', desc: 'Aprende con las mejores herramientas de IA del mercado' },
  { value: 'freelancer', icon: 'work', label: 'Freelancer / Emprendedor', desc: 'Potencia tu negocio con un stack completo de IA' },
  { value: 'business', icon: 'business_center', label: 'Empresa / Equipo', desc: 'Soluciones escalables para equipos de trabajo' },
]

const STEP2_BY_PROFILE: Record<string, { question: string; subtitle: string; options: QuizOption[] }> = {
  dev: {
    question: '¿Qué tipo de desarrollo haces?',
    subtitle: 'Adaptamos las herramientas a tu stack.',
    options: [
      { value: 'frontend', icon: 'web', label: 'Frontend / Full-Stack Web', desc: 'React, Next.js, Vue — con Gemini Code Assist' },
      { value: 'backend', icon: 'dns', label: 'Backend / APIs / Cloud', desc: 'Node, Python, Go — Claude Opus 4.6 para arquitectura' },
      { value: 'mobile', icon: 'smartphone', label: 'Mobile (Android / iOS)', desc: 'Flutter, Kotlin, Swift — asistencia de IA en tiempo real' },
      { value: 'ml', icon: 'psychology', label: 'Data Science / Machine Learning', desc: 'Notebooks, TensorFlow, PyTorch — GPUs y 30TB storage' },
      { value: 'devops', icon: 'cloud_sync', label: 'DevOps / Infraestructura', desc: 'Docker, K8s, CI/CD — automatización con IA' },
    ]
  },
  creator: {
    question: '¿Qué tipo de contenido creas?',
    subtitle: 'Te mostramos lo que puedes lograr.',
    options: [
      { value: 'video', icon: 'videocam', label: 'Videos / Animaciones', desc: 'Veo 3.1 genera clips de hasta 60s en resolución 4K' },
      { value: 'images', icon: 'image', label: 'Imágenes / Diseño gráfico', desc: 'Nano Banana Pro para imágenes fotorrealistas en 4K' },
      { value: 'audio', icon: 'mic', label: 'Audio / Podcasts / Música', desc: 'Generación y edición de audio con modelos de IA' },
      { value: 'marketing', icon: 'campaign', label: 'Marketing / Redes sociales', desc: 'Contenido visual + copy generado con Gemini Pro' },
    ]
  },
  student: {
    question: '¿Qué estás aprendiendo?',
    subtitle: 'Tenemos herramientas para cada área.',
    options: [
      { value: 'learn_code', icon: 'code', label: 'Programación / Desarrollo', desc: 'Practica con IDE asistido por IA y tutoriales interactivos' },
      { value: 'learn_design', icon: 'palette', label: 'Diseño / Creatividad', desc: 'Experimenta con generación de imágenes y video' },
      { value: 'learn_ai', icon: 'smart_toy', label: 'Inteligencia Artificial', desc: 'Acceso a modelos top: Gemini 3.1 Pro, Claude Opus 4.6' },
      { value: 'learn_general', icon: 'auto_stories', label: 'Uso general / Tareas', desc: 'Asistente de IA para investigación y productividad' },
    ]
  },
  freelancer: {
    question: '¿Qué servicios ofreces?',
    subtitle: 'Optimiza tu flujo de trabajo.',
    options: [
      { value: 'free_dev', icon: 'code', label: 'Desarrollo web / apps', desc: 'Entrega proyectos más rápido con asistencia de código IA' },
      { value: 'free_design', icon: 'draw', label: 'Diseño / UI-UX', desc: 'Genera mockups, prototipos y assets con IA generativa' },
      { value: 'free_video', icon: 'movie_edit', label: 'Video / Producción', desc: 'Veo 3.1 + edición IA para entregas profesionales' },
      { value: 'free_multi', icon: 'hub', label: 'Servicios múltiples', desc: 'Acceso completo a todo el stack de herramientas' },
    ]
  },
  business: {
    question: '¿Cuántas personas hay en tu equipo?',
    subtitle: 'El plan ideal depende de tu escala.',
    options: [
      { value: 'biz_small', icon: 'group', label: '2 a 5 personas', desc: 'Startup o equipo pequeño — cupos ilimitados en Compartido' },
      { value: 'biz_medium', icon: 'groups', label: '6 a 20 personas', desc: 'Equipo mediano — máximo rendimiento compartido' },
      { value: 'biz_large', icon: 'corporate_fare', label: '20+ personas', desc: 'Empresa grande — contacta para plan enterprise' },
    ]
  },
}

const STEP3_PRIORITY: QuizOption[] = [
  { value: 'price', icon: 'savings', label: 'Mejor precio posible', desc: 'Quiero acceder a todo gastando lo mínimo' },
  { value: 'performance', icon: 'speed', label: 'Máximo rendimiento', desc: 'Necesito velocidad, cuotas altas y sin esperas' },
  { value: 'privacy', icon: 'lock', label: 'Privacidad y exclusividad', desc: 'Quiero mi propia cuenta, mi correo, mis datos' },
  { value: 'tools', icon: 'build', label: 'Acceso a todas las herramientas', desc: 'Quiero usar absolutamente todo lo disponible' },
]

const STEP4_TEAM: QuizOption[] = [
  { value: 'solo', icon: 'person', label: 'Solo yo', desc: 'Uso personal e individual' },
  { value: 'duo', icon: 'group', label: '2 personas', desc: 'Con un compañero o socio' },
  { value: 'team', icon: 'groups', label: '3 o más personas', desc: 'Equipo o grupo de trabajo' },
]

// Tool benefits by profile for the recommendation
const BENEFITS: Record<string, string[]> = {
  dev: [
    '🔥 Claude Opus 4.6 — razonamiento avanzado para arquitectura y debugging',
    '⚡ Gemini 3.1 Pro — code assist en tiempo real dentro del IDE',
    '🛠️ Gemini Code Assist — autocompletado, refactoring y code review con IA',
    '☁️ 30 TB de almacenamiento para repos, builds y datasets',
    '🚀 Acceso a APIs de Google AI Studio sin límites adicionales',
  ],
  creator: [
    '🎬 Veo 3.1 — genera videos de hasta 60s en resolución 4K',
    '🖼️ Nano Banana Pro — imágenes fotorrealistas en 4K',
    '✨ Gemini 3.1 Pro — genera copy, guiones y descripciones',
    '☁️ 30 TB para almacenar todo tu contenido multimedia',
    '🎨 Herramientas de edición y postproducción con IA',
  ],
  student: [
    '📚 Acceso completo a Gemini 3.1 Pro para aprendizaje',
    '💻 IDE con IA para practicar programación con asistencia',
    '🎨 Herramientas creativas para proyectos académicos',
    '🤖 Experimenta con los modelos de IA más avanzados',
    '☁️ 30 TB para guardar todos tus proyectos y materiales',
  ],
  freelancer: [
    '⚡ Entrega proyectos 3x más rápido con asistencia de IA',
    '🔥 Claude Opus 4.6 + Gemini 3.1 Pro para cualquier tarea',
    '🎬 Veo 3.1 y Nano Banana Pro para entregas multimedia',
    '☁️ 30 TB almacenamiento para archivos de clientes',
    '📊 Herramientas de productividad y automatización',
  ],
  business: [
    '👥 Cupos ilimitados en Plan Compartido para todo el equipo',
    '⚡ Todas las herramientas de IA para cada departamento',
    '☁️ 30 TB de almacenamiento compartido en la nube',
    '🔒 Soporte prioritario y configuración asistida',
    '📊 Ideal para equipos de marketing, desarrollo y diseño',
  ],
}

const FAQ_DATA = [
  {
    question: "¿Qué incluye el Plan Compartido?",
    answer: (
      <>
        <p>El <strong>Plan Compartido ($20 USD)</strong> te brinda acceso completo y sin restricciones de herramientas en un entorno compartido para equipos (con cupos ilimitados). Incluye:</p>
        <ul>
          <li><strong>App de Gemini:</strong> Razonamiento profundo.</li>
          <li><strong>Flow & Veo 3.1:</strong> Creación de video profesional.</li>
          <li><strong>25,000 créditos IA</strong> al mes.</li>
          <li><strong>NotebookLM:</strong> Límites altos de procesamiento.</li>
          <li>Acceso a <strong>Nano Banana Pro, Whisk e IA Studio</strong>.</li>
        </ul>
        <p>Es la opción ideal para aumentar tu productividad, liberar tu creatividad y estudiar de forma más inteligente.</p>
      </>
    )
  },
  {
    question: "¿Qué beneficios exclusivos tiene el Plan Privado?",
    answer: (
      <>
        <p>El <strong>Plan Privado ($55 USD)</strong> está diseñado para máxima privacidad y rendimiento en trabajos pesados. Incluye todo lo del Plan Compartido, y además beneficios exclusivos:</p>
        <ul>
          <li>Vínculo directo y exclusivo a tu <strong>correo personal</strong>.</li>
          <li>Entorno totalmente exclusivo (limitado a <strong>solo 2 cupos</strong>).</li>
          <li><strong>Límites máximos posibles</strong> en Flow y el resto de la IA.</li>
          <li><strong>Prioridad absoluta</strong> en generación y renders 4K.</li>
          <li>Soporte prioritario dedicado.</li>
          <li>Descuento en Google AI Ultra for Business.</li>
        </ul>
        <p>Te ofrece el máximo acceso para programar más rápido y asegurar rendimiento constante bajo alta demanda.</p>
      </>
    )
  },
  {
    question: "¿Existen límites de uso o créditos en los planes?",
    answer: (
      <p>Ambos planes ofrecen acceso a "Todas las herramientas". El <strong>Plan Compartido</strong> te otorga límites altos con una bolsa de <strong>25,000 créditos IA al mes</strong>. Si tus proyectos requieren exigencia ininterrumpida, el <strong>Plan Privado</strong> te ofrece límites extendidos, alcanzando los máximos topes posibles en la plataforma, asegurándote además prioridad absoluta de procesamiento.</p>
    )
  },
  {
    question: "¿Cuál es la diferencia entre el entorno de equipo y el exclusivo?",
    answer: (
      <p>El <strong>Plan Compartido</strong> opera en un "entorno de equipo", lo cual significa que permite cupos ilimitados para colaborar y trabajar en conjunto. Por otro lado, el <strong>Plan Privado</strong> es un "entorno exclusivo" restringido a máximo 2 cupos y vinculado a tu correo de uso personal, garantizando privacidad total para código y datos sensibles.</p>
    )
  },
  {
    question: "¿Cómo funcionan las modalidades de pago (Mensual vs. Pago Único)?",
    answer: (
      <p>Ofrecemos dos modalidades para que elijas la que se adapte mejor a ti: la opción <strong>Mensual (Suscripción)</strong>, que se renueva de forma automática para tu comodidad, y la opción de <strong>Pago Único</strong>, que te cubre por 30 días exactos y te permite renovar de forma manual si no deseas ataduras automáticas.</p>
    )
  }
];

const FAQSection = () => {
  const [openItems, setOpenItems] = useState<number[]>([0]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const allOpen = openItems.length === FAQ_DATA.length;
  
  const toggleAll = () => {
    if (allOpen) {
      setOpenItems([]);
    } else {
      setOpenItems(FAQ_DATA.map((_, i) => i));
    }
  };

  return (
    <section className="faq-section" id="faq">
      <div className="grid-container">
        <div className="faq-header scroll-reveal">
          <h2>Preguntas frecuentes</h2>
        </div>
        
        <div className="faq-accordion-controls scroll-reveal">
          <button onClick={toggleAll}>
            {allOpen ? 'Contraer todo' : 'Expandir todo'}
            <span className="google-symbols" style={{ fontSize: 20 }}>
              {allOpen ? 'remove' : 'add'}
            </span>
          </button>
        </div>

        <div className="faq-accordion scroll-reveal">
          {FAQ_DATA.map((item, idx) => {
            const isOpen = openItems.includes(idx);
            return (
              <div key={idx} className={`faq-item ${isOpen ? 'open' : ''}`}>
                <button 
                  className="faq-question" 
                  onClick={() => toggleItem(idx)}
                  aria-expanded={isOpen}
                >
                  {item.question}
                  <span className="google-symbols faq-icon">
                    {isOpen ? 'remove' : 'add'}
                  </span>
                </button>
                <div className="faq-answer-wrapper">
                  <div className="faq-answer">
                    <div className="faq-answer-inner">
                      {item.answer}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export function App() {
  /* Quiz state */
  const [quizStep, setQuizStep] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<string[]>([])
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [billingMode, setBillingMode] = useState<'once' | 'subscription'>('subscription')

  const [headerScrolled, setHeaderScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showShowcase, setShowShowcase] = useState(false)

  /* Lock body scroll when showcase modal is open */
  useEffect(() => {
    if (showShowcase) {
      document.body.style.overflow = 'hidden'
      lenisRef.current?.stop()
    } else {
      document.body.style.overflow = ''
      lenisRef.current?.start()
    }
    return () => { document.body.style.overflow = '' }
  }, [showShowcase])

  const showcaseRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const lenisRef = useRef<InstanceType<typeof Lenis> | null>(null)
  const [cursorVisible, setCursorVisible] = useState(false)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!showcaseRef.current || !cursorRef.current) return
    const rect = showcaseRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    cursorRef.current.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`
  }

  /* ═══ MERCADO PAGO — PAGO ÚNICO ═══ */
  const handleCheckout = async (plan: 'shared' | 'private') => {
    setCheckoutLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/create-preference`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json()
      if (data.sandbox_init_point) {
        window.location.href = data.sandbox_init_point
      } else if (data.init_point) {
        window.location.href = data.init_point
      } else {
        alert('Error: no se recibió URL de pago.')
      }
    } catch (err) {
      console.error('Checkout error:', err)
      alert('Error al conectar con el sistema de pagos. Intenta nuevamente.')
    } finally {
      setCheckoutLoading(false)
    }
  }

  /* ═══ MERCADO PAGO — SUSCRIPCIÓN RECURRENTE ═══ */
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [payerEmail, setPayerEmail] = useState('')
  const [pendingSubPlan, setPendingSubPlan] = useState<'shared' | 'private' | null>(null)

  const handleSubscription = async (plan: 'shared' | 'private', email: string) => {
    setCheckoutLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/create-subscription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, payer_email: email }),
      })
      const data = await res.json()
      if (data.sandbox_init_point) {
        window.location.href = data.sandbox_init_point
      } else if (data.init_point) {
        window.location.href = data.init_point
      } else {
        alert('Error: no se recibió URL de suscripción. ' + (data.detail || ''))
      }
    } catch (err) {
      console.error('Subscription error:', err)
      alert('Error al conectar con el sistema de pagos. Intenta nuevamente.')
    } finally {
      setCheckoutLoading(false)
    }
  }

  const confirmSubscription = () => {
    if (!payerEmail || !payerEmail.includes('@')) {
      alert('Por favor ingresa un email válido.')
      return
    }
    if (!pendingSubPlan) return
    setShowEmailModal(false)
    handleSubscription(pendingSubPlan, payerEmail)
  }

  /* Unified pay handler: routes to the correct payment method */
  const handlePay = (plan: 'shared' | 'private') => {
    if (billingMode === 'subscription') {
      setPendingSubPlan(plan)
      setShowEmailModal(true)
    } else {
      handleCheckout(plan)
    }
  }

  /* Total quiz steps count (dynamic) */
  const totalSteps = quizAnswers[0] === 'business' ? 3 : 4

  /* Get current step config */
  const getStepConfig = () => {
    if (quizStep === 0) return { question: '¿Cuál es tu perfil?', subtitle: 'Selecciona el que mejor te describa.', options: STEP1_PROFILES }
    if (quizStep === 1) return STEP2_BY_PROFILE[quizAnswers[0]] || STEP2_BY_PROFILE.dev
    if (quizAnswers[0] === 'business') {
      // Business skips priority → goes straight to result (team already answered in step 2)
      return null
    }
    if (quizStep === 2) return { question: '¿Qué es lo más importante para ti?', subtitle: 'Esto define qué plan se ajusta mejor.', options: STEP3_PRIORITY }
    if (quizStep === 3) return { question: '¿Cuántas personas usarán la cuenta?', subtitle: 'El número de usuarios influye en tu plan ideal.', options: STEP4_TEAM }
    return null
  }

  /* Balanced scoring recommendation */
  const getRecommendation = (): 'shared' | 'private' => {
    const [perfil, sub, priority, team] = quizAnswers
    let score = 0 // Higher = more private-leaning

    // Profile weight (0-2)
    if (perfil === 'dev' && (sub === 'ml' || sub === 'backend')) score += 2
    else if (perfil === 'dev') score += 1
    if (perfil === 'freelancer' && sub === 'free_dev') score += 1
    // student, creator → 0

    // Priority weight (strongest signal, 0-3)
    if (priority === 'privacy') score += 3
    if (priority === 'performance') score += 2
    if (priority === 'tools') score += 0
    if (priority === 'price') score -= 1

    // Team weight (-2 to +1)
    if (team === 'solo') score += 1
    if (team === 'team') score -= 2

    // Business special: answered team in step 2
    if (perfil === 'business') {
      if (sub === 'biz_small') return 'shared'
      if (sub === 'biz_medium') return 'shared'
      if (sub === 'biz_large') return 'shared' // enterprise → shared (contact)
    }

    return score >= 3 ? 'private' : 'shared'
  }

  const getRecommendationText = () => {
    const plan = getRecommendation()
    const perfil = quizAnswers[0]
    const priority = quizAnswers[2]

    if (plan === 'private') {
      if (priority === 'privacy') return 'Valoras la exclusividad. El Plan Privado te da tu propio correo vinculado, máximas cuotas y solo 2 usuarios — máxima privacidad.'
      if (priority === 'performance') return 'Necesitas rendimiento sin compromisos. El Plan Privado ofrece cuotas extendidas para trabajos pesados, compilaciones largas y renders intensivos.'
      if (perfil === 'dev') return 'Como desarrollador, el Plan Privado maximiza tu productividad con Claude Opus 4.6, cuotas altas para compilación y tu correo personal vinculado.'
      return 'Según tus necesidades, el Plan Privado ($55/mes) te ofrece máximo rendimiento, privacidad y cuotas extendidas para trabajo intensivo.'
    }
    // Shared
    if (priority === 'price') return '¡Excelente elección! El Plan Compartido te da acceso a TODAS las mismas herramientas por solo $20/mes — el mejor valor del mercado.'
    if (priority === 'tools') return 'Ambos planes incluyen exactamente las mismas herramientas. El Plan Compartido ($20/mes) te da acceso completo con cupos ilimitados.'
    if (perfil === 'student') return '¡Ideal para aprender! El Plan Compartido ($20/mes) te da acceso completo a todas las herramientas de IA sin restricciones.'
    if (perfil === 'creator') return 'Para crear sin límites, el Plan Compartido ($20/mes) incluye Veo 3.1, Nano Banana Pro y 30 TB. ¡Todo lo que necesitas!'
    if (perfil === 'business') return 'Para equipos, el Plan Compartido ($20/mes) es ideal: cupos ilimitados, todas las herramientas y correo proporcionado.'
    return 'El Plan Compartido ($20/mes) te da acceso completo a todas las herramientas con cupos ilimitados. ¡Comienza hoy!'
  }

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    })
    lenisRef.current = lenis

    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => { lenis.raf(time * 1000) })
    gsap.ticker.lagSmoothing(0)

    const handleScroll = () => setHeaderScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })

    gsap.fromTo('.anim-up',
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: 'power3.out' }
    )

    gsap.utils.toArray<HTMLElement>('.scroll-reveal').forEach((el) => {
      gsap.fromTo(el,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 92%', once: true } }
      )
    })

    gsap.utils.toArray<HTMLElement>('.feature-row').forEach((el, i) => {
      gsap.fromTo(el,
        { opacity: 0, y: 80 },
        { opacity: 1, y: 0, duration: 1.4, ease: 'power2.out', delay: i * 0.08,
          scrollTrigger: { trigger: el, start: 'top 90%', once: true } }
      )
    })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      lenis.destroy()
    }
  }, [])

  return (
    <div className="paginaUltra">
      <div className="vignette-container"/>
      {/* Particle background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <Antigravity
          count={300}
          driftAmount={1.5}
          driftSpeed={0.25}
          particleSize={0.07}
          mouseRadius={5}
          mouseStrength={1.5}
        />
      </div>

      {/* ═══ HEADER ═══ */}
      <header className={`header ${headerScrolled ? 'scrolled' : ''}`}>
        <div className="grid-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="#" className="logo" style={{ zIndex: 1001 }}>
            <BrandLogo/>
            <span>CodeAgents</span>
          </a>
          
          <button 
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            style={{ zIndex: 1001 }}
          >
            <span className="google-symbols">{mobileMenuOpen ? 'close' : 'menu'}</span>
          </button>

          <nav className={`header-nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            <a href="#features" onClick={() => setMobileMenuOpen(false)}>Funciones</a>
            <a href="#plans" onClick={() => setMobileMenuOpen(false)}>Planes</a>
            <a href="#blog" onClick={() => setMobileMenuOpen(false)}>Novedades</a>
            <a href="https://antigravity.google/docs" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)}>Docs</a>
            <button onClick={() => { document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' }); setMobileMenuOpen(false); }} className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '14px' }}>Comenzar</button>
          </nav>
        </div>
      </header>

      {/* ═══ HERO — Focused on value proposition ═══ */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge anim-up">
            <span className="google-symbols" style={{ fontSize: 16 }}>bolt</span>
            <ShinyText text="Cupos limitados — Marzo 2026" speed={4} />
          </div>

          <h1 className="anim-up">
            <SplitText
              text="Todo el poder de la IA de Google,"
              splitType="words"
              delay={80}
              duration={0.7}
              ease="power3.out"
              from={{ opacity: 0, y: 30, rotateX: 40 }}
              to={{ opacity: 1, y: 0, rotateX: 0 }}
              threshold={0.1}
              textAlign="center"
            />
            <div className="hero-accent">
              <SplitText
                text="desde $20 al mes"
                splitType="words"
                delay={100}
                duration={0.8}
                ease="power2.out"
                from={{ opacity: 0, y: 50, scale: 0.8 }}
                to={{ opacity: 1, y: 0, scale: 1 }}
                threshold={0.1}
                textAlign="center"
              />
            </div>
          </h1>

          <div className="hero-subtitle anim-up">
            <BlurText
              text="Accede a Gemini 3.1 Pro, generación de video con Veo 3.1, imágenes con Nano Banana Pro y 30TB de almacenamiento. Todo en un solo plan, sin sorpresas."
              delay={40}
              animateBy="words"
              direction="top"
              stepDuration={0.3}
              className="hero-subtitle-blur"
            />
          </div>

          <div className="hero-cta anim-up">
            <button onClick={() => document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' })} className="btn btn-primary">Activar mi plan Ultra</button>
            <a href="https://antigravity.google/download" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">Descargar Antigravity</a>
          </div>

          <div className="hero-trust anim-up">
            <div className="trust-item">
              <span className="google-symbols" style={{ fontSize: 18 }}>verified</span>
              Plan oficial de Google
            </div>
            <div className="trust-item">
              <span className="google-symbols" style={{ fontSize: 18 }}>lock</span>
              Pago 100% seguro
            </div>
            <div className="trust-item">
              <span className="google-symbols" style={{ fontSize: 18 }}>autorenew</span>
              Cancela cuando quieras
            </div>
          </div>
        </div>

        {/* Showcase Card */}
        <div className="showcase-card anim-up">
          <div 
            aria-label="Reproducir video"
            className="video-wrapper"
            ref={showcaseRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setCursorVisible(true)}
            onMouseLeave={() => setCursorVisible(false)}
          >
            <div className="custom-cursor" ref={cursorRef} style={{ opacity: cursorVisible ? 1 : 0 }}>
              <div className="cursor-content">
                <span className="google-symbols symbol" style={{ fontSize: 20 }}>play_arrow</span>
                <span className="call-to-action">Ver demo</span>
              </div>
            </div>
            <div className="video-control-button google-symbols">play_arrow</div>
            <video autoPlay loop muted playsInline width="1920" height="1080" className="landing-video">
              <source src="https://antigravity.google/assets/video/AGY_Logo_loop.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      {/* ═══ INFINITE ICON MARQUEE ═══ */}
      <div className="marquee-container">
        <div className="marquee-content">
          {[...toolIconsList, ...toolIconsList].map((icon, i) => (
            <div key={i} className="icon-bubble">
              <span className="google-symbols">{icon}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ VALUE PROPOSITION — Why Ultra? ═══ */}
      <section className="value-section">
        <div className="grid-container">
          <div className="value-header scroll-reveal">
            <h2>¿Por qué elegir el plan Ultra?</h2>
            <p>Accede a todo el ecosistema de herramientas de IA de Google por una fracción de lo que pagarías individualmente.</p>
          </div>

          <div className="value-grid">
            {[
              { icon: 'neurology', title: 'Gemini 3.1 Pro', desc: 'El modelo de IA más avanzado de Google. Razonamiento profundo, generación de código y análisis de datos sin límites prácticos.', price: 'Incluido', color: 'rgba(134, 59, 255, 0.15)' },
              { icon: 'movie', title: 'Veo 3.1', desc: 'Genera videos profesionales desde texto. Clips de alta calidad para contenido, marketing y proyectos creativos.', price: 'Incluido', color: 'rgba(71, 191, 255, 0.15)' },
              { icon: 'image', title: 'Nano Banana Pro', desc: 'Generación de imágenes en resolución 2K y 4K. Perfecto para diseño gráfico, publicidad y contenido visual.', price: 'Incluido', color: 'rgba(255, 107, 107, 0.12)' },
              { icon: 'cloud', title: '30 TB de Almacenamiento', desc: 'Espacio masivo en la nube para todos tus proyectos, archivos y creaciones generadas con IA.', price: 'Plan Privado', color: 'rgba(72, 199, 142, 0.12)' },
              { icon: 'palette', title: 'Whisk + IA Studio', desc: 'Suite de herramientas creativas para remixar, editar y experimentar con modelos generativos de Google.', price: 'Incluido', color: 'rgba(255, 159, 252, 0.12)' },
              { icon: 'speed', title: 'Acceso Prioritario', desc: 'Salta la cola. Los usuarios Ultra tienen prioridad en renders, generación y procesamiento de modelos IA.', price: 'Plan Privado', color: 'rgba(255, 193, 7, 0.12)' },
            ].map((card, idx) => (
              <SpotlightCard
                key={idx}
                className="value-card scroll-reveal"
                spotlightColor={card.color}
              >
                <div className="value-icon"><span className="google-symbols">{card.icon}</span></div>
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
                <span className="value-price">{card.price}</span>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ AGENT TEXT ═══ */}
      <section className="agent-text-section">
        <div className="grid-container">
          <div className="agent-text scroll-reveal">
            <BlurText
              text="CodeAgents reúne los agentes de Inteligencia Artificial más potentes del planeta para el ecosistema de desarrollo. Acelera tu código, diseña sin límites y despliega más rápido en un solo lugar — sin restricciones."
              delay={30}
              animateBy="words"
              direction="bottom"
              stepDuration={0.25}
              className="agent-text-blur"
            />
          </div>
        </div>
      </section>

      {/* ═══ FEATURE VIDEO LIST ═══ */}
      <section id="features" className="feature-list-section">
        <div className="grid-container" style={{ maxWidth: 1200 }}>
          <div className="feature-rows-container">
            {featureList.map((feat, idx) => (
              <div className="feature-row scroll-reveal" key={idx}>
                <div className="feature-text">
                  <h2>{feat.title}</h2>
                  <p>{feat.desc}</p>
                </div>
                <div className="feature-media">
                  <div className="feature-video-container">
                    <video src={feat.videoSrc} autoPlay loop muted playsInline />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ COMPARISON SECTION — Show the savings ═══ */}
      <section className="comparison-section">
        <div className="grid-container">
          <div className="comparison-header scroll-reveal">
            <h2>Ahorra más de $200/mes comparado con planes individuales</h2>
            <p>Cada herramienta por separado tendría un costo individual. Con Ultra, obtienes todo en un solo plan accesible.</p>
          </div>

          <div className="comparison-table scroll-reveal">
            <div className="comparison-row comparison-head">
              <span>Herramienta</span>
              <span>Precio individual</span>
              <span>Con Ultra</span>
            </div>
            <div className="comparison-row">
              <span>Gemini 3.1 Pro (API)</span>
              <span className="price-individual">~$29/mes</span>
              <span className="price-ultra">Incluido</span>
            </div>
            <div className="comparison-row">
              <span>Veo 3.1 (generación video)</span>
              <span className="price-individual">~$49/mes</span>
              <span className="price-ultra">Incluido</span>
            </div>
            <div className="comparison-row">
              <span>Nano Banana Pro (imágenes 4K)</span>
              <span className="price-individual">~$39/mes</span>
              <span className="price-ultra">Incluido</span>
            </div>
            <div className="comparison-row">
              <span>Google One 30TB</span>
              <span className="price-individual">~$149/mes</span>
              <span className="price-ultra">Plan Privado</span>
            </div>
            <div className="comparison-row">
              <span>IA Studio + Whisk</span>
              <span className="price-individual">~$19/mes</span>
              <span className="price-ultra">Incluido</span>
            </div>
            <div className="comparison-row comparison-total">
              <span>Total por separado</span>
              <span className="price-individual">
                $<span style={{ display: 'inline-block', minWidth: '32px', textAlign: 'right' }}><CountUp from={0} to={285} duration={2.5} separator="," /></span>/mes
              </span>
              <span className="price-ultra-total">
                Desde $<span style={{ display: 'inline-block', minWidth: '20px', textAlign: 'right' }}><CountUp from={285} to={20} duration={2} /></span>/<span>mes</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ PLANS ═══ */}
      <section id="plans" className="plans-section">
        <div className="grid-container">
          <div className="plans-header scroll-reveal">
            <h2>Elige tu plan</h2>
            <p>Ambos planes incluyen acceso completo a las mismas herramientas. La diferencia está en la privacidad, cupos y recursos dedicados.</p>

            {/* Billing toggle */}
            <div className="billing-toggle">
              <button
                className={`billing-option ${billingMode === 'once' ? 'active' : ''}`}
                onClick={() => setBillingMode('once')}
              >
                <span className="google-symbols" style={{ fontSize: 16 }}>payments</span>
                Pago Único
              </button>
              <button
                className={`billing-option ${billingMode === 'subscription' ? 'active purple' : ''}`}
                onClick={() => setBillingMode('subscription')}
              >
                <span className="google-symbols" style={{ fontSize: 16 }}>autorenew</span>
                Suscripción Mensual
                <span className="billing-save-badge">AUTO</span>
              </button>
            </div>

            {/* Dynamic Warning Message */}
            <div className={`billing-warning-banner ${billingMode}`}>
              {billingMode === 'subscription' ? (
                <>
                  <div className="warning-icon-wrapper sub"><span className="google-symbols">autorenew</span></div>
                  <div>
                    <strong>Suscripción Mensual (Cobro Automático)</strong>
                    <p>Se renovará automáticamente tu acceso al finalizar el mes. Puedes cancelar en cualquier momento desde tu panel de control.</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="warning-icon-wrapper once"><span className="google-symbols">event_available</span></div>
                  <div>
                    <strong>Pago Único (Sin compromisos)</strong>
                    <p>Obtienes acceso por 30 días exactos. Finalizado el periodo tu cuenta quedará inactiva temporalmente hasta que decidas renovar manualmente.</p>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="plans-grid">
            <div className="g-plan-card scroll-reveal">
              <div className="g-plan-content">
                <div className="g-eyebrow outline">{billingMode === 'subscription' ? 'SUSCRIPCIÓN · RECURRENTE' : 'MENSUAL · PAGO ÚNICO'}</div>
                
                <h3 className="g-plan-title">Plan Compartido</h3>
                <p className="g-plan-subtitle">Todas las herramientas, entorno compartido</p>
                
                <div className="g-plan-price-amount" style={{ fontSize: 40, marginTop: 16 }}>
                  $20 <span style={{ fontSize: 16, color: '#9aa0a6' }}>USD {billingMode === 'subscription' ? '/ mes' : ''}</span>
                </div>
                
                {billingMode === 'subscription' && (
                  <p style={{ fontSize: 13, color: '#81c995', marginBottom: 32, marginTop: -16, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className="google-symbols" style={{ fontSize: 16 }}>check_circle</span>
                    Cobro automático mensual · Cancela cuando quieras
                  </p>
                )}

                <ul className="g-plan-features-list">
                  <li><span className="google-symbols" style={{ color: '#8ab4f8', fontVariationSettings: "'FILL' 1" }}>check_circle</span> <span><strong>App de Gemini:</strong> Razonamiento profundo y modelos potentes</span></li>
                  <li><span className="google-symbols" style={{ color: '#8ab4f8', fontVariationSettings: "'FILL' 1" }}>check_circle</span> <span><strong>Flow & Veo 3.1:</strong> Creación de video pro</span></li>
                  <li><span className="google-symbols" style={{ color: '#8ab4f8', fontVariationSettings: "'FILL' 1" }}>check_circle</span> <span><strong>25,000 créditos IA/mes</strong> para generación multimedia</span></li>
                  <li><span className="google-symbols" style={{ color: '#8ab4f8', fontVariationSettings: "'FILL' 1" }}>check_circle</span> <span><strong>NotebookLM:</strong> Flujos de trabajo potentes y altos límites</span></li>
                  <li><span className="google-symbols" style={{ color: '#8ab4f8', fontVariationSettings: "'FILL' 1" }}>check_circle</span> <span>Nano Banana Pro, Whisk e IA Studio</span></li>
                  <li><span className="google-symbols" style={{ color: '#8ab4f8', fontVariationSettings: "'FILL' 1" }}>check_circle</span> <span>Entorno y correo administrado (Cupos ilimitados)</span></li>
                </ul>

                <hr style={{ border: 'none', borderTop: '1px solid #3c4043', margin: '24px 0' }} />

                <div className="g-plan-more-access-title" style={{ marginTop: 0, textAlign: 'left', fontSize: 14 }}>
                  Incluye más acceso a lo siguiente:
                </div>
                <div className="g-plan-more-access-grid">
                  <div className="g-plan-more-access-item">
                    <img src="https://storage.googleapis.com/gweb-one-cdn/one/uploads/235ad6261d5294e74a167f644a98478615736f51.svg" width="24" height="24" alt="" loading="lazy" style={{ marginBottom: 12 }} />
                    <span className="g-plan-more-access-text">Aumentar la<br/>productividad</span>
                  </div>
                  <div className="g-plan-more-access-item">
                    <img src="https://storage.googleapis.com/gweb-one-cdn/one/uploads/9d13f170ef4a6353be0a47307ef80816fd5953f1.svg" width="24" height="24" alt="" loading="lazy" style={{ marginBottom: 12 }} />
                    <span className="g-plan-more-access-text">Liberar tu<br/>creatividad</span>
                  </div>
                  <div className="g-plan-more-access-item">
                    <img src="https://storage.googleapis.com/gweb-one-cdn/one/uploads/eeb2d844a189dd807a27bb485dbcb320474a46c1.svg" width="24" height="24" alt="" loading="lazy" style={{ marginBottom: 12 }} />
                    <span className="g-plan-more-access-text">Estudiar de forma<br/>más inteligente</span>
                  </div>
                  <div className="g-plan-more-access-item">
                    <span className="google-symbols g-plan-more-access-icon" style={{ fontVariationSettings: "'FILL' 1" }}>code</span>
                    <span className="g-plan-more-access-text">Programar más<br/>rápido</span>
                  </div>
                </div>

                <a href="#benefits" className="g-plan-benefits-link" onClick={(e) => e.preventDefault()} style={{ textAlign: 'left', marginLeft: 0, marginTop: 8, marginBottom: 32 }}>
                  Ver los beneficios del plan +
                </a>



                <button onClick={() => handlePay('shared')} className="g-plan-btn dark" disabled={checkoutLoading} style={{ marginTop: 'auto' }}>
                  {checkoutLoading ? 'Procesando...' : billingMode === 'subscription' ? 'Suscribirme — Compartido' : 'Comenzar Compartido'}
                </button>
              </div>
            </div>

            <div className="g-plan-card featured scroll-reveal">
              <div className="g-badge-floating">
                <span className="google-symbols" style={{ fontSize: 14 }}>workspace_premium</span>
                Recomendado
              </div>
              <div className="g-plan-content">
                <div className="g-eyebrow outline">{billingMode === 'subscription' ? 'SUSCRIPCIÓN · RECURRENTE' : 'PAGO ÚNICO'}</div>
                
                <h3 className="g-plan-title">Plan Privado</h3>
                <p className="g-plan-subtitle">Máxima privacidad y rendimiento para trabajos pesados</p>
                
                <div className="g-plan-price-amount" style={{ fontSize: 40, marginTop: 16 }}>
                  $55 <span style={{ fontSize: 16, color: '#9aa0a6' }}>USD {billingMode === 'subscription' ? '/ mes' : ''}</span>
                </div>
                
                {billingMode === 'subscription' && (
                  <p style={{ fontSize: 13, color: '#81c995', marginBottom: 32, marginTop: -16, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className="google-symbols" style={{ fontSize: 16 }}>check_circle</span>
                    Cobro automático mensual · Cancela cuando quieras
                  </p>
                )}

                <ul className="g-plan-features-list">
                  <li><span className="google-symbols google-symbols-filled-green">check_circle</span> <span><strong>Todos los beneficios del Plan Compartido</strong></span></li>
                  <li><span className="google-symbols" style={{ color: '#81c995' }}>check</span> <span>Vinculado o transferido a tu correo personal</span></li>
                  <li><span className="google-symbols" style={{ color: '#81c995' }}>check</span> <span><strong>Límites máximos posibles</strong> en Flow y NotebookLM</span></li>
                  <li><span className="google-symbols" style={{ color: '#81c995' }}>check</span> <span>Prioridad absoluta en renders 4K y razonamiento de Gemini</span></li>
                  <li><span className="google-symbols" style={{ color: '#81c995' }}>check</span> <span><strong>Descuento adicional</strong> para Google AI Ultra for Business</span></li>
                  <li><span className="google-symbols" style={{ color: '#81c995' }}>check</span> <span>Entorno exclusivo (Solo 2 cupos) y Soporte prioritario</span></li>
                </ul>

                <hr style={{ border: 'none', borderTop: '1px solid #3c4043', margin: '24px 0' }} />

                <div className="g-plan-more-access-title" style={{ marginTop: 0, textAlign: 'left', fontSize: 14 }}>
                  Incluye más acceso a lo siguiente:
                </div>
                <div className="g-plan-more-access-grid">
                  <div className="g-plan-more-access-item">
                    <img src="https://storage.googleapis.com/gweb-one-cdn/one/uploads/235ad6261d5294e74a167f644a98478615736f51.svg" width="24" height="24" alt="" loading="lazy" style={{ marginBottom: 12 }} />
                    <span className="g-plan-more-access-text">Aumentar la<br/>productividad</span>
                  </div>
                  <div className="g-plan-more-access-item">
                    <img src="https://storage.googleapis.com/gweb-one-cdn/one/uploads/9d13f170ef4a6353be0a47307ef80816fd5953f1.svg" width="24" height="24" alt="" loading="lazy" style={{ marginBottom: 12 }} />
                    <span className="g-plan-more-access-text">Liberar tu<br/>creatividad</span>
                  </div>
                  <div className="g-plan-more-access-item">
                    <img src="https://storage.googleapis.com/gweb-one-cdn/one/uploads/eeb2d844a189dd807a27bb485dbcb320474a46c1.svg" width="24" height="24" alt="" loading="lazy" style={{ marginBottom: 12 }} />
                    <span className="g-plan-more-access-text">Estudiar de forma<br/>más inteligente</span>
                  </div>
                  <div className="g-plan-more-access-item">
                    <span className="google-symbols g-plan-more-access-icon" style={{ fontVariationSettings: "'FILL' 1" }}>code</span>
                    <span className="g-plan-more-access-text">Programar más<br/>rápido</span>
                  </div>
                </div>

                <a href="#benefits" className="g-plan-benefits-link" onClick={(e) => e.preventDefault()} style={{ textAlign: 'left', marginLeft: 0, marginTop: 8, marginBottom: 32 }}>
                  Ver los beneficios del plan +
                </a>

                <button onClick={() => handlePay('private')} className="g-plan-btn purple" disabled={checkoutLoading} style={{ marginTop: 'auto' }}>
                  {checkoutLoading ? 'Procesando...' : billingMode === 'subscription' ? 'Suscribirme — Privado' : 'Activar Plan Privado'}
                </button>
              </div>
            </div>
          </div>

          <p className="plans-device-note scroll-reveal">
            <span className="google-symbols" style={{ fontSize: 18, verticalAlign: 'middle', marginRight: 6 }}>info</span>
            Requiere <a href="#" rel="noopener noreferrer">Antigravity</a> instalado. Disponible para <strong>Windows 10+</strong>, <strong>macOS 12+</strong> y <strong>Linux</strong>.
          </p>

        </div>
      </section>

      {/* ═══ DISCOVER CTA ═══ */}
      <section className="plans-section" style={{ paddingTop: 0, paddingBottom: 48 }}>
        <div className="grid-container">
          <div className="g1-discover-cta scroll-reveal">
            <div className="g1-discover-content">
              <span className="g1-badge-nuevo" style={{ display: 'inline-block', background: '#e8eaed', color: '#202124', fontSize: 12, fontWeight: 700, padding: '4px 14px', borderRadius: 100, marginBottom: 20 }}>Nuevo</span>
              <h2>Descubre un universo<br/>de posibilidades</h2>
              <p>Videos cinematográficos, agentes autónomos, IA de nueva generación y mucho más. Todo incluido en tu plan.</p>
              <button className="g1-discover-btn" onClick={() => setShowShowcase(true)}>
                <span className="google-symbols" style={{ fontSize: 20 }}>explore</span>
                Saber más
              </button>
            </div>
            <div className="g1-discover-visual">
              <video muted playsInline loop autoPlay src="https://storage.googleapis.com/gweb-gemini-cdn/gemini/uploads/67b77ecba7d860d7a3fc58ac1fce782a41f487eb.compressed.mp4" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SHOWCASE FULLSCREEN MODAL ═══ */}
      {showShowcase && (
        <div className="g1-showcase-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowShowcase(false) }} onWheel={(e) => e.stopPropagation()}>
          <div className="g1-showcase-modal" onWheel={(e) => e.stopPropagation()}>
            <button className="g1-showcase-close" onClick={() => setShowShowcase(false)} aria-label="Cerrar">
              <span className="google-symbols">close</span>
            </button>

            {/* Floating Bubble Nav — mobile-first con hamburguesa */}
            <nav className="g1-bubble-nav">
              <div className="g1-bubble-nav-inner">
                {/* Hamburger toggle (visible only on mobile) */}
                <button className="g1-bubble-hamburger" onClick={(e) => {
                  const menu = e.currentTarget.closest('.g1-bubble-nav')?.querySelector('.g1-bubble-dropdown');
                  menu?.classList.toggle('open');
                  e.currentTarget.classList.toggle('open');
                }} aria-label="Menú de secciones">
                  <span className="g1-hamburger-line"></span>
                  <span className="g1-hamburger-line"></span>
                  <span className="g1-hamburger-line"></span>
                </button>

                {/* Desktop nav items (hidden on mobile, shown inline on desktop) */}
                <div className="g1-bubble-desktop-items">
                  <button className="g1-bubble-item active" onClick={(e) => {
                    e.currentTarget.closest('.g1-bubble-nav-inner')?.querySelectorAll('.g1-bubble-item').forEach(b => b.classList.remove('active'));
                    e.currentTarget.classList.add('active');
                    document.getElementById('g1-video-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}>
                    <span className="g1-badge-nuevo">Nuevo</span> Video
                  </button>
                  <button className="g1-bubble-item" onClick={(e) => {
                    e.currentTarget.closest('.g1-bubble-nav-inner')?.querySelectorAll('.g1-bubble-item').forEach(b => b.classList.remove('active'));
                    e.currentTarget.classList.add('active');
                    document.getElementById('g1-ai-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}>IA de nueva generación</button>
                  <button className="g1-bubble-item" onClick={(e) => {
                    e.currentTarget.closest('.g1-bubble-nav-inner')?.querySelectorAll('.g1-bubble-item').forEach(b => b.classList.remove('active'));
                    e.currentTarget.classList.add('active');
                    document.getElementById('g1-productivity-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}>Productividad</button>
                  <button className="g1-bubble-item" onClick={(e) => {
                    e.currentTarget.closest('.g1-bubble-nav-inner')?.querySelectorAll('.g1-bubble-item').forEach(b => b.classList.remove('active'));
                    e.currentTarget.classList.add('active');
                    document.getElementById('g1-learning-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}>Aprendizaje</button>
                  <button className="g1-bubble-item" onClick={(e) => {
                    e.currentTarget.closest('.g1-bubble-nav-inner')?.querySelectorAll('.g1-bubble-item').forEach(b => b.classList.remove('active'));
                    e.currentTarget.classList.add('active');
                    document.getElementById('g1-agents-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}>
                    <span className="g1-badge-nuevo">Nuevo</span> Agentes de IA
                  </button>
                </div>

                <button className="g1-bubble-cta" onClick={() => {
                  setShowShowcase(false);
                  setTimeout(() => document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' }), 300);
                }}>Registrarse</button>
              </div>

              {/* Mobile dropdown (hidden by default, shown when hamburger is clicked) */}
              <div className="g1-bubble-dropdown">
                {[
                  { id: 'g1-video-section', label: 'Video', badge: 'Nuevo' },
                  { id: 'g1-ai-section', label: 'IA de nueva generación' },
                  { id: 'g1-productivity-section', label: 'Productividad' },
                  { id: 'g1-learning-section', label: 'Aprendizaje' },
                  { id: 'g1-agents-section', label: 'Agentes de IA', badge: 'Nuevo' },
                ].map((item) => (
                  <button key={item.id} className="g1-dropdown-item" onClick={(e) => {
                    document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    e.currentTarget.closest('.g1-bubble-nav')?.querySelector('.g1-bubble-dropdown')?.classList.remove('open');
                    e.currentTarget.closest('.g1-bubble-nav')?.querySelector('.g1-bubble-hamburger')?.classList.remove('open');
                  }}>
                    {item.badge && <span className="g1-badge-nuevo">{item.badge}</span>}
                    {item.label}
                  </button>
                ))}
              </div>
            </nav>

            {/* ═══ VIDEO SHOWCASE (idéntico al diseño Google One) ═══ */}
            <div id="g1-video-section" className="g1-section" style={{ paddingTop: 48 }}>
              <span className="g1-pill-badge">Nuevo</span>
              <h2 className="g1-section-title">Crea momentos cinematográficos con<br/>la generación de videos de vanguardia</h2>

              <div className="g1-video-carousel">
                <div className="g1-video-track" id="videoTrack" style={{ transform: 'translateX(0%)' }}>
                  {[
                    { src: 'https://storage.googleapis.com/gweb-gemini-cdn/gemini/uploads/67b77ecba7d860d7a3fc58ac1fce782a41f487eb.compressed.mp4', label: 'Un búho sabio volando entre las nubes en un cielo iluminado por la luna' },
                    { src: 'https://storage.googleapis.com/gweb-gemini-cdn/gemini/uploads/e4e754498b0fa52f1bd8e5c43fff67e47417630d.compressed.mp4', label: 'Un gato cantando ópera con orquesta completa' },
                    { src: 'https://storage.googleapis.com/gweb-gemini-cdn/gemini/uploads/3c864ff4ad5b6fa91bbcf7814f6a8e53ea19cd1f.compressed.mp4', label: 'Un viejo marinero comiendo espagueti' },
                    { src: 'https://storage.googleapis.com/gweb-gemini-cdn/gemini/uploads/b06ee5fbeac029f214aa25285980ce718bcc0f4e.compressed.mp4', label: 'Un cartógrafo en su estudio, examinando un antiguo mapa' },
                    { src: 'https://storage.googleapis.com/gweb-gemini-cdn/gemini/uploads/a0958d2a1255072bfd655488a208d0b85c66012d.compressed.mp4', label: 'Un detective interroga a un pato de goma nervioso' },
                  ].map((video, i) => (
                    <div className="g1-video-slide" key={i}>
                      <div className="g1-video-frame">
                        <video muted playsInline loop autoPlay={i === 0} aria-label={video.label} src={video.src}
                          onMouseEnter={(e) => (e.currentTarget as HTMLVideoElement).play()} />
                        <div className="g1-video-controls">
                          <button aria-label="Pausar" onClick={(e) => { const v = e.currentTarget.closest('.g1-video-frame')?.querySelector('video'); if(v) v.paused ? v.play() : v.pause(); }}>
                            <span className="google-symbols">pause</span>
                          </button>
                          <button aria-label="Silenciar" onClick={(e) => { const v = e.currentTarget.closest('.g1-video-frame')?.querySelector('video'); if(v) v.muted = !v.muted; }}>
                            <span className="google-symbols">volume_off</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="g1-carousel-dots">
                {[0,1,2,3,4].map(i => (
                  <button key={i} className={`g1-carousel-dot ${i === 0 ? 'active' : ''}`} aria-label={`Video ${i+1}`} onClick={() => {
                    const track = document.getElementById('videoTrack');
                    if (track) { track.style.transform = `translateX(-${i * 100}%)`; track.querySelectorAll('video').forEach((v, idx) => { if(idx===i)(v as HTMLVideoElement).play();else(v as HTMLVideoElement).pause(); }); }
                    document.querySelectorAll('.g1-carousel-dot').forEach((d, idx) => d.classList.toggle('active', idx === i));
                  }} />
                ))}
              </div>
            </div>

            {/* ═══ IA DE NUEVA GENERACIÓN (Google One style) ═══ */}
            <div id="g1-ai-section" className="g1-section">
              <h2 className="g1-section-title">Accede a los modelos de IA más avanzados<br/>de Google para <span className="g1-blue">tus proyectos</span></h2>
              <p className="g1-section-sub">Nuestros modelos más recientes son mucho más capaces en razonamiento lógico, análisis, código y colaboración creativa.</p>
              
              <div className="g1-bento-grid">
                {/* 1. Gemini 3.1 Pro (Full width top) */}
                <div className="g1-bento-card g1-col-12" style={{ minHeight: '480px' }}>
                  <video muted playsInline loop autoPlay src="https://storage.googleapis.com/gweb-gemini-cdn/gemini/uploads/67b77ecba7d860d7a3fc58ac1fce782a41f487eb.compressed.mp4" className="g1-bento-video" />
                  <div className="g1-bento-content">
                    <span className="g1-card-badge">IA de nueva generación</span>
                    <h3>Aborda proyectos complejos con <span className="g1-blue">Gemini Pro y Ultra</span></h3>
                    <p>Acceso prioritario a los modelos experimentales más avanzados.</p>
                  </div>
                  <button className="g1-bento-plus"><span className="google-symbols">add</span></button>
                </div>
                
                {/* 2. Deep Research (Half width bottom left) */}
                <div className="g1-bento-card g1-col-6">
                  <video muted playsInline loop autoPlay src="https://storage.googleapis.com/gweb-gemini-cdn/gemini/uploads/e4e754498b0fa52f1bd8e5c43fff67e47417630d.compressed.mp4" className="g1-bento-video" />
                  <div className="g1-bento-content">
                    <span className="g1-card-badge">Acceso ampliado</span>
                    <h3>Aprovecha al máximo las <span className="g1-blue">funciones de Gemini</span></h3>
                    <p>Deep Research analiza automáticamente cientos de sitios web para darte informes detallados.</p>
                  </div>
                  <button className="g1-bento-plus"><span className="google-symbols">add</span></button>
                </div>

                {/* 3. Project Lyria (Half width bottom right) */}
                <div className="g1-bento-card g1-col-6">
                  <video muted playsInline loop autoPlay src="https://storage.googleapis.com/gweb-gemini-cdn/gemini/uploads/3c864ff4ad5b6fa91bbcf7814f6a8e53ea19cd1f.compressed.mp4" className="g1-bento-video" />
                  <div className="g1-bento-content">
                    <span className="g1-card-badge g1-badge-nuevo">Nuevo</span>
                    <h3>Crea bandas sonoras personalizadas <span className="g1-blue">para cualquier momento</span></h3>
                    <p>Transforma un sentimiento en una pista musical con Project Lyria 3.</p>
                  </div>
                  <button className="g1-bento-plus"><span className="google-symbols">add</span></button>
                </div>
              </div>
            </div>

            {/* ═══ PRODUCTIVIDAD (Google One style) ═══ */}
            <div id="g1-productivity-section" className="g1-section">
              <h2 className="g1-section-title">Impulsa tu productividad con Gemini<br/>en <span className="g1-blue">tus apps de Google</span></h2>
              
              <div className="g1-bento-grid">
                {/* Left side column (stacked) - 8 span */}
                <div className="g1-bento-card g1-col-7" style={{ minHeight: '360px' }}>
                  <video muted playsInline loop autoPlay src="https://storage.googleapis.com/gweb-gemini-cdn/gemini/uploads/b06ee5fbeac029f214aa25285980ce718bcc0f4e.compressed.mp4" className="g1-bento-video" />
                  <div className="g1-bento-content">
                    <h3>Ayúdame a escribir</h3>
                    <p>Redacta documentos completos, currículums y más con herramientas por IA.</p>
                  </div>
                  <button className="g1-bento-plus"><span className="google-symbols">add</span></button>
                </div>
                
                {/* Right side column (tall) - 4 span */}
                <div className="g1-bento-card g1-col-5 g1-row-2" style={{ minHeight: '744px' }}>
                  {/* Reuse one of the smooth gradient background videos for visual placeholder */}
                  <video muted playsInline loop autoPlay src="https://storage.googleapis.com/gweb-gemini-cdn/gemini/uploads/67b77ecba7d860d7a3fc58ac1fce782a41f487eb.compressed.mp4" className="g1-bento-video" />
                  <div className="g1-bento-content">
                    <h3>Chrome Auto Browse</h3>
                    <p>Deja que Gemini Chrome investigue reservas de vuelos y costos de hoteles por ti.</p>
                  </div>
                  <button className="g1-bento-plus"><span className="google-symbols">add</span></button>
                </div>

                <div className="g1-bento-card g1-col-7" style={{ minHeight: '360px' }}>
                  <video muted playsInline loop autoPlay src="https://storage.googleapis.com/gweb-gemini-cdn/gemini/uploads/a0958d2a1255072bfd655488a208d0b85c66012d.compressed.mp4" className="g1-bento-video" />
                  <div className="g1-bento-content">
                    <h3>Crea imágenes en Slides y <span className="g1-blue">videos en Vids</span></h3>
                    <p>Añade voz a tus presentaciones visuales en un clic.</p>
                  </div>
                  <button className="g1-bento-plus"><span className="google-symbols">add</span></button>
                </div>
              </div>
            </div>

            {/* ═══ APRENDIZAJE ═══ */}
            <div id="g1-learning-section" className="g1-section">
              <h2 className="g1-section-title">Estudia de manera más inteligente,<br/><span className="g1-blue">no más difícil</span></h2>
              
              <div className="g1-bento-grid">
                {/* Left tall card (NotebookLM) */}
                <div className="g1-bento-card g1-col-8 g1-row-2" style={{ minHeight: '660px' }}>
                  <video muted playsInline loop autoPlay src="https://storage.googleapis.com/gweb-one-cdn/one/uploads/a2e4e30e212f57703adac34802c979e01a6eda28.mp4" className="g1-bento-video" />
                  <div className="g1-bento-content">
                    <span className="g1-card-badge">Descripciones en audio</span>
                    <h3>Comprende y domina temas <span className="g1-blue">más rápido</span></h3>
                    <p>Estudia y organiza tus investigaciones con 5X más recursos en Audio Overviews de NotebookLM.</p>
                  </div>
                  <button className="g1-bento-plus"><span className="google-symbols">add</span></button>
                </div>
                
                {/* Right side top */}
                <div className="g1-bento-card g1-col-4" style={{ minHeight: '318px' }}>
                  <video muted playsInline loop autoPlay src="https://storage.googleapis.com/gweb-gemini-cdn/gemini/uploads/e4e754498b0fa52f1bd8e5c43fff67e47417630d.compressed.mp4" className="g1-bento-video" />
                  <div className="g1-bento-content">
                    <h3>Condensa horas de búsqueda</h3>
                  </div>
                  <button className="g1-bento-plus"><span className="google-symbols">add</span></button>
                </div>
                
                {/* Right side bottom */}
                <div className="g1-bento-card g1-col-4" style={{ minHeight: '318px' }}>
                  <video muted playsInline loop autoPlay src="https://storage.googleapis.com/gweb-gemini-cdn/gemini/uploads/b06ee5fbeac029f214aa25285980ce718bcc0f4e.compressed.mp4" className="g1-bento-video" />
                  <div className="g1-bento-content">
                    <h3>Mantente organizado</h3>
                  </div>
                  <button className="g1-bento-plus"><span className="google-symbols">add</span></button>
                </div>
              </div>
            </div>

            {/* ═══ AGENTES DE IA ═══ */}
            <div id="g1-agents-section" className="g1-section">
              <h2 className="g1-section-title">Ahorra tiempo con agentes de IA que<br/><span className="g1-blue">automatizan tu trabajo</span></h2>
              
              <div className="g1-bento-grid">
                {/* Project Mariner */}
                <div className="g1-bento-card g1-col-6" style={{ minHeight: '500px' }}>
                  <video muted playsInline loop autoPlay src="https://storage.googleapis.com/gweb-one-cdn/one/uploads/e9f0be5fc3838f6fa17aa4ccd2f12f104e90ceb9.mp4" className="g1-bento-video" />
                  <div className="g1-bento-content">
                    <span className="g1-card-badge">Project Mariner</span>
                    <h3>Ahorra tiempo en tareas<br/>de <span className="g1-blue">navegación repetitivas</span></h3>
                    <p>Delega flujos enteros de compras o reservas de viaje.</p>
                  </div>
                  <button className="g1-bento-plus"><span className="google-symbols">add</span></button>
                </div>
                
                {/* Jules */}
                <div className="g1-bento-card g1-col-6" style={{ minHeight: '500px' }}>
                  <video muted playsInline loop autoPlay src="https://storage.googleapis.com/gweb-one-cdn/one/uploads/2cf6dc8cc5f939dd52d6433d1339cbb956a2d6ed.mp4" className="g1-bento-video" />
                  <div className="g1-bento-content">
                    <span className="g1-card-badge">Jules</span>
                    <h3>Enfócate en la visión general y<br/>envía <span className="g1-blue">funciones en tiempo récord</span></h3>
                    <p>Deja que Jules lea tu código base, entienda tu intención y aborde bugs directamente.</p>
                  </div>
                  <button className="g1-bento-plus"><span className="google-symbols">add</span></button>
                </div>
              </div>
            </div>

            {/* ═══ CTA inside modal ═══ */}
            <div style={{ textAlign: 'center', padding: '64px 24px 80px' }}>
              <h2 className="g1-section-title" style={{ marginBottom: 24 }}>¿Listo para comenzar?</h2>
              <button className="g1-discover-btn" onClick={() => { setShowShowcase(false); setTimeout(() => document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' }), 300); }}>
                <span className="google-symbols" style={{ fontSize: 20 }}>rocket_launch</span>
                Ver planes y precios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ DOWNLOADS ═══ */}
      <section className="download-section">
        <div className="grid-container">
          <div className="download-wrapper scroll-reveal">
            <div className="download-header">
              <h2>Descargar CodeAgents</h2>
              <p>Gratuito para Windows, macOS y Linux. Después, activa tu plan Ultra.</p>
            </div>
            <div className="download-grid">
              <a href="https://antigravity.google/download" className="download-card" target="_blank" rel="noopener noreferrer">
                <div className="download-icon"><span className="google-symbols">window</span></div>
                <div className="download-info">
                  <strong>Windows</strong>
                  <span>.exe — Windows 10+ (x64 / ARM64)</span>
                </div>
                <span className="google-symbols download-arrow">download</span>
              </a>
              <a href="https://antigravity.google/download" className="download-card" target="_blank" rel="noopener noreferrer">
                <div className="download-icon"><span className="google-symbols">laptop_mac</span></div>
                <div className="download-info">
                  <strong>macOS</strong>
                  <span>.dmg — macOS 12+ (Apple Silicon / Intel)</span>
                </div>
                <span className="google-symbols download-arrow">download</span>
              </a>
              <a href="https://antigravity.google/download" className="download-card download-card-full" target="_blank" rel="noopener noreferrer">
                <div className="download-icon"><span className="google-symbols">terminal</span></div>
                <div className="download-info">
                  <strong>Linux</strong>
                  <span>apt repository — Ubuntu 20.04+, Debian 10+, Fedora 36+</span>
                </div>
                <span className="google-symbols download-arrow">open_in_new</span>
              </a>
            </div>
            <p className="download-note">
              v1.20.6 · Actualizado Feb 2026 · <a href="https://antigravity.google/download" target="_blank" rel="noopener noreferrer">Ver todas las versiones →</a>
            </p>
          </div>
        </div>
      </section>

      {/* ═══ NOVEDADES / BLOG ═══ */}
      <section id="blog" className="blog-section">
        <div className="grid-container">
          <div className="section-header scroll-reveal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 400, letterSpacing: '-0.03em' }}>Últimas Novedades</h2>
            <a href="https://antigravity.google/blog" target="_blank" rel="noopener noreferrer" className="btn btn-secondary-pill" style={{ margin: 0 }}>Ver blog completo</a>
          </div>

          <div role="tabpanel" id="blog-content-panel" className="blog-cards scroll-reveal">
            {novedades.map((note, idx) => (
              <a href={note.href} target="_blank" rel="noopener noreferrer" className="featured-card" key={idx} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="img">
                  <img alt={note.title} src={note.imageSrc} />
                </div>
                <div className="texts">
                  <h3 className="heading-6">{note.title}</h3>
                  <div className="tags-section">
                    <div className="tags-caption">
                      <span className="caption">{note.date}</span>
                      <span className="caption">{note.category}</span>
                    </div>
                    <span className="button button-secondary call-to-action">
                      Leer artículo
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
      {/* ═══ ASSESSMENT (BRANCHING QUIZ) ═══ */}
      <section className="assessment-section">
        <div className="grid-container">
          <div className="assessment-box scroll-reveal">
            {(() => {
              const stepConfig = getStepConfig()
              if (stepConfig) {
                return (
                  <div className="quiz-step" key={`${quizStep}-${quizAnswers[0] || ''}`}>
                    {/* Progress bar */}
                    <div className="quiz-progress">
                      {Array.from({ length: totalSteps }).map((_, i) => (
                        <div key={i} className={`quiz-progress-dot ${i <= quizStep ? 'active' : ''} ${i < quizStep ? 'completed' : ''}`} />
                      ))}
                    </div>
                    <p className="quiz-step-count">Paso {quizStep + 1} de {totalSteps}</p>
                    <h3>{stepConfig.question}</h3>
                    <p>{stepConfig.subtitle}</p>
                    <div className="profile-options">
                      {stepConfig.options.map((opt: QuizOption) => (
                        <button
                          key={opt.value}
                          className="profile-option-btn has-desc"
                          onClick={() => {
                            const newAnswers = [...quizAnswers]
                            newAnswers[quizStep] = opt.value
                            setQuizAnswers(newAnswers)
                            setQuizStep(quizStep + 1)
                          }}
                        >
                          <span className="google-symbols" style={{ fontSize: 22, color: 'var(--accent)' }}>{opt.icon}</span>
                          <span className="option-text">
                            <strong>{opt.label}</strong>
                            {opt.desc && <small>{opt.desc}</small>}
                          </span>
                        </button>
                      ))}
                    </div>
                    {quizStep > 0 && (
                      <button className="quiz-back-btn" onClick={() => setQuizStep(quizStep - 1)}>
                        <span className="google-symbols" style={{ fontSize: 16 }}>arrow_back</span> Anterior
                      </button>
                    )}
                  </div>
                )
              }

              // Result screen
              const plan = getRecommendation()
              const profileBenefits = BENEFITS[quizAnswers[0]] || BENEFITS.dev
              return (
                <div className="recommendation-result">
                  <div className="recommendation-icon">
                    <span className="google-symbols" style={{ fontSize: 32 }}>
                      {plan === 'private' ? 'workspace_premium' : 'thumb_up'}
                    </span>
                  </div>
                  <h3>
                    {plan === 'private'
                      ? '¡Te recomendamos el Plan Privado!'
                      : '¡El Plan Compartido es perfecto para ti!'}
                  </h3>
                  <p className="recommendation-reason">{getRecommendationText()}</p>

                  {/* Profile-specific benefits */}
                  <div className="recommendation-benefits">
                    <p className="benefits-title">Lo que incluye tu plan:</p>
                    <ul className="benefits-list">
                      {profileBenefits.slice(0, 4).map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="recommendation-actions">
                    <button
                      onClick={() => handleCheckout(plan)}
                      className={`btn ${plan === 'private' ? 'btn-accent' : 'btn-primary'}`}
                      disabled={checkoutLoading}
                    >
                      {checkoutLoading ? 'Redirigiendo a Mercado Pago...' : plan === 'private'
                        ? 'Activar Plan Privado — $55/mes'
                        : 'Comenzar Compartido — $20/mes'}
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => { setQuizStep(0); setQuizAnswers([]) }}
                      style={{ fontSize: 14 }}
                    >
                      Repetir cuestionario
                    </button>
                  </div>
                  <a
                    href="#plans"
                    className="compare-plans-link"
                    onClick={(e) => {
                      e.preventDefault()
                      document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' })
                    }}
                  >
                    <span className="google-symbols" style={{ fontSize: 16 }}>compare_arrows</span>
                    Comparar ambos planes
                  </a>
                </div>
              )
            })()}
          </div>
        </div>
      </section>

      {/* ═══ DOCUMENTATION ═══ */}
      <section className="docs-section">
        <div className="grid-container">
          <div className="docs-grid scroll-reveal">
            <div className="docs-header">
              <h2>Documentación Oficial</h2>
              <p>Comienza a usar Antigravity en cuestión de minutos.</p>
              <a href="https://antigravity.google/docs" target="_blank" rel="noopener noreferrer" className="btn btn-secondary-pill" style={{ marginTop: 16 }}>Ir a los Docs</a>
            </div>
            <div className="docs-links">
              <a href="https://antigravity.google/docs/get-started" target="_blank" rel="noopener noreferrer" className="doc-link">
                <span className="google-symbols">menu_book</span>
                <div>
                  <strong>Guía de inicio rápido</strong>
                  <p>Instala, configura y lanza tu primer agente IA.</p>
                </div>
              </a>
              <a href="https://antigravity.google/docs/agents" target="_blank" rel="noopener noreferrer" className="doc-link">
                <span className="google-symbols">api</span>
                <div>
                  <strong>Referencia de Agentes</strong>
                  <p>Endpoints y métodos para interactuar con Gemini 3.1 Pro.</p>
                </div>
              </a>
              <a href="https://antigravity.google/docs/extensions" target="_blank" rel="noopener noreferrer" className="doc-link">
                <span className="google-symbols">extension</span>
                <div>
                  <strong>Extensiones y Plugins</strong>
                  <p>Conecta herramientas externas y automatiza flujos de trabajo.</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FAQ SECTION ═══ */}
      <FAQSection />

      {/* ═══ DARK CTA ═══ */}
      <div className="grid-container">
        <div className="dark-cta scroll-reveal">
          <div style={{ position: 'relative', zIndex: 2 }}>
            <h2>
              <SplitText
                text="Activa tu plan Ultra hoy"
                splitType="words"
                delay={120}
                duration={0.9}
                ease="power4.out"
                from={{ opacity: 0, y: 60, rotateX: 50 }}
                to={{ opacity: 1, y: 0, rotateX: 0 }}
                threshold={0.2}
                textAlign="center"
              />
            </h2>
            <p className="dark-cta-sub">
              <BlurText
                text="Desde $20/mes. Sin compromisos. Cancela cuando quieras."
                delay={60}
                animateBy="words"
                direction="bottom"
                stepDuration={0.3}
                className="dark-cta-blur"
              />
            </p>
            <div className="cta-buttons">
              <button onClick={() => handleCheckout('shared')} className="btn btn-primary-inverse" disabled={checkoutLoading}>{checkoutLoading ? 'Procesando...' : 'Comenzar ahora'}</button>
              <a href="https://antigravity.google/" target="_blank" rel="noopener noreferrer" className="btn btn-secondary-inverse">Conocer Antigravity</a>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ FOOTER ═══ */}
      <footer className="footer">
        <div className="grid-container">
          <div className="footer-top">
            <div className="footer-brand">
              <BrandLogo size={18}/>
              <span>CodeAgents</span>
            </div>
            <div className="footer-links">
              <a href="#" rel="noopener noreferrer">CodeAgents</a>
              <a href="https://antigravity.google/docs" target="_blank" rel="noopener noreferrer">Documentación API</a>
              <a href="https://antigravity.google/blog" target="_blank" rel="noopener noreferrer">Blog Dev</a>
              <a href="https://antigravity.google/download" target="_blank" rel="noopener noreferrer">Descargar</a>
              <a href="https://antigravity.google/pricing" target="_blank" rel="noopener noreferrer">Precios Oficiales</a>
            </div>
          </div>
          <p>© 2026 CodeAgents · Ecosistema de desarrollo IA independiente. Todos los derechos reservados.</p>
        </div>
      </footer>

      {/* ═══ EMAIL MODAL (Suscripción) ═══ */}
      {showEmailModal && (
        <div className="email-modal-overlay" onClick={() => setShowEmailModal(false)}>
          <div className="email-modal" onClick={(e) => e.stopPropagation()}>
            <button className="email-modal-close" onClick={() => setShowEmailModal(false)}>
              <span className="google-symbols">close</span>
            </button>
            <div className="email-modal-icon">
              <span className="google-symbols">autorenew</span>
            </div>
            <h3>Activar Suscripción</h3>
            <p>Ingresa tu email para configurar el cobro automático mensual. Podrás cancelar en cualquier momento.</p>
            <p className="email-modal-plan">
              Plan: <strong>{pendingSubPlan === 'private' ? 'Privado — $55 USD/mes' : 'Compartido — $20 USD/mes'}</strong>
            </p>
            <input
              type="email"
              className="email-modal-input"
              placeholder="tu@email.com"
              value={payerEmail}
              onChange={(e) => setPayerEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && confirmSubscription()}
              autoFocus
            />
            <button className="btn btn-accent email-modal-btn" onClick={confirmSubscription} disabled={checkoutLoading}>
              {checkoutLoading ? 'Procesando...' : 'Confirmar Suscripción'}
            </button>
            <p className="email-modal-disclaimer">
              <span className="google-symbols" style={{ fontSize: 14 }}>lock</span>
              Pago seguro procesado por Mercado Pago
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
