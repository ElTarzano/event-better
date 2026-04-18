document.addEventListener("DOMContentLoaded", function () {

  /* ── 1. NAV SCROLL BEHAVIOUR (IntersectionObserver) ── */
  const body = document.body;

  // Sentinel element at the very top
  const sentinel = document.getElementById("observe-top");
  if (sentinel) {
    const sentinelObserver = new IntersectionObserver((entries) => {
      if (entries[0].boundingClientRect.y < 0) {
        body.classList.add("observe-top");
        body.classList.add("scrolled");
      } else {
        body.classList.remove("observe-top");
        body.classList.remove("scrolled");
      }
    });
    sentinelObserver.observe(sentinel);
  }

  // Hero zone — białe kolory nav gdy hero jest widoczny
  const heroSection = document.getElementById("hero");
  if (heroSection) {
    const heroObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          body.classList.add("hero-zone");
        } else {
          body.classList.remove("hero-zone");
        }
      },
      { threshold: 0.1 }
    );
    heroObserver.observe(heroSection);
  }


  /* ── 2. HAMBURGER / MOBILE MENU ── */
  const hamburger   = document.getElementById("hamburger");
  const mobileMenu  = document.getElementById("mobile-menu");
  const mobileLinks = document.querySelectorAll(".mobile-link");

  function openMenu() {
    mobileMenu.classList.add("open");
    mobileMenu.setAttribute("aria-hidden", "false");
    hamburger.setAttribute("aria-expanded", "true");
    body.style.overflow = "hidden";
  }

  function closeMenu() {
    mobileMenu.classList.remove("open");
    mobileMenu.setAttribute("aria-hidden", "true");
    hamburger.setAttribute("aria-expanded", "false");
    body.style.overflow = "";
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.contains("open");
      isOpen ? closeMenu() : openMenu();
    });

    // Close on link click
    mobileLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    // Close on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mobileMenu.classList.contains("open")) {
        closeMenu();
        hamburger.focus();
      }
    });
  }


  /* ── 3. ACTIVE NAV LINK (IntersectionObserver) ── */
  const sections  = document.querySelectorAll("section[id]");
  const navLinks  = document.querySelectorAll(".nav-link");

  function setActive(id) {
    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      link.classList.toggle("active", href === `#${id}`);
    });
  }

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );

  sections.forEach((s) => sectionObserver.observe(s));


  /* ── 4. SCROLL REVEAL ── */
  const revealEls = document.querySelectorAll(
    "h1, h2, .hero-eyebrow, .hero-lead, .btn, .section-label, .text-columns p, .card, .testimonial, .contact-lead, .contact-form"
  );

  revealEls.forEach((el) => el.classList.add("reveal"));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealEls.forEach((el) => revealObserver.observe(el));


  /* ── 5. CONTACT FORM — Netlify AJAX submit ── */
  const form        = document.getElementById("contact-form");
  const submitBtn   = form ? form.querySelector(".btn--submit") : null;
  const successMsg  = document.getElementById("form-success");

  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      // Basic HTML5 validation check
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      submitBtn.classList.add("btn--loading");
      submitBtn.disabled = true;

      const formData = new FormData(form);
      const body = new URLSearchParams(formData).toString();

      try {
        const res = await fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body,
        });

        if (res.ok) {
          form.reset();
          if (successMsg) {
            successMsg.classList.add("visible");
            successMsg.scrollIntoView({ behavior: "smooth", block: "nearest" });
          }
        } else {
          alert("Coś poszło nie tak. Spróbuj ponownie lub napisz bezpośrednio na email.");
        }
      } catch {
        alert("Brak połączenia. Sprawdź internet i spróbuj ponownie.");
      } finally {
        submitBtn.classList.remove("btn--loading");
        submitBtn.disabled = false;
      }
    });
  }


  /* ── 6. FOOTER YEAR ── */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
