/**
 * Pavan Kumar — Portfolio
 * Mobile navigation, reveal, and proof counters.
 */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initReveal();
  initCounters();
});

/* =========================
   MOBILE MENU
   ========================= */

function initMobileMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector("#mobile-menu");

  if (!toggle || !menu) return;

  const links = menu.querySelectorAll("a");
  const focusable = [toggle, ...links];

  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.setAttribute("aria-hidden", String(!open));
    document.body.classList.toggle("menu-is-open", open);

    if (open) {
      const firstLink = links[0];
      if (firstLink) firstLink.focus();
    }
  };

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    setOpen(open);
  });

  links.forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    if (!open) return;

    if (event.key === "Escape") {
      setOpen(false);
      toggle.focus();
      return;
    }

    if (event.key !== "Tab") return;

    const currentIndex = focusable.indexOf(document.activeElement);
    if (event.shiftKey) {
      if (currentIndex <= 0) {
        event.preventDefault();
        focusable[focusable.length - 1].focus();
      }
    } else if (currentIndex === focusable.length - 1) {
      event.preventDefault();
      focusable[0].focus();
    }
  });
}

/* =========================
   SCROLL REVEAL
   ========================= */

function initReveal() {
  const nodes = document.querySelectorAll(".js-reveal");
  if (!nodes.length) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || !("IntersectionObserver" in window)) {
    nodes.forEach((node) => node.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
  );

  nodes.forEach((node) => observer.observe(node));
}

/* =========================
   PROOF COUNTERS
   ========================= */

function initCounters() {
  const nodes = document.querySelectorAll("[data-count]");
  if (!nodes.length) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const formatValue = (node, value) => {
    const pad = Number(node.dataset.pad || 0);
    const prefix = node.dataset.prefix || "";
    const suffix = node.dataset.suffix || "";
    const rounded = Math.round(value);
    const body = pad > 0 ? String(rounded).padStart(pad, "0") : String(rounded);
    node.textContent = `${prefix}${body}${suffix}`;
  };

  const animate = (node) => {
    const target = Number(node.dataset.count);
    if (!Number.isFinite(target)) return;

    if (reduceMotion) {
      formatValue(node, target);
      return;
    }

    const duration = 650;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      formatValue(node, target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  if (!("IntersectionObserver" in window)) {
    nodes.forEach(animate);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animate(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.4 }
  );

  nodes.forEach((node) => observer.observe(node));
}
