import './style.css';
import { createHeader } from './components/header';
import { createFooter } from './components/footer';
import { createCarousel, type Slide } from './style/carousel';

const heroSlides: Slide[] = [
  { src: '/photo/web/dsf2397.jpg', alt: 'La salle du café, avec des clients attablés' },
  { src: '/photo/web/dsf2361.jpg', alt: 'Un cuisinier dresse des assiettes en cuisine' },
  { src: '/photo/web/dsf2395.jpg', alt: 'Deux assiettes de pâtes passées au service' },
  { src: '/photo/web/dsf2428.jpg', alt: 'Des pâtes versées dans une assiette en faïence bleue' },
  { src: '/photo/web/dsf2453.jpg', alt: 'Assiettes de pâtes en sauce prêtes à être servies' },
  { src: '/photo/web/dsf2515.jpg', alt: 'Un membre de l’équipe en cuisine' },
  { src: '/photo/web/dsf2605.jpg', alt: 'Dressage des entrées sur le passe' },
  { src: '/photo/web/dsf2672.jpg', alt: 'Finitions sur une série d’assiettes' },
  { src: '/photo/web/dsf2679.jpg', alt: 'Soupes et salades alignées sur le passe' },
];

const app = document.querySelector<HTMLDivElement>('#app');

if (app) {
  const main = document.createElement('main');
  main.className = 'hero';
  main.innerHTML = `<h1 class="visually-hidden">Café du Conservatoire</h1>`;
  main.append(createCarousel(heroSlides));

  app.append(createHeader(), main, createFooter());
}
