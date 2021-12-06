import SiteMenuView from './view/site-filter-view.js';
import {RenderPosition, render} from './render.js';
import UserRankView from './view/user-rank-view.js';
import FilmContainerView from './view/film-container-view.js';
import LoadMoreBtnView from './view/show-more-btn-view.js';
import FilmsCardsView from './view/films-cards-view.js';
import AdditionalInfoPopupView from './view/additional-info-popup-view.js';
import {getFilmsData} from './mock/mock-data.js';
import NoFilmsView from './view/no-films-view.js';

const FILM_COUNT = 5;
const films = getFilmsData();
const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');

render(siteHeaderElement, new UserRankView(), RenderPosition.BEFOREEND);
render(siteMainElement, new SiteMenuView(), RenderPosition.BEFOREEND);
render(siteMainElement, new FilmContainerView(), RenderPosition.BEFOREEND);

const siteFilmListContainer = siteMainElement.querySelector('.films-list__container');

const renderCardAndPopup = (film) => {
  const filmCardComponent = new FilmsCardsView(film);
  const filmPopupComponent = new AdditionalInfoPopupView(film);
  const removePopup = () => {
    document.body.removeChild(filmPopupComponent.element);
    document.body.classList.remove('hide-overflow');
  };

  const onKeyDownClosePopup = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      removePopup();
      document.removeEventListener('keydown', onKeyDownClosePopup);
    }
  };

  render(siteFilmListContainer, filmCardComponent, RenderPosition.BEFOREEND);
  filmCardComponent.setClickHandler(() => {
    document.body.appendChild(filmPopupComponent.element);
    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', onKeyDownClosePopup);
  });

  filmPopupComponent.setPopupCloseBtnHandler(() => {
    removePopup();
  });
};

films.slice(0, 5).forEach((film) => {
  renderCardAndPopup(film);
});

if (films.length > FILM_COUNT) {
  let renderFilmCount = FILM_COUNT;
  const moreBtnView = new LoadMoreBtnView();

  render(siteFilmListContainer, moreBtnView, RenderPosition.AFTEREND);

  const loadMoreBtn = document.querySelector('.films-list__show-more');

  moreBtnView.setClickHandler(() => {
    films
      .slice(renderFilmCount, renderFilmCount + FILM_COUNT)
      .forEach((film) => {
        renderCardAndPopup(film);
      });

    renderFilmCount += FILM_COUNT;

    if (renderFilmCount >= films.length) {
      loadMoreBtn.remove();
    }
  });
}

if (films.length === 0) {
  render(siteMainElement, new NoFilmsView(), RenderPosition.BEFOREEND);
}
