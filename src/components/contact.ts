import './contact.css';
import { CAFE, HOURS } from './cafe-info';
import { escapeHtml, hasApi, submitForm } from '../api';

const icons = {
  pin: `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></svg>`,
  phone: `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3h3.5l1.7 4.3-2.2 1.4a11 11 0 0 0 5.3 5.3l1.4-2.2L19 13.5V17a2 2 0 0 1-2 2A15 15 0 0 1 3 5a2 2 0 0 1 2-2Z" /></svg>`,
  plane: `<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M2.6 10.6 20.2 3.3c.9-.4 1.8.5 1.4 1.4l-7.3 17.6c-.4 1-1.8.9-2.1-.1l-1.9-6.4a1 1 0 0 0-.6-.6l-6.4-1.9c-1-.3-1.1-1.7-.1-2.1Z" /></svg>`,
  check: `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>`,
  mail: `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></svg>`,
};

/** The label's letters, each in its own span so they can rise one after another. */
const letters = (text: string) =>
  [...text]
    .map((char, i) => `<span class="field__char" style="--i: ${i}">${char === ' ' ? '&nbsp;' : char}</span>`)
    .join('');

/** Button letters: the outer span drops in on load, the inner one waves on hover. */
const buttonLetters = (text: string) =>
  [...text]
    .map((char, i) => `<span class="send-btn__char" style="--i: ${i}"><span>${char}</span></span>`)
    .join('');

/** A text field whose label sits in the field and floats above it on focus or once filled. */
const field = (name: string, label: string, type: string, extra = '') => {
  const control =
    type === 'textarea'
      ? `<textarea class="field__input field__input--area" id="contact-${name}" name="${name}" rows="5" placeholder=" " ${extra}></textarea>`
      : `<input class="field__input" id="contact-${name}" name="${name}" type="${type}" placeholder=" " ${extra} />`;
  return `
    <div class="field">
      ${control}
      <label class="field__label" for="contact-${name}">
        <span class="visually-hidden">${label}</span>
        <span class="field__chars" aria-hidden="true">${letters(label)}</span>
      </label>
    </div>`;
};

/** Contact block for the menu page: address, phone, email and hours, then a form. It posts to
 *  the backend when there is one; otherwise (or if that fails) it opens the visitor's mail app. */
