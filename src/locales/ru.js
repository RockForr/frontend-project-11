export default {
  translation: {
    elements: {
      title: 'RSS агрегатор',
      lead: 'Начните читать RSS сегодня! Это легко, это красиво.',
      placeholder: 'Ссылка RSS',
      label: 'Ссылка RSS',
      button: 'Добавить',
      example: 'Пример: https://lorem-rss.hexlet.app/feed',
      feeds: {
        title: 'Фиды',
      },
      posts: {
        title: 'Посты',
        button: 'Просмотр',
      },
      modal: {
        readButton: 'Читать полностью',
        closeButton: 'Закрыть',
      },
    },
    feedback: {
      rssAdded: 'RSS успешно загружен',
      DuplicateError: 'RSS уже существует',
      ValidationError: 'Ссылка должна быть валидным URL',
      AxiosError: 'Ошибка сети',
      ParseError: 'Ресурс не содержит валидный RSS',
      EmptyError: 'Не должно быть пустым',
    },
  },
};