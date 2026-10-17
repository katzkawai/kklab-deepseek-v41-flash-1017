/* =========================================================
   浜名湖うなぎ — interactions
   ========================================================= */

(function () {
  "use strict";

  const header = document.getElementById("header");
  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("navToggle");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- header state ---------- */
  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 40);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- mobile navigation ---------- */
  const closeNav = () => {
    nav.classList.remove("is-open");
    header.classList.remove("is-open");
    document.body.classList.remove("is-locked");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "メニューを開く");
  };

  const openNav = () => {
    nav.classList.add("is-open");
    header.classList.add("is-open");
    document.body.classList.add("is-locked");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "メニューを閉じる");
  };

  navToggle.addEventListener("click", () => {
    if (navToggle.getAttribute("aria-expanded") === "true") {
      closeNav();
    } else {
      openNav();
    }
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      closeNav();
      navToggle.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900 && nav.classList.contains("is-open")) {
      closeNav();
    }
  });

  /* ---------- reveal on scroll ---------- */
  const revealItems = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && !reduceMotion.matches) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  /* ---------- hero parallax ---------- */
  const heroArt = document.querySelector(".hero-art");
  const hero = document.querySelector(".hero");
  let ticking = false;

  const updateParallax = () => {
    if (!heroArt) return;
    const desktop = window.innerWidth > 900;
    const offset = Math.min(window.scrollY, window.innerHeight);
    heroArt.style.transform = desktop
      ? `translateY(calc(-50% + ${offset * 0.1}px))`
      : "";
    ticking = false;
  };

  if (heroArt && hero && !reduceMotion.matches) {
    updateParallax();
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          window.requestAnimationFrame(updateParallax);
          ticking = true;
        }
      },
      { passive: true }
    );
    window.addEventListener("resize", updateParallax);
  }

  /* ---------- scroll spy ---------- */
  const sections = Array.from(document.querySelectorAll("main section[id]")).filter(
    (section) => section.querySelector("h2")
  );
  const navLinks = Array.from(nav.querySelectorAll('a[href^="#"]'));

  if ("IntersectionObserver" in window && sections.length) {
    const spyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            const active = link.getAttribute("href") === `#${id}`;
            link.classList.toggle("is-current", active);
            if (active) {
              link.setAttribute("aria-current", "true");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((section) => spyObserver.observe(section));
  }

  /* ---------- FAQ: one answer at a time ---------- */
  const faqItems = Array.from(document.querySelectorAll(".faq-item"));
  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;
      faqItems.forEach((other) => {
        if (other !== item && other.open) other.open = false;
      });
    });
  });

  /* ---------- re-run reveal when motion preference changes ---------- */
  const syncMotionPreference = () => {
    if (reduceMotion.matches) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      if (heroArt) heroArt.style.transform = "";
    }
  };

  if (typeof reduceMotion.addEventListener === "function") {
    reduceMotion.addEventListener("change", syncMotionPreference);
  }
})();
