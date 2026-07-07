'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useCart } from '@/lib/cart-store'
import CartSidebar from '@/components/CartSidebar'
import { CartBadge } from '@/components/CartCount'

const HERO_IMAGES = [
  { src: '/hero-frontal.png', alt: 'Cupula carbono frontal' },
  { src: '/diagonal.png', alt: 'Cupula carbono diagonal' },
  { src: '/lateral2.png', alt: 'Cupula carbono lateral' },
  { src: '/trasera.png', alt: 'Cupula carbono trasera' },
]

const HERO_LABELS = [
  'Vista frontal',
  'Vista diagonal',
  'Vista lateral',
  'Vista trasera',
]

const PRODUCT = {
  id: 'cupula-z900-glossy-2025',
  name: 'Cupula Forjada Carbono Z900',
  price: 15100,
  image: '/hero-frontal.png',
}

const SPECS = [
  { label: 'Material', value: 'Carbono forjado 100%' },
  { label: 'Proceso', value: 'Autoclave' },
  { label: 'Acabado', value: 'Glossy + UV400' },
  { label: 'Peso', value: '~320 g' },
  { label: 'Compatibilidad', value: 'Z900 2025 - 2026' },
  { label: 'Montaje', value: 'Bolt-on OEM' },
  { label: 'Envio', value: 'Gratis, 3-5 dias' },
]

const FEATURES = [
  {
    num: '01',
    title: 'Carbono real',
    desc: 'No es acrilico. Es fibra de carbono 100% real con patron irregular unico.',
    img: '/hero-frontal.png',
  },
  {
    num: '02',
    title: 'Ultraligera',
    desc: 'Menos peso frontal = mejor manejabilidad y respuesta en curva.',
    img: '/lateral2.png',
  },
  {
    num: '03',
    title: 'Proteccion UV',
    desc: 'Capa anti-UV integrada. No amarillea. Anos de brillo.',
    img: '/galeria-multiangulo.png',
  },
  {
    num: '04',
    title: 'Hecha a mano',
    desc: 'Laminado, corte, pulido, barnizado. Cada pieza es una obra de arte.',
    img: '/trasera.png',
  },
]

const FAQS = [
  {
    q: '¿Qué es el carbono forjado?',
    a: 'El carbono forjado es un material compuesto hecho de fibra de carbono cortada y aleatoriamente orientada, comprimido bajo alta presión. A diferencia del carbono tradicional tejido, el forjado ofrece resistencia isotrópica (igual en todas direcciones) y un acabado visual único tipo mármol.',
  },
  {
    q: '¿Es compatible con mi Kawasaki Z900?',
    a: 'Nuestra cúpula es compatible con todas las versiones de la Kawasaki Z900 desde 2020 hasta 2026, incluyendo la versión SE. Se monta directamente en los puntos de fijación originales sin necesidad de modificaciones.',
  },
  {
    q: '¿Cómo se instala?',
    a: 'El montaje es Plug & Play. Solo necesitas un destornillador Allen y 15-20 minutos. La cúpula se fija en los mismos puntos que la original. No se requieren perforaciones ni herramientas especiales.',
  },
  {
    q: '¿Cuánto tarda el envío?',
    a: 'El envío es gratuito a toda Europa. El plazo de entrega es de 3-5 días laborables. Recibirás un email con el número de tracking en cuanto salga.',
  },
  {
    q: '¿Puedo devolver el producto?',
    a: 'Sí, tienes 14 días para devolver el producto desde que lo recibes, sin necesidad de justificación. El producto debe estar en perfecto estado y con su embalaje original.',
  },
  {
    q: '¿Cuánto pesa la cúpula?',
    a: 'Nuestra cúpula de carbono forjado pesa aproximadamente 320g, significativamente más ligera que la original de plástico. Esto mejora la relación peso/potencia y la sensación al rodar.',
  },
]

function formatPrice(cents: number) {
  return (cents / 100).toFixed(2).replace('.', ',') + '\u20AC'
}

