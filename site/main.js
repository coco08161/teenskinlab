/* Teen Skin Lab — header/footer, scroll animations, flip cards, form.
   No libraries: everything here is plain JavaScript. */

document.documentElement.classList.add("js");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const page = location.pathname.split("/").pop() || "index.html";

/* ---------- Site navigation (edit links here once, every page updates) ---------- */
const NAV = [
  { label: "Learn", children: [
    { label: "Learn Hub", href: "learn.html" },
    { label: "Sun Safety", href: "sun-safety.html" },
    { label: "Know the Signs", href: "know-the-signs.html" },
    { label: "Skin 101", href: "skin-101.html" },
    { label: "Acne & Breakouts", href: "acne.html" },
    { label: "Ingredients", href: "ingredients.html" },
    { label: "Research", href: "research.html" },
  ]},
  { label: "Myth Lab", href: "myth-lab.html" },
  { label: "Impact", href: "impact.html" },
  { label: "About", href: "about.html" },
  { label: "Contact", href: "contact.html" },
];

/* The highlighted button at the end of the menu */
const CTA = { label: "Take Action", href: "take-action.html" };

/* Social profiles (used in the footer and anywhere with data-socials) */
const SOCIALS = [
  { label: "YouTube", href: "https://www.youtube.com/@TeenSkinLab" },
  { label: "Instagram", href: "https://www.instagram.com/teenskinlab.co/" },
  { label: "TikTok", href: "https://www.tiktok.com/@teenskinlab" },
];

const current = (href) => (href === page ? ' aria-current="page"' : "");

function renderHeader() {
  const slot = document.getElementById("site-header");
  if (!slot) return;
  const items = NAV.map((item) => {
    if (!item.children) return `<li><a href="${item.href}"${current(item.href)}>${item.label}</a></li>`;
    const active = item.children.some((c) => c.href === page);
    return `<li class="has-drop">
      <button type="button" aria-expanded="false"${active ? ' aria-current="page"' : ""}>${item.label} <span class="chev">▼</span></button>
      <ul class="drop">${item.children.map((c) => `<li><a href="${c.href}"${current(c.href)}>${c.label}</a></li>`).join("")}</ul>
    </li>`;
  }).join("");

  slot.outerHTML = `
  <div class="announce"><a href="take-action.html">Free sun-safety workshops for South Florida schools &amp; teams — request one →</a></div>
  <header class="site-header">
    <div class="wrap nav">
      <a class="brand" href="index.html" aria-label="Teen Skin Lab home">
        <img src="logo-horizontal.png" alt="Teen Skin Lab" width="1128" height="260">
      </a>
      <button class="burger" type="button" aria-label="Open menu" aria-expanded="false"><span></span></button>
      <ul class="menu">${items}<li><a class="btn amber" href="${CTA.href}"${current(CTA.href)}>${CTA.label} <span class="arr">→</span></a></li></ul>
    </div>
    <div class="progress"></div>
  </header>`;
}

function renderFooter() {
  const slot = document.getElementById("site-footer");
  if (!slot) return;
  const learn = NAV[0].children.map((c) => `<li><a href="${c.href}">${c.label}</a></li>`).join("");
  const rest = [CTA, ...NAV.slice(1)].map((c) => `<li><a href="${c.href}">${c.label}</a></li>`).join("");
  const socials = SOCIALS.map((s) => `<li><a href="${s.href}" target="_blank" rel="noopener">${s.label} ↗</a></li>`).join("");
  slot.outerHTML = `
  <footer class="site-footer on-dark">
    <div class="wrap">
      <p class="foot-big" data-reveal>Know the signs.<br>Build the habits.</p>
      <div class="foot-grid">
        <div>
          <div class="foot-badge"><img src="logo.png" alt="Teen Skin Lab logo"></div>
          <p>A student-led skin cancer prevention program bringing sun-safety education and sunscreen access to South Florida teens.</p>
        </div>
        <div><h4>Learn</h4><ul>${learn}</ul></div>
        <div><h4>Explore</h4><ul>${rest}</ul></div>
        <div><h4>Follow</h4><ul>${socials}</ul></div>
      </div>
      <div class="disclaimer">
        <p>Teen Skin Lab shares general education only. It is not medical advice, diagnosis, or treatment. Talk with a trusted adult and a qualified healthcare professional about your own skin.</p>
        <p>© ${new Date().getFullYear()} Teen Skin Lab · Photos via <a href="https://unsplash.com" target="_blank" rel="noopener">Unsplash</a></p>
      </div>
    </div>
  </footer>`;
}

renderHeader();
renderFooter();

/* Any <div data-socials></div> becomes a row of follow buttons */
document.querySelectorAll("[data-socials]").forEach((slot) => {
  slot.classList.add("btn-row");
  slot.innerHTML = SOCIALS.map((s) => `<a class="btn ${slot.dataset.socials || "light"}" href="${s.href}" target="_blank" rel="noopener">${s.label} <span class="arr">↗</span></a>`).join("");
});
// Fade the page content in. (Applied to <main>, not <body>: a transform on <body>
// would trap the fixed mobile menu inside the page instead of the screen.)
document.querySelector("main")?.classList.add("page-fade");

/* ---------- Header: mobile menu, dropdowns, shrink + progress on scroll ---------- */
const header = document.querySelector(".site-header");
const burger = document.querySelector(".burger");
const progress = document.querySelector(".progress");

burger?.addEventListener("click", () => {
  const open = document.body.classList.toggle("nav-open");
  burger.setAttribute("aria-expanded", open);
  burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  document.body.style.overflow = open ? "hidden" : "";
});

