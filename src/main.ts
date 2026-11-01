import './style.css';
import { createHeader } from './components/header';
import { createHero } from './components/hero';
import { createAbout } from './components/about';
import { createFooter } from './components/footer';
import './mobile-style.css';

history.scrollRestoration = 'manual';
window.scrollTo(0, 0);
window.addEventListener('pageshow', () => window.scrollTo(0, 0));

const app = document.querySelector<HTMLDivElement>('#app');

if (app) {
  const main = document.createElement('main');
  main.innerHTML = `<h1 class="visually-hidden">Café du Conservatoire</h1>`;
  main.append(createHero(), createAbout());

  app.append(createHeader(), main, createFooter());
}
