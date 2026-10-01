const form = document.querySelector('#enquiry');
const service = document.querySelector('#service');
document.querySelectorAll('[data-service]').forEach(link => link.addEventListener('click', () => { service.value = link.dataset.service; }));
document.querySelector('#year').textContent = new Date().getFullYear();
form.addEventListener('submit', event => {
  event.preventDefault();
  const area = document.querySelector('#area').value.trim();
  if (!area) { document.querySelector('#area').setCustomValidity('Please enter your area.'); document.querySelector('#area').reportValidity(); return; }
  const detail = document.querySelector('#details').value.trim();
  const message = `Hello Bluey! I’d like to enquire about ${service.value.toLowerCase()}.\nArea: ${area}${detail ? `\nDetails: ${detail}` : ''}\nPlease let me know your availability and what you need for a quote.`;
  document.querySelector('#prepared-message').value = message;
  document.querySelector('#message-result').hidden = false;
  document.querySelector('#prepared-message').focus();
  window.open('https://wa.me/2348128920329?text=' + encodeURIComponent(message), '_blank', 'noopener,noreferrer');
});
document.querySelector('#area').addEventListener('input', event => event.target.setCustomValidity(''));
document.querySelector('#copy-message').addEventListener('click', async () => {
  const field = document.querySelector('#prepared-message');
  try { await navigator.clipboard.writeText(field.value); document.querySelector('#copy-status').textContent = 'Copied. You can now share your enquiry with Bluey.'; }
  catch { field.focus(); field.select(); document.querySelector('#copy-status').textContent = 'Select and copy the message above to share with Bluey.'; }
});

// Content remains visible if animation support or JavaScript is unavailable.
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const motionToggle = document.querySelector('.motion-toggle');
let motionPaused = false;
const syncMotion = () => {
  document.body.classList.toggle('motion-paused', motionPaused || motionPreference.matches);
  motionToggle.hidden = motionPreference.matches;
  motionToggle.setAttribute('aria-pressed', String(motionPaused));
  motionToggle.textContent = motionPaused ? 'Resume animations' : 'Pause animations';
};
motionToggle.addEventListener('click', () => { motionPaused = !motionPaused; syncMotion(); });
motionPreference.addEventListener('change', syncMotion);
syncMotion();
// The widget opens WhatsApp only when the visitor chooses to continue.
const whatsappToggle = document.querySelector('#whatsapp-toggle');
const whatsappPanel = document.querySelector('#whatsapp-panel');
const closeWhatsApp = () => {
  whatsappPanel.hidden = true;
  whatsappToggle.setAttribute('aria-expanded', 'false');
  whatsappToggle.focus();
};
whatsappToggle.hidden = false;
whatsappToggle.addEventListener('click', () => {
  const isOpen = whatsappToggle.getAttribute('aria-expanded') === 'true';
  whatsappPanel.hidden = isOpen;
  whatsappToggle.setAttribute('aria-expanded', String(!isOpen));
  if (!isOpen) document.querySelector('#whatsapp-close').focus();
});
document.querySelector('#whatsapp-close').addEventListener('click', closeWhatsApp);
document.querySelector('.whatsapp-widget').addEventListener('keydown', event => {
  if (event.key === 'Escape' && !whatsappPanel.hidden) closeWhatsApp();
});

const feedbackMessage = document.querySelector('#feedback-message');
feedbackMessage.addEventListener('input', () => feedbackMessage.setCustomValidity(''));
document.querySelector('#feedback-form').addEventListener('submit', event => {
  event.preventDefault();
  const detail = feedbackMessage.value.trim();
  if (!detail) {
    feedbackMessage.setCustomValidity('Please add your feedback.');
    feedbackMessage.reportValidity();
    return;
  }
  const name = document.querySelector('#feedback-name').value.trim();
  const type = document.querySelector('#feedback-type').value;
  const rating = document.querySelector('#feedback-rating').value;
  const message = `Hello Bluey! I’d like to share feedback.\nType: ${type}${name ? `\nName: ${name}` : ''}${rating ? `\nRating: ${rating}` : ''}\nFeedback: ${detail}`;
  document.querySelector('#feedback-prepared').value = message;
  document.querySelector('#feedback-result').hidden = false;
  document.querySelector('#feedback-status').textContent = '';
  document.querySelector('#feedback-prepared').focus();
  window.open('https://wa.me/2348128920329?text=' + encodeURIComponent(message), '_blank', 'noopener,noreferrer');
});
document.querySelector('#copy-feedback').addEventListener('click', async () => {
  const field = document.querySelector('#feedback-prepared');
  try {
    await navigator.clipboard.writeText(field.value);
    document.querySelector('#feedback-status').textContent = 'Copied. You can now share your feedback with Bluey.';
  } catch {
    field.focus();
    field.select();
    document.querySelector('#feedback-status').textContent = 'Select and copy the message above to share with Bluey.';
  }
});
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      if (!motionPreference.matches && !motionPaused) entry.target.classList.add('reveal-in');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.section-heading, .service-grid article, .approach-art, .approach-copy, .faq-list, .contact > div, #enquiry').forEach(element => {
    revealObserver.observe(element);
  });
}