document.querySelectorAll(".has-drop > button").forEach((btn) => {
  btn.addEventListener("click", () => {
    const li = btn.parentElement;
    const open = li.classList.toggle("open");
    btn.setAttribute("aria-expanded", open);
  });
});
document.addEventListener("click", (e) => {
  document.querySelectorAll(".has-drop.open").forEach((li) => {
    if (!li.contains(e.target)) { li.classList.remove("open"); li.querySelector("button").setAttribute("aria-expanded", "false"); }
  });
});
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  document.querySelectorAll(".has-drop.open").forEach((li) => li.classList.remove("open"));
  if (document.body.classList.contains("nav-open")) burger.click();
});

/* ---------- Scroll-linked effects (one rAF loop) ---------- */
const parallax = [...document.querySelectorAll("[data-speed]")];
let ticking = false;

function onScroll() {
  const y = window.scrollY;
  header?.classList.toggle("scrolled", y > 20);
  const max = document.documentElement.scrollHeight - innerHeight;
  if (progress) progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;

  if (!reduceMotion) {
    parallax.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > innerHeight + 200) return;
      const offset = (r.top + r.height / 2 - innerHeight / 2) * parseFloat(el.dataset.speed);
      el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    });
  }
  ticking = false;
}
window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
onScroll();

/* ---------- Reveal on scroll (with automatic stagger inside groups) ---------- */
document.querySelectorAll("[data-stagger]").forEach((group) => {
  [...group.querySelectorAll(":scope > [data-reveal]")].forEach((el, i) => el.style.setProperty("--d", `${i * 0.12}s`));
});

const revealer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("is-in");
    revealer.unobserve(entry.target);
  });
}, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
document.querySelectorAll("[data-reveal], .mark, .hero").forEach((el) => revealer.observe(el));

/* ---------- Count-up numbers ---------- */
const counter = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    counter.unobserve(el);
    const end = parseFloat(el.dataset.count);
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    if (reduceMotion) { el.textContent = prefix + end + suffix; return; }
    const start = performance.now();
    const dur = 1400;
    const tick = (now) => {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = prefix + Math.round(end * eased) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}, { threshold: 0.6 });
document.querySelectorAll("[data-count]").forEach((el) => counter.observe(el));

/* ---------- Impact progress bars: <div class="meter" data-current="3" data-goal="15"> ---------- */
document.querySelectorAll(".meter[data-goal]").forEach((meter) => {
  const current = parseFloat(meter.dataset.current) || 0;
  const goal = parseFloat(meter.dataset.goal) || 1;
  const pct = Math.min(100, (current / goal) * 100);
  const nums = meter.querySelector(".meter-nums");
  if (nums) nums.innerHTML = `<b>${current.toLocaleString()}</b> / ${goal.toLocaleString()}`;
  meter.style.setProperty("--pct", `${Math.max(pct, current > 0 ? 2 : 0)}%`);
});

/* ---------- Sticky "steps": highlight the step in view, swap the photo ---------- */
document.querySelectorAll("[data-steps]").forEach((wrap) => {
  const steps = [...wrap.querySelectorAll(".step")];
  const imgs = [...wrap.querySelectorAll(".steps-media img")];
  const tag = wrap.querySelector(".steps-media .tag");
  const activate = (i) => {
    steps.forEach((s, j) => s.classList.toggle("active", i === j));
    imgs.forEach((img, j) => img.classList.toggle("show", i === j));
    if (tag) tag.textContent = steps[i].dataset.tag || "";
  };
  activate(0);
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) activate(steps.indexOf(e.target)); });
  }, { rootMargin: "-45% 0px -45% 0px" });
  steps.forEach((s) => io.observe(s));
});

/* ---------- Background colour shifts as themed sections enter ---------- */
const themed = document.querySelectorAll("[data-body]");
if (themed.length) {
  const base = getComputedStyle(document.body).backgroundColor;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      document.body.style.backgroundColor = e.isIntersecting ? e.target.dataset.body : base;
    });
  }, { rootMargin: "-50% 0px -50% 0px" });
  themed.forEach((s) => io.observe(s));
}

/* ---------- Flip cards ---------- */
document.querySelectorAll(".flip button").forEach((btn) => {
  btn.addEventListener("click", () => {
    const card = btn.closest(".flip");
    const flipped = card.classList.toggle("flipped");
    btn.setAttribute("aria-pressed", flipped);
  });
});

/* ---------- Survey button: until a real link is added, say it's coming ---------- */
document.querySelectorAll('[data-survey][href="#"]').forEach((link) => {
  link.innerHTML = 'Survey opens soon';
  link.setAttribute("aria-disabled", "true");
  link.addEventListener("click", (e) => e.preventDefault());
});

/* ---------- Contact form (Formspree) ---------- */
const form = document.querySelector("form[data-formspree]");
if (form) {
  const status = form.querySelector(".form-status");

  // Links like contact.html?reason=workshop pre-select the matching reason
  const reason = new URLSearchParams(location.search).get("reason");
  const option = reason && form.querySelector(`option[data-key="${reason}"]`);
  if (option) option.selected = true;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (form.action.includes("YOUR_FORM_ID")) {
      status.textContent = "The form isn't connected yet — see the README to hook up Formspree.";
      return;
    }
    status.textContent = "Sending…";
    try {
      const res = await fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error();
      form.reset();
      status.textContent = "Thanks! Your message is in the lab. We'll get back to you soon.";
    } catch {
      status.textContent = "Something went wrong. Please try again in a minute.";
    }
  });
}
