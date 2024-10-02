import onChange from 'on-change';

const renderForm = (value, elements, i18nInstance) => {
  const { isFeedValid, error } = value;
  const { input, feedback } = elements;

  input.classList.toggle('is-invalid', !isFeedValid);
  feedback.classList.toggle('text-success', isFeedValid);
  feedback.classList.toggle('text-danger', !isFeedValid);
  feedback.textContent = isFeedValid ? '' : i18nInstance.t(`error.${error}`);
};

const createContainer = (i18nInstance, containerType) => {
  const cardContainer = document.createElement('div');
  cardContainer.classList.add('card', 'border-0');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  cardContainer.prepend(cardBody);

  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h4');
  cardTitle.textContent = i18nInstance.t(containerType);
  cardContainer.append(cardTitle);

  const listGroup = document.createElement('ul');
  listGroup.classList.add('list-group', 'border-0', 'rounded-0');

  return { cardContainer, listGroup };
};

const renderFeeds = (watchedState, elements, i18nInstance) => {
  const containerType = 'feeds';
  const { feeds } = elements;
  feeds.textContent = '';

  const { cardContainer, listGroup } = createContainer(i18nInstance, containerType);
  feeds.append(cardContainer);

  watchedState.feeds.forEach(({ title, description }) => {
    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item', 'border-0', 'border-end-0');

    const titleElement = document.createElement('h3');
    titleElement.classList.add('h6', 'm-0');
    titleElement.textContent = title;
    listItem.append(titleElement);

    const descriptionElement = document.createElement('p');
    descriptionElement.classList.add('m-0', 'small', 'text-black-50');
    descriptionElement.textContent = description;
    listItem.append(descriptionElement);

    listGroup.append(listItem);
  });
  cardContainer.append(listGroup);
};

const renderPosts = (watchedState, elements, i18nInstance) => {
  const containerType = 'posts';
  const { posts } = elements;
  posts.textContent = '';

  const { cardContainer, listGroup } = createContainer(i18nInstance, containerType);
  posts.append(cardContainer);

  watchedState.posts.forEach(({ title, id, link }) => {
    const listItem = document.createElement('li');
    listItem.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
      'border-0',
      'border-end-0',
    );

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', link);
    linkElement.dataset.id = id;
    linkElement.setAttribute('target', '_blank');
    linkElement.setAttribute('rel', 'noopener noreferrer');
    linkElement.textContent = title;
    const titleClass = watchedState.postViewState.visitedPostsId.has(id) ? 'fw-normal' : 'fw-bold';
    linkElement.classList.toggle(titleClass);

    const previewButton = document.createElement('button');
    previewButton.setAttribute('type', 'button');
    previewButton.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    previewButton.dataset.id = id;
    previewButton.dataset.bsToggle = 'modal';
    previewButton.dataset.bsTarget = '#modal';
    previewButton.textContent = i18nInstance.t('button');
    listItem.append(linkElement, previewButton);
    listGroup.append(listItem);
  });
  cardContainer.append(listGroup);
};

const activeFromStatus = (value, elements, i18nInstance) => {
  const { formStatus, error } = value;
  const {
    form,
    feedback,
    input,
    submitBtn,
  } = elements;

  submitBtn.disabled = false;
  input.disabled = false;
  input.classList.remove('is-invalid');
  feedback.classList.remove('text-danger', 'text-success');

  switch (formStatus) {
    case 'success':
      feedback.classList.add('text-success');
      feedback.textContent = i18nInstance.t('success');
      form.reset();
      input.focus();
      break;

    case 'sending':
      submitBtn.disabled = true;
      feedback.classList.add('text-success');
      break;

    case 'failed':
      input.classList.add('is-invalid');
      feedback.classList.add('text-danger');
      feedback.textContent = i18nInstance.t(`error.${error}`);
      break;

    case 'filling':
      break;

    default:
      throw new Error(`Unknown form status: ${formStatus}`);
  }
};

const renderModalWindow = (watchedState, elements) => {
  const { modalTitle, modalBody, modalLinkBtn } = elements;
  const { currentPostId } = watchedState.postViewState;
  const { title, description, link } = watchedState.posts.find((post) => post.id === currentPostId);
  modalTitle.textContent = title;
  modalBody.textContent = description;
  modalLinkBtn.href = link;
};

export default (state, elements, i18nInstance) => onChange(state, (path, value) => {
  switch (path) {
    case 'form':
      renderForm(value, elements, i18nInstance);
      break;
    case 'loadingFeedback':
      activeFromStatus(value, elements, i18nInstance);
      break;

    case 'postViewState.visitedPostsId':
    case 'posts':
      renderPosts(state, elements, i18nInstance);
      break;

    case 'feeds':
      renderFeeds(state, elements, i18nInstance);
      break;
    case 'postViewState.currentPostId':
      renderModalWindow(state, elements);
      break;
    default:
      break;
  }
  return state;
});
