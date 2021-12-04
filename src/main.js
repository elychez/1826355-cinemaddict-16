import SiteMenuView from './view/site-filter-view.js';
import {RenderPosition, render} from './render.js';
import UserRankView from './view/user-rank-view.js';
import FilmContainerView from './view/film-container-view.js';
import LoadMoreBtnView from './view/show-more-btn-view.js';
import FilmsCardsView from './view/films-cards-view.js';
import AdditionalInfoPopupView from './view/additional-info-popup-view.js';
import {getFilmsData} from './mock/mock-data.js';

const FILM_COUNT = 5;
const films = getFilmsData();
const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');

render(siteHeaderElement, new UserRankView().element, RenderPosition.BEFOREEND);
render(siteMainElement, new SiteMenuView().element, RenderPosition.BEFOREEND);
render(siteMainElement, new FilmContainerView().element, RenderPosition.BEFOREEND);

const siteFilmListContainer = siteMainElement.querySelector('.films-list__container');

const renderPopup = (film) => {
  const filmCardComponent = new FilmsCardsView(film).element;
  const filmPopupComponent = new AdditionalInfoPopupView(film).element;

  render(siteFilmListContainer, filmCardComponent, RenderPosition.BEFOREEND);
  filmCardComponent.addEventListener('click', () => {
    document.body.appendChild(filmPopupComponent);
    document.body.classList.add('hide-overflow');
  });
  filmPopupComponent.querySelector('.film-details__close-btn').addEventListener('click', () => {
    document.body.removeChild(filmPopupComponent);
    document.body.classList.remove('hide-overflow');
  });
};

films.slice(0, 5).forEach((film) => {
  renderPopup(film);
});

if (films.length > FILM_COUNT) {
  let renderFilmCount = FILM_COUNT;

  render(siteFilmListContainer, new LoadMoreBtnView().element, RenderPosition.AFTEREND);

  const loadMoreBtn = document.querySelector('.films-list__show-more');

  loadMoreBtn.addEventListener('click', (evt) => {
    evt.preventDefault();
    films
      .slice(renderFilmCount, renderFilmCount + FILM_COUNT)
      .forEach((film) => {
        renderPopup(film);
      });

    renderFilmCount += FILM_COUNT;

    if (renderFilmCount >= films.length) {
      loadMoreBtn.remove();
    }
  });
}
