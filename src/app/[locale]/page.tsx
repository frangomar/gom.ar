/* eslint-disable @next/next/no-img-element -- las imágenes pasan por getImageProps (AVIF/WebP y srcset) sin sumar JS de cliente */
import type { Metadata } from "next";
import { getImageProps } from "next/image";
import { Fragment, type CSSProperties, type ReactNode } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { AppLocale, PublishedLocale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { BEHANCE_URL, CONTACT_EMAIL, LINKEDIN_URL, WHATSAPP_URL } from "@/lib/site";
import { CASES, caseTitle, type HomeCase } from "@/content/home";
import JsonLd from "@/components/JsonLd";
import TrackedLink from "@/components/TrackedLink";
import HomeFx, { type BandCase } from "@/components/home/HomeFx";
import ContactForm from "@/components/home/ContactForm";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // El layout ya validó el locale contra publishedLocales.
  const locale = (await params).locale as AppLocale;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return pageMetadata({ locale, path: "", title: t("title"), description: t("description"), siteName: t("siteName") });
}

// Letras sueltas para el rodillo; los puntos y barras van en el color de la marca.
function Roll({ text }: { text: string }) {
  return (
    <span className="roll" aria-hidden="true">
      {[...text].map((ch, i) => (
        <span className="m" key={i}>
          <span className={"./".includes(ch) ? "c dim" : "c"}>{ch}</span>
        </span>
      ))}
    </span>
  );
}

// Etiqueta de botón: las letras ruedan en hover; el lector de pantalla lee el texto entero.
function Lbl({ text }: { text: string }) {
  return (
    <>
      <span className="lbl" aria-hidden="true">
        {[...text].map((ch, i) => (
          <span className="c" style={{ "--i": i } as CSSProperties} key={i}>{ch}</span>
        ))}
      </span>
      <span className="sr">{text}</span>
    </>
  );
}

// Imagen optimizada por Next (AVIF/WebP, srcset) renderizada como <img> común, diferida.
function Img({ src, w, h, sizes, style, className }: { src: string; w: number; h: number; sizes: string; style?: CSSProperties; className?: string }) {
  const { props } = getImageProps({ src, alt: "", width: w, height: h, sizes, quality: 60 });
  return <img {...props} alt="" loading="lazy" decoding="async" style={style} className={className} />;
}

const Fill = () => <span className="fill" aria-hidden="true" />;

// Renders de Blender (design/3d) en AVIF y WebP. El still es el cuadro del medio de la secuencia de giro,
// así que cuando HomeFx monta la secuencia arriba no hay salto.
const BLANK = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
const set = (name: string, f: string, d: [string, string]) => `/3d/${name}/still.${f} ${d[0]}, /3d/${name}/still@2x.${f} ${d[1]}`;

// Objeto sobre el título: solo desktop. En mobile ninguna <source> aplica y queda el GIF vacío, sin descarga.
function Obj({ name }: { name: string }) {
  return (
    <picture className="obj" data-seq={name}>
      <source media="(min-width: 1024px)" type="image/avif" srcSet={set(name, "avif", ["1x", "2x"])} />
      <source media="(min-width: 1024px)" type="image/webp" srcSet={set(name, "webp", ["1x", "2x"])} />
      <img src={BLANK} alt="" width={240} height={240} loading="lazy" decoding="async" />
    </picture>
  );
}

function Render({ name, sizes, w, h, className, seq }: { name: string; sizes: string; w: number; h: number; className?: string; seq?: boolean }) {
  const half = [`${w / 2}w`, `${w}w`] as [string, string];
  return (
    <picture className={className} data-seq={seq ? name : undefined}>
      <source type="image/avif" srcSet={set(name, "avif", half)} sizes={sizes} />
      <img src={`/3d/${name}/still@2x.webp`} srcSet={set(name, "webp", half)} sizes={sizes} alt="" width={w} height={h} loading="lazy" decoding="async" />
    </picture>
  );
}

const WaIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.3.8 3.2.7.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2l-.4-.2Z" />
  </svg>
);

function Logo({ c, className }: { c: HomeCase; className: string }) {
  if (c.word) return <span className={`word ${className}`}>{c.word}</span>;
  return <i className={`logo ${className}`} style={{ "--src": `url(${c.logo!.src})`, "--ar": c.logo!.ar } as CSSProperties} aria-hidden="true" />;
}

function Wa({ href, text, className = "" }: { href: string; text: string; className?: string }) {
  return (
    <TrackedLink event="whatsapp_click" href={href} className={`b ${className}`} target="_blank" rel="noopener">
      <Fill />
      <WaIcon />
      <Lbl text={text} />
    </TrackedLink>
  );
}

