import AdditionalInfoPopupView from '../view/additional-info-popup-view.js';
import FilmContainerView from '../view/film-container-view.js';
import FilmsCardsView from '../view/films-cards-view.js';
import NoFilmsView from '../view/no-films-view.js';
import LoadMoreBtnView from '../view/show-more-btn-view.js';
import SiteMenuView from '../view/site-filter-view.js';
import UserRankView from '../view/user-rank-view.js';
import {render, RenderPosition} from '../render.js';

const FILM_COUNT = 5;

export default class FilmPresenter {
  #siteHeader = null;
  #siteMain = null;
  #filmContainer = null;
  #film = null;

  #containerComponent = new FilmContainerView();
  #emptyListComponent = new NoFilmsView();
  #filterComponent = new SiteMenuView();
  #rankComponent = new UserRankView();

  filmsCards = [];

  constructor(siteHeaderElement, siteMainElement) {
    this.#siteHeader = siteHeaderElement;
    this.#siteMain = siteMainElement;
    this.#filmContainer = this.#containerComponent.element.querySelector('.films-list__container');
  }

  init = (filmsCards) => {
    this.filmsCards = [...filmsCards];

    render(this.#siteMain, this.#containerComponent, RenderPosition.BEFOREEND);

    this.#renderRank();
    this.#renderFilter();
    this.#renderCards();
    this.#renderEmptyFilmList();
    this.#renderShowMoreBtn();
  }

  #renderFilter = () => {
    render(this.#siteMain, this.#filterComponent, RenderPosition.AFTERBEGIN);
  }

  #renderCard = (film) => {
    this.#film = film;

    const filmCardComponent = new FilmsCardsView(this.#film);
    const filmPopupComponent = new AdditionalInfoPopupView(this.#film);
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

    render(this.#filmContainer, filmCardComponent, RenderPosition.BEFOREEND);
    filmCardComponent.setClickHandler(() => {
      document.body.appendChild(filmPopupComponent.element);
      document.body.classList.add('hide-overflow');
      document.addEventListener('keydown', onKeyDownClosePopup);
    });

    filmPopupComponent.setPopupCloseBtnHandler(() => {
      removePopup();
    });

    filmCardComponent.setFavoritesHandler(this.#handleFavoriteClick());
  }

  #renderCards = () => {
    this.filmsCards.slice(0, 5).forEach((film) => {
      this.#renderCard(film);
    });
  }

  #renderEmptyFilmList = () => {
    if (this.filmsCards.length === 0) {
      render(this.#siteMain, this.#emptyListComponent, RenderPosition.BEFOREEND);
    }
  }

  #renderRank = () => {
    render(this.#siteHeader, this.#rankComponent, RenderPosition.BEFOREEND);
  }

  #renderShowMoreBtn = () => {
    if (this.filmsCards.length > FILM_COUNT) {
      let renderFilmCount = FILM_COUNT;
      const moreBtnView = new LoadMoreBtnView();

      render(this.#filmContainer, moreBtnView, RenderPosition.AFTEREND);

      const loadMoreBtn = document.querySelector('.films-list__show-more');

      moreBtnView.setClickHandler(() => {
        this.filmsCards
          .slice(renderFilmCount, renderFilmCount + FILM_COUNT)
          .forEach((film) => {
            this.#renderCard(film);
          });

        renderFilmCount += FILM_COUNT;

        if (renderFilmCount >= this.filmsCards.length) {
          loadMoreBtn.remove();
        }
      });
    }
  }

  #handleFavoriteClick = () => {
    // this.#film = Object.assign({}, this.#film, {isInFavorites: this.#film.isInFavorites});
  }
}
