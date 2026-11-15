const chatEl = document.getElementById("chat");
const form = document.getElementById("form");
const input = document.getElementById("input");

const history = []; // { role: "user"|"assistant", content: string }

function addMessage(role, text, meta = null) {
  const wrap = document.createElement("div");
  wrap.className = `msg ${role}`;

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;

  wrap.appendChild(bubble);

  if (meta?.sources?.length) {
    const sources = document.createElement("div");
    sources.className = "sources";
    sources.innerHTML =
      "<strong>Sources:</strong> " + meta.sources.map(s => `<span class="src">${s}</span>`).join(" ");
    wrap.appendChild(sources);
  }

  if (meta?.suggested_questions?.length) {
    const sug = document.createElement("div");
    sug.className = "suggest-inline";
    meta.suggested_questions.slice(0, 3).forEach(q => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = q;
      b.onclick = () => send(q);
      sug.appendChild(b);
    });
    wrap.appendChild(sug);
  }

  chatEl.appendChild(wrap);
  chatEl.scrollTop = chatEl.scrollHeight;
}

async function send(text) {
  if (!text?.trim() || form.querySelector("button").disabled) return;

  addMessage("user", text);
  history.push({ role: "user", content: text });

  input.value = "";
  input.focus();

  const submit = form.querySelector("button");
  submit.disabled = true;
  submit.textContent = "Thinking…";
  try {
  const res = await fetch("/.netlify/functions/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text, history })
  });

  const data = await res.json();
  if (!res.ok) {
    addMessage("assistant", data?.error || "The resume assistant is unavailable right now. Please try again later or contact me on LinkedIn.");
    return;
  }

  addMessage("assistant", data.answer, {
    sources: data.sources,
    suggested_questions: data.suggested_questions
  });

  history.push({ role: "assistant", content: data.answer });
  } catch {
    addMessage("assistant", "The resume assistant could not connect. You can still explore the projects and CV, or contact me on LinkedIn.");
  } finally {
    submit.disabled = false;
    submit.textContent = "Ask";
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  send(input.value);
});

document.querySelectorAll(".suggest button").forEach(btn => {
  btn.addEventListener("click", () => send(btn.dataset.q));
});

chatEl.addEventListener("click", () => input.focus());

addMessage(
  "assistant",
  "Start here: type a question in the field below, or choose one of the suggested topics above."
);

const launcher = document.getElementById("chat-launcher");
const panel = document.getElementById("resume-panel");
const closeButton = panel.querySelector(".chat-close");
function setChatOpen(open) {
  document.querySelector("main").inert = open;
  panel.hidden = !open;
  launcher.setAttribute("aria-expanded", String(open));
  launcher.hidden = open;
  if (open) input.focus(); else launcher.focus();
}
launcher.addEventListener("click", () => setChatOpen(true));
closeButton.addEventListener("click", () => setChatOpen(false));
panel.addEventListener("keydown", (event) => {
  if (event.key === "Escape") { event.preventDefault(); setChatOpen(false); }
  if (event.key === "Tab") {
    const controls = [...panel.querySelectorAll("button:not(:disabled), input, a[href]")].filter(el => !el.hidden);
    const first = controls[0], last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});

// Each project's existing figures become a gallery; add figures to add views.
document.querySelectorAll('.project').forEach(project => {
  const figures = [...project.querySelectorAll('.project-image, .phone-gallery figure')];
  if (!figures.length) return;
  const gallery = document.createElement('section');
  gallery.className = 'project-carousel';
  gallery.setAttribute('aria-label', `${project.querySelector('h3').textContent} screenshots`);
  gallery.setAttribute('aria-roledescription', 'carousel');
  const track = document.createElement('div');
  track.className = 'carousel-track';
  track.tabIndex = 0;
  track.setAttribute('aria-label', 'Project images. Use left and right arrow keys to browse.');
  (project.querySelector('.phone-gallery') || figures[0]).before(gallery);
  gallery.append(track);
  figures.forEach((figure, index) => {
    figure.className = 'carousel-slide';
    if (figure.querySelector('img').height > figure.querySelector('img').width) figure.classList.add('portrait-slide');
    figure.setAttribute('role', 'group');
    figure.setAttribute('aria-label', `${index + 1} of ${figures.length}`);
    track.append(figure);
  });
  project.querySelector('.phone-gallery')?.remove();
  if (figures.length < 2) return;
  const controls = document.createElement('div');
  controls.className = 'carousel-controls';
  const previous = document.createElement('button');
  const next = document.createElement('button');
  [previous, next].forEach((button, i) => {
    button.type = 'button';
    button.setAttribute('aria-label', i ? 'Next image' : 'Previous image');
    button.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="${i ? 'm9 5 7 7-7 7' : 'm15 5-7 7 7 7'}"/></svg>`;
  });
  const count = document.createElement('span');
  count.className = 'carousel-count';
  count.setAttribute('aria-live', 'polite');
  controls.append(previous, count, next);
  gallery.append(controls);
  let current = 0;
  const update = () => {
    current = Math.round(track.scrollLeft / track.clientWidth);
    count.textContent = `${current + 1} / ${figures.length}`;
    previous.disabled = current === 0;
    next.disabled = current === figures.length - 1;
  };
  const move = step => track.scrollTo({left: Math.max(0, Math.min(figures.length - 1, current + step)) * track.clientWidth, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  track.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1);
    }
  });
  track.addEventListener('scroll', update, {passive: true});
  new ResizeObserver(() => { track.scrollTo({left: current * track.clientWidth, behavior: 'instant'}); }).observe(track);
  update();
});

(() => {
  const buttons = document.querySelectorAll('.view-switch button');
  const panels = document.querySelectorAll('details.tech');
  const setView = (view, remember) => {
    buttons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.view === view)));
    panels.forEach(p => { p.open = view === 'technical'; });
    document.body.dataset.view = view;
    if (remember) { try { localStorage.setItem('portfolio-view', view); } catch {} }
  };
  let saved = 'overview';
  try { saved = localStorage.getItem('portfolio-view') === 'technical' ? 'technical' : 'overview'; } catch {}
  buttons.forEach(b => b.addEventListener('click', () => setView(b.dataset.view, true)));
  if (location.hash === '#technical') saved = 'technical';
  setView(saved, false);
})();
