import {createSiteMenuTemplate} from './view/site-filter-view.js';
import {renderTemplate, RenderPosition} from './render.js';
import {createUserRankTemplate} from './view/user-rank-view.js';
import {createFilmContainerTemplate} from './view/film-container-view.js';
import {createShowMoreBtnTemplate} from './view/show-more-btn-view.js';
import {createFilmsCardsTemplate} from './view/films-cards-view.js';
import {createAdditionalFilmInfoPopupTemplate} from './view/additional-info-popup-view.js';
import {getFilmsData} from './mock/mock-data.js';

const FILM_COUNT = 5;

const films = getFilmsData();

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');

renderTemplate(siteHeaderElement, createUserRankTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createSiteMenuTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createFilmContainerTemplate(), RenderPosition.BEFOREEND);

const siteFilmListContainer = siteMainElement.querySelector('.films-list__container');

films.slice(0, 5).forEach((film) => {
  renderTemplate(siteFilmListContainer, createFilmsCardsTemplate(film), RenderPosition.BEFOREEND);
});

renderTemplate(document.body, createAdditionalFilmInfoPopupTemplate(films[0]), RenderPosition.BEFOREEND);

if (films.length > FILM_COUNT) {
  let renderFilmCount = FILM_COUNT;

  renderTemplate(siteFilmListContainer, createShowMoreBtnTemplate(), RenderPosition.AFTEREND);

  const loadMoreBtn = document.body.querySelector('.films-list__show-more');

  loadMoreBtn.addEventListener('click', (evt) => {
    evt.preventDefault();
    films
      .slice(renderFilmCount, renderFilmCount + FILM_COUNT)
      .forEach((film) => renderTemplate(siteFilmListContainer, createFilmsCardsTemplate(film), RenderPosition.BEFOREEND));

    renderFilmCount += FILM_COUNT;

    if (renderFilmCount >= films.length) {
      loadMoreBtn.remove();
    }
  });
}
