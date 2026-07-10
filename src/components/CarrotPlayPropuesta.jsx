"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useInView,
  useMotionValue,
  useSpring,
  animate,
} from "framer-motion";
import styles from "./CarrotPlayPropuesta.module.css";

const PHOTOS = {
  hero: "https://images.pexels.com/photos/32896996/pexels-photo-32896996/free-photo-of-estetica-del-padel.jpeg?auto=compress&cs=tinysrgb&w=1600",
  lineas:
    "https://images.pexels.com/photos/33634412/pexels-photo-33634412/free-photo-of-vista-abstracta-de-las-lineas-de-la-cancha-de-padel.jpeg?auto=compress&cs=tinysrgb&w=1600",
  pelota:
    "https://images.pexels.com/photos/35118461/pexels-photo-35118461/free-photo-of-pelota-de-tenis-verde-sobre-superficie-de-cancha-azul.jpeg?auto=compress&cs=tinysrgb&w=1600",
};

const EASE = [0.16, 1, 0.3, 1];

const revealVariant = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

function Reveal({ as = "div", className = "", children, ...props }) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      variants={revealVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      {...props}
    >
      {children}
    </Tag>
  );
}

function RevealGroup({ as = "div", className = "", children, ...props }) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      {...props}
    >
      {children}
    </Tag>
  );
}

function CountUp({ value, prefix = "", as = "span", className }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const shouldReduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView || shouldReduceMotion) return;
    const controls = animate(0, value, {
      duration: 1.2,
      ease: EASE,
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value, shouldReduceMotion]);

  const Tag = motion[as];
  const shown = shouldReduceMotion ? value : display;
  return (
    <Tag ref={ref} className={className}>
      {prefix}
      {shown.toLocaleString("es-AR")}
    </Tag>
  );
}

function MagneticButton({ href, className, children }) {
  const ref = useRef(null);
  const [enabled, setEnabled] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 20, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 260, damping: 20, mass: 0.4 });

  useEffect(() => {
    if (shouldReduceMotion) return;
    setEnabled(window.matchMedia("(pointer: fine)").matches);
  }, [shouldReduceMotion]);

  const handleMouseMove = (e) => {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.35);
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.35);
  };
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      className={className}
      style={enabled ? { x: springX, y: springY } : undefined}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{
        scale: 1.05,
        boxShadow: "0 0 22px rgba(146, 255, 107, 0.55)",
      }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
    >
      {children}
    </motion.a>
  );
}

function PhotoBand({ src }) {
  const ref = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    shouldReduceMotion ? [1, 1, 1] : [1.12, 1, 1.12]
  );

  return (
    <div ref={ref} className={styles.photoBand}>
      <motion.div
        className={styles.photoBandImg}
        style={{ backgroundImage: `url(${src})`, scale }}
        aria-hidden="true"
      />
      <div className={styles.photoBandOverlay} aria-hidden="true" />
    </div>
  );
}

function useActiveIndex(refs) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = refs.findIndex((r) => r.current === entry.target);
            if (idx !== -1) setActive(idx);
          }
        });
      },
      { threshold: 0.5, rootMargin: "-15% 0px -15% 0px" }
    );
    refs.forEach((r) => {
      if (r.current) observer.observe(r.current);
    });
    return () => observer.disconnect();
  }, [refs]);
  return active;
}

const SETS = [
  {
    label: "Set 1",
    tag: "Flujos",
    title: "Arquitectura de flujos",
    body: "Navegación y jerarquía separadas por rol: jugador y organizador/club.",
    deliver: "→ Mapa de flujos + wireframes de baja fidelidad",
  },
  {
    label: "Set 2",
    tag: "Identidad",
    title: "Identidad visual",
    body: "Paleta, tipografía, tono e ícono de marca, coherentes con el naming.",
    deliver: "→ Sistema de identidad aplicable",
  },
  {
    label: "Set 3",
    tag: "Sistema UI",
    title: "Sistema de componentes",
    body: "Tokens, componentes y estados aplicados sobre las pantallas clave.",
    deliver: "→ Sistema de diseño + pantallas de referencia",
  },
  {
    label: "Set 4",
    tag: "Seguimiento",
    title: "Revisión de implementación",
    body: "Feedback sobre lo que se va construyendo, a tu ritmo.",
    deliver: "→ Revisión asincrónica por entregas",
  },
];

