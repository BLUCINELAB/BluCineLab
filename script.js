document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    alert('Grazie per il tuo messaggio! Ti risponderemo al più presto.');
    form.reset();
  });
});
