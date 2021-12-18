import {getFilmsData} from './mock/mock-data.js';
import FilmPresenter from './presenter/film-presenter.js';

const films = getFilmsData();

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');

const filmPresenter = new FilmPresenter(siteHeaderElement, siteMainElement);

filmPresenter.init(films);