export default function CarrotPlayPropuesta() {
  const heroRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const photoY = useTransform(
    heroProgress,
    [0, 1],
    shouldReduceMotion ? ["0%", "0%"] : ["0%", "18%"]
  );
  const linesY = useTransform(
    heroProgress,
    [0, 1],
    shouldReduceMotion ? ["0%", "0%"] : ["0%", "-12%"]
  );

  const setRef0 = useRef(null);
  const setRef1 = useRef(null);
  const setRef2 = useRef(null);
  const setRef3 = useRef(null);
  const setRefs = useMemo(
    () => [setRef0, setRef1, setRef2, setRef3],
    []
  );
  const activeSet = useActiveIndex(setRefs);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const html = document.documentElement;
    const previous = html.style.scrollBehavior;
    html.style.scrollBehavior = "smooth";
    return () => {
      html.style.scrollBehavior = previous;
    };
  }, [shouldReduceMotion]);

  return (
    <div className={styles.page}>
      <section className={styles.hero} ref={heroRef}>
        <motion.div
          className={styles.heroPhoto}
          style={{ backgroundImage: `url(${PHOTOS.hero})`, y: photoY }}
          aria-hidden="true"
        />
        <div className={styles.heroPhotoOverlay} aria-hidden="true" />
        <motion.svg
          className={styles.courtLines}
          style={{ y: linesY }}
          viewBox="0 0 920 420"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <rect
            x="20"
            y="20"
            width="880"
            height="380"
            fill="none"
            stroke="var(--chalk)"
            strokeOpacity="0.16"
            strokeWidth="2"
          />
          <line
            x1="460"
            y1="20"
            x2="460"
            y2="400"
            stroke="var(--chalk)"
            strokeOpacity="0.16"
            strokeWidth="2"
          />
          <line
            x1="20"
            y1="152"
            x2="900"
            y2="152"
            stroke="var(--chalk)"
            strokeOpacity="0.1"
            strokeWidth="1.5"
          />
          <line
            x1="20"
            y1="268"
            x2="900"
            y2="268"
            stroke="var(--chalk)"
            strokeOpacity="0.1"
            strokeWidth="1.5"
          />
          <circle cx="820" cy="70" r="3.5" fill="var(--ball)" opacity="0.6" />
        </motion.svg>
        <RevealGroup className={`${styles.wrap} ${styles.heroInner}`}>
          <motion.p variants={revealVariant} className={styles.eyebrow}>
            Propuesta de diseño · CarrotPlay
          </motion.p>
          <motion.h1 variants={revealVariant}>
            Carrot<span>Play</span>
          </motion.h1>
          <motion.p variants={revealVariant} className={styles.heroSub}>
            CarrotPlay ya resuelve la parte técnica del juego. Esta propuesta
            se ocupa de lo que todavía falta: que jugador y organizador
            encuentren su cancha propia dentro del producto, y que la marca
            se vea tan seria como el torneo que organiza.
          </motion.p>
          <motion.div variants={revealVariant} className={styles.heroMeta}>
            <span>
              <b>Sitio</b> · carrotplay.com.ar
            </span>
            <span>
              <b>Estado</b> · staging
            </span>
            <span>
              <b>Modelo</b> · packs de 5h por etapa
            </span>
          </motion.div>
        </RevealGroup>
      </section>

      <section>
        <Reveal className={styles.wrap}>
          <p className={styles.sectionTag}>Diagnóstico</p>
          <div className={styles.sectionHead}>
            <h2>
              Antes de rediseñar,
              <br />
              el estado del partido
            </h2>
          </div>
          <p className={styles.lede}>
            CarrotPlay tiene dos perfiles de uso que no se mezclan nunca:
            quien juega —reserva, se inscribe, arma ligas con amigos— y quien
            organiza —gestiona torneos, zonas y resultados. Hoy el sitio los
            trata como un único usuario genérico: mismo menú, misma home,
            mismo tono para los dos. La base mobile responde bien (las cards
            se acomodan, no hay overflow); lo que falta no es maquetado, es
            arquitectura, jerarquía e identidad.
          </p>
        </Reveal>
      </section>

      <PhotoBand src={PHOTOS.lineas} />

      <section id="puntos">
        <div className={styles.wrap}>
          <Reveal className={styles.sectionHead}>
            <h2>
              Seis puntos
              <br />a resolver
            </h2>
            <p className={styles.sectionTag}>En orden de prioridad</p>
          </Reveal>

          <RevealGroup>
            <motion.div className={styles.rally} variants={revealVariant}>
              <div className={styles.rallyNum}>1</div>
              <div className={styles.rallyBody}>
                <h3>
                  Arquitectura plana, sin distinción entre jugador y
                  organizador
                </h3>
                <div className={`${styles.rallyRow} ${styles.sol}`}>
                  <span className={`${styles.rallyLabel} ${styles.sol}`}>
                    Solución
                  </span>
                  <p>
                    Dos árboles de navegación completos según rol, definidos
                    desde el login: cada uno con su propia home, menú y
                    accesos rápidos.
                  </p>
                </div>
                <div className={`${styles.rallyRow} ${styles.ref}`}>
                  <span className={`${styles.rallyLabel} ${styles.ref}`}>
                    Referencia
                  </span>
                  <p>
                    Es el mismo criterio que usan Playtomic y Vola: cada una
                    vive del lado que le toca —reserva y ranking por acá,
                    torneos y cobros por allá— y nunca se cruzan.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div className={styles.rally} variants={revealVariant}>
              <div className={styles.rallyNum}>2</div>
              <div className={styles.rallyBody}>
                <h3>Home sin bifurcación clara entre los dos perfiles</h3>
                <div className={`${styles.rallyRow} ${styles.sol}`}>
                  <span className={`${styles.rallyLabel} ${styles.sol}`}>
                    Solución
                  </span>
                  <p>
                    Un hero corto con una sola promesa, seguido de un selector
                    explícito — &quot;Soy jugador&quot; / &quot;Organizo
                    torneos&quot; — que deriva a contenido breve y específico
                    por lado.
                  </p>
                </div>
                <div className={`${styles.rallyRow} ${styles.ref}`}>
                  <span className={`${styles.rallyLabel} ${styles.ref}`}>
                    Referencia
                  </span>
                  <p>
                    Wona, que también le habla a dos públicos distintos,
                    separa el perfil de club del de usuario desde el primer
                    login. El mensaje nunca se pisa.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div className={styles.rally} variants={revealVariant}>
              <div className={styles.rallyNum}>3</div>
              <div className={styles.rallyBody}>
                <h3>
                  Tres botones de igual peso en el hero, sin acción principal
                </h3>
                <div className={`${styles.rallyRow} ${styles.sol}`}>
                  <span className={`${styles.rallyLabel} ${styles.sol}`}>
                    Solución
                  </span>
                  <p>
                    Una acción primaria por perfil — reservar/inscribirse
                    para el jugador, crear torneo para el organizador — con
                    tratamiento visual dominante sobre el resto.
                  </p>
                </div>
                <div className={`${styles.rallyRow} ${styles.ref}`}>
                  <span className={`${styles.rallyLabel} ${styles.ref}`}>
                    Referencia
                  </span>
                  <p>
                    En Playtomic no hay dudas posibles: todo el peso visual
                    cae sobre &quot;Reservar ahora&quot;. Lo demás espera.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div className={styles.rally} variants={revealVariant}>
              <div className={styles.rallyNum}>4</div>
              <div className={styles.rallyBody}>
                <h3>
                  Cards de ranking y calendario sobrecargadas de datos
                  secundarios
                </h3>
                <div className={`${styles.rallyRow} ${styles.sol}`}>
                  <span className={`${styles.rallyLabel} ${styles.sol}`}>
                    Solución
                  </span>
                  <p>
                    Jerarquía tipográfica clara entre dato principal y
                    secundario, y menos campos visibles: lo justo para
                    decidir de un vistazo.
                  </p>
                </div>
                <div className={`${styles.rallyRow} ${styles.ref}`}>
                  <span className={`${styles.rallyLabel} ${styles.ref}`}>
                    Referencia
                  </span>
                  <p>
                    Tournify lo resuelve con tres datos por card —fecha,
                    sede, estado— y deja todo lo demás para cuando abrís el
                    detalle.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div className={styles.rally} variants={revealVariant}>
              <div className={styles.rallyNum}>5</div>
              <div className={styles.rallyBody}>
                <h3>Identidad de marca que no pasó del nombre</h3>
                <div className={`${styles.rallyRow} ${styles.sol}`}>
                  <span className={`${styles.rallyLabel} ${styles.sol}`}>
                    Solución
                  </span>
                  <p>
                    Sistema de identidad completo: paleta, tipografía, tono y
                    un ícono coherente con &quot;Carrot&quot; — hoy ausente
                    en toda la interfaz.
                  </p>
                </div>
                <div className={`${styles.rallyRow} ${styles.ref}`}>
                  <span className={`${styles.rallyLabel} ${styles.ref}`}>
                    Referencia
                  </span>
                  <p>
                    Ni Vola ni Wona improvisan acá: naming, paleta y tono se
                    repiten idénticos en cada rincón de la plataforma.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div className={styles.rally} variants={revealVariant}>
              <div className={styles.rallyNum}>6</div>
              <div className={styles.rallyBody}>
                <h3>
                  &quot;Liga de Amigos&quot; y &quot;Canchas Abiertas&quot;
                  como anuncios sueltos
                </h3>
                <div className={`${styles.rallyRow} ${styles.sol}`}>
                  <span className={`${styles.rallyLabel} ${styles.sol}`}>
                    Solución
                  </span>
                  <p>
                    Integrarlas al árbol del jugador como una categoría más
                    (&quot;cómo quiero jugar&quot;), no como banners
                    aislados en el scroll.
                  </p>
                </div>
                <div className={`${styles.rallyRow} ${styles.ref}`}>
                  <span className={`${styles.rallyLabel} ${styles.ref}`}>
                    Referencia
                  </span>
                  <p>
                    En Wona, reservas, clases y torneos conviven como
                    categorías de un mismo menú — nunca como banners sueltos.
                  </p>
                </div>
              </div>
            </motion.div>
          </RevealGroup>
        </div>
      </section>

      <section id="etapas">
        <Reveal className={styles.wrap}>
          <div className={styles.sectionHead}>
            <h2>
              El partido se juega
              <br />
              en cuatro sets
            </h2>
            <p className={styles.sectionTag}>
              Cada set se aprueba y se paga por separado
            </p>
          </div>
          <p className={styles.lede}>
            No hay set 3 comprometido si el set 1 no se jugó. Cada etapa se
            cierra, se factura, y recién ahí se abre la siguiente.
          </p>

          <div className={styles.scoreboard}>
            <div className={styles.setsStrip}>
              {SETS.map((set, i) => (
                <div
                  key={set.label}
                  className={`${styles.setTab} ${
                    activeSet === i ? styles.setTabActive : ""
                  }`}
                >
                  {set.label}
                  <b>{set.tag}</b>
                </div>
              ))}
            </div>
            <div className={styles.setPanel}>
              {SETS.map((set, i) => (
                <div
                  key={set.title}
                  ref={setRefs[i]}
                  className={`${styles.setCol} ${
                    activeSet === i ? styles.setColActive : ""
                  }`}
                >
                  <div className={styles.setColTag}>
                    {set.label} <b>{set.tag}</b>
                  </div>
                  <h4>{set.title}</h4>
                  <p>{set.body}</p>
                  <div className={styles.deliver}>{set.deliver}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <PhotoBand src={PHOTOS.pelota} />

      <section id="inversion">
        <div className={styles.wrap}>
          <Reveal className={styles.sectionHead}>
            <h2>Inversión</h2>
            <p className={styles.sectionTag}>Packs de 5 horas · USD 150 c/u</p>
          </Reveal>

          <Reveal as="p" className={styles.lede}>
            Todo se compra en packs de 5 horas y cada uno se factura antes de
            arrancarlo. Lo que ves abajo por etapa es una estimación de
            partida, no una promesa de horas exactas — se ajusta con vos a
            medida que el trabajo avanza.
          </Reveal>

          <RevealGroup className={styles.priceGrid}>
            <motion.div
              className={styles.priceCard}
              variants={revealVariant}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
            >
              <p className={styles.pk}>Etapa 1</p>
              <h3>Arquitectura de flujos</h3>
              <CountUp
                value={450}
                prefix="$"
                as="div"
                className={styles.amount}
              />
              <div className={styles.hrs}>≈ 3 packs (15h aprox.)</div>
              <p className={styles.covers}>Cubre el Set 1 completo.</p>
            </motion.div>
            <motion.div
              className={styles.priceCard}
              variants={revealVariant}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
            >
              <p className={styles.pk}>Etapa 2</p>
              <h3>Identidad visual</h3>
              <CountUp
                value={450}
                prefix="$"
                as="div"
                className={styles.amount}
              />
              <div className={styles.hrs}>≈ 3 packs (15h aprox.)</div>
              <p className={styles.covers}>Cubre el Set 2 completo.</p>
            </motion.div>
            <motion.div
              className={styles.priceCard}
              variants={revealVariant}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
            >
              <p className={styles.pk}>Etapa 3</p>
              <h3>Sistema de componentes UI</h3>
              <CountUp
                value={450}
                prefix="$"
                as="div"
                className={styles.amount}
              />
              <div className={styles.hrs}>≈ 3 packs (15h aprox.)</div>
              <p className={styles.covers}>Cubre el Set 3 completo.</p>
            </motion.div>
          </RevealGroup>

          <Reveal className={styles.totalBar}>
            <span className={styles.tLabel}>
              Estimado etapas 1 a 3 · ~9 packs
            </span>
            <span className={styles.tAmount}>
              <span>USD</span>{" "}
              <CountUp value={1350} as="span" />
            </span>
          </Reveal>

          <Reveal as="p" className={styles.etapa4Note}>
            <b>Set 4 (revisión de implementación)</b> queda afuera de esta
            estimación: se suma en packs de 5 horas, a demanda y sin
            vencimiento — porque ese tramo lo marca tu ritmo de desarrollo,
            no un cronograma cerrado.
          </Reveal>
        </div>
      </section>

      <section id="notas">
        <Reveal className={styles.wrap}>
          <div className={styles.sectionHead}>
            <h2>Notas al margen</h2>
          </div>
          <p className={styles.lede}>
            Tres cosas fuera de esta propuesta, pero que vale la pena tener
            anotadas antes de salir de staging.
          </p>
          <div className={styles.notes}>
            <div className={styles.noteRow}>
              <span className={styles.flag}>→</span>
              <p>
                El menú mobile parece fallar al tocar algunos ítems de
                navegación — conviene validarlo en dispositivo real antes
                del lanzamiento.
              </p>
            </div>
            <div className={styles.noteRow}>
              <span className={styles.flag}>→</span>
              <p>
                Hay una diferencia de fechas entre la tarjeta de un torneo
                en el listado y su ficha de detalle — a revisar como bug de
                datos.
              </p>
            </div>
            <div className={styles.noteRow}>
              <span className={styles.flag}>→</span>
              <p>
                Mientras el sitio esté online en staging, queda expuesto
                públicamente sin ningún bloqueo de acceso.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      <footer>
        <Reveal as="div" className={styles.wrap}>
          <h2>
            ¿Arrancamos
            <br />
            por el Set 1?
          </h2>
          <p>
            Sin compromiso de proyecto completo: aprobás una etapa a la vez,
            a tu ritmo.
          </p>
          <MagneticButton href="#etapas" className={styles.ctaBtn}>
            Ver las etapas de nuevo
          </MagneticButton>
          <p className={styles.footFine}>CarrotPlay · Propuesta de diseño</p>
        </Reveal>
      </footer>
    </div>
  );
}
