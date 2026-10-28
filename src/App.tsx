import { cloneElement, isValidElement, useEffect, useRef, useState, type ReactElement, type ReactNode } from "react";
import { Menu, X, ArrowRight, ArrowLeft, ArrowUpRight, Check, Mail, MapPin, Phone, Award, Pause, Play, Sparkles, FlaskConical, Microscope, Monitor, Barcode, Keyboard, FileUp, Printer, FileCheck, PieChart, Server, RotateCcw, Workflow as WorkflowIcon, Headset, Plug, ArrowUp } from "lucide-react";
import { HERO_SLIDES, CONTACT, FORM, NAV, STATS, CERTS, PRODUCTS, DIVISIONS, CONSULT, SOLUTIONS, CLIENTS } from "./data";

const HERO_MS = 3000; // Home slider: seconds between images (3000 = 3 s)
const SOLUTION_MS = 5000; // Solutions tabs: time per tab (5000 = 5 s)
const DIVISION_MS = 12000; // Divisions: reading time per division (12000 = 12 s)

/** Embedded laboratory illustration (inline SVG, no file needed). */
function LabArt() {
  return (
    <svg viewBox="0 0 480 400" className="h-full w-full" role="img" aria-label="Laboratory illustration">
      <rect width="480" height="400" fill="#f3ead6" />
      <circle cx="390" cy="80" r="150" fill="#0a7d5a" opacity=".1" /><circle cx="70" cy="330" r="110" fill="#e34234" opacity=".09" />
      <rect x="40" y="36" width="250" height="150" rx="16" fill="#fff" stroke="#0a7d5a" strokeOpacity=".25" />
      <rect x="58" y="54" width="90" height="10" rx="5" fill="#1b2a23" opacity=".75" />
      {[[62, 60], [100, 90], [138, 72], [176, 112], [214, 96]].map(([x, h], i) => <rect key={i} x={x} y={170 - h} width="24" height={h} rx="5" fill={i === 3 ? "#e34234" : "#0a7d5a"} />)}
      <path d="M58 118 C100 84 140 130 190 92 S250 80 274 64" fill="none" stroke="#e34234" strokeWidth="3" strokeLinecap="round" />
      <rect x="310" y="40" width="130" height="86" rx="14" fill="#065f46" /><path d="M326 100l22-26 20 14 24-34 28 22" fill="none" stroke="#fbf6ea" strokeWidth="3" strokeLinecap="round" /><circle cx="418" cy="68" r="5" fill="#e34234" />
      <rect x="20" y="318" width="440" height="14" rx="7" fill="#1b2a23" opacity=".85" />
      <path d="M96 318V268L62 214c-6-10 0-18 10-18h60c10 0 16 8 10 18l-34 54v50" fill="#fff" stroke="#1b2a23" strokeWidth="3" strokeLinejoin="round" />
      <path d="M72 236h50l22 34c2 4-1 6-4 6H66c-3 0-6-2-4-6z" fill="#0a7d5a" opacity=".85" transform="translate(0 20)" />
      {[[190, "#0a7d5a"], [222, "#e34234"], [254, "#0a7d5a"]].map(([x, c], i) => <g key={i}><rect x={x as number} y="226" width="22" height="92" rx="11" fill="#fff" stroke="#1b2a23" strokeWidth="3" /><rect x={(x as number) + 4} y={256 - i * 6} width="14" height={58 + i * 6} rx="7" fill={c as string} /></g>)}
      <path d="M350 318v-30h50v30M340 288h70M375 288V230a34 34 0 1 1 28 -34M398 200l30-30" fill="none" stroke="#1b2a23" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="428" cy="166" r="9" fill="#e34234" />
    </svg>
  );
}

/** Shows a photo from /public/images, or the built-in lab illustration if the file is missing. */
function PhotoOrArt({ src, alt, eager }: { src?: string; alt: string; eager?: boolean }) {
  const [bad, setBad] = useState(!src);
  return bad ? <LabArt /> : <img src={src} alt={alt} onError={() => setBad(true)} loading={eager ? "eager" : "lazy"} decoding="async" className="h-full w-full object-cover" />;
}

/** Hero: auto-changing slides with crossfade, slow zoom and glass caption. Edit HERO_SLIDES in data.tsx. */
function HeroSlider() {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((v) => (v + 1) % HERO_SLIDES.length), HERO_MS); return () => clearInterval(t); }, []);
  const s = HERO_SLIDES[i];
  return (
    <div className="relative aspect-[6/5] overflow-hidden rounded-[2rem] border border-white/70 bg-ivory-2 shadow-2xl shadow-emerald-deep/25">
      {HERO_SLIDES.map((x, k) => (
        <div key={k} className={`absolute inset-0 transition-opacity duration-1000 ${k === i ? "opacity-100" : "opacity-0"}`}>
          <div className="kenburns h-full w-full"><PhotoOrArt src={x.src} alt={x.title} eager={k === 0} /></div>
        </div>))}
      <div className="float absolute right-4 top-4 rounded-full border border-white/70 bg-ivory/60 px-4 py-2 text-xs font-extrabold text-emerald-deep backdrop-blur-xl">☁ Cloud · 3-day go-live</div>
      <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/70 bg-ivory/55 p-5 shadow-xl backdrop-blur-xl">
        <div key={i} className="rise"><h3 className="font-display text-xl font-bold">{s.title}</h3><p className="mt-1 text-sm text-ink/75">{s.text}</p></div>
        <div className="mt-3 flex gap-2">{HERO_SLIDES.map((_, k) => <button key={k} aria-label={`Slide ${k + 1}`} onClick={() => setI(k)} className={`relative h-1.5 rounded-full before:absolute before:-inset-x-1 before:-inset-y-3 before:content-[''] transition-[width,background-color] duration-300 ${k === i ? "w-8 bg-vermilion" : "w-3 bg-emerald/40"}`} />)}</div>
      </div>
    </div>
  );
}

/** Counts from 0 up to `to` when scrolled into view. */
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [v, setV] = useState(0);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { setV(to); return; }
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; io.disconnect();
      const t0 = performance.now();
      const tick = (t: number) => { const p = Math.min((t - t0) / 2200, 1); setV(Math.round(to * (1 - Math.pow(1 - p, 3)))); if (p < 1) raf = requestAnimationFrame(tick); };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(ref.current!);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [to]);
  return <span ref={ref}>{v}{suffix}</span>;
}

/** Glass stat cards over an emerald backdrop. Edit STATS in data.tsx. */
function Stats() {
  return (
    <div className="mx-auto max-w-7xl px-5 pb-16">
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-deep via-emerald to-emerald-deep p-6 md:p-8">
        <span className="float absolute -left-10 -top-10 h-52 w-52 rounded-full bg-vermilion/70 blur-3xl" />
        <span className="absolute -bottom-14 right-10 h-60 w-60 rounded-full bg-ivory/30 blur-3xl" />
        <div className="relative grid grid-cols-2 gap-4 md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-2xl border border-white/30 bg-white/15 p-6 text-center text-white shadow-lg backdrop-blur-xl">
              <div className="font-display text-4xl font-bold tabular-nums md:text-5xl"><Counter to={s.to} suffix={s.suffix} /></div>
              <div className="mt-2 text-sm font-semibold text-ivory/85">{s.label}</div>
            </div>))}
        </div>
      </div>
    </div>
  );
}

