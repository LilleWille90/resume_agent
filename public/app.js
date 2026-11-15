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

addMessage(
  "assistant",
  "Hi! I answer questions about Mattias’ work from his CV and project notes. Pick a question on the left or type your own."
);

// Section entrances: each part of a section rises in turn, once.
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const reveals = document.querySelectorAll("[data-reveal]");
reveals.forEach(group => [...group.children].forEach((child, i) => child.style.setProperty("--i", i)));
if ("IntersectionObserver" in window && !reduceMotion.matches) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("is-in"); io.unobserve(entry.target); }
    });
  }, { rootMargin: "0px 0px -10% 0px", threshold: 0.08 });
  reveals.forEach(el => io.observe(el));
  // A fast scroll or a jump link can pass a section without it ever crossing the
  // viewport; reveal everything that is already above the bottom of the screen.
  let pending = false;
  const catchUp = (instant = false) => {
    pending = false;
    reveals.forEach(el => {
      if (!el.classList.contains("is-in") && el.getBoundingClientRect().top < window.innerHeight) {
        if (instant) el.classList.add("no-anim");
        el.classList.add("is-in"); io.unobserve(el);
      }
    });
  };
  window.addEventListener("scroll", () => { if (!pending) { pending = true; requestAnimationFrame(() => catchUp()); } }, { passive: true });
  // A window that suddenly grows (a full-page capture, a rotated tablet) shows the
  // new area at once rather than as a column of blanks.
  window.addEventListener("resize", () => catchUp(true));
} else {
  reveals.forEach(el => el.classList.add("is-in"));
}

// Project clips: load and play only while visible. With reduced motion they stay
// still on their poster and get controls so the visitor can start them.
const clips = document.querySelectorAll("video.clip");
const loadClip = video => { if (!video.src) { video.src = video.dataset.src; } };
if (reduceMotion.matches || !("IntersectionObserver" in window)) {
  clips.forEach(video => { video.controls = true; video.loop = false; loadClip(video); });
} else {
  const vio = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const video = entry.target;
      if (entry.isIntersecting) {
        loadClip(video);
        video.play().catch(() => { video.controls = true; });
      } else if (!video.paused) {
        video.pause();
      }
    });
  }, { threshold: 0.35 });
  clips.forEach(video => vio.observe(video));
}
