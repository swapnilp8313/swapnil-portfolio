/* ==========================================================================
   Swapnil Pawar — Portfolio scripts
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile navigation ---------- */
  const toggle = document.querySelector(".mobile-nav-toggle");
  const navLinks = document.getElementById("navLinks");

  function setMenu(open) {
    if (!toggle || !navLinks) return;
    navLinks.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.querySelector("i").className = open ? "ri-close-line" : "ri-menu-line";
  }

  if (toggle && navLinks) {
    toggle.addEventListener("click", () => {
      setMenu(!navLinks.classList.contains("open"));
    });

    // Close the menu after choosing a link
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenu(false));
    });

    // Close with Escape
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setMenu(false);
    });
  }

  /* ---------- Highlight the nav link for the section in view ---------- */
  const sections = document.querySelectorAll("main section[id]");
  const links = document.querySelectorAll(".nav-links a");

  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((link) => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === "#" + entry.target.id
            );
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((section) => spy.observe(section));
  }

  /* ---------- Fade-in on scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const reveal = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    revealEls.forEach((el) => reveal.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  /* ---------- Contact form ---------- */
  // To receive messages directly, create a free form at https://formspree.io
  // and paste its URL into the form's data-endpoint attribute in index.html,
  // e.g. data-endpoint="https://formspree.io/f/yourFormId".
  // Without an endpoint, the form opens the visitor's email app instead.
  const form = document.getElementById("contactForm");
  const message = document.getElementById("formMessage");
  const TO_EMAIL = "swapnilp8313@gmail.com";

  function showMessage(type, text) {
    message.className = "form-message " + type;
    message.textContent = text;
  }

  if (form && message) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const data = new FormData(form);
      const name = data.get("name").trim();
      const email = data.get("email").trim();
      const body = data.get("message").trim();
      const endpoint = (form.dataset.endpoint || "").trim();
      const button = form.querySelector("button[type='submit']");

      if (!endpoint) {
        const subject = encodeURIComponent("Portfolio enquiry from " + name);
        const mailBody = encodeURIComponent(body + "\n\n— " + name + " (" + email + ")");
        window.location.href = "mailto:" + TO_EMAIL + "?subject=" + subject + "&body=" + mailBody;
        showMessage("success", "Opening your email app. Send the draft to reach me.");
        return;
      }

      button.disabled = true;
      showMessage("success", "Sending…");

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ name, email, message: body }),
        });

        if (!response.ok) throw new Error("Request failed");

        form.reset();
        showMessage("success", "Message sent. Thanks " + name + ", I'll reply soon.");
      } catch (error) {
        showMessage(
          "error",
          "Message not sent. Please try again or email me at " + TO_EMAIL + "."
        );
      } finally {
        button.disabled = false;
      }
    });
  }
});
