import onChange from 'on-change';
import * as yup from 'yup';
import * as render from './view.js';

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
    case 'data.posts':
      render.posts(watchedState.data.posts);
      break;
    case 'currentPostId':
      watchedState.data.posts.forEach((post) => {
        if (value === post.id) {
          post.status = 'visited';
          render.modal(post);
        }
      });
      render.posts(watchedState.data.posts);
      break;
    default:
      throw new Error('Ошибка, попробуйте снова');
  }
});

const validateUrl = (url) => {
  const schema = yup.string().required().url();

  return schema.validate(url)
    .then((link) => {
        if (!link.trim()) {
          throw new CustomError('EmptyError');
        }
        if (watchedState.data.urls.includes(link)) {
          throw new CustomError('DuplicateError')
        }
        return link;
    })
    .catch((error) => {
        throw error;
    });
};