const CLOUD = "M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z";

/** About-us visual: the Kriti Smart LIMS cloud syncing with labs, instruments, ERP and the customer portal. */
function CloudArt() {
  const chip = (x: number, y: number, t: string, c: string) => (
    <g key={t}><rect x={x} y={y - 22} width="156" height="44" rx="22" fill="#fff" fillOpacity=".88" stroke="#0a7d5a" strokeOpacity=".25" />
      <circle cx={x + 24} cy={y} r="6" fill={c} /><text x={x + 40} y={y + 5.5} fontSize="15" fontWeight="700" fill="#1b2a23">{t}</text></g>);
  return (
    <div className="dots relative overflow-hidden rounded-3xl border border-white/70 bg-gradient-to-br from-white/80 to-ivory-2 p-4 shadow-xl shadow-emerald-deep/15">
      <svg viewBox="0 0 640 340" className="w-full" role="img" aria-label="Kriti Smart LIMS cloud connected to laboratories, instruments, ERP and customer portal">
        <defs><linearGradient id="cg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#0a7d5a" /><stop offset="1" stopColor="#065f46" /></linearGradient></defs>
        <g className="drift"><path d={CLOUD} transform="translate(236 14) scale(2.4)" fill="#fff" fillOpacity=".95" /></g>
        <g className="drift" style={{ animationDelay: "-6s" }}><path d={CLOUD} transform="translate(300 286) scale(1.7)" fill="#fff" fillOpacity=".9" /></g>
        {["M160 60C215 60 215 140 262 150", "M160 170H262", "M160 280C215 280 215 200 262 190"].map((d) => <path key={d} d={d} className="flow" fill="none" stroke="#0a7d5a" strokeWidth="2.5" strokeLinecap="round" />)}
        {["M480 60C425 60 425 140 378 150", "M480 170H378", "M480 280C425 280 425 200 378 190"].map((d) => <path key={d} d={d} className="flow" fill="none" stroke="#e34234" strokeWidth="2.5" strokeLinecap="round" />)}
        <circle cx="320" cy="170" r="112" fill="#0a7d5a" fillOpacity=".18" className="pulse" />
        <g className="float">
          <path d={CLOUD} transform="translate(320 170) scale(8) translate(-12 -12)" fill="url(#cg)" stroke="#fff" strokeWidth=".35" />
          <text x="320" y="172" textAnchor="middle" fontSize="18" fontWeight="800" fill="#fbf6ea">Kriti Smart LIMS</text>
          <text x="320" y="192" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fbf6ea" opacity=".85">CLOUD · ISO 27001</text>
          <circle cx="394" cy="148" r="6" fill="#e34234" /><circle cx="394" cy="148" r="6" fill="#e34234" className="pulse" />
        </g>
        {chip(4, 60, "Food Labs", "#0a7d5a")}{chip(4, 170, "Textile Labs", "#0a7d5a")}{chip(4, 280, "Env. Labs", "#0a7d5a")}
        {chip(480, 60, "Instruments", "#e34234")}{chip(480, 170, "SAP / ERP", "#e34234")}{chip(480, 280, "Client Portal", "#e34234")}
      </svg>
      <div className="mt-1 flex flex-wrap justify-center gap-2 text-xs font-bold">
        {["Public · Private · Hybrid cloud", "24x7 support", "Go live in 3 days"].map((t) => <span key={t} className="rounded-full border border-white/70 bg-white/60 px-3 py-1 text-emerald-deep backdrop-blur">{t}</span>)}
      </div>
    </div>
  );
}

