import './style.css';
import { createHeader } from './components/header';
import { createMenuPage } from './components/menu-viewer';
import { createContact } from './components/contact';
import { createFooter } from './components/footer';

const app = document.querySelector<HTMLDivElement>('#app');

if (app) {
  const main = document.createElement('main');
  main.append(createMenuPage(), createContact());
  const header = createHeader();
  // Desktop: a way back to the landing page from the corner (header.css).
  header.classList.add('site-header--home-link');
  app.append(header, main, createFooter());
}
