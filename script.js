document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const payload = {};

      for (const [key, value] of formData.entries()) {
        payload[key] = value;
      }

      // Log per debug / prototipo
      console.log("Contatto BluCineLab:", payload);
      console.log("Email di riferimento:", "blucinelab@gmail.com");

      alert("Grazie per il tuo messaggio! Ti risponderemo al più presto.");
      form.reset();
    });
  }
});
