import {generateComments, getFilmsData} from './mock/mock-data.js';
import FilmPresenter from './presenter/film-presenter.js';
import FilmsModel from './model/films-model';
import FilterModel from './model/filter-model';
import FilterPresenter from './presenter/filter-presenter';
import CommentsModel from './model/comments-model';

const films = getFilmsData();

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');

const commentsModel = new CommentsModel();
const filmsModel = new FilmsModel(commentsModel);
const filterModel = new FilterModel();
filmsModel.films = films;
const comments = generateComments(films);
commentsModel.comments = comments;

const filmPresenter = new FilmPresenter(siteHeaderElement, siteMainElement, filmsModel, filterModel, commentsModel);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);

filmPresenter.init();
filterPresenter.init();