const Head = ({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) => (
  <div className="mx-auto mb-12 max-w-3xl text-center"><p className="eyebrow">{eyebrow}</p>
    <h2 className="mt-3 font-display text-4xl font-bold leading-tight md:text-5xl">{title}</h2>{sub && <p className="mt-4 text-lg text-ink/70">{sub}</p>}</div>
);
const Item = ({ t }: { t: string }) => { const [a, ...b] = t.split(": "); return (
  <li className="flex gap-3"><Check className="mt-1 shrink-0 text-emerald" size={18} /><span>{b.length ? <><b>{a}:</b> {b.join(": ")}</> : a}</span></li>); };

const PILLARS = [
  { icon: <WorkflowIcon />, title: "Enterprise BPM", text: "Business process management solutions that make laboratory operations uniform, efficient and resource-optimised." },
  { icon: <FlaskConical />, title: "Digital LIMS", text: "Built for ISO 17025:2017 accredited laboratories: compliance, automation and digital transformation." },
  { icon: <Headset />, title: "24x7 service team", text: "Experts in IT infrastructure, networking and cloud keep your laboratory running around the clock." },
  { icon: <Plug />, title: "Integration & APIs", text: "Laboratory instruments, SAP / ERP and other systems connected, with APIs by multi-technology experts." },
];

/** Mini visuals for the five smaller product cards. Each hints at what the product does and plays once when the grid scrolls into view. */
function Mini({ i, seen }: { i: number; seen: boolean }) {
  if (i === 1) return <div className="flex h-14 items-end gap-2" aria-hidden>{[55, 85, 40, 70].map((h, k) => <span key={k} className={`w-5 rounded-t-md bg-gradient-to-t from-emerald to-[#3bc79a] ${seen ? "grow" : "opacity-0"}`} style={{ height: `${h}%`, animationDelay: `${500 + k * 70}ms` }} />)}<span className="ml-2 pb-0.5 text-xs font-bold text-ink/55">Stock levels</span></div>;
  if (i === 2) return (
    <svg viewBox="0 0 100 52" className="h-14 w-28" aria-hidden>
      <path d="M10 46A40 40 0 0 1 90 46" fill="none" stroke="rgba(10,125,90,.22)" strokeWidth="7" strokeLinecap="round" />
      {[-60, -30, 0, 30, 60].map((r) => <line key={r} x1="50" y1="9" x2="50" y2="14" stroke="#0a7d5a" strokeWidth="2" strokeLinecap="round" transform={`rotate(${r} 50 46)`} />)}
      <line x1="50" y1="46" x2="50" y2="18" stroke="#1b2a23" strokeWidth="3" strokeLinecap="round" className={seen ? "needle" : ""} style={{ transform: "rotate(-70deg)", transformOrigin: "50px 46px" }} /><circle cx="50" cy="46" r="5" fill="#e34234" />
    </svg>);
  if (i === 3) return <ul className="space-y-1.5 text-xs font-bold" aria-hidden>{["Request logged", "Result published"].map((t, k) => <li key={t} className={`flex w-fit items-center gap-1.5 rounded-full border border-white/80 bg-white/60 px-3 py-1 text-emerald-deep ${seen ? "rise" : "opacity-0"}`} style={{ animationDelay: `${600 + k * 500}ms` }}><Check size={12} />{t}</li>)}</ul>;
  if (i === 4) return <svg viewBox="0 0 120 40" className="h-12 w-32" aria-hidden><rect x="2" y="12" width="16" height="16" rx="4" fill="#0a7d5a" /><path d="M20 20H80" stroke="#0a7d5a" strokeWidth="2" strokeLinecap="round" className="flow" /><path d="M84 12v16c0 3 6 5 14 5s14-2 14-5V12z" fill="#065f46" /><ellipse cx="98" cy="12" rx="14" ry="5" fill="#3bc79a" /></svg>;
  return <svg viewBox="0 0 120 40" className="h-12 w-32" aria-hidden><path d="M2 34L24 26L44 30L68 16L90 20L116 5" fill="none" stroke="#e34234" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" pathLength="1" className={seen ? "draw" : ""} style={seen ? undefined : { strokeDasharray: 1, strokeDashoffset: 1 }} /><circle cx="116" cy="5" r="4" fill="#e34234" className={seen ? "pop" : "opacity-0"} style={{ animationDelay: "1.4s" }} /></svg>;
}

/** Contact graphic: Trivandrum (head office and development center) linked to San Jose by a dashed line that keeps moving. */
function OfficeLink() {
  const arc = "M70 92C150 -10 270 -10 350 92";
  return (
    <div className="glass mt-6"><div className="relative p-5">
      <svg viewBox="0 0 420 130" className="w-full" role="img" aria-label="Trivandrum, India connected to San Jose, USA">
        <path d={arc} fill="none" stroke="rgba(10,125,90,.25)" strokeWidth="2" /><path d={arc} fill="none" stroke="#e34234" strokeWidth="2.5" strokeLinecap="round" className="flow" />
        <circle cx="70" cy="92" r="16" fill="#0a7d5a" fillOpacity=".2" className="pulse" /><circle cx="70" cy="92" r="7" fill="#0a7d5a" /><circle cx="87" cy="101" r="4" fill="#3bc79a" />
        <circle cx="350" cy="92" r="16" fill="#e34234" fillOpacity=".2" className="pulse" /><circle cx="350" cy="92" r="7" fill="#e34234" />
        <text x="70" y="124" textAnchor="middle" fontSize="13" fontWeight="700" fill="#1b2a23">Trivandrum, India</text><text x="350" y="124" textAnchor="middle" fontSize="13" fontWeight="700" fill="#1b2a23">San Jose, USA</text>
      </svg>
      <p className="mt-1 text-center text-sm font-semibold text-ink/65">Head office and development center in Trivandrum, with Kritisoft LLC in San Jose.</p>
    </div></div>);
}

/** Sunrise-horizon band after Home: deep emerald night, grainy emerald glow, vermilion sunrise. */
function Horizon() {
  return (
    <section aria-label="Kritisoft at a glance" className="px-3 pb-8 md:px-8">
      <div className="relative isolate min-h-[540px] overflow-hidden rounded-[2.5rem] bg-[#06231b] text-center">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 155% 100% at 50% 142%, #fbf6ea 54%, rgba(251,246,234,0) 66%), radial-gradient(48% 24% at 50% 74%, rgba(227,66,52,.55), transparent 72%), radial-gradient(ellipse 172% 112% at 50% 142%, transparent 50%, #0a7d5a 64%, #065f46 76%, transparent 92%)" }} />
        <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full opacity-40 mix-blend-overlay"><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter><rect width="100%" height="100%" filter="url(#grain)" /></svg>
        {Array.from({ length: 22 }, (_, i) => { const h = (n: number) => { const x = Math.sin(i * 91.7 + n * 12.3) * 43758.5; return x - Math.floor(x); }; const sz = 1 + Math.round(h(3) * 2); return <i key={i} aria-hidden className="star absolute rounded-full bg-white" style={{ left: `${h(1) * 96 + 2}%`, top: `${h(2) * 48 + 3}%`, width: sz, height: sz, animationDelay: `${h(4) * 6}s`, animationDuration: `${4 + h(5) * 4}s` }} />; })}
        <div className="relative z-10 mx-auto max-w-3xl px-6 pt-14">
          <p className="eyebrow !text-[#ff8a7d]">Since 2000 · 350+ laboratories</p>
          <h2 className="mt-4 font-display text-4xl font-bold leading-tight text-ivory md:text-5xl">One smart cloud for every sample, result and report.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-ivory/75">Kritisoft builds laboratory software that carries a sample from intake to invoice, trusted by laboratories across India, the Middle East and Southeast Asia.</p>
          <a href="#solutions" className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 font-bold text-ivory backdrop-blur-xl transition hover:bg-vermilion">Explore solutions <ArrowRight size={18} /></a>
        </div>
      </div>
    </section>
  );
}

/** Flowing emerald-to-vermilion wave that opens the Contact section. */
function ContactWave() {
  const c = "M0 70C160 18 300 112 520 80S860 18 1060 60S1340 112 1440 54";
  return (
    <div aria-hidden className="relative h-20 md:h-28">
      <svg viewBox="0 0 1440 130" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <defs><linearGradient id="wg" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stopColor="#0a7d5a" /><stop offset=".55" stopColor="#e34234" /><stop offset="1" stopColor="#0a7d5a" /></linearGradient></defs>
        <path d={`${c}L1440 0L0 0Z`} fill="#f3ead6" fillOpacity=".6" />
        <path d={c} fill="none" stroke="url(#wg)" strokeWidth="16" opacity=".2" style={{ filter: "blur(8px)" }} vectorEffect="non-scaling-stroke" />
        <path d={c} fill="none" stroke="url(#wg)" strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        <g className="sway"><path d={c} transform="translate(0 16)" fill="none" stroke="#0a7d5a" strokeOpacity=".4" strokeWidth="2.5" strokeDasharray="1 11" strokeLinecap="round" vectorEffect="non-scaling-stroke" /></g>
      </svg>
    </div>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const bar = useRef<HTMLSpanElement>(null);
  /** Reading-progress line under the header, and the link of the section currently on screen. */
  useEffect(() => {
    let raf = 0;
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => { const h = document.documentElement; if (bar.current) bar.current.style.transform = `scaleX(${h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)})`; }); };
    window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: "-45% 0px -50% 0px" });
    NAV.forEach((n) => { const el = document.getElementById(n.toLowerCase()); if (el) io.observe(el); });
    return () => { window.removeEventListener("scroll", onScroll); io.disconnect(); cancelAnimationFrame(raf); };
  }, []);
  return (
    <header className="sticky top-0 z-50 border-b border-emerald/10 bg-ivory/85 backdrop-blur-lg">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
        <a href="#home"><img src="/images/logo.png" alt="Kritisoft – the Online Software people" className="h-12 w-auto" /></a>
        <ul className="hidden items-center gap-7 text-sm font-semibold lg:flex">
          {NAV.map((n) => <li key={n}><a href={`#${n.toLowerCase()}`} aria-current={active === n.toLowerCase() ? "true" : undefined} className={`relative transition-colors hover:text-vermilion-ink after:absolute after:inset-x-0 after:-bottom-1.5 after:h-0.5 after:origin-left after:rounded-full after:bg-vermilion after:transition-transform after:duration-200 ${active === n.toLowerCase() ? "text-emerald after:scale-x-100" : "after:scale-x-0"}`}>{n}</a></li>)}
          <li><a href="#contact" className="rounded-full bg-vermilion px-5 py-2.5 text-white shadow-lg shadow-vermilion/25 transition hover:bg-emerald">Request a Demo</a></li>
        </ul>
        <button className="lg:hidden" aria-label="Menu" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      </nav>
      {open && <ul className="menu-in space-y-1 border-t border-emerald/10 bg-ivory px-5 py-3 lg:hidden">{NAV.map((n) => <li key={n}><a onClick={() => setOpen(false)} href={`#${n.toLowerCase()}`} className="block py-2 font-semibold">{n}</a></li>)}</ul>}
      <span ref={bar} aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-gradient-to-r from-emerald via-[#3bc79a] to-vermilion" style={{ transform: "scaleX(0)" }} />
    </header>
  );
}

