import './style.css';
import { createHeader } from './components/header';
import { createHero } from './components/hero';
import { createFooter } from './components/footer';
import './mobile-style.css';

const app = document.querySelector<HTMLDivElement>('#app');

if (app) {
  const main = document.createElement('main');
  main.innerHTML = `<h1 class="visually-hidden">Café du Conservatoire</h1>`;
  main.append(createHero());

  app.append(createHeader(), main, createFooter());
}
