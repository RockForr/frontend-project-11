import onChange from 'on-change';
import axios from 'axios';
import * as yup from 'yup';
import * as render from './view.js';
import CustomError from './utils/errorConstructor.js';

const state = {
  form: {
    error: null,
  },
  data: {
    urls: [],
    posts: [],
    feeds: [],
  },
  currentPostId: null,
};

const watchedState = onChange(state, (path, value) => {
  switch (path) {
    case 'data.urls':
      render.success();
      break;
    case 'form.error':
      render.error(value);
      break;
    case 'data.feeds':
      render.feeds(watchedState.data.feeds);
      break;
    case 'data.posts':
      render.posts(watchedState.data.posts);
      break;
    case 'currentPostId':
      watchedState.data.posts.forEach((post) => {
        if (value === post.id) {
          // eslint-disable-next-line
          post.status = 'visited';
          render.modal(post);
        }
      });
      render.posts(watchedState.data.posts);
      break;
    default:
      throw new Error('Неизвестная ошибка');
  }
});

function getRequest(url) {
  return axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
    .then((response) => response);
}

const validateUrl = (url) => {
  const schema = yup.string().required().url();

  return schema.validate(url)
    .then((link) => {
      if (!link.trim()) {
        throw new CustomError('EmptyError');
      }
      if (watchedState.data.urls.includes(link)) {
        throw new CustomError('DuplicateError');
      }
      return link;
    })
    .catch((error) => {
      throw error;
    });
};

const rssUpdate = (feed, posts) => {
  const newFeeds = [];
  const newPosts = [];

  const currentFeeds = watchedState.data.feeds.map((item) => item.title);
  if (!currentFeeds.includes(feed.title)) {
    newFeeds.push(feed);
  }

  const currentPosts = watchedState.data.posts
    .map((post) => post.title);

  posts.forEach((post) => {
    if (!currentPosts.includes(post.title)) {
      newPosts.push(post);
    }
  });
  return { newFeeds, newPosts };
};

export {
  watchedState,
  validateUrl,
  getRequest,
  rssUpdate,
};