export default function Home() {
  const addItem = useCart((s) => s.addItem)

  // ── Scroll progress bar ──
  useEffect(() => {
    const bar = document.getElementById('progressBar')
    const onScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop
      const scrollHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight
      if (bar) bar.style.transform = `scaleX(${scrollTop / scrollHeight})`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ── Nav pill + WhatsApp visibility ──
  const [navVisible, setNavVisible] = useState(false)
  const [waVisible, setWaVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const y = window.pageYOffset || document.documentElement.scrollTop
      const docH = document.documentElement.scrollHeight
      const winH = window.innerHeight
      setNavVisible(y > winH * 0.5)
      setWaVisible(y + winH >= docH - winH * 0.8)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ── FAQ accordion ──
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  // ── Mobile menu ──
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  // ── Apple Hero split-slide ──
  const appleHeroRef = useRef<HTMLDivElement>(null)
  const appleInnerRef = useRef<HTMLDivElement>(null)
  const framesRef = useRef<(HTMLImageElement | null)[]>([])
  const dotsRef = useRef<(HTMLSpanElement | null)[]>([])
  const labelRef = useRef<HTMLDivElement>(null)
  const curFrame = useRef(0)
  const busy = useRef(false)

  const heroReset = useCallback((el: HTMLImageElement | null, i: number) => {
    if (!el) return
    el.className = 'apple-frame' + (i === 0 ? ' frame-first' : '')
  }, [])

  const heroGo = useCallback(
    (from: number, to: number) => {
      if (busy.current || from === to) return
      busy.current = true
      const old = framesRef.current[from]
      const nw = framesRef.current[to]
      const dir = to > from ? 'r' : 'l'

      framesRef.current.forEach((f, i) => heroReset(f, i))

      if (old) old.classList.add('exit-' + dir)
      if (nw) {
        nw.classList.add('enter-' + dir)
        void nw.offsetWidth
        nw.classList.remove('enter-' + dir)
        const posClass = to === 0 ? 'pos-c' : to % 2 === 1 ? 'pos-l' : 'pos-r'
        nw.classList.add(posClass)
      }

      dotsRef.current[from]?.classList.remove('active')
      dotsRef.current[to]?.classList.add('active')
      if (labelRef.current) labelRef.current.textContent = HERO_LABELS[to]
      curFrame.current = to

      setTimeout(() => {
        busy.current = false
      }, 550)
    },
    [heroReset]
  )

  useEffect(() => {
    const updateHero = () => {
      const hero = appleHeroRef.current
      const inner = appleInnerRef.current
      if (!hero || !inner) return

      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop
      const heroTop = hero.offsetTop
      const heroHeight = hero.offsetHeight
      const vh = window.innerHeight
      const heroBottom = heroTop + heroHeight

      if (scrollTop >= heroTop && scrollTop < heroBottom - vh) {
        inner.style.position = 'fixed'
        inner.style.top = '0'
        inner.style.left = '0'
        inner.style.width = '100%'
        inner.style.zIndex = '1'

        const scrollable = heroHeight - vh
        const progress = (scrollTop - heroTop) / scrollable
        const fi = Math.min(Math.floor(progress * 4), 3)
        if (fi !== curFrame.current) heroGo(curFrame.current, fi)
      } else if (scrollTop < heroTop) {
        inner.style.position = 'relative'
        inner.style.top = 'auto'
        inner.style.zIndex = '1'
        if (curFrame.current !== 0) {
          framesRef.current.forEach((f, i) => {
            if (f)
              f.className =
                'apple-frame' + (i === 0 ? ' frame-first pos-c' : '')
          })
          curFrame.current = 0
          dotsRef.current.forEach((d, i) => {
            if (d)
              d.className = 'apple-dot' + (i === 0 ? ' active' : '')
          })
          if (labelRef.current) labelRef.current.textContent = HERO_LABELS[0]
        }
      } else {
        inner.style.position = 'fixed'
        inner.style.top = '0'
        inner.style.left = '0'
        inner.style.width = '100%'
        inner.style.zIndex = '0'
      }
    }

    window.addEventListener('scroll', updateHero, { passive: true })
    updateHero()
    return () => window.removeEventListener('scroll', updateHero)
  }, [heroGo])

  // ── Sticky parallax ──
  const stickySectionRef = useRef<HTMLDivElement>(null)
  const stickyImgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const onScroll = () => {
      const section = stickySectionRef.current
      const img = stickyImgRef.current
      if (!section || !img) return
      const rect = section.getBoundingClientRect()
      const sectionHeight = section.offsetHeight - window.innerHeight
      const progress = -rect.top / sectionHeight
      if (progress >= 0 && progress <= 1) {
        img.style.transform = `scale(${1 + progress * 0.1}) translateY(${progress * -60}px)`
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ── Text reveal ──
  const textRevealRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = textRevealRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const words = e.target.querySelectorAll('.word')
            words.forEach((word, i) => {
              setTimeout(
                () => (word as HTMLElement).classList.add('vis'),
                i * 120
              )
            })
            const subText = (e.target as HTMLElement).nextElementSibling
            if (subText) subText.classList.add('vis')
          }
        })
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // ── Smooth anchor scroll ──
  useEffect(() => {
    const links = document.querySelectorAll('a[href^="#"]')
    const handler = (e: Event) => {
      e.preventDefault()
      const href = (e.currentTarget as HTMLAnchorElement).getAttribute('href')
      const target = document.querySelector(href || '')
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    links.forEach((a) => a.addEventListener('click', handler))
    return () => links.forEach((a) => a.removeEventListener('click', handler))
  }, [])

  // ── Add to cart ──
  const handleAddToCart = () => {
    addItem(PRODUCT)
    // Open sidebar
    const openFn = (window as unknown as Record<string, unknown>).openCart
    if (typeof openFn === 'function') openFn()
  }

  return (
    <>
      {/* Progress bar */}
      <div className="progress-bar" id="progressBar" />

      {/* Header — hamburger mobile only */}
      <header className="header transparent">
        <div
          className={`hamburger${menuOpen ? ' active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span />
          <span />
          <span />
        </div>
      </header>

      {/* Nav pill */}
      <nav className={`nav-pill${navVisible ? ' visible' : ''}`}>
        <a href="#producto">Producto</a>
        <a href="#detalles">Detalles</a>
        <a href="#specs">Specs</a>
        <a href="#comprar" className="pill-cta">
          Comprar
        </a>
        <button
          className="cart-trigger"
          onClick={() => {
            const openFn = (window as unknown as Record<string, unknown>)
              .openCart
            if (typeof openFn === 'function') openFn()
          }}
          aria-label="Abrir carrito"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
          <CartBadge className="cart-badge" />
        </button>
      </nav>

      {/* Mobile cart icon */}
      <button
        className="mobile-cart"
        onClick={() => {
          const openFn = (window as unknown as Record<string, unknown>).openCart
          if (typeof openFn === 'function') openFn()
        }}
        aria-label="Abrir carrito"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 01-8 0" />
        </svg>
        <CartBadge className="cart-badge" />
      </button>

      {/* Mobile menu */}
      <div className={`mobile-menu${menuOpen ? ' active' : ''}`}>
        <a href="#producto" className="mobile-link" onClick={closeMenu}>
          Producto
        </a>
        <a href="#detalles" className="mobile-link" onClick={closeMenu}>
          Detalles
        </a>
        <a href="#specs" className="mobile-link" onClick={closeMenu}>
          Especificaciones
        </a>
        <a
          href="#comprar"
          className="mobile-link"
          style={{ color: 'var(--green)' }}
          onClick={closeMenu}
        >
          Comprar
        </a>
      </div>

      {/* ═══════════════════════════════════════════
           HERO
           ═══════════════════════════════════════════ */}
      <div className="apple-hero" ref={appleHeroRef}>
        <div className="apple-hero-inner" ref={appleInnerRef}>
          <div className="apple-bg" />
          <div className="apple-image-container">
            {HERO_IMAGES.map((img, i) => (
              <img
                key={i}
                ref={(el) => {
                  framesRef.current[i] = el
                }}
                src={img.src}
                alt={img.alt}
                className={`apple-frame${i === 0 ? ' frame-first pos-c' : ''}`}
              />
            ))}
          </div>

          <div className="apple-dots">
            {HERO_IMAGES.map((_, i) => (
              <span
                key={i}
                ref={(el) => {
                  dotsRef.current[i] = el
                }}
                className={`apple-dot${i === 0 ? ' active' : ''}`}
              />
            ))}
          </div>

          <div className="apple-label" ref={labelRef}>
            Vista frontal
          </div>

          <div className="apple-content">
            <p className="eyebrow">Fibra de carbono forjada</p>
            <h1>
              <span className="thin">CUPULA</span>Z900
            </h1>
            <p className="desc">
              Ligereza. Resistencia. Sin concesiones.
            </p>
            <a href="#comprar" className="btn-hero">
              Comprar ahora
              <svg viewBox="0 0 14 14" fill="none">
                <path
                  d="M1 7h12M8 2l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>

          <div className="scroll-indicator">
            <div className="line" />
            Scroll
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
           MARQUEE
           ═══════════════════════════════════════════ */}
      <div className="marquee-section">
        <div className="marquee-track">
          <span>20% OFF</span>
          <span className="dot">&middot;</span>
          <span>SOLO ESTE MES</span>
          <span className="dot">&middot;</span>
          <span>ENVIO GRATIS</span>
          <span className="dot">&middot;</span>
          <span>20% OFF</span>
          <span className="dot">&middot;</span>
          <span>SOLO ESTE MES</span>
          <span className="dot">&middot;</span>
          <span>ENVIO GRATIS</span>
          <span className="dot">&middot;</span>
          <span>20% OFF</span>
          <span className="dot">&middot;</span>
          <span>SOLO ESTE MES</span>
          <span className="dot">&middot;</span>
          <span>ENVIO GRATIS</span>
          <span className="dot">&middot;</span>
          <span>20% OFF</span>
          <span className="dot">&middot;</span>
          <span>SOLO ESTE MES</span>
          <span className="dot">&middot;</span>
          <span>ENVIO GRATIS</span>
          <span className="dot">&middot;</span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
           TEXT REVEAL
           ═══════════════════════════════════════════ */}
      <section className="text-reveal-section">
        <div className="text-reveal-inner" ref={textRevealRef}>
          <h2 className="big-text">
            <span className="word">Cada</span>{' '}
            <span className="word">fibra</span>{' '}
            <span className="word">es</span>{' '}
            <span className="word" style={{ color: 'var(--gray-500)' }}>
              unica.
            </span>
          </h2>
          <p className="sub-text">
            El carbono forjado no sigue patrones. Cada pieza tiene una textura
            diferente, irrepetible. Como una huella dactilar hecha en autoclave.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
           STICKY IMAGE + PARALLAX TEXT
           ═══════════════════════════════════════════ */}
      <section className="sticky-section" id="producto" ref={stickySectionRef}>
        <div className="sticky-container">
          <div className="sticky-text">
            <p className="label">Diseno</p>
            <h3>
              Forma que <span className="thin">protege.</span>
              <br />
              Textura que <span className="thin">enamora.</span>
            </h3>
            <p className="desc">
              Moldeada a partir del original de Kawasaki. Cada curva esta
              calculada para un encaje perfecto.
            </p>
            <div className="stats">
              <div>
                <div className="stat-val">-60%</div>
                <div className="stat-label">Peso</div>
              </div>
              <div>
                <div className="stat-val">100%</div>
                <div className="stat-label">Carbono real</div>
              </div>
            </div>
          </div>
          <div className="sticky-image">
            <img
              src="/diagonal.png"
              alt="Cupula carbono vista diagonal"
              ref={stickyImgRef}
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
           SPLIT 1
           ═══════════════════════════════════════════ */}
      <section className="split-asym">
        <div className="img-side">
          <img src="/hero-frontal.png" alt="Cupula carbono frontal" />
        </div>
        <div className="text-side">
          <p className="label">Proceso</p>
          <h3>
            Moldeada en
            <br />
            <span className="thin">autoclave.</span>
          </h3>
          <p className="desc">
            Alta presion, alta temperatura, vacio absoluto. El mismo proceso
            que en competicion. Sin burbujas. Sin defectos.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
           SPLIT 2 (reverse)
           ═══════════════════════════════════════════ */}
      <section className="split-asym reverse">
        <div className="text-side">
          <p className="label">Instalacion</p>
          <h3>
            5 minutos.
            <br />
            <span className="thin">Sin herramientas especiales.</span>
          </h3>
          <p className="desc">
            Encaje directo con tornillos de fabrica. Abre, coloca, aprieta. Sin
            adaptadores, sin taladros.
          </p>
          <div className="stats">
            <div>
              <div className="stat-val">5 min</div>
              <div className="stat-label">Instalacion</div>
            </div>
            <div>
              <div className="stat-val">0</div>
              <div className="stat-label">Modificaciones</div>
            </div>
          </div>
        </div>
        <div className="img-side">
          <img src="/lateral2.png" alt="Cupula carbono lateral" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════
           FEATURES GRID
           ═══════════════════════════════════════════ */}
      <section className="features-grid" id="detalles">
        <h2 className="section-title">Por que forjado.</h2>
        {FEATURES.map((f) => (
          <div key={f.num} className="feature-card">
            <div className="card-img">
              <img src={f.img} alt={f.title} />
            </div>
            <div className="card-body">
              <p className="card-num">{f.num}</p>
              <h4>{f.title}</h4>
              <p>{f.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* ═══════════════════════════════════════════
           SPECS
           ═══════════════════════════════════════════ */}
      <section className="specs-section" id="specs">
        <div className="specs-left">
          <h2>Especificaciones.</h2>
          <p>Todo lo que necesitas saber. Sin rodeos.</p>
        </div>
        <div className="specs-right">
          {SPECS.map((s) => (
            <div key={s.label} className="spec-line">
              <span className="s-label">{s.label}</span>
              <span className="s-value">{s.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
           CTA FINAL
           ═══════════════════════════════════════════ */}
      <section className="cta-final" id="comprar">
        <div className="cta-bg">
          <div className="speed-line" />
          <div className="speed-line" />
          <div className="speed-line" />
          <div className="speed-line" />
          <div className="speed-line" />
          <div className="speed-line" />
          <div className="speed-line" />
          <div className="speed-line" />
          <div className="speed-line" />
          <div className="speed-line" />
        </div>
        <div className="cta-content">
          <div className="stock-alert">
            <span className="stock-dot" />
            Quedan <strong>2</strong> unidades &mdash;
            <em>ultima oportunidad</em>
          </div>
          <h2>¿Listo para volar?</h2>
          <div className="cta-price-row">
            <span className="big">151€</span>
            <span className="old">189€</span>
            <span className="badge">-20%</span>
          </div>
          <p className="cta-note">
            Envio gratis &middot; Pago seguro con Stripe &middot; Devolucion 14
            dias
          </p>
          <div className="cta-buttons">
            <button className="btn-cta primary" onClick={handleAddToCart}>
              Anadir al carrito
              <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
                <path
                  d="M1 7h12M8 2l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <a
              href="https://wa.me/34666666666?text=Hola%2C%20quiero%20info%20sobre%20la%20cupula%20de%20carbono%20para%20Z900"
              target="_blank"
              className="btn-cta secondary"
            >
              Preguntar por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
           FAQ
           ═══════════════════════════════════════════ */}
      <section
        style={{
          background: '#111',
          padding: '100px 24px',
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: '0 auto',
          }}
        >
          <h2
            style={{
              color: '#fff',
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 700,
              textAlign: 'center',
              marginBottom: 60,
              letterSpacing: '-0.02em',
            }}
          >
            Preguntas frecuentes.
          </h2>
          <div>
            {FAQS.map((faq, i) => {
              const isOpen = openFaq === i
              return (
                <div
                  key={i}
                  style={{
                    borderBottom:
                      i < FAQS.length - 1
                        ? '1px solid rgba(255,255,255,0.05)'
                        : 'none',
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '24px 0',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <span
                      style={{
                        color: '#fff',
                        fontSize: '1.125rem',
                        fontWeight: 600,
                        fontFamily: 'inherit',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {faq.q}
                    </span>
                    <span
                      style={{
                        flexShrink: 0,
                        marginLeft: 16,
                        color: '#8e8e93',
                        fontSize: '1.25rem',
                        fontWeight: 300,
                        transition: 'transform 0.3s ease',
                        transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                      }}
                    >
                      +
                    </span>
                  </button>
                  <div
                    style={{
                      maxHeight: isOpen ? 300 : 0,
                      overflow: 'hidden',
                      transition: 'max-height 0.35s ease',
                    }}
                  >
                    <p
                      style={{
                        color: '#8e8e93',
                        fontSize: '1rem',
                        lineHeight: 1.7,
                        margin: 0,
                        paddingBottom: 24,
                        maxWidth: 800,
                      }}
                    >
                      {faq.a}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
           FOOTER
           ═══════════════════════════════════════════ */}
      <footer className="footer">
        <span className="copy">&copy; 2026 CarbonZ</span>
        <div className="links">
          <a href="/#comprar">Tienda</a>
          <a href="/blog">Blog</a>
          <a href="/politica-privacidad">Politica de Privacidad</a>
          <a href="/terminos">Terminos</a>
          <a href="#">Instagram</a>
        </div>
      </footer>

      {/* ═══════════════════════════════════════════
           WHATSAPP
           ═══════════════════════════════════════════ */}
      <a
        href="https://wa.me/34666666666?text=Hola%2C%20quiero%20info%20sobre%20la%20cupula%20de%20carbono%20para%20Z900"
        target="_blank"
        className={`whatsapp-btn${waVisible ? ' visible' : ''}`}
      >
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>

      {/* Cart sidebar */}
      <CartSidebar />
    </>
  )
}