/** Hero background: a mosaic of soft, glassy tiles glowing emerald and mint, with a warm vermilion corner and a white V-notch at the top.
 *  Change cols/rows/tile size or the colours below. Tiles fade out toward the bottom of the hero. */
function TileField() {
  const cols = 32, rows = 16, s = 46;
  const hash = (a: number, b: number) => { const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return x - Math.floor(x); };
  const cells: { c: number; r: number; op: number; fill: string; pulse: boolean; d: number }[] = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const x = c / (cols - 1), y = r / (rows - 1);
    const g1 = Math.exp(-(((x - 0.76) / 0.27) ** 2 + ((y - 0.45) / 0.4) ** 2)); // main emerald glow
    const g2 = Math.exp(-(((x - 0.1) / 0.2) ** 2 + ((y - 0.8) / 0.28) ** 2)); // warm corner glow
    const notch = y < 0.45 ? Math.max(0, 1 - Math.abs(x - 0.5) / (0.05 + 0.32 * y)) : 0; // white V at the top centre
    const v = Math.min(1, g1 * (1 - 0.85 * notch) * (0.75 + 0.5 * hash(c, r)) + 0.1 * hash(r, c));
    const warm = g2 > 0.3 && hash(c + 9, r) > 0.35;
    cells.push({ c, r, op: warm ? 0.15 + 0.5 * g2 : (0.06 + 0.6 * v) * (0.3 + 0.7 * Math.min(1, Math.max(0, (x - 0.15) / 0.45))), fill: warm ? "#ff8a7d" : v < 0.3 ? "#9be3c8" : v < 0.6 ? "#3bc79a" : "#0a7d5a", pulse: hash(c * 7, r * 3) > 0.94, d: hash(r, c * 5) * 6 });
  }
  const tiles = (edge: boolean) => cells.map((t) => <rect key={`${t.c}-${t.r}`} x={t.c * s + 2.5} y={t.r * s + 2.5} width={s - 5} height={s - 5} rx="8" fill={t.fill} opacity={t.op} className={edge && t.pulse ? "tile-pulse" : undefined} style={edge && t.pulse ? { animationDelay: `${t.d}s` } : undefined} stroke={edge ? "rgba(255,255,255,.7)" : "none"} strokeWidth="1.5" />);
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 [mask-image:linear-gradient(180deg,#000_55%,transparent_100%)]">
      <svg viewBox={`0 0 ${cols * s} ${rows * s}`} preserveAspectRatio="xMidYMin slice" className="h-full w-full">
        <defs><filter id="tglow" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="16" /></filter></defs>
        <g filter="url(#tglow)">{tiles(false)}</g>
        <g>{tiles(true)}</g>
      </svg>
    </div>
  );
}

function Hero() {
  return (
    <section id="home" className="relative isolate overflow-hidden"><TileField />
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-2 lg:py-28">
        <div className="rise">
          <p className="eyebrow">Kritisoft · Since 2000 · ISO 9001 · ISO 27001</p>
          <h1 className="mt-4 font-display text-5xl font-bold leading-[1.05] md:text-6xl">Enterprise <span className="text-emerald">Kriti Smart LIMS</span> for the digital-era laboratory<span className="text-vermilion-ink">.</span></h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/75">A comprehensive Laboratory Information Management solution for configuration, implementation and support across multiple industry verticals, backed by a team with two decades of proven expertise.</p>
          <p className="mt-3 max-w-xl text-ink/65">Feature-rich, cloud-based and easy to configure, built on a robust open-source platform.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#contact" className="inline-flex items-center gap-2 rounded-full bg-vermilion px-7 py-3.5 font-bold text-white shadow-lg shadow-vermilion/30 transition hover:-translate-y-0.5">Request a Demo <ArrowRight size={18} /></a>
            <a href="#solutions" className="rounded-full border-2 border-emerald px-7 py-3.5 font-bold text-emerald transition hover:bg-emerald hover:text-white">Explore Solutions</a>
          </div>
        </div>
        <HeroSlider />
      </div>
      <Stats />
    </section>
  );
}

function About() {
  const [ref, seen] = useInView<HTMLDivElement>();
  return (
    <section id="about" className="bg-ivory-2/60 py-24"><div className="mx-auto max-w-7xl px-5">
      <Head eyebrow="About us" title="Two decades of building laboratory software" />
      <div className="grid items-start gap-10 lg:grid-cols-2">
        <div className="space-y-5 text-lg leading-relaxed text-ink/75">
          <p className="border-l-4 border-vermilion pl-5 font-display text-2xl font-medium leading-snug text-ink">KRITI Microsystems, known by its brand name <b className="text-ink">Kritisoft</b>, is an Indian IT Solutions and Services provider established in the year 2000, led by professionals with deep expertise in product development and a strong vision for emerging technology trends.</p>
          <p>A team of skilled engineers, each with more than a decade of experience, drives innovation in cloud and on-premise installations and deployments.</p>
          <p><b className="text-ink">Core focus:</b> Enterprise Business Process Management (BPM) solutions that help corporate laboratories achieve uniform, efficient and resource-optimized operations.</p>
          <p>The <b className="text-ink">LIMS Division</b> develops digital LIMS for ISO 17025:2017 accredited laboratories, enabling compliance, automation and digital transformation, trusted by corporate, public sector and government institutions worldwide.</p>
          <p>A dedicated 24x7 service team, supported by experts in IT infrastructure, networking and cloud, also handles integration of laboratory instruments, SAP / ERP and other business systems, with API development by multi-technology experts.</p>
        </div>
        <div className="space-y-5">
          <CloudArt />
          <div className="grid gap-4 sm:grid-cols-3">{CERTS.map(([a, b]) => <div key={a} onMouseMove={spot} className="glass p-4"><Award className="text-vermilion-ink" /><div className="mt-2 font-bold">{a}</div><div className="text-xs text-ink/65">{b}</div></div>)}</div>
          <div className="glass"><div className="relative flex gap-4 p-6"><span className="absolute inset-y-5 left-0 w-1 rounded-r-full bg-vermilion" /><span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-gradient-to-br from-emerald to-emerald-deep font-display text-lg font-bold text-white ring-4 ring-white/70">MN</span><div><p className="eyebrow">Leadership</p><p className="mt-2 text-ink/75"><b>M. Nahas</b>, CEO of Kriti Microsystems, is a social entrepreneur and the promoter of Kritisoft, backed by a professional team with 20+ years in project and resource management, delivering within budget and timeline.</p></div></div></div>
        </div>
      </div>
      <div ref={ref} className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {PILLARS.map((p, i) => (
          <div key={p.title} className={seen ? "rise" : "opacity-0"} style={{ animationDelay: `${i * 70}ms` }}>
            <article onMouseMove={spot} className="glass group h-full"><div className="relative p-6">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-emerald to-emerald-deep text-white shadow-lg ring-1 ring-white/60 transition duration-500 group-hover:-rotate-6 group-hover:scale-110">{p.icon}</span>
              <h3 className="mt-4 font-display text-xl font-bold">{p.title}</h3><p className="mt-2 text-ink/70">{p.text}</p>
            </div></article>
          </div>))}
      </div>
    </div></section>
  );
}

