import * as yup from 'yup';
import i18next from 'i18next';
import axios from 'axios';
import _ from 'lodash';

import parseFeedData from './parser.js';
import watch from './view.js';
import resources from './locales/index.js';
import customMessages from './locales/customMessages.js';

const timeOut = 10000;
const timeInterval = 5000;
const defaultLanguage = 'ru';

const validate = (url, listUrls) => {
  const schema = yup.string().url().required().notOneOf(listUrls);
  return schema
    .validate(url)
    .then(() => null)
    .catch((error) => error.message);
};

const buildProxy = (url) => {
  const proxy = new URL('/get', 'https://allorigins.hexlet.app');
  proxy.searchParams.set('disableCache', 'true');
  proxy.searchParams.set('url', url);
  return proxy.toString();
};

const handlerError = (error) => {
  switch (error.name) {
    case 'AxiosError':
      return 'networkError';
    case 'ParserError':
      return 'invalidFeed';
    default:
      return 'defaultError';
  }
};

const createLinkedPost = (feedId) => (post) => ({
  ...post,
  feedId,
  id: _.uniqueId(),
});

const loadData = (watchedState, url) => {
// eslint-disable-next-line no-param-reassign
  watchedState.loadingFeedback = { formStatus: 'sending', error: '' };
  return axios({
    method: 'get',
    url: buildProxy(url),
    timeout: timeOut,
  })
    .then((response) => {
      const { feed, posts } = parseFeedData(response.data.contents);
      const feedId = _.uniqueId();
      watchedState.feeds.push({ ...feed, id: feedId, link: url });
      const linkedPosts = posts.map(createLinkedPost(feedId));
      watchedState.posts.push(...linkedPosts);
      // eslint-disable-next-line no-param-reassign
      watchedState.loadingFeedback = {
        error: '',
        formStatus: 'success',
      };
    })
    .catch((error) => {
      // eslint-disable-next-line no-param-reassign
      watchedState.loadingFeedback = {
        error: handlerError(error),
        formStatus: 'failed',
      };
    });
};

const checkNewPosts = (watchedState) => {
  const feedsPromises = watchedState.feeds.map(({ feedId, link }) => axios({
    method: 'get',
    url: buildProxy(link),
    timeout: timeOut,
  })
    .then((response) => {
      const { posts } = parseFeedData(response.data.contents);
      const oldPosts = watchedState.posts.map((post) => post.link);
      const newPosts = posts.filter((post) => !oldPosts.includes(post.link));

      if (newPosts.length > 0) {
        const linkedNewPosts = newPosts.map(createLinkedPost(feedId));
        watchedState.posts.push(...linkedNewPosts);
      }
      return Promise.resolve();
    }));

  return Promise
    .all(feedsPromises)
    .finally(() => {
      setTimeout(() => checkNewPosts(watchedState), timeInterval);
    });
};

export default () => {
  const i18nInstance = i18next.createInstance();
  i18nInstance.init({
    lng: defaultLanguage,
    debug: true,
    resources,
  })
    .then(() => {
      yup.setLocale(customMessages);

      const initState = {
        form: {
          isFeedValid: true,
          error: '',
        },
        loadingFeedback: {
          formStatus: 'filling',
          error: '',
        },
        postViewState: {
          currentPostId: '',
          visitedPostsId: new Set(),
        },
        feeds: [],
        posts: [],
      };

      const elements = {
        form: document.querySelector('.rss-form'),
        input: document.querySelector('input[name="url"]'),
        submitBtn: document.querySelector('button[type="submit"]'),
        feedback: document.querySelector('.feedback'),
        posts: document.querySelector('.posts'),
        feeds: document.querySelector('.feeds'),
        modalWindow: document.querySelector('.modal'),
        modalTitle: document.querySelector('.modal-title'),
        modalBody: document.querySelector('.modal-body'),
        modalLinkBtn: document.querySelector('.full-article'),
      };

      const watchedState = watch(initState, elements, i18nInstance);

      elements.form.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const url = formData.get('url').trim();
        const feedUrls = watchedState.feeds.map((feed) => feed.link);
        validate(url, feedUrls)
          .then((error) => {
            if (error) {
              watchedState.form = {
                isFeedValid: false,
                error,
              };
              return;
            }
            watchedState.form = {
              isFeedValid: true,
              error: '',
            };
            loadData(watchedState, url);
          })
          .catch((error) => {
            console.error(error);
          });
      });

      elements.posts.addEventListener('click', (event) => {
        const { id } = event.target.dataset;
        if (!id) {
          return;
        }
        watchedState.postViewState.currentPostId = id;
        watchedState.postViewState.visitedPostsId.add(id);
      });
      checkNewPosts(watchedState);
    });
};
