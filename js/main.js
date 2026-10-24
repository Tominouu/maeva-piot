// Apparition des blocs au défilement
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach((el) => observer.observe(el));
} else {
  reveals.forEach((el) => el.classList.add('visible'));
}

// Visionneuse (galerie photo et flyers)
const zoomables = [...document.querySelectorAll('[data-zoom]')];
if (zoomables.length) {
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-label', 'Visionneuse');
  lightbox.innerHTML = `
    <img alt="">
    <button class="lightbox__fermer" type="button" aria-label="Fermer">✕</button>
    <button class="lightbox__prec" type="button" aria-label="Image précédente">‹</button>
    <button class="lightbox__suiv" type="button" aria-label="Image suivante">›</button>`;
  document.body.appendChild(lightbox);

  const image = lightbox.querySelector('img');
  let index = 0;
  let declencheur = null;

  const afficher = (i) => {
    index = (i + zoomables.length) % zoomables.length;
    const source = zoomables[index].querySelector('img');
    image.src = source.currentSrc || source.src;
    image.alt = source.alt;
  };
  const ouvrir = (i) => {
    declencheur = document.activeElement;
    afficher(i);
    lightbox.classList.add('ouverte');
    document.body.style.overflow = 'hidden';
    lightbox.querySelector('.lightbox__fermer').focus();
  };
  const fermer = () => {
    lightbox.classList.remove('ouverte');
    document.body.style.overflow = '';
    if (declencheur) declencheur.focus();
  };

  zoomables.forEach((el, i) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      ouvrir(i);
    });
  });
  lightbox.querySelector('.lightbox__fermer').addEventListener('click', fermer);
  lightbox.querySelector('.lightbox__prec').addEventListener('click', () => afficher(index - 1));
  lightbox.querySelector('.lightbox__suiv').addEventListener('click', () => afficher(index + 1));
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) fermer();
  });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('ouverte')) return;
    if (e.key === 'Escape') fermer();
    if (e.key === 'ArrowLeft') afficher(index - 1);
    if (e.key === 'ArrowRight') afficher(index + 1);
  });
}
