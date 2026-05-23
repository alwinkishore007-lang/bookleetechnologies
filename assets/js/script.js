/**
 * Booklee Technologies — Main JavaScript
 * Modular, production-ready interactions
 */

(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
  const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const CURSOR_HOVER_SELECTOR =
    "a, button, .btn, input, textarea, select, .glass-card, .service-card, .contact-card, .engagement-snapshot, .snapshot-kpi, .faq-item__button, .nav__link, .mobile-menu__link, .why-us__node, .footer__link, .footer__social-link, .footer__booklee, .footer__booklee-char, [data-cursor-hover]";

  let smoothScrollTo = null;

  /** Official Booklee contact & social URLs */
  const SITE_CONTACT = {
    email: "bookleetechnologies@gmail.com",
    formSubmit: "https://formsubmit.co/ajax/bookleetechnologies@gmail.com",
    calendly: "https://calendly.com/bookleetechnologies/30mins",
    linkedin: "https://www.linkedin.com/company/booklee-technologies/",
    instagram: "https://www.instagram.com/booklee_technologies/",
  };

  /* --------------------------------------------------------------------------
     Utilities
     -------------------------------------------------------------------------- */
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

  const debounce = (fn, delay = 100) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };

  const getBasePath = () => {
    const path = window.location.pathname;
    if (path.includes("/services/")) return "../";
    return "";
  };

  /* --------------------------------------------------------------------------
     Page Loader
     -------------------------------------------------------------------------- */
  function initPageLoader() {
    const loader = $("#page-loader");
    if (!loader) return;

    const hideLoader = () => {
      loader.classList.add("is-hidden");
      document.body.classList.remove("no-scroll");
    };

    document.body.classList.add("no-scroll");

    if (document.readyState === "complete") {
      setTimeout(hideLoader, prefersReducedMotion ? 0 : 800);
    } else {
      window.addEventListener("load", () => {
        setTimeout(hideLoader, prefersReducedMotion ? 0 : 800);
      });
    }

    setTimeout(hideLoader, 3000);
  }

  /* --------------------------------------------------------------------------
     Scroll Progress Indicator
     -------------------------------------------------------------------------- */
  function initScrollProgress() {
    const bar = $("#scroll-progress");
    if (!bar) return;

    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = `${progress}%`;
      bar.setAttribute("aria-valuenow", Math.round(progress));
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  /* --------------------------------------------------------------------------
     Sticky Header
     -------------------------------------------------------------------------- */
  function initHeader() {
    const header = $("#header");
    if (!header) return;

    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 20);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* --------------------------------------------------------------------------
     Active Nav Link
     -------------------------------------------------------------------------- */
  function initActiveNav() {
    const path = window.location.pathname.split("/").pop() || "index.html";
    const inServicesDir = window.location.pathname.includes("/services/");

    $$(".nav__link, .mobile-menu__link").forEach((link) => {
      const href = link.getAttribute("href");
      if (!href) return;
      const linkPath = href.split("/").pop();
      const isServicesLink = linkPath === "services.html";
      const isMatch =
        linkPath === path ||
        (path === "" && linkPath === "index.html") ||
        (inServicesDir && isServicesLink);

      if (isMatch) {
        link.classList.add("is-active");
        link.setAttribute("aria-current", "page");
      }
    });
  }

  /* --------------------------------------------------------------------------
     Mobile Menu
     -------------------------------------------------------------------------- */
  function initMobileMenu() {
    const toggle = $("#nav-toggle");
    const menu = $("#mobile-menu");
    if (!toggle || !menu) return;

    const openMenu = () => {
      toggle.setAttribute("aria-expanded", "true");
      menu.classList.add("is-open");
      menu.setAttribute("aria-hidden", "false");
      document.body.classList.add("no-scroll");
    };

    const closeMenu = () => {
      toggle.setAttribute("aria-expanded", "false");
      menu.classList.remove("is-open");
      menu.setAttribute("aria-hidden", "true");
      document.body.classList.remove("no-scroll");
    };

    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      isOpen ? closeMenu() : openMenu();
    });

    $$(".mobile-menu__link", menu).forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", debounce(() => {
      if (window.innerWidth >= 1024) closeMenu();
    }, 150));
  }

  /* --------------------------------------------------------------------------
     Custom Cursor
     -------------------------------------------------------------------------- */
  function initCustomCursor() {
    if (prefersReducedMotion || isTouchDevice || !hasFinePointer) return;

    const dot = $("#cursor-dot");
    const ring = $("#cursor-ring");
    if (!dot || !ring) return;

    document.body.classList.add("custom-cursor");

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    const updateHoverState = (e) => {
      const hit = document.elementFromPoint(e.clientX, e.clientY);
      ring.classList.toggle("is-hover", !!hit?.closest(CURSOR_HOVER_SELECTOR));
    };

    document.addEventListener(
      "mousemove",
      (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = `${mouseX}px`;
        dot.style.top = `${mouseY}px`;
        updateHoverState(e);
      },
      { passive: true }
    );

    document.addEventListener("mouseleave", () => {
      ring.classList.remove("is-hover");
    });

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;
      requestAnimationFrame(animateRing);
    };
    animateRing();
  }

  /* --------------------------------------------------------------------------
     Mouse-follow Gradient
     -------------------------------------------------------------------------- */
  /* --------------------------------------------------------------------------
     Service cards — click empty card area (no nested anchor overlay)
     -------------------------------------------------------------------------- */
  function initServiceCards() {
    $$(".service-card").forEach((card) => {
      const mainLink = $(".service-card__title a", card) || $(".service-card__cta", card);
      if (!mainLink) return;

      const href = mainLink.getAttribute("href");
      if (!href) return;

      card.dataset.href = href;
      card.classList.add("service-card--clickable");
      card.setAttribute("tabindex", "0");

      const navigate = () => {
        const base = getBasePath();
        window.location.href = href.startsWith("http") ? href : `${base}${href}`;
      };

      card.addEventListener("click", (e) => {
        if (e.target.closest("a")) return;
        navigate();
      });

      card.addEventListener("keydown", (e) => {
        if (e.target.closest("a")) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate();
        }
      });
    });
  }

  function initMouseGradient() {
    if (prefersReducedMotion || isTouchDevice || !hasFinePointer) return;

    const gradient = $("#mouse-gradient");
    if (!gradient) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let glowX = mouseX;
    let glowY = mouseY;
    let active = false;

    document.addEventListener(
      "mousemove",
      (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!active) {
          gradient.classList.add("is-active");
          active = true;
        }
      },
      { passive: true }
    );

    document.addEventListener("mouseleave", () => {
      gradient.classList.remove("is-active");
      active = false;
    });

    const animateGlow = () => {
      glowX += (mouseX - glowX) * 0.1;
      glowY += (mouseY - glowY) * 0.1;
      gradient.style.left = `${glowX}px`;
      gradient.style.top = `${glowY}px`;
      requestAnimationFrame(animateGlow);
    };
    animateGlow();
  }

  /* --------------------------------------------------------------------------
     Apple-style smooth scrolling (eased wheel + anchors)
     -------------------------------------------------------------------------- */
  function initAppleSmoothScroll() {
    if (prefersReducedMotion) return;

    document.documentElement.classList.add("smooth-scroll-enabled");

    let current = window.scrollY;
    let target = window.scrollY;
    let rafId = null;
    const ease = 0.085;

    const getMaxScroll = () =>
      Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

    const tick = () => {
      const diff = target - current;
      if (Math.abs(diff) < 0.5) {
        current = target;
        window.scrollTo(0, current);
        rafId = null;
        return;
      }
      current += diff * ease;
      window.scrollTo(0, current);
      rafId = requestAnimationFrame(tick);
    };

    smoothScrollTo = (y) => {
      target = Math.max(0, Math.min(getMaxScroll(), y));
      if (!rafId) rafId = requestAnimationFrame(tick);
    };

    window.addEventListener(
      "wheel",
      (e) => {
        if (e.ctrlKey || document.body.classList.contains("no-scroll")) return;
        if (e.target.closest("textarea, select, .mobile-menu.is-open")) return;

        target = Math.max(0, Math.min(getMaxScroll(), target + e.deltaY));
        e.preventDefault();
        if (!rafId) rafId = requestAnimationFrame(tick);
      },
      { passive: false }
    );

    window.addEventListener(
      "scroll",
      () => {
        if (!rafId) {
          current = target = window.scrollY;
        }
      },
      { passive: true }
    );
  }

  /* --------------------------------------------------------------------------
     Footer BOOKLEE — local mouse glow + scroll reveal
     -------------------------------------------------------------------------- */
  function initFooterBooklee() {
    const section = $(".footer__signature");
    const glow = $("#footer-booklee-glow");
    const booklee = $(".footer__booklee");

    if (booklee && !booklee.classList.contains("reveal-stagger")) {
      booklee.classList.add("reveal-stagger");
    }

    if (!section || !glow) return;

    if (prefersReducedMotion || !hasFinePointer) {
      section.classList.add("is-glow-active");
      return;
    }

    let glowX = section.offsetWidth / 2;
    let glowY = section.offsetHeight / 2;
    let targetX = glowX;
    let targetY = glowY;

    const setGlowPosition = () => {
      glow.style.left = `${glowX}px`;
      glow.style.top = `${glowY}px`;
    };

    setGlowPosition();

    section.addEventListener(
      "mousemove",
      (e) => {
        const rect = section.getBoundingClientRect();
        targetX = e.clientX - rect.left;
        targetY = e.clientY - rect.top;
        section.classList.add("is-glow-active");
      },
      { passive: true }
    );

    section.addEventListener("mouseleave", () => {
      section.classList.remove("is-glow-active");
      targetX = section.offsetWidth / 2;
      targetY = section.offsetHeight / 2;
    });

    const animateLocalGlow = () => {
      glowX += (targetX - glowX) * 0.12;
      glowY += (targetY - glowY) * 0.12;
      setGlowPosition();
      requestAnimationFrame(animateLocalGlow);
    };
    animateLocalGlow();
  }

  /* --------------------------------------------------------------------------
     Background Particles
     -------------------------------------------------------------------------- */
  function initParticles() {
    if (prefersReducedMotion) return;

    const container = $("#bg-particles");
    if (!container) return;

    const count = window.innerWidth < 768 ? 25 : 45;

    for (let i = 0; i < count; i++) {
      const particle = document.createElement("span");
      particle.className = "particle";
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDuration = `${8 + Math.random() * 12}s`;
      particle.style.animationDelay = `${Math.random() * 10}s`;
      particle.setAttribute("aria-hidden", "true");
      container.appendChild(particle);
    }
  }

  /* --------------------------------------------------------------------------
     Scroll Reveal (Intersection Observer)
     -------------------------------------------------------------------------- */
  function initScrollReveal() {
    const elements = $$(".reveal, .reveal-stagger");
    if (!elements.length) return;

    if (prefersReducedMotion) {
      elements.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    elements.forEach((el) => observer.observe(el));
  }

  /* --------------------------------------------------------------------------
     Hero Parallax
     -------------------------------------------------------------------------- */
  function initParallax() {
    if (prefersReducedMotion) return;

    const parallaxEls = $$("[data-parallax]");
    if (!parallaxEls.length) return;

    const onScroll = () => {
      const scrollY = window.scrollY;
      parallaxEls.forEach((el) => {
        const speed = parseFloat(el.dataset.parallax) || 0.3;
        el.style.transform = `translateY(${scrollY * speed}px)`;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* --------------------------------------------------------------------------
     FAQ Accordion
     -------------------------------------------------------------------------- */
  function initFaq() {
    $$(".faq-item").forEach((item) => {
      const button = $(".faq-item__button", item);
      const answer = $(".faq-item__answer", item);
      if (!button || !answer) return;

      button.addEventListener("click", () => {
        const isOpen = item.classList.contains("is-open");

        $$(".faq-item.is-open").forEach((openItem) => {
          if (openItem !== item) {
            openItem.classList.remove("is-open");
            $(".faq-item__button", openItem)?.setAttribute("aria-expanded", "false");
          }
        });

        item.classList.toggle("is-open", !isOpen);
        button.setAttribute("aria-expanded", String(!isOpen));
      });
    });
  }

  /* --------------------------------------------------------------------------
     Contact form — validation + delivery to SITE_CONTACT.email (FormSubmit)
     -------------------------------------------------------------------------- */
  function initContactForm() {
    const form = $("#contact-form");
    if (!form) return;

    const success = $("#form-success");
    const sendError = $("#form-send-error");
    const submitBtn = form.querySelector('[type="submit"]');
    const submitLabel = submitBtn?.textContent?.trim() || "Send Message";

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const showError = (group, message) => {
      group.classList.add("is-invalid");
      const errorEl = $(".form-error", group);
      if (errorEl) errorEl.textContent = message;
    };

    const clearErrors = () => {
      $$(".form-group", form).forEach((g) => g.classList.remove("is-invalid"));
      sendError?.classList.remove("is-visible");
      success?.classList.remove("is-visible");
    };

    const setSubmitting = (isSubmitting) => {
      if (!submitBtn) return;
      submitBtn.disabled = isSubmitting;
      submitBtn.setAttribute("aria-busy", isSubmitting ? "true" : "false");
      submitBtn.textContent = isSubmitting ? "Sending…" : submitLabel;
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      clearErrors();

      let valid = true;
      const name = $("#name", form);
      const email = $("#email", form);
      const company = $("#company", form);
      const details = $("#details", form);
      const honey = $("#_honey", form);

      if (honey?.value) return;

      if (!name?.value.trim()) {
        showError(name.closest(".form-group"), "Please enter your name.");
        valid = false;
      }

      if (!email?.value.trim() || !validateEmail(email.value)) {
        showError(email.closest(".form-group"), "Please enter a valid email address.");
        valid = false;
      }

      if (!details?.value.trim()) {
        showError(details.closest(".form-group"), "Please share a few details about your project.");
        valid = false;
      }

      if (!valid) return;

      setSubmitting(true);

      try {
        const response = await fetch(SITE_CONTACT.formSubmit, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: name.value.trim(),
            email: email.value.trim(),
            company: company?.value.trim() || "—",
            message: details.value.trim(),
            _subject: "New contact inquiry — Booklee Technologies website",
            _replyto: email.value.trim(),
            _template: "table",
          }),
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(result.message || "Unable to send message.");
        }

        if (success) {
          success.classList.add("is-visible");
          success.setAttribute("tabindex", "-1");
          success.focus();
        }

        form.reset();
      } catch {
        if (sendError) {
          sendError.textContent = `We couldn't send your message right now. Please email us directly at ${SITE_CONTACT.email}.`;
          sendError.classList.add("is-visible");
          sendError.focus();
        }
      } finally {
        setSubmitting(false);
      }
    });
  }

  /* --------------------------------------------------------------------------
     Calendly — load embed script when present
     -------------------------------------------------------------------------- */
  function initCalendly() {
    const widget = $(".calendly-inline-widget");
    const calendlyUrl = SITE_CONTACT.calendly;

    if (widget) {
      if (!widget.dataset.url || widget.dataset.url.includes("your-calendly")) {
        widget.dataset.url = calendlyUrl;
      }
    }

    $$("[data-calendly-link]").forEach((link) => {
      link.href = widget?.dataset.url || calendlyUrl;
    });

    if (!widget) return;

    if (!document.querySelector('script[src*="calendly"]')) {
      const script = document.createElement("script");
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }

  /* --------------------------------------------------------------------------
     Sync official email & social links across the site
     -------------------------------------------------------------------------- */
  function initSiteContact() {
    $$("[data-site-email]").forEach((el) => {
      const email = SITE_CONTACT.email;
      if (el.tagName === "A") {
        el.href = `mailto:${email}`;
      }
    });

    $$('[data-site-email="text"]').forEach((el) => {
      el.textContent = SITE_CONTACT.email;
    });

    $$("[data-site-linkedin]").forEach((el) => {
      if (el.tagName === "A") el.href = SITE_CONTACT.linkedin;
    });

    $$("[data-site-instagram]").forEach((el) => {
      if (el.tagName === "A") el.href = SITE_CONTACT.instagram;
    });

    $$('a[href^="mailto:"]').forEach((el) => {
      if (el.href.includes("hello@booklee.tech") || el.textContent?.includes("hello@booklee")) {
        el.href = `mailto:${SITE_CONTACT.email}`;
        if (el.textContent?.includes("hello@booklee")) {
          el.textContent = SITE_CONTACT.email;
        }
      }
    });

    $$('a[href*="linkedin.com"]').forEach((el) => {
      if (el.href.includes("booklee")) el.href = SITE_CONTACT.linkedin;
    });

    $$('a[href*="instagram.com"]').forEach((el) => {
      if (el.href.includes("booklee")) el.href = SITE_CONTACT.instagram;
    });
  }

  /* --------------------------------------------------------------------------
     Smooth anchor scroll with header offset
     -------------------------------------------------------------------------- */
  function initSmoothAnchors() {
    $$('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        const id = anchor.getAttribute("href");
        if (id === "#" || id.length < 2) return;

        const target = $(id);
        if (!target) return;

        e.preventDefault();
        const headerOffset =
          parseInt(getComputedStyle(document.documentElement).getPropertyValue("--header-offset")) ||
          parseInt(getComputedStyle(document.documentElement).getPropertyValue("--header-logo-height")) ||
          112;
        const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;

        if (smoothScrollTo && !prefersReducedMotion) {
          smoothScrollTo(top);
        } else {
          window.scrollTo({ top, behavior: prefersReducedMotion ? "auto" : "smooth" });
        }
      });
    });
  }

  /* --------------------------------------------------------------------------
     Count-up animation (hero stats)
     -------------------------------------------------------------------------- */
  function initCountUp() {
    const counters = $$("[data-count]");
    if (!counters.length) return;

    const runCounter = (el) => {
      if (el.dataset.animated === "true") return;
      el.dataset.animated = "true";

      const target = parseFloat(el.dataset.count) || 0;
      const suffix = el.dataset.suffix || "";
      const duration = prefersReducedMotion ? 0 : 2000;
      const startTime = performance.now();

      const tick = (now) => {
        const elapsed = now - startTime;
        const progress = duration === 0 ? 1 : Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(target * eased);
        el.textContent = `${value}${suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    };

    if (prefersReducedMotion) {
      counters.forEach((el) => {
        el.textContent = `${el.dataset.count}${el.dataset.suffix || ""}`;
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((el) => observer.observe(el));
  }

  /* --------------------------------------------------------------------------
     Services assemble animation
     -------------------------------------------------------------------------- */
  function initServicesAssemble() {
    const grids = $$(".services-assemble");
    if (!grids.length) return;

    if (prefersReducedMotion) {
      grids.forEach((grid) => grid.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    grids.forEach((grid) => observer.observe(grid));
  }

  /* --------------------------------------------------------------------------
     Service cards — subtle 3D tilt follow mouse
     -------------------------------------------------------------------------- */
  function initServiceCardEffects() {
    if (prefersReducedMotion || !hasFinePointer) return;

    $$(".service-card").forEach((card) => {
      card.addEventListener(
        "mousemove",
        (e) => {
          const grid = card.closest(".services-assemble");
          if (!grid?.classList.contains("is-visible")) return;

          const rect = card.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;

          card.style.setProperty("--mouse-x", x.toFixed(3));
          card.style.setProperty("--mouse-y", y.toFixed(3));
          card.style.setProperty("--tilt-y", `${(x * 8).toFixed(2)}deg`);
          card.style.setProperty("--tilt-x", `${(y * -6).toFixed(2)}deg`);
        },
        { passive: true }
      );

      card.addEventListener("mouseleave", () => {
        card.style.setProperty("--mouse-x", "0");
        card.style.setProperty("--mouse-y", "0");
        card.style.setProperty("--tilt-x", "0deg");
        card.style.setProperty("--tilt-y", "0deg");
      });
    });
  }

  /* --------------------------------------------------------------------------
     Timeline scroll-driven line (About page)
     -------------------------------------------------------------------------- */
  function initTimelineScroll() {
    const timeline = $("#company-timeline");
    if (!timeline) return;

    const fill = $("#timeline-line-fill");
    const marker = $("#timeline-line-marker");
    const line = $(".timeline__line", timeline);
    const items = $$(".timeline__item", timeline);
    if (!items.length) return;

    const DOT_OFFSET = 10;
    let ticking = false;
    let trackStart = 0;
    let trackHeight = 1;

    const measureTrack = () => {
      const timelineRect = timeline.getBoundingClientRect();
      const firstRect = items[0].getBoundingClientRect();
      const lastRect = items[items.length - 1].getBoundingClientRect();

      trackStart = firstRect.top + DOT_OFFSET - timelineRect.top;
      const trackEnd = lastRect.top + DOT_OFFSET - timelineRect.top;
      trackHeight = Math.max(trackEnd - trackStart, 1);

      if (line) {
        line.style.top = `${trackStart}px`;
        line.style.bottom = "auto";
        line.style.height = `${trackHeight}px`;
      }

      return { timelineRect, firstDocY: firstRect.top + DOT_OFFSET, lastDocY: lastRect.top + DOT_OFFSET };
    };

    const update = () => {
      ticking = false;
      const { timelineRect, firstDocY, lastDocY } = measureTrack();
      const vh = window.innerHeight;
      const scrollCenter = window.scrollY + vh * 0.5;
      const firstDotDoc = window.scrollY + firstDocY;
      const lastDotDoc = window.scrollY + lastDocY;
      const range = lastDotDoc - firstDotDoc;

      let progress = range > 0 ? (scrollCenter - firstDotDoc) / range : 0;

      if (lastDocY < vh * 0.42) progress = 1;
      if (firstDocY > vh * 0.58) progress = 0;

      progress = Math.max(0, Math.min(1, progress));

      const percent = progress * 100;
      if (fill) fill.style.height = `${percent}%`;
      if (marker) marker.style.top = `${percent}%`;

      const isComplete = progress >= 0.995;

      items.forEach((item, index) => {
        const itemRect = item.getBoundingClientRect();
        const dotLocal = itemRect.top + DOT_OFFSET - timelineRect.top;
        const itemPercent = ((dotLocal - trackStart) / trackHeight) * 100;

        item.classList.toggle("is-passed", isComplete || itemPercent <= percent + 1);
        item.classList.toggle(
          "is-active",
          isComplete ? index === items.length - 1 : Math.abs(itemPercent - percent) < 8
        );
      });
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    if (prefersReducedMotion) {
      measureTrack();
      if (fill) fill.style.height = "100%";
      if (marker) marker.style.top = "100%";
      items.forEach((item) => item.classList.add("is-passed"));
      items[items.length - 1].classList.add("is-active");
      return;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", debounce(update, 120));

    if ("ResizeObserver" in window) {
      const ro = new ResizeObserver(debounce(update, 80));
      ro.observe(timeline);
      items.forEach((item) => ro.observe(item));
    }

    update();
  }

  /* --------------------------------------------------------------------------
     Why Booklee flowchart — reveal steps on scroll
     -------------------------------------------------------------------------- */
  function initWhyUsFlow() {
    const section = $("#why-us");
    const flow = $("#why-us-flow");
    if (!section || !flow) return;

    const steps = $$(".why-us__step", flow);
    const connectors = $$(".why-us__connector", flow);
    const spineFill = $("#why-us-spine-fill");
    const flowItems = $$("[data-flow-step]", flow);

    if (!flowItems.length) return;

    const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

    const update = () => {
      const sectionRect = section.getBoundingClientRect();
      const flowRect = flow.getBoundingClientRect();
      const vh = window.innerHeight;
      const triggerY = vh * 0.58;

      const scrollStart = vh * 0.85;
      const scrollEnd = vh * 0.25;
      const sectionProgress = clamp(
        (scrollStart - sectionRect.top) / (scrollStart - scrollEnd + sectionRect.height * 0.5),
        0,
        1
      );

      if (spineFill) {
        const spineTop = flowRect.top + 24;
        const spineHeight = flowRect.height - 48;
        const fillPx = sectionProgress * spineHeight;
        spineFill.style.height = `${fillPx}px`;
      }

      steps.forEach((step) => {
        const rect = step.getBoundingClientRect();
        const center = rect.top + rect.height * 0.35;
        if (center < triggerY) {
          step.classList.add("is-visible");
        }
      });

      connectors.forEach((conn) => {
        const rect = conn.getBoundingClientRect();
        const lineFill = $(".why-us__arrow-line-fill", conn);
        const connTop = rect.top;
        const connBottom = rect.bottom;
        const connHeight = rect.height || 1;

        let fillRatio = clamp((triggerY - connTop) / connHeight, 0, 1);
        if (connBottom < triggerY) fillRatio = 1;

        if (lineFill) {
          lineFill.style.height = `${fillRatio * 100}%`;
        }

        conn.classList.toggle("is-active", fillRatio > 0.15 && fillRatio < 1);
        conn.classList.toggle("is-complete", fillRatio >= 1);
      });
    };

    if (prefersReducedMotion) {
      steps.forEach((s) => s.classList.add("is-visible"));
      connectors.forEach((c) => {
        c.classList.add("is-complete");
        const fill = $(".why-us__arrow-line-fill", c);
        if (fill) fill.style.height = "100%";
      });
      if (spineFill) spineFill.style.height = "100%";
      return;
    }

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          update();
          ticking = false;
        });
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", debounce(update, 100));
    update();
  }

  /* --------------------------------------------------------------------------
     Lazy load images
     -------------------------------------------------------------------------- */
  function initLazyImages() {
    const images = $$("img[loading='lazy']");
    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute("data-src");
            }
            observer.unobserve(img);
          }
        });
      },
      { rootMargin: "100px" }
    );

    images.forEach((img) => observer.observe(img));
  }

  /* --------------------------------------------------------------------------
     Initialize all modules
     -------------------------------------------------------------------------- */
  function init() {
    initPageLoader();
    initScrollProgress();
    initHeader();
    initActiveNav();
    initMobileMenu();
    initAppleSmoothScroll();
    initCustomCursor();
    initServiceCards();
    initMouseGradient();
    initParticles();
    initScrollReveal();
    initFooterBooklee();
    initCountUp();
    initServicesAssemble();
    initServiceCardEffects();
    initWhyUsFlow();
    initTimelineScroll();
    initParallax();
    initFaq();
    initContactForm();
    initSiteContact();
    initCalendly();
    initSmoothAnchors();
    initLazyImages();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
