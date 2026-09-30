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
