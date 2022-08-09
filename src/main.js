import FilmPresenter from './presenter/film-presenter.js';
import FilmsModel from './model/films-model';
import FilterModel from './model/filter-model';
import FilterPresenter from './presenter/filter-presenter';
import CommentsModel from './model/comments-model';
import StatsPresenter from './presenter/stats-presenter';
import {ScreenType} from './const';
import ApiService from './api-service';

const AUTHORIZATION = 'Basic n45j321mdsff';
const END_POINT = 'https://16.ecmascript.pages.academy/cinemaddict/';

const apiService = new ApiService(END_POINT, AUTHORIZATION);

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');


const filmsModel = new FilmsModel(apiService);
const commentsModel = new CommentsModel(apiService, filmsModel);
const filterModel = new FilterModel();

const filmPresenter = new FilmPresenter(siteHeaderElement, siteMainElement, filmsModel, filterModel, commentsModel);

const statsPresenter = new StatsPresenter(siteMainElement, filmsModel);

const handleNavigationClick = (screenType) => {
  if (screenType === ScreenType.STATS) {
    filmPresenter.destroy();
    statsPresenter.init();
    return;
  }

  statsPresenter.destroy();
  filmPresenter.init();
};

const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel, handleNavigationClick);
filterPresenter.init();
filmPresenter.init();

filmsModel.init().finally(() => {

});
