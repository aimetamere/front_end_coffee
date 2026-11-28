import './style.css';
import { createHeader } from './components/header';
import { createMenuPage } from './components/menu-viewer';
import { createContact } from './components/contact';
import { createFooter } from './components/footer';
import { loadContent } from './api';
import { applyContent } from './components/cafe-info';

applyContent(await loadContent());

const app = document.querySelector<HTMLDivElement>('#app');

if (app) {
  const main = document.createElement('main');
  main.append(createMenuPage(), createContact());
  app.append(createHeader(), main, createFooter());
}
