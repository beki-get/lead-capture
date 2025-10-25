// embed.js - clients include <script src="https://lead-capture-two.vercel.app/embed.js" data-user-email="client@gmail.com"></script>
(function () {
  try {
    const currentScript = document.currentScript;
    const userEmail = currentScript?.getAttribute('data-user-email') || '';
    const container = document.createElement('div');
    container.style.maxWidth = '420px';
    container.style.margin = '0 auto';
    const iframe = document.createElement('iframe');

    const src = new URL('https://lead-capture-two.vercel.app/embed-form');
    if (userEmail) src.searchParams.set('userEmail', userEmail);

    iframe.src = src.toString();
    iframe.style.width = '100%';
    iframe.style.height = '640px';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '12px';
    iframe.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)';

    container.appendChild(iframe);
    currentScript.parentNode.insertBefore(container, currentScript.nextSibling);
  } catch (e) {
    // fail silently
    console.error('embed.js error', e);
  }
})();
