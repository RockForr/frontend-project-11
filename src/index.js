import  './styles.scss';
import  'bootstrap';
import i18next from 'i18next';

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