/** Reveals once when scrolled into view. */
function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.15 });
    io.observe(ref.current!);
    return () => io.disconnect();
  }, []);
  return [ref, seen] as const;
}
/** Makes an icon bigger (icons in data.tsx default to size 24). */
const big = (n: ReactNode, s: number) => (isValidElement(n) ? cloneElement(n as ReactElement<{ size?: number }>, { size: s }) : n);
/** Moves the glass spotlight to the mouse position. */
const spot = (e: React.MouseEvent<HTMLElement>) => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`); e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`); };

const NODES = ["Registration", "Reception", "Preparation", "Work allocation", "Testing", "Validation", "Approval", "Reporting", "Archival"];
const ROW_H = [44, 44, 44, 44, 96, 44, 44, 96, 44]; // row heights in px on desktop (Testing and Reporting hold stacked side items)
type Side = [number, "L" | "R", "in" | "out", string, ReactNode];
/** Side items of the LIMS workflow: [row, left/right, input/output, label, icon]. Row 0 = Registration ... row 8 = Archival. */
const SIDE: Side[] = [
  [0, "L", "in", "Other computers", <Monitor size={14} />], [1, "L", "in", "Bar codes", <Barcode size={14} />], [2, "L", "in", "Sample", <FlaskConical size={14} />],
  [4, "L", "in", "Instruments", <Microscope size={14} />], [4, "L", "in", "Keyboard", <Keyboard size={14} />], [4, "L", "in", "File transfer", <FileUp size={14} />],
  [7, "L", "out", "C of A", <FileCheck size={14} />], [8, "L", "out", "Statistics & graphs", <PieChart size={14} />],
  [0, "R", "out", "Labels", <Printer size={14} />], [3, "R", "out", "Worklists", <Printer size={14} />],
  [7, "R", "out", "Ad hoc", <Printer size={14} />], [7, "R", "out", "Management", <Printer size={14} />], [7, "R", "out", "Summary", <Printer size={14} />],
  [8, "R", "out", "Other computers", <Server size={14} />],
];

/** The LIMS workflow diagram on a refracted blue glass panel. A highlight walks through the nine stages (Registration to Archival),
 *  lighting each input and output as it goes, with the Re-test loop flashing at Validation. Speed = the 950 (ms per stage). */
function Workflow({ run }: { run: boolean }) {
  const [n, setN] = useState(0); // stage in focus (0-8); 9-11 hold on "Archived"
  useEffect(() => {
    if (!run) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { setN(10); return; }
    const t = setInterval(() => setN((v) => (v + 1) % 12), 950);
    return () => clearInterval(t);
  }, [run]);
  const retest = n === 5 || n === 6;
  const chip = ([row, , , label, icon]: Side) => (
    <span key={label} className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold backdrop-blur transition duration-500 ${n >= row ? "border-white/45 bg-white/25 text-white shadow-[0_0_16px_rgba(125,226,255,.45)]" : "border-white/15 bg-white/5 text-white/50"}`}>{icon}{label}</span>);
  return (
    <div className="prism rounded-2xl p-5 text-white md:p-6">
      <div className="flex items-center justify-between gap-3 text-xs font-bold"><span>Typical ordering workflow</span><span className="flex items-center gap-1.5"><i className="pulse h-2 w-2 rounded-full bg-vermilion" />{n < 9 ? `${NODES[n]} in progress` : "Archived"}</span></div>
      <div className="mt-5 grid gap-3">
        {NODES.map((name, k) => {
          const L = SIDE.filter((s) => s[0] === k && s[1] === "L"), R = SIDE.filter((s) => s[0] === k && s[1] === "R");
          const done = n > k, cur = n === k, stack = k === 4 || k === 7;
          const conn = 12 + (ROW_H[k] - 44) / 2 + ((ROW_H[k + 1] ?? 44) - 44) / 2;
          return (
            <div key={name} className="grid items-center gap-2 md:h-[var(--h)] md:grid-cols-[1fr_210px_1fr] md:gap-3" style={{ "--h": `${ROW_H[k]}px` } as React.CSSProperties}>
              <div className={`order-2 items-center gap-2 md:order-1 md:justify-end ${L.length ? "flex" : "hidden md:flex"}`}>
                <div className={`flex flex-wrap gap-2 ${stack ? "md:flex-col md:items-end md:gap-1.5" : "md:justify-end"}`}>{L.map(chip)}</div>
                {L.length > 0 && <span className="hidden text-white/60 md:block">{L[0][2] === "in" ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}</span>}
              </div>
              <div className="relative order-1 md:order-2">
                <div className={`flex h-11 items-center gap-2.5 rounded-xl border px-3 text-[11px] font-bold uppercase tracking-wide backdrop-blur-md transition duration-500 ${done ? "border-[#7fe0b9]/70 bg-[#3bc79a]/25 text-white" : cur ? "border-white bg-white/30 text-white shadow-[0_0_28px_rgba(255,255,255,.55)] ring-4 ring-vermilion/30" : "border-white/20 bg-white/10 text-white/60"}`}>
                  <i className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[10px] not-italic ${done ? "bg-ivory text-emerald-deep" : cur ? "bg-vermilion text-white" : "bg-white/20"}`}>{done ? <Check size={13} /> : k + 1}</i>{name}
                </div>
                {k < 8 && <span className={`absolute left-1/2 top-full hidden w-px bg-current transition-colors duration-500 md:block ${n > k ? "text-[#7fe0b9]" : "text-white/25"}`} style={{ height: conn }}><i className="absolute -bottom-0.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rotate-45 border-b border-r border-current" /></span>}
              </div>
              <div className="relative order-3 flex items-center gap-2">
                {R.length > 0 && <span className="hidden text-white/60 md:block"><ArrowRight size={14} /></span>}
                <div className={`flex flex-wrap gap-2 ${stack ? "md:flex-col md:gap-1.5" : ""}`}>{R.map(chip)}</div>
                {k === 5 && <span className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition duration-500 md:ml-5 ${retest ? "border-vermilion bg-vermilion/70 text-white shadow-[0_0_20px_rgba(227,66,52,.7)]" : "border-white/15 bg-white/5 text-white/50"}`}><RotateCcw size={14} />Re-test</span>}
                {k === 4 && <span className={`absolute -left-3 top-1/2 hidden h-[82px] w-7 border-r-2 border-t-2 border-dashed transition-colors duration-500 md:block ${retest ? "border-vermilion" : "border-white/25"}`}><i className="absolute -left-0.5 -top-[5px] h-2 w-2 rotate-45 border-b-2 border-l-2 border-inherit" /></span>}
              </div>
            </div>);
        })}
      </div>
    </div>
  );
}

/** Products: frosted-glass bento. The flagship LIMS card is full width with the workflow diagram; the other five sit below. Edit items in PRODUCTS (data.tsx). */
function Products() {
  const [ref, seen] = useInView<HTMLDivElement>();
  const span = ["lg:col-span-6", "lg:col-span-2", "lg:col-span-2", "lg:col-span-2", "lg:col-span-3", "lg:col-span-3"];
  const tile = (p: (typeof PRODUCTS)[number], i: number, s: string, ic: number) => <span className={`grid shrink-0 place-items-center rounded-2xl text-white shadow-lg ring-1 ring-white/60 transition duration-500 group-hover:-rotate-6 group-hover:scale-110 ${i % 3 === 2 ? "bg-gradient-to-br from-vermilion to-[#b8281d]" : "bg-gradient-to-br from-emerald to-emerald-deep"} ${s}`}>{big(p.icon, ic)}</span>;
  const go = (p: (typeof PRODUCTS)[number]) => <a href="#contact" aria-label={`Request a demo of ${p.name}`} className="grid h-10 w-10 place-items-center rounded-full border border-white/80 bg-white/60 text-emerald-deep backdrop-blur transition hover:bg-vermilion hover:text-white"><ArrowUpRight size={18} /></a>;
  return (
    <section id="products" className="relative overflow-hidden py-24">
      <span className="float absolute -left-32 top-24 h-96 w-96 rounded-full bg-emerald/25 blur-3xl" />
      <span className="drift absolute -right-24 top-1/2 h-96 w-96 rounded-full bg-vermilion/20 blur-3xl" />
      <span className="float absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-[#3bc79a]/25 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-5">
        <Head eyebrow="Products" title="One platform, every laboratory function" sub="Kriti Smart LIMS is customisable and built for ISO 17025 and ISO 15189 accredited laboratories." />
        <div ref={ref} className="grid gap-5 lg:grid-cols-6">
          {PRODUCTS.map((p, i) => (
            <div key={p.name} className={`${seen ? "rise" : "opacity-0"} ${span[i] ?? "lg:col-span-2"}`} style={{ animationDelay: `${i * 70}ms` }}>
              <article onMouseMove={spot} className="glass group h-full">
                {i === 0 ? (
                  <div className="relative grid gap-8 p-6 md:p-10 lg:grid-cols-[5fr_7fr] lg:items-center">
                    <div className="flex flex-col">
                      <div className="flex items-start justify-between">{tile(p, i, "h-16 w-16", 30)}{go(p)}</div>
                      <p className="mt-6 text-sm font-bold text-vermilion-ink">Our flagship product</p>
                      <h3 className="mt-1 font-display text-3xl font-bold md:text-4xl">{p.name}</h3>
                      <p className="mt-3 max-w-xl text-lg text-ink/70">{p.text}</p>
                      <ul className="mt-5 flex flex-wrap gap-2 text-sm font-bold">{["Cloud-based", "Highly configurable", "Open-source platform", "ISO 17025 & ISO 15189"].map((t) => <li key={t} className="rounded-full border border-white/80 bg-white/55 px-3.5 py-1.5 text-emerald-deep backdrop-blur">{t}</li>)}</ul>
                      <a href="#contact" className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-vermilion px-6 py-3 font-bold text-white shadow-lg shadow-vermilion/30 transition hover:bg-emerald">Request a demo <ArrowRight size={18} /></a>
                    </div>
                    <Workflow run={seen} />
                  </div>
                ) : (
                  <div className="relative flex h-full flex-col p-6 md:p-7">
                    <div className="flex items-start justify-between">{tile(p, i, "h-12 w-12", 24)}{go(p)}</div>
                    <h3 className="mt-5 font-display text-xl font-bold">{p.name}</h3><p className="mt-2 text-ink/70">{p.text}</p><div className="mt-auto pt-5"><Mini i={i} seen={seen} /></div>
                  </div>)}
              </article>
            </div>))}
        </div>
      </div>
    </section>
  );
}

/** Divisions: a stage where each division gets its own reading time. Plays through all four (DIVISION_MS each), pauses on hover or with the button. */
function Divisions() {
  const [i, setI] = useState(0);
  const [hover, setHover] = useState(false);
  const [off, setOff] = useState(false);
  const paused = hover || off;
  const d = DIVISIONS[i];
  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => setI((v) => (v + 1) % DIVISIONS.length), DIVISION_MS);
    return () => clearTimeout(t);
  }, [i, paused]);
  const at = (ms: number) => ({ animationDelay: `${ms}ms` });
  return (
    <section id="divisions" className="relative overflow-hidden bg-[#06231b] py-24 text-ivory">
      <span className="float absolute -left-24 top-10 h-96 w-96 rounded-full bg-emerald/40 blur-3xl" />
      <span className="drift absolute -right-24 bottom-24 h-96 w-96 rounded-full bg-vermilion/25 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-5" onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)} onPointerLeave={() => setHover(false)}>
        <div className="mx-auto mb-12 max-w-3xl text-center"><p className="eyebrow !text-[#ff8a7d]">Our divisions</p><h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">Four divisions, one accountable team</h2><p className="mt-4 text-lg text-ivory/70">Take a moment with each one. They play through on their own. Hover over the section or press Pause to stop.</p></div>
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <div className="flex gap-3 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            {DIVISIONS.map((x, k) => (
              <button key={x.name} onClick={() => setI(k)} className={`flex min-w-64 items-center gap-4 rounded-2xl border p-4 text-left backdrop-blur-xl transition duration-500 lg:min-w-0 ${k === i ? "border-white/40 bg-white/15 shadow-[0_0_40px_-8px_rgba(227,66,52,.6)]" : "border-white/10 bg-white/5 opacity-70 hover:opacity-100"}`}>
                <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl transition-colors duration-500 ${k === i ? "bg-vermilion text-white" : "bg-white/10"}`}>{x.icon}</span>
                <span className="font-bold leading-snug">{x.name}</span>
              </button>))}
            <button onClick={() => setOff(!off)} className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-sm font-bold text-ivory/80 transition hover:bg-white/10">{off ? <Play size={16} /> : <Pause size={16} />}{off ? "Play" : "Pause"}</button>
          </div>
          <div key={d.name} className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-2xl md:p-10">
            <div className="flex items-center gap-5">
              <div className="relative h-24 w-24 shrink-0">
                <svg viewBox="0 0 96 96" className="absolute inset-0 -rotate-90"><circle cx="48" cy="48" r="44" fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="3" />
                  <circle cx="48" cy="48" r="44" fill="none" stroke="#e34234" strokeWidth="3" strokeLinecap="round" className={paused ? "" : "ring"} style={paused ? { strokeDasharray: 276.5, strokeDashoffset: 0 } : { animationDuration: `${DIVISION_MS}ms` }} /></svg>
                <span className="pop absolute inset-3 grid place-items-center rounded-full bg-gradient-to-br from-emerald to-emerald-deep shadow-[0_0_40px_rgba(10,125,90,.8)]">{big(d.icon, 34)}</span>
              </div>
              <h3 className="rise font-display text-3xl font-bold leading-tight md:text-4xl" style={at(60)}>{d.name}</h3>
            </div>
            <p className="rise mt-6 max-w-2xl text-lg leading-relaxed text-ivory/80" style={at(140)}>{d.intro}</p>
            <ul className="mt-6 grid gap-3 md:grid-cols-2">
              {d.items.map((t, k) => { const [a, ...b] = t.split(": "); return (
                <li key={t} className="rise flex gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur" style={at(240 + k * 70)}>
                  <Check className="mt-0.5 shrink-0 text-[#3bc79a]" size={18} /><span><b className="block">{a}</b><span className="text-sm text-ivory/75">{b.join(": ")}</span></span></li>); })}
            </ul>
            <div className="rise mt-6 flex gap-4 rounded-2xl border-l-4 border-vermilion bg-vermilion/15 p-5" style={at(240 + d.items.length * 70 + 100)}>
              <Sparkles className="mt-0.5 shrink-0 text-[#ff8a7d]" /><p><b>Why it matters. </b><span className="text-ivory/85">{d.value}</span></p></div>
          </div>
        </div>
        <div className="mt-12 overflow-hidden rounded-[2rem] border border-white/15 bg-white/5 p-8 backdrop-blur-xl">
          <h3 className="font-display text-2xl font-bold">LIMS consultancy, implementation & handholding</h3>
          <p className="mt-2 max-w-4xl text-ivory/80">Comprehensive consultancy for Quality Control and Analytical Testing laboratories, plus structured training for pre-sales, pre-sampling, sample collection, retention, sample management and result management, so teams adopt LIMS smoothly and sustainably.</p>
          <div className="mt-6 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]"><div className="marquee flex w-max">
            {[0, 1].map((g) => <ul key={g} aria-hidden={g === 1} className={`flex shrink-0 gap-3 pr-3 ${g ? "dupg" : ""}`}>{CONSULT.map((c) => <li key={c} className="whitespace-nowrap rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold backdrop-blur">{c}</li>)}</ul>)}
          </div></div>
        </div>
      </div>
    </section>
  );
}

function Solutions() {
  const [i, setI] = useState(0);
  const [hover, setHover] = useState(false);
  const [off, setOff] = useState(false);
  const paused = hover || off;
  const s = SOLUTIONS[i];
  /** Auto-advance every SOLUTION_MS (top of file), Food Testing -> Calibration -> back to Food Testing. */
  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => setI((v) => (v + 1) % SOLUTIONS.length), SOLUTION_MS);
    return () => clearTimeout(t);
  }, [i, paused]);
  return (
    <section id="solutions" className="py-24"><div className="mx-auto max-w-7xl px-5" onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)} onPointerLeave={() => setHover(false)}>
      <Head eyebrow="Key projects" title="Kriti Smart LIMS for every testing domain" />
      <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
        {SOLUTIONS.map((x, k) => (
          <button key={x.id} onClick={() => setI(k)} className={`relative overflow-hidden rounded-full px-5 py-2.5 text-sm font-bold transition duration-500 ${k === i ? "river text-white shadow-lg shadow-emerald/30" : "border border-emerald/30 bg-white/60 hover:border-vermilion"}`}>
            <span className="relative z-10">{x.name}</span>
            {k === i && <span key={`${i}-${paused}`} style={{ animationDuration: `${SOLUTION_MS}ms` }} className={`absolute bottom-0 left-0 z-10 h-1 rounded-full bg-vermilion ${paused ? "w-0" : "tabfill"}`} />}
          </button>))}
        <button onClick={() => setOff(!off)} aria-label={off ? "Play slideshow" : "Pause slideshow"} className="grid h-10 w-10 place-items-center rounded-full border border-emerald/30 bg-white/60 text-emerald transition hover:border-vermilion hover:text-vermilion-ink">{off ? <Play size={16} /> : <Pause size={16} />}</button>
      </div>
      <div className="relative grid items-center gap-10 overflow-hidden rounded-[2rem] border border-emerald/15 bg-white/70 p-6 md:p-10 lg:grid-cols-2">
        <div key={s.id} className="rise relative"><span className="rounded-full bg-vermilion/10 px-3 py-1 text-xs font-extrabold text-vermilion-ink">{s.count}</span><span className="ml-3 text-xs font-bold tracking-widest text-ink/45">0{i + 1} / 0{SOLUTIONS.length}</span>
          <h3 className="mt-3 font-display text-3xl font-bold">Smart LIMS for {s.name} Laboratories</h3><p className="mt-3 text-lg text-ink/70">{s.blurb}</p>
          <ul className="mt-5 space-y-3">{s.feats.map((f) => <Item key={f} t={f} />)}</ul></div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border-4 border-white shadow-xl shadow-emerald-deep/15">
          {SOLUTIONS.map((x, k) => <div key={x.id} className={`absolute inset-0 transition-opacity duration-1000 ${k === i ? "opacity-100" : "opacity-0"}`}><div className="kenburns h-full w-full"><PhotoOrArt src={x.img} alt={`${x.name} laboratory`} /></div></div>)}
        </div>
      </div></div></section>
  );
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
/** Client logo from /public/images/clients/<slug>.png (slug = name in lowercase with dashes, e.g. ncml-ltd.png); initials if the file is missing. */
function ClientLogo({ name }: { name: string }) {
  const [bad, setBad] = useState(false);
  return (
    <span className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-2xl bg-white ring-1 ring-emerald/15">
      {bad ? <span className="grid h-full w-full place-items-center bg-gradient-to-br from-emerald to-emerald-deep font-display text-lg font-bold text-white">{name.split(" ").filter((w) => /^[A-Z]/.test(w)).slice(0, 2).map((w) => w[0]).join("")}</span>
        : <img src={`/images/clients/${slug(name)}.png`} alt={`${name} logo`} loading="lazy" decoding="async" onError={() => setBad(true)} className="h-full w-full object-contain p-1.5" />}
    </span>);
}

/** Clients: glass stat tiles plus two slow, opposite-direction rows of glass client cards (pause on hover). Edit CLIENTS in data.tsx. */
function Clients() {
  const rows = [CLIENTS.slice(0, 12), CLIENTS.slice(12)];
  return (
    <section id="clients" className="relative overflow-hidden bg-ivory-2/60 py-24">
      <span className="float absolute -right-24 top-10 h-96 w-96 rounded-full bg-emerald/20 blur-3xl" />
      <span className="drift absolute -left-24 bottom-10 h-96 w-96 rounded-full bg-vermilion/15 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-5">
        <Head eyebrow="Prestigious clients" title="Trusted by 350+ laboratories worldwide" sub="Government agencies, accredited laboratories and global brands across India, the Middle East and Southeast Asia." />
        <div className="mx-auto mb-12 grid max-w-3xl grid-cols-3 gap-4">
          {([[350, "+", "Laboratories served"], [CLIENTS.length, "", "Featured clients"], [6, "", "Countries"]] as [number, string, string][]).map(([to, sfx, l]) => (
            <div key={l} className="glass p-5 text-center"><div className="relative"><div className="font-display text-4xl font-bold text-emerald tabular-nums md:text-5xl"><Counter to={to} suffix={sfx} /></div><div className="mt-1 text-sm font-semibold text-ink/65">{l}</div></div></div>))}
        </div>
      </div>
      <div className="relative [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]">
        {rows.map((row, r) => (
          <div key={r} className="overflow-hidden py-6">
            <div className={`marquee flex w-max ${r ? "rev" : ""}`} style={{ animationDuration: r ? "85s" : "70s" }}>
              {[0, 1].map((g) => (
                <ul key={g} aria-hidden={g === 1} className={`flex shrink-0 gap-5 pr-5 ${g ? "dupg" : ""}`}>
                  {row.map(([n, loc, url]) => (
                    <li key={n}><article onMouseMove={spot} className="glass glass-lite group h-28 w-80">
                      <div className="relative flex h-full items-center gap-4 px-4">
                        <ClientLogo name={n} />
                        <div className="min-w-0"><h3 className="line-clamp-2 font-display text-base font-bold leading-tight">{n}</h3><p className="mt-1 flex items-center gap-1 truncate text-xs font-semibold text-ink/60"><MapPin size={12} className="shrink-0 text-vermilion-ink" />{loc}</p></div>
                        {url && <a href={url} target="_blank" rel="noreferrer" tabIndex={g ? -1 : 0} aria-label={`Visit ${n}`} className="ml-auto grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/80 bg-white/60 text-emerald-deep transition hover:bg-vermilion hover:text-white"><ArrowUpRight size={16} /></a>}
                      </div></article></li>))}
                </ul>))}
            </div>
          </div>))}
      </div>
    </section>
  );
}

function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const tel = (p: string) => "tel:" + p.replace(/[^\d+]/g, "");
  /** Sends the enquiry straight to your inbox through Web3Forms (key in data.tsx). With no key, falls back to the visitor's email app. */
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    if (f.get("botcheck")) return; // hidden spam trap: real visitors never fill it
    const name = String(f.get("name")), email = String(f.get("email")), message = String(f.get("message"));
    if (!FORM.accessKey) {
      window.location.href = `mailto:${CONTACT.emails[0]}?subject=${encodeURIComponent("LIMS enquiry from " + name)}&body=${encodeURIComponent(`${message}\n\n${name} · ${email}`)}`;
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch(FORM.endpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ access_key: FORM.accessKey, subject: `New LIMS enquiry from ${name} (${FORM.site})`, from_name: "Kritisoft Website", name, email, message }) });
      const json = await res.json();
      if (json.success) { form.reset(); setStatus("sent"); } else setStatus("error");
    } catch { setStatus("error"); }
  };
  const inp = "w-full rounded-xl border border-emerald/25 bg-white px-4 py-3 outline-none focus:border-vermilion";
  return (
    <><ContactWave /><section id="contact" className="pb-24 pt-8"><div className="mx-auto max-w-7xl px-5">
      <div className="grid gap-10 lg:grid-cols-2">
        <div><p className="eyebrow">Contact</p><h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">Your smarter laboratory starts with one conversation</h2>
          <p className="mt-4 text-lg text-ink/70">Tell us about your laboratory and we will show you Kriti Smart LIMS.</p>
          <div className="mt-8 space-y-3">{CONTACT.emails.map((m) => <a key={m} href={`mailto:${m}`} className="card flex items-center gap-3 !p-4 font-bold"><Mail className="text-vermilion-ink" />{m}</a>)}</div><OfficeLink /></div>
        {status === "sent" ? (
          <div className="card grid place-items-center space-y-3 !p-8 text-center" role="status"><span className="grid h-14 w-14 place-items-center rounded-full bg-emerald text-white"><Check /></span>
            <h3 className="font-display text-2xl font-bold">Thank you! Your enquiry has been sent.</h3><p className="text-ink/70">Our team will get back to you shortly.</p>
            <button onClick={() => setStatus("idle")} className="font-bold text-vermilion-ink underline">Send another enquiry</button></div>
        ) : (
        <form onSubmit={submit} className="card space-y-4 !p-8"><input required name="name" placeholder="Your name" className={inp} /><input required type="email" name="email" placeholder="Work email" className={inp} /><textarea required name="message" rows={4} placeholder="Tell us about your laboratory" className={inp} />
          <input type="text" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
          {status === "error" && <p role="alert" className="text-sm font-semibold text-vermilion-ink">Sorry, that did not go through. Please try again, or email us at <a className="underline" href={`mailto:${CONTACT.emails[0]}`}>{CONTACT.emails[0]}</a>.</p>}
          <button disabled={status === "sending"} className="w-full rounded-full bg-vermilion py-3.5 font-bold text-white transition hover:bg-emerald disabled:opacity-60">{status === "sending" ? "Sending…" : "Send Enquiry"}</button></form>)}
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {CONTACT.offices.map((o) => (
          <article key={o.name} className="card"><p className="eyebrow">{o.tag}</p><h3 className="mt-2 font-display text-xl font-bold">{o.name}</h3>
            <p className="mt-3 flex gap-2 text-ink/70"><MapPin className="mt-0.5 shrink-0 text-emerald" size={18} /><span>{o.address.map((l) => <span key={l} className="block">{l}</span>)}</span></p>
            <ul className="mt-4 space-y-1.5">{o.phones.map((p) => <li key={p}><a href={tel(p)} className="flex items-center gap-2 font-bold hover:text-vermilion-ink"><Phone size={16} className="text-vermilion-ink" />{p}</a></li>)}</ul></article>))}
      </div>
    </div></section></>
  );
}

/** Tiny maker's mark: a sun with an eye inside it. */
function SunEye() {
  return (
    <svg viewBox="0 0 48 48" className="h-7 w-7" role="img" aria-label="Sun and eye logo">
      <g className="spin">{Array.from({ length: 12 }, (_, i) => <line key={i} x1="24" y1="2.5" x2="24" y2="8" stroke="#e34234" strokeWidth="2.6" strokeLinecap="round" transform={`rotate(${i * 30} 24 24)`} />)}</g>
      <circle cx="24" cy="24" r="14.5" fill="#e34234" />
      <path d="M13.5 24Q24 14.5 34.5 24Q24 33.5 13.5 24Z" fill="#fbf6ea" />
      <circle cx="24" cy="24" r="4.6" fill="#065f46" /><circle cx="24" cy="24" r="2" fill="#1b2a23" /><circle cx="25.4" cy="22.6" r=".9" fill="#fbf6ea" />
    </svg>
  );
}

export default function App() {
  return (<>
    <Navbar /><main><Hero /><Horizon /><About /><Products /><Divisions /><Solutions /><Clients /><Contact /></main>
    <footer className="bg-ink py-10 text-center text-sm text-ivory/70">
      <img src="/images/logo.png" alt="Kritisoft" className="mx-auto mb-3 h-12 rounded bg-ivory p-1" />
      <p className="mb-4 text-xs font-semibold italic uppercase tracking-[0.28em] text-[#ff8a7d]">The Online Software People</p>
      <p>© {new Date().getFullYear()} KRITISOFT · ISO 9001:2015 · ISO 27001:2018 · {CONTACT.web}</p>
      <div className="mx-auto mt-5 flex w-fit items-center gap-3"><span className="flex items-center gap-2 rounded-full border border-ivory/15 bg-ivory/5 px-3.5 py-1.5 text-xs font-semibold text-ivory/80"><i className="pulse h-2 w-2 rounded-full bg-[#3bc79a]" />Support online 24x7</span><a href="#home" aria-label="Back to top" className="grid h-9 w-9 place-items-center rounded-full border border-ivory/20 text-ivory/80 transition hover:bg-vermilion hover:text-white"><ArrowUp size={16} /></a></div>
      <div className="mx-auto mt-6 flex w-fit items-center gap-2.5 border-t border-ivory/10 pt-5">
        <span className="text-xs italic text-ivory/50">Developed by</span><SunEye />
        <span className="font-brand text-lg tracking-[0.3em] text-ivory">RORSISNITH</span>
      </div>
    </footer>
  </>);
}