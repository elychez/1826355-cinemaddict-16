import AdditionalInfoPopupView from '../view/additional-info-popup-view.js';
import FilmContainerView from '../view/film-container-view.js';
import FilmsCardsView from '../view/films-cards-view.js';
import NoFilmsView from '../view/no-films-view.js';
import LoadMoreBtnView from '../view/show-more-btn-view.js';
import SiteMenuView from '../view/site-filter-view.js';
import UserRankView from '../view/user-rank-view.js';
import {render, RenderPosition} from '../render.js';
import cardPresenter from "./card-presenter";
import {updateItem} from "../utils/utils";

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

  #filmPresenter = new Map();

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

  #renderCards = () => {
    this.filmsCards.slice(0, 5).forEach((film) => {
      const filmCardPresenter = new cardPresenter(this.#handleFilmChange, this.#filmContainer);
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

      render(this.#filmContainer, moreBtnView, RenderPosition.AFTEREND);

      const loadMoreBtn = document.querySelector('.films-list__show-more');

      moreBtnView.setClickHandler(() => {
        this.filmsCards
          .slice(renderFilmCount, renderFilmCount + FILM_COUNT)
          .forEach((film) => {
            const filmCardPresenter = new cardPresenter(this.#handleFilmChange, this.#filmContainer);
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
    this.#filmPresenter.get(updatedTask.id).init(updatedTask);
  }
}
