import i18nextInstance from './index.js';

const DomElements = {
  input: document.getElementById('url-inpit'),
  form: document.querySelector('.rss-form'),
  feedback: document.querySelector('.feedback'),
};

const error = (err) => {
    if (err) {
      DomElements.feedback.textContent = i18nextInstance.t(`feedback.${err}`);
      DomElements.feedback.classList.replace('text-success', 'text-danger');
      DomElements.input.classList.add('is-invalid');
    }
};

const success = () => {
  DomElements.feedback.textContent = i18nextInstance.t('feedback.rssAdded');
  DomElements.feedback.classList.replace('text-danger', 'text-success');
  DomElements.input.classList.remove('is-invalid');
  DomElements.form.reset();
};

const createContainer = (type, list) => {
  const divCard = document.createElement('div');
  divCard.classList.add('card', 'border-0');

  const divCardBody = document.createElement('div');
  divCardBody.classList.add('card-body');

  const h2 = document.createElement('h2');
  h2.textContent = i18nextInstance.t(`elements.${type}.title`);
  h2.classList.add('card-title', 'h4');
  divCardBody.append(h2);

  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');

  list.forEach((element) => ul.append(element));

  divCard.append(divCardBody, ul);
  document.querySelector(`.${type}`).replaceChildren(divCard);
};

const posts = (postsList) => {
  const list = postsList.map((post) => {
    const {
      id,
      title,
      link,
      status,
    } = post;
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-item-start', 'border-0', 'border-end-0');

    const a = document.createElement('a');
    if (status === 'visited') {
      a.classList.add('fw-normal', 'link-secondary');
    } else {
      a.classList.add('fw-bold');
    }
    a.setAttribute('href', link);
    a.dataset.id = id;
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
    a.textContent = title;
    const button = document.createElement('button');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.setAttribute('type', 'button');
    button.dataset.id = id;
    button.dataset.bsToggle = 'modal';
    button.dataset.bsTarget = '#modal';
    button.textContent = i18nextInstance.t('elements.posts.button');

    li.append(a, button);
    return li;
  });
  createContainer('posts', list);
};

const feeds = (feedsList) => {
  const list = feedsList.map((feed) => {
    const { title, description } = feed;
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');

    const h3 = document.createElement('h3');
    h3.classList.add('h6', 'm-0');
    h3.textContent = title;

    const p = document.createElement('p');
    p.classList.add('m-0', 'small', 'text-black-50');
    p.textContent = description;
    li.append(h3, p);
    return li;
  });
  createContainer('feeds', list);
};

const modal = (post) => {
  const title = document.querySelector('.modal-title');
  const body = document.querySelector('.modal-body');
  const link = document.querySelector('.modal-footer').querySelector('a');

  title.textContent = post.title;
  body.textContent = post.description;
  link.setAttribute('href', post.link);
};

export {
  posts,
  feeds,
  modal,
  error,
  success,
};