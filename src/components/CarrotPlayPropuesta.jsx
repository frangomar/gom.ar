"use client";
import { useEffect, useRef } from "react";
import styles from "./CarrotPlayPropuesta.module.css";

const PHOTOS = {
  hero: "https://images.pexels.com/photos/32896996/pexels-photo-32896996/free-photo-of-estetica-del-padel.jpeg?auto=compress&cs=tinysrgb&w=1600",
  lineas:
    "https://images.pexels.com/photos/33634412/pexels-photo-33634412/free-photo-of-vista-abstracta-de-las-lineas-de-la-cancha-de-padel.jpeg?auto=compress&cs=tinysrgb&w=1600",
  pelota:
    "https://images.pexels.com/photos/35118461/pexels-photo-35118461/free-photo-of-pelota-de-tenis-verde-sobre-superficie-de-cancha-azul.jpeg?auto=compress&cs=tinysrgb&w=1600",
};

function Reveal({ as: Tag = "div", className = "", children, ...props }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!("IntersectionObserver" in window)) {
      el.classList.add(styles.in);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.in);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    io.observe(el);

    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`${styles.reveal} ${className}`} {...props}>
      {children}
    </Tag>
  );
}

export default function CarrotPlayPropuesta() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const html = document.documentElement;
    const previous = html.style.scrollBehavior;
    html.style.scrollBehavior = "smooth";
    return () => {
      html.style.scrollBehavior = previous;
    };
  }, []);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div
          className={styles.heroPhoto}
          style={{ backgroundImage: `url(${PHOTOS.hero})` }}
          aria-hidden="true"
        />
        <div className={styles.heroPhotoOverlay} aria-hidden="true" />
        <svg
          className={styles.courtLines}
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
        </svg>
        <div className={`${styles.wrap} ${styles.heroInner}`}>
          <p className={styles.eyebrow}>Propuesta de diseño, para Nicolás</p>
          <h1>
            Carrot<span>Play</span>
          </h1>
          <p className={styles.heroSub}>
            CarrotPlay ya resuelve la parte técnica del juego. Esta propuesta
            se ocupa de lo que todavía falta: que jugador y organizador
            encuentren su cancha propia dentro del producto, y que la marca
            se vea tan seria como el torneo que organiza.
          </p>
          <div className={styles.heroMeta}>
            <span>
              <b>Sitio</b> · carrotplay.com.ar
            </span>
            <span>
              <b>Estado</b> · staging
            </span>
            <span>
              <b>Modelo</b> · pack de horas por etapas
            </span>
          </div>
        </div>
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

      <Reveal
        as="div"
        className={styles.photoBand}
        style={{ backgroundImage: `url(${PHOTOS.lineas})` }}
      >
        <div className={styles.photoBandOverlay} aria-hidden="true" />
      </Reveal>

      <section id="puntos">
        <Reveal className={styles.wrap}>
          <div className={styles.sectionHead}>
            <h2>
              Seis puntos
              <br />a resolver
            </h2>
            <p className={styles.sectionTag}>En orden de prioridad</p>
          </div>

          <div className={styles.rally}>
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
          </div>

          <div className={styles.rally}>
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
          </div>

          <div className={styles.rally}>
            <div className={styles.rallyNum}>3</div>
            <div className={styles.rallyBody}>
              <h3>Tres botones de igual peso en el hero, sin acción principal</h3>
              <div className={`${styles.rallyRow} ${styles.sol}`}>
                <span className={`${styles.rallyLabel} ${styles.sol}`}>
                  Solución
                </span>
                <p>
                  Una acción primaria por perfil — reservar/inscribirse para
                  el jugador, crear torneo para el organizador — con
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
          </div>

          <div className={styles.rally}>
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
                  secundario, y menos campos visibles: lo justo para decidir
                  de un vistazo.
                </p>
              </div>
              <div className={`${styles.rallyRow} ${styles.ref}`}>
                <span className={`${styles.rallyLabel} ${styles.ref}`}>
                  Referencia
                </span>
                <p>
                  Tournify lo resuelve con tres datos por card —fecha, sede,
                  estado— y deja todo lo demás para cuando abrís el detalle.
                </p>
              </div>
            </div>
          </div>

          <div className={styles.rally}>
            <div className={styles.rallyNum}>5</div>
            <div className={styles.rallyBody}>
              <h3>Identidad de marca que no pasó del nombre</h3>
              <div className={`${styles.rallyRow} ${styles.sol}`}>
                <span className={`${styles.rallyLabel} ${styles.sol}`}>
                  Solución
                </span>
                <p>
                  Sistema de identidad completo: paleta, tipografía, tono y
                  un ícono coherente con &quot;Carrot&quot; — hoy ausente en
                  toda la interfaz.
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
          </div>

          <div className={styles.rally}>
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
                  (&quot;cómo quiero jugar&quot;), no como banners aislados
                  en el scroll.
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
          </div>
        </Reveal>
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
              <div className={styles.setTab}>
                Set 1
                <b>Flujos</b>
              </div>
              <div className={styles.setTab}>
                Set 2
                <b>Identidad</b>
              </div>
              <div className={styles.setTab}>
                Set 3
                <b>Sistema UI</b>
              </div>
              <div className={styles.setTab}>
                Set 4
                <b>Seguimiento</b>
              </div>
            </div>
            <div className={styles.setPanel}>
              <div className={styles.setCol}>
                <div className={styles.setColTag}>
                  Set 1 <b>Flujos</b>
                </div>
                <h4>Arquitectura de flujos</h4>
                <p>
                  Navegación y jerarquía separadas por rol: jugador y
                  organizador/club.
                </p>
                <div className={styles.deliver}>
                  → Mapa de flujos + wireframes de baja fidelidad
                </div>
              </div>
              <div className={styles.setCol}>
                <div className={styles.setColTag}>
                  Set 2 <b>Identidad</b>
                </div>
                <h4>Identidad visual</h4>
                <p>
                  Paleta, tipografía, tono e ícono de marca, coherentes con
                  el naming.
                </p>
                <div className={styles.deliver}>
                  → Sistema de identidad aplicable
                </div>
              </div>
              <div className={styles.setCol}>
                <div className={styles.setColTag}>
                  Set 3 <b>Sistema UI</b>
                </div>
                <h4>Sistema de componentes</h4>
                <p>
                  Tokens, componentes y estados aplicados sobre las
                  pantallas clave.
                </p>
                <div className={styles.deliver}>
                  → Sistema de diseño + pantallas de referencia
                </div>
              </div>
              <div className={styles.setCol}>
                <div className={styles.setColTag}>
                  Set 4 <b>Seguimiento</b>
                </div>
                <h4>Revisión de implementación</h4>
                <p>Feedback sobre lo que se va construyendo, a tu ritmo.</p>
                <div className={styles.deliver}>
                  → Revisión asincrónica por entregas
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <Reveal
        as="div"
        className={styles.photoBand}
        style={{ backgroundImage: `url(${PHOTOS.pelota})` }}
      >
        <div className={styles.photoBandOverlay} aria-hidden="true" />
      </Reveal>

      <section id="inversion">
        <Reveal className={styles.wrap}>
          <div className={styles.sectionHead}>
            <h2>Inversión</h2>
            <p className={styles.sectionTag}>Pack de horas · USD 30 / hora</p>
          </div>

          <div className={styles.priceGrid}>
            <div className={styles.priceCard}>
              <p className={styles.pk}>Pack 1</p>
              <h3>Arquitectura de flujos</h3>
              <div className={styles.amount}>$450</div>
              <div className={styles.hrs}>15 horas</div>
              <p className={styles.covers}>Cubre el Set 1 completo.</p>
            </div>
            <div className={styles.priceCard}>
              <p className={styles.pk}>Pack 2</p>
              <h3>Identidad visual</h3>
              <div className={styles.amount}>$450</div>
              <div className={styles.hrs}>15 horas</div>
              <p className={styles.covers}>Cubre el Set 2 completo.</p>
            </div>
            <div className={styles.priceCard}>
              <p className={styles.pk}>Pack 3</p>
              <h3>Sistema de componentes UI</h3>
              <div className={styles.amount}>$450</div>
              <div className={styles.hrs}>15 horas</div>
              <p className={styles.covers}>Cubre el Set 3 completo.</p>
            </div>
          </div>

          <div className={styles.totalBar}>
            <span className={styles.tLabel}>Total etapas 1 a 3 · 45 horas</span>
            <span className={styles.tAmount}>
              <span>USD</span> 1.350
            </span>
          </div>

          <p className={styles.etapa4Note}>
            <b>Set 4 (revisión de implementación)</b> no entra en este
            total: se compra en packs de 5 horas (USD 150 cada uno), a
            demanda y sin vencimiento — porque ese tramo lo marca tu ritmo
            de desarrollo, no un cronograma cerrado.
          </p>
        </Reveal>
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
        <div className={styles.wrap}>
          <h2>
            ¿Arrancamos
            <br />
            por el Set 1?
          </h2>
          <p>
            Sin compromiso de proyecto completo: aprobás una etapa a la vez,
            a tu ritmo.
          </p>
          <a className={styles.ctaBtn} href="#etapas">
            Ver las etapas de nuevo
          </a>
          <p className={styles.footFine}>CarrotPlay · Propuesta de diseño</p>
        </div>
      </footer>
    </div>
  );
}
