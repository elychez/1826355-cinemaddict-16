import {createSiteMenuTemplate} from './view/site-filter-view.js';
import {renderTemplate, RenderPosition} from './render.js';
import {createUserRankTemplate} from './view/user-rank-view.js';
import {createFilmContainerTemplate} from './view/film-container-view.js';
import {createShowMoreBtnTemplate} from './view/show-more-btn-view.js';
import {createFilmsCardsTemplate} from './view/films-cards-view.js';
import {createAdditionalFilmInfoPopupTemplate} from './view/additional-info-popup-view.js';

const TASK_COUNT  = 5;

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');

renderTemplate(siteHeaderElement, createUserRankTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createSiteMenuTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createFilmContainerTemplate(), RenderPosition.BEFOREEND);

const siteFilmListContainer = siteMainElement.querySelector('.films-list__container');

for (let i = 0; i < TASK_COUNT; i++) {
  renderTemplate(siteFilmListContainer, createFilmsCardsTemplate(), RenderPosition.BEFOREEND);
}

renderTemplate(siteFilmListContainer, createShowMoreBtnTemplate(), RenderPosition.AFTEREND);
renderTemplate(document.body, createAdditionalFilmInfoPopupTemplate(), RenderPosition.BEFOREEND);