export function createContact(): HTMLElement {
  const section = document.createElement('section');
  section.id = 'contact';
  section.className = 'contact';
  section.setAttribute('aria-labelledby', 'contact-title');
  section.innerHTML = `
    <h2 id="contact-title" class="contact__title">Contact</h2>
    <div class="contact__inner">
      <div class="contact__info">
        <p class="contact__line">
          <span class="contact__icon">${icons.pin}</span>
          <span>${escapeHtml(CAFE.street)}<br />${escapeHtml(CAFE.city)}</span>
        </p>
        <p class="contact__line">
          <span class="contact__icon">${icons.phone}</span>
          <a href="${escapeHtml(CAFE.phoneHref)}">${escapeHtml(CAFE.phone)}</a>
        </p>
        <p class="contact__line">
          <span class="contact__icon">${icons.mail}</span>
          <a href="mailto:${escapeHtml(CAFE.email)}">${escapeHtml(CAFE.email)}</a>
        </p>
        <p class="contact__hours">${HOURS.map(escapeHtml).join('<br />')}</p>
      </div>
      <form class="contact__form" novalidate>
        <div class="contact__names">
          ${field('prenom', 'Prénom', 'text', 'autocomplete="given-name"')}
          ${field('nom', 'Nom de famille', 'text', 'autocomplete="family-name"')}
        </div>
        ${field('email', 'E-mail', 'email', 'autocomplete="email" required aria-describedby="contact-note"')}
        ${field('message', 'Contacter', 'textarea')}
        <!-- Honeypot: invisible to people, tempting to bots. -->
        <input type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" style="position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0" />
        <p class="contact__note" id="contact-note" role="status" aria-live="polite"></p>
        <button type="submit" class="send-btn">
          <span class="send-btn__outline" aria-hidden="true"></span>
          <span class="send-btn__state send-btn__state--default" aria-hidden="true">
            <span class="send-btn__icon send-btn__icon--plane">${icons.plane}</span>
            <span class="send-btn__text">${buttonLetters('Envoyer')}</span>
          </span>
          <span class="send-btn__state send-btn__state--sent" aria-hidden="true">
            <span class="send-btn__icon">${icons.check}</span>
            <span class="send-btn__text">${buttonLetters('Envoyé')}</span>
          </span>
          <span class="visually-hidden send-btn__name">Envoyer</span>
        </button>
      </form>
    </div>
  `;

  const form = section.querySelector<HTMLFormElement>('.contact__form')!;
  const email = form.querySelector<HTMLInputElement>('#contact-email')!;
  const note = form.querySelector<HTMLElement>('.contact__note')!;
  const button = form.querySelector<HTMLButtonElement>('.send-btn')!;
  const buttonName = button.querySelector<HTMLElement>('.send-btn__name')!;
  let resetTimer = 0;

  /** The plane flies off, then the label turns to "Envoyé"; back to "Envoyer" a little later. */
  const playSent = () => {
    window.clearTimeout(resetTimer);
    button.classList.remove('is-sending', 'is-sent');
    void button.offsetWidth; // restart the animations if sent again
    button.classList.add('is-sending');
    buttonName.textContent = 'Envoyé';
    resetTimer = window.setTimeout(() => {
      button.classList.remove('is-sending', 'is-sent');
      buttonName.textContent = 'Envoyer';
    }, 4500);
  };

  /** The plane's flight; with reduced motion, straight to "Envoyé". */
  const playFlight = () => {
    playSent();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      button.classList.remove('is-sending');
      button.classList.add('is-sent');
    }
  };

  button.addEventListener('animationend', (event) => {
    if (event.animationName === 'send-plane-fly') {
      button.classList.remove('is-sending');
      button.classList.add('is-sent');
    }
  });

  const setNote = (text: string, isError: boolean) => {
    note.textContent = text;
    note.classList.toggle('is-error', isError);
  };

  email.addEventListener('input', () => {
    if (email.getAttribute('aria-invalid') && email.validity.valid) {
      email.removeAttribute('aria-invalid');
      setNote('', false);
    }
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!email.value.trim() || !email.validity.valid) {
      email.setAttribute('aria-invalid', 'true');
      setNote(
        email.value.trim() ? 'Merci de vérifier votre e-mail.' : 'Merci d’indiquer votre e-mail.',
        true,
      );
      email.focus();
      return;
    }

    const data = new FormData(form);
    const value = (key: string) => String(data.get(key) ?? '').trim();

    /** Opens the visitor's mail app with everything filled in. The fields keep their text,
     *  so nothing is lost if the mail app doesn't open. */
    const sendByMail = () => {
      const name = [value('prenom'), value('nom')].filter(Boolean).join(' ');
      const subject = name ? `Message de ${name}` : 'Message depuis le site';
      const lines = name ? [`Nom : ${name}`] : [];
      lines.push(`E-mail : ${value('email')}`, '', value('message'));
      const body = lines.join('\n');

      const link = document.createElement('a');
      link.href = `mailto:${CAFE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      link.click();
      playFlight();
      setNote('Votre messagerie s’ouvre avec le message prêt à envoyer.', false);
    };

    if (!hasApi) {
      sendByMail();
      return;
    }

    if (button.getAttribute('aria-disabled')) return;
    button.setAttribute('aria-disabled', 'true');
    const result = await submitForm('contact', {
      prenom: value('prenom'),
      nom: value('nom'),
      email: value('email'),
      message: value('message'),
      website: value('website'),
    });
    button.removeAttribute('aria-disabled');

    if (result.ok) {
      playFlight();
      setNote('Merci, votre message est bien envoyé.', false);
      form.reset();
    } else if (result.status === 422 && result.fields?.email) {
      email.setAttribute('aria-invalid', 'true');
      setNote(email.value.trim() ? 'Merci de vérifier votre e-mail.' : 'Merci d’indiquer votre e-mail.', true);
      email.focus();
    } else if (result.status === 429) {
      setNote('Trop de messages envoyés. Réessayez dans quelques minutes.', true);
    } else {
      // The API is down or refused: the mail app still works.
      sendByMail();
    }
  });

  return section;
}
