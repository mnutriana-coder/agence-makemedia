/* Make Media — JS */

/* === NAV scroll === */
const nav = document.getElementById('nav');
const onScroll = () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* === Burger menu === */
const burgerBtn = document.getElementById('burgerBtn');
const navLinks  = document.getElementById('navLinks');

burgerBtn?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  burgerBtn.classList.toggle('open', open);
  burgerBtn.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

navLinks?.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burgerBtn?.classList.remove('open');
    burgerBtn?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

/* === Reveal on scroll (IntersectionObserver) === */
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => observer.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('visible'));
}

/* === Counter animation === */
const counters = document.querySelectorAll('.stats__number[data-target]');
const animateCounter = el => {
  const target = parseFloat(el.dataset.target);
  const isDecimal = target % 1 !== 0;
  const duration = 1600;
  const start = performance.now();
  const update = now => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const value = target * ease;
    el.textContent = isDecimal ? value.toFixed(1) : Math.round(value);
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
};

if ('IntersectionObserver' in window) {
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        counterObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => counterObserver.observe(el));
}

/* === Contact form === */
const form = document.getElementById('contactForm');
form?.addEventListener('submit', e => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  const name = form.name?.value?.trim();
  const tel  = form.tel?.value?.trim();

  if (!name || !tel) {
    showFormMessage('Veuillez remplir votre nom et téléphone.', 'error');
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Envoi en cours…';

  const subject = encodeURIComponent(`[Make Media] Message de ${name}`);
  const body = encodeURIComponent(
    `Nom: ${name}\nTéléphone: ${tel}\nProfil: ${form.activite?.value || 'N/A'}\n\nMessage:\n${form.message?.value?.trim() || '—'}`
  );
  window.location.href = `mailto:makemedia.officiel@gmail.com?subject=${subject}&body=${body}`;

  setTimeout(() => {
    btn.disabled = false;
    btn.textContent = 'Envoyer le message';
    showFormMessage('Merci ! Votre message a été préparé. Réponse sous 24h.', 'success');
    form.reset();
  }, 800);
});

function showFormMessage(text, type) {
  document.querySelector('.form-msg')?.remove();
  const msg = document.createElement('p');
  msg.className = 'form-msg';
  msg.textContent = text;
  msg.style.cssText = `
    grid-column: 1/-1;
    font-size:.85rem;
    padding:10px 14px;
    border-radius:4px;
    background:${type === 'success' ? 'rgba(201,168,76,.12)' : 'rgba(220,53,69,.12)'};
    border:1px solid ${type === 'success' ? 'rgba(201,168,76,.4)' : 'rgba(220,53,69,.4)'};
    color:${type === 'success' ? '#C9A84C' : '#f87171'};
  `;
  form.appendChild(msg);
  setTimeout(() => msg.remove(), 5000);
}
