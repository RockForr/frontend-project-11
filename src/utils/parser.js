import _ from 'lodash';
import CustomError from './errorConstructor.js';

export default function parse(content) {
  const parser = new DOMParser();
  const parsedData = parser.parseFromString(content, 'application/xml');
  if (parsedData.querySelector('parseError')) {
    throw new CustomError('ParseError');
  }

const title = parsedData.querySelector('title').textContent;
const description = parsedData.querySelector('description').textContent;
const feedId = _.uniqueId();
const feed = { id: feedId, title, description };

const posts = Array.from(parsedData.querySelectorAll('item'))
  .reduce((acc, post) => {
    const id = _.uniqueId();
    const postTitle = post.querySelector('title').textContent;
    const postDescription = post.querySelector('description').textContent;
    const link = post.querySelector('link').textContent;
    acc.push(
        {
            id,
            title: postTitle,
            description: postDescription,
            link,
            feedId,
            status: 'unread',
        },
    );
    return acc;
  }, []);
  return { feed, posts };
};
