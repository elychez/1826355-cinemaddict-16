import FilmContainerView from '../view/film-container-view.js';
import NoFilmsView from '../view/no-films-view.js';
import LoadMoreBtnView from '../view/show-more-btn-view.js';
import SiteMenuView from '../view/site-filter-view.js';
import UserRankView from '../view/user-rank-view.js';
import {render, RenderPosition} from '../render.js';
import cardPresenter from './card-presenter.js';
import {updateItem} from '../utils/utils.js';
import SortView from '../view/sort-view';
import {SortType} from '../const';
import {sortDate, sortRating} from '../utils/film';
import {remove} from '../view/abstract-view';

const FILM_COUNT = 5;

export default class FilmPresenter {
  #siteHeader = null;
  #siteMain = null;
  #filmContainer = null;
  #filmsSortType = null;
  #sortComponent = null;

  #containerComponent = new FilmContainerView();
  #emptyListComponent = new NoFilmsView();
  #filterComponent = new SiteMenuView();
  #rankComponent = new UserRankView();
  #showMoreBtnComponent = new LoadMoreBtnView();

  #filmPresenter = new Map();
  #currentSortType = SortType.DEFAULT;
  #sourcedFilms = [];
  #renderedFilmCount = FILM_COUNT;

  filmsCards = [];

  constructor(siteHeaderElement, siteMainElement) {
    this.#siteHeader = siteHeaderElement;
    this.#siteMain = siteMainElement;
    this.#filmContainer = this.#containerComponent.element.querySelector('.films-list__container');
  }

  init = (filmsCards) => {
    this.filmsCards = [...filmsCards];
    this.#sourcedFilms = [...filmsCards];
    render(this.#siteMain, this.#containerComponent, RenderPosition.BEFOREEND);
    this.#renderSort();

    this.#renderRank();
    this.#renderFilter();
    this.#renderCards();
    this.#renderEmptyFilmList();
    this.#renderShowMoreBtn();
  }

  #renderFilter = () => {
    render(this.#siteMain, this.#filterComponent, RenderPosition.AFTERBEGIN);
  }

  #renderCards = () => {
    this.filmsCards.slice(0, 5).forEach((film) => {
      const filmCardPresenter = new cardPresenter(this.#handleFilmChange, this.#filmContainer, this.#handleModeChange);
      filmCardPresenter.init(film);
      this.#filmPresenter.set(film.id, filmCardPresenter);
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
      this.#showMoreBtnComponent = moreBtnView;
      render(this.#filmContainer, moreBtnView, RenderPosition.AFTEREND);

      const loadMoreBtn = document.querySelector('.films-list__show-more');

      moreBtnView.setClickHandler(() => {
        this.filmsCards
          .slice(renderFilmCount, renderFilmCount + FILM_COUNT)
          .forEach((film) => {
            const filmCardPresenter = new cardPresenter(this.#handleFilmChange, this.#filmContainer, this.#handleModeChange);
            filmCardPresenter.init(film);
            this.#filmPresenter.set(film.id, filmCardPresenter);
          });

        renderFilmCount += FILM_COUNT;

        if (renderFilmCount >= this.filmsCards.length) {
          loadMoreBtn.remove();
        }
      });
    }
  }

  #handleFilmChange = (updatedTask) => {
    this.filmsCards = updateItem(this.filmsCards, updatedTask);
    this.#sourcedFilms = updateItem(this.#sourcedFilms, updatedTask);
    this.#filmPresenter.get(updatedTask.id).init(updatedTask);
  }

  #handleModeChange = () => {
    this.#filmPresenter.forEach((presenter) => presenter.resetView());
  }

  #sortFilms = () => {
    switch (this.#filmsSortType) {
      case SortType.DEFAULT:
        this.filmsCards = [...this.#sourcedFilms];
        break;
      case SortType.DATE:
        this.filmsCards.sort(sortDate);
        break;
      case SortType.RATING:
        this.filmsCards.sort(sortRating);
        break;
      default:
        this.filmsCards = [...this.#sourcedFilms];
    }

    this.#currentSortType = this.#filmsSortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#filmsSortType = sortType;
    this.#sortFilms(sortType);
    this.#clearFilmList();
    this.#renderSort();
    this.#renderCards();
    this.#renderShowMoreBtn();
  }

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    render(this.#filmContainer, this.#sortComponent, RenderPosition.BEFOREBEGIN);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #clearFilmList = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#renderedFilmCount = FILM_COUNT;
    remove(this.#showMoreBtnComponent);
    remove(this.#sortComponent);
  }

}
