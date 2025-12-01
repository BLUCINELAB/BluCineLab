document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const navLinks = document.querySelectorAll(".main-nav a");

  /* ==============================
     Smooth scroll nav
     ============================== */
  navLinks.forEach(link => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");

      if (href && href.startsWith("#")) {
        event.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  });

  /* ==============================
     Form contatti (anteprima)
     ============================== */
  if (form) {
    const successMessage = document.createElement("p");
    successMessage.className = "form-note";
    successMessage.style.marginTop = "0.9rem";
    successMessage.style.color = "#3df5ff";
    successMessage.style.display = "none";
    successMessage.textContent =
      "Messaggio registrato in anteprima. Ti risponderemo via email appena il sistema sarà attivo.";
    form.appendChild(successMessage);

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const payload = {};

      for (const [key, value] of formData.entries()) {
        payload[key] = value.trim();
      }

      // Validazione base
      if (!payload.name || !payload.email || !payload.message) {
        alert("Compila tutti i campi prima di inviare.");
        return;
      }

      console.log("Contatto BluCineLab:", payload);
      console.log("Email di riferimento:", "blucinelab@gmail.com");

      form.reset();
      successMessage.style.display = "block";

      setTimeout(() => {
        successMessage.style.display = "none";
      }, 4000);
    });
  }
});
