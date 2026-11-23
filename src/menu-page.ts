import './style.css';
import { createHeader } from './components/header';
import { createMenuPage } from './components/menu-viewer';
import { createFooter } from './components/footer';
// Phone rules shared with the home page (header, menu sheet, footer), last.
import './mobile-layout.css';

const app = document.querySelector<HTMLDivElement>('#app');

if (app) {
  app.append(createHeader(), createMenuPage(), createFooter());
}
