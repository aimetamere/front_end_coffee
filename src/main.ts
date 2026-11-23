import './style.css';
import { createHeader } from './components/header';
import { createHero } from './components/hero';
import { createAbout } from './components/about';
import { createGallery } from './components/gallery';
import { createFooter } from './components/footer';

history.scrollRestoration = 'manual';

/** Starts at the top, unless the address names a section (e.g. /#about from the menu page). */
const scrollToStart = () => {
  const target = location.hash ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null;
  if (target) target.scrollIntoView();
  else window.scrollTo(0, 0);
};
window.addEventListener('pageshow', scrollToStart);

const app = document.querySelector<HTMLDivElement>('#app');

if (app) {
  const main = document.createElement('main');
  main.innerHTML = `<h1 class="visually-hidden">Café du Conservatoire</h1>`;
  main.append(createHero(), createAbout(), createGallery());

  app.append(createHeader(), main, createFooter());
}

scrollToStart();
