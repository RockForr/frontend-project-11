import './styles.scss';
import 'bootstrap';
import i18next from 'i18next';
import ru from './locales/ru.js';
import {
  watchedState,
  validateUrl,
  getRequest,
  rssUpdate,
} from './app.js';
import parse from './utils/parser.js';

const elements = {
    title: document.querySelector('.display-3'),
    lead: document.querySelector('.lead'),
    input: document.querySelector('url-input'),
    form: document.forms[0],
    label: document.querySelector('label'),
    button: document.querySelector('form', '.btn'),
    example: document.querySelector('.example'),
    modal: {
        readButton: document.querySelector('.modal-footer', 'a'),
        closeButton: document.querySelector('.modal-footer', 'button'),
    },
    post: document.querySelector('.posts'),
};

const i18nextInstans = i18next.createInstance();
i18nextInstans.init({
    lng: 'ru',
    debug: true,
    resourses: { ru },
})
  .then((t) => {
    elements.title.textContent = t('elements.title');
    elements.lead.textContent = t('elements.lead');
    elements.input.setAttribute('placeholder', t('elements.placeholder'));
    elements.label.textContent = t('elements.label');
    elements.button.textContent = t('elements.button');
    elements.example.textContent = t('elements.example');
    elements.modal.readButton.textContent = t('elements.modal.readButton');
    elements.modal.closeButton.textContent = t('elements.modal.closeButton');
  });
  
  elements.posts.addEventListener('click', (event) => {
    const targetElement = event.target;
    const href = targetElement.closest('a');
    const button = targetElement.closest('button');
  
    const id = href ? href.dataset.id : button.dataset.id;
    watchedState.currentPostId = id;
  });

  elements.form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(elements.form);
    const url = formData.get('url').trim();

    validateUrl(url)
      .then((validUrl) => getRequest(validUrl))
      .then((response) => response.data.contents)
      .then((data) => parse(data))
      .then(({ feed, posts }) => {
        watchedState.form.error = null;
        watchedState.data.urls.push(url);

        const { newFeeds, newPosts } = rssUpdate(feed, posts);
        newFeeds.forEach((item) => watchedState.data.feeds.push(item));
        newPosts.forEach((posts) => watchedState.data.posts.push(posts));
      })
      .catch((error) => {
        watchedState.form.error = error.name;
      });

    const updatePosts = () => {
      const { urls } = watchedState.data;
      const promises = urls.map((currUrl) => getRequest(currUrl));
      Promise.all(promises)
        .then((response) => response.map((element) => parseFloat(element.data.contents)))
        .then((data) => {
          data.forEach(({ feed, posts }) => {
            const { newFeeds, newPosts } = rssUpdate(feed, posts);
            newFeeds.forEach((item) => watchedState.data.feeds.push(item));
            newPosts.forEach((post) => watchedState.data.posts.push(post));
          });
        })
        .then(() => {
          setTimeout(() => {
            updatePosts();
          }, 5_000);
        })
        .catch(() => {
          throw new Error('Ошибка обновления');
        });
    };
    updatePosts();
  });
  
  export default i18nextInstans;