function CaseMedia({ c }: { c: HomeCase }) {
  if (c.media === "phone" || c.media === "notebook")
    return <div className="media mock"><Render name={c.media} sizes="(max-width: 760px) 95vw, 56vw" w={1600} h={1600} seq /></div>;
  if (c.media === "wall") {
    // 4 columnas de piezas reales del feed (portadas exportadas), cada una se mueve en sentido contrario
    return (
      <div className="media wall">
        {[0, 1, 2, 3].map((k) => (
          <div className="col" data-dir={k % 2 ? 1 : -1} key={k}>
            {Array.from({ length: 9 }, (_, j) => {
              const n = String((k * 17 + j * 7) % 72).padStart(2, "0");
              return <Img key={j} src={`/home/ig/${n}.jpg`} w={420} h={525} sizes="(max-width: 760px) 30vw, 14vw" />;
            })}
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="media photo">
      <Img src={c.img!} w={1400} h={900} sizes="(max-width: 760px) 95vw, 56vw" />
    </div>
  );
}

export default async function Home({ params }: Props) {
  const locale = (await params).locale as PublishedLocale;
  setRequestLocale(locale);
  const t = await getTranslations("Home");
  const wa = `${WHATSAPP_URL}?text=${encodeURIComponent(t("waText"))}`;
  const heroCases = CASES.filter((c) => c.inHero);
  const first = heroCases[0];
  const band: BandCase[] = heroCases.map((c) => ({
    title: caseTitle(c, locale).join(""),
    brand: c.brand,
    key: c.logo?.src ?? c.word!,
    meta: c.text[locale].f,
  }));
  const logoKeys = [...new Map(heroCases.map((c) => [c.logo?.src ?? c.word!, c])).values()];
  const svc = t.raw("svc") as { t: string; p: string; l: string[] }[];

  const words = (s: string, cls: string): ReactNode =>
    s.split(" ").map((w, i) => (
      <Fragment key={i}>
        <span className={cls}>{w}</span>{" "}
      </Fragment>
    ));

  return (
    <>
      <header className="top nav">
        <a className="mark" href={`/${locale}`}>gom<span className="dim">.</span>ar</a>
        <nav aria-label={locale === "es" ? "Principal" : "Main"}>
          <a href="#casos">{t("nav.cases")}</a>
          <a href="#servicios">{t("nav.services")}</a>
          <a href="#sobre-mi">{t("nav.about")}</a>
        </nav>
        <a className="lang" href={locale === "es" ? "/en" : "/es"} hrefLang={locale === "es" ? "en" : "es"}>{locale === "es" ? "EN" : "ES"}</a>
        <Wa href={wa} text={t("whatsapp")} className="sm hide-sm" />
      </header>

      <main id="main">
        <div className="hw">
          <section className="hero">
            <div className="main" id="hmain">
              <div>
                {/* el número se arma con renders por carácter recién cuando se conoce el LCP (HomeFx) */}
                <div className="num" aria-hidden="true"><span className="digits" id="digits" /></div>
                <p className="sr" id="tsr" data-tpl={t("clockSr")} />
                <p className="cap">{t("cap")}</p>
              </div>
              <div>
                <h1>{t("h1")}</h1>
                <div className="ctas">
                  <Wa href={wa} text={t("whatsapp")} />
                  <a className="u" href="#casos"><Lbl text={t("seeCases")} /></a>
                </div>
              </div>
            </div>
            <div className="band" id="band" style={{ "--brand": first.brand } as CSSProperties}>
              <div>
                <span className="domain"><Roll text={band[0].title} /></span>
                <p className="meta" id="meta">{band[0].meta}</p>
              </div>
              <ul className="logos" id="logos">
                {logoKeys.map((c, i) => (
                  <li key={c.id} data-k={c.logo?.src ?? c.word} className={i === 0 ? "on" : undefined} style={{ "--c": c.brand } as CSSProperties}>
                    <Logo c={c} className="" />
                  </li>
                ))}
              </ul>
              <button className="pause" type="button" data-pause aria-label={t("pause")} data-play={t("play")}>
                <svg viewBox="0 0 14 14" aria-hidden="true"><rect x="2" y="1" width="3.5" height="12" fill="currentColor" /><rect x="8.5" y="1" width="3.5" height="12" fill="currentColor" /></svg>
              </button>
            </div>
          </section>
        </div>

        <section className="deck" id="casos" aria-label={t("casesLabel")}>
          {CASES.map((c) => {
            const [a, b] = caseTitle(c, locale);
            const tx = c.text[locale];
            return (
              <article className="card" key={c.id} style={{ "--brand": c.brand } as CSSProperties} data-media={c.media}>
                <div className="txt">
                  {c.obj && <Obj name={c.obj} />}
                  <Logo c={c} className="brand" />
                  <h2 className="dom roll-in" aria-label={a + b}><Roll text={a} /><Roll text={b} /></h2>
                  <p className="desc">{tx.d}</p>
                  <p className="facts">{tx.f}</p>
                  {c.live && (
                    <div className="acts">
                      <TrackedLink event="live_site_click" href={c.live} className="b" target="_blank" rel="noopener">
                        <Fill /><Lbl text={tx.live!} />
                      </TrackedLink>
                    </div>
                  )}
                </div>
                <CaseMedia c={c} />
              </article>
            );
          })}
          <div className="end" />
        </section>

        <section className="svc" id="servicios">
          <h2 className="svc-h roll-in" aria-label={(t.raw("svcTitle") as string[]).join(" ")}>
            {(t.raw("svcTitle") as string[]).map((s, i) => <Roll text={s} key={i} />)}
          </h2>
          <div className="svc-grid">
            <div className="svc-list">
              {svc.map((s, i) => (
                <article className={i === 0 ? "svc-item on" : "svc-item"} data-v={i} key={i}>
                  <SvcVisual i={i} inline />
                  <h3>{s.t}</h3>
                  <p>{s.p}</p>
                  <ul>{s.l.map((x) => <li key={x}>{x}</li>)}</ul>
                </article>
              ))}
            </div>
            <div className="vis" aria-hidden="true">
              {[0, 1, 2].map((i) => <SvcVisual i={i} key={i} />)}
            </div>
          </div>
        </section>

        <section className="s">
          <p className="big">{words(t("ai"), "w")}</p>
          <p className="lead rise">{t("aiLead")}</p>
          <div className="cols2">
            <div><h3 className="rise">{t("aiFastT")}</h3><ul>{(t.raw("aiFast") as string[]).map((x) => <li className="rise" key={x}>{x}</li>)}</ul></div>
            <div><h3 className="rise">{t("aiMineT")}</h3><ul>{(t.raw("aiMine") as string[]).map((x) => <li className="rise" key={x}>{x}</li>)}</ul></div>
          </div>
        </section>

        <section className="s" id="sobre-mi">
          <div className="about">
            <div className="face" id="face"><span className="placeholder">{t("photo")}</span></div>
            <p className="bio" id="bio">{words(t("bio"), "bw")}</p>
          </div>
        </section>

        <section className="s contact" id="contacto">
          <h2 className="giant roll-in" aria-label={(t.raw("contact") as string[]).join(" ")}>
            <Roll text={(t.raw("contact") as string[])[0]} /><br /><Roll text={(t.raw("contact") as string[])[1]} />
          </h2>
          <div className="crow">
            <div className="quick">
              <Wa href={wa} text={t("whatsapp")} className="xl" />
              <TrackedLink event="email_click" className="u" href={`mailto:${CONTACT_EMAIL}`}><Lbl text={CONTACT_EMAIL} /></TrackedLink>
              <p className="cap">{t("reply")}</p>
            </div>
            <ContactForm
              email={CONTACT_EMAIL}
              subject={t("mailSubject")}
              labels={{ name: t("fName"), email: t("fEmail"), type: t("fType"), msg: t("fMsg"), send: t("fSend"), note: t("fNote") }}
              types={t.raw("fTypes") as string[]}
            />
          </div>
        </section>
      </main>

      <footer>
        <div className="wm3d" aria-hidden="true"><Render name="wordmark" sizes="100vw" w={1600} h={560} /></div>
        <div className="fbar">
          <span>© gom.ar</span>
          <a className="u" href={LINKEDIN_URL} target="_blank" rel="noopener"><Lbl text="LinkedIn" /></a>
          <a className="u" href={BEHANCE_URL} target="_blank" rel="noopener"><Lbl text="Behance" /></a>
        </div>
      </footer>
      <TrackedLink event="whatsapp_click" href={wa} className="b fab" target="_blank" rel="noopener" aria-label={t("whatsapp")}><Fill /><WaIcon /></TrackedLink>
      <HomeFx band={band} />
      <JsonLd />
    </>
  );
}

function SvcVisual({ i, inline = false }: { i: number; inline?: boolean }) {
  const cls = `v v${i}${inline ? " vin" : ""}${i === 0 && !inline ? " on" : ""}`;
  if (i === 0) return <div className={cls}><Img src="/home/estacion-noche.jpg" w={1400} h={900} sizes="(max-width: 760px) 95vw, 46vw" /></div>;
  if (i === 1)
    return (
      <div className={cls}>
        <Img src="/home/phone-04.png" w={600} h={1301} sizes="(max-width: 760px) 34vw, 16vw" />
        <Img src="/home/phone-03.png" w={600} h={1301} sizes="(max-width: 760px) 34vw, 16vw" />
      </div>
    );
  return (
    <div className={cls}>
      {[["21", -2], ["32", -1], ["57", 2], ["48", 1], ["36", 0]].map(([n, k]) => (
        <Img key={n} src={`/home/ig/${n}.jpg`} w={420} h={525} sizes="(max-width: 760px) 44vw, 18vw" style={{ "--n": k } as CSSProperties} />
      ))}
    </div>
  );
}
