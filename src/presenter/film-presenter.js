import FilmContainerView from '../view/film-container-view.js';
import NoFilmsView from '../view/no-films-view.js';
import LoadMoreBtnView from '../view/show-more-btn-view.js';
import UserRankView from '../view/user-rank-view.js';
import {render, RenderPosition} from '../render.js';
import cardPresenter from './card-presenter.js';
import SortView from '../view/sort-view';
import {CommentAction, FilterType, SortType, UpdateType} from '../const';
import {sortRating} from '../utils/film';
import {remove} from '../view/abstract-view';
import {filter} from '../utils/filters';
import {FilmsListView} from '../view/film-list-view';
import {getSortedFilms} from '../utils/utils';

const FILM_COUNT = 5;

export default class FilmPresenter {
  #siteHeader = null;
  #siteMain = null;
  #filmContainer = null;
  #filmsSortType = SortType.DEFAULT;
  #sortComponent = null;
  #filmsModel = null;
  #filterModel = null;
  #commentsModel = null

  #containerComponent = new FilmContainerView();
  #emptyListComponent = new NoFilmsView();
  #filterComponent = null;
  #rankComponent = new UserRankView();
  #showMoreBtnComponent = new LoadMoreBtnView();
  #loadingComponent = new FilmsListView('Loading...');

  #filmPresenter = new Map();
  #currentSortType = SortType.DEFAULT;
  #currentFilterType = FilterType.ALL;
  #sourcedFilms = [];
  #renderedFilmCount = FILM_COUNT;
  #isLoading = true;


  constructor(siteHeaderElement, siteMainElement, filmsModel, filterModel, commentsModel) {
    this.#siteHeader = siteHeaderElement;
    this.#siteMain = siteMainElement;
    this.#filmContainer = this.#containerComponent.element.querySelector('.films-list__container');
    this.#filmsModel = filmsModel;
    this.#filterModel = filterModel;
    this.#commentsModel = commentsModel;
  }

  get films() {
    this.#currentFilterType = this.#filterModel.filter;
    const films = this.#filmsModel.films;
    const filteredFilms = filter[this.#currentFilterType](films);
    return this.#filmsSortType === SortType.DEFAULT ? filteredFilms : getSortedFilms(filteredFilms, this.#filmsSortType);
  }

  init = () => {
    this.#sourcedFilms = this.films;
    render(this.#siteMain, this.#containerComponent, RenderPosition.BEFOREEND);

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#commentsModel.addObserver(this.#handleCommentEvent);

    this.#renderBoard();
  }

  #renderCards = () => {
    this.films.slice(0, 5).forEach((film) => {
      const filmCardPresenter = new cardPresenter(this.#handleFilmChange, this.#filmContainer, this.#handleModeChange, this.#handleCommentChange, this.#commentsModel);
      filmCardPresenter.init(film);
      this.#filmPresenter.set(film.id, filmCardPresenter);
    });
  }

  #renderEmptyFilmList = () => {
    if (this.films.length === 0) {
      render(this.#siteMain, this.#emptyListComponent, RenderPosition.BEFOREEND);
    }
  }

  #renderRank = () => {
    render(this.#siteHeader, this.#rankComponent, RenderPosition.BEFOREEND);
  }

  #renderShowMoreBtn = () => {
    if (this.films.length > FILM_COUNT) {
      let renderFilmCount = FILM_COUNT;
      const moreBtnView = new LoadMoreBtnView();
      this.#showMoreBtnComponent = moreBtnView;
      render(this.#filmContainer, moreBtnView, RenderPosition.AFTEREND);

      const loadMoreBtn = document.querySelector('.films-list__show-more');

      moreBtnView.setClickHandler(() => {
        this.films
          .slice(renderFilmCount, renderFilmCount + FILM_COUNT)
          .forEach((film) => {
            const filmCardPresenter = new cardPresenter(this.#handleFilmChange, this.#filmContainer, this.#handleModeChange, this.#handleCommentChange, this.#commentsModel);
            filmCardPresenter.init(film);
            this.#filmPresenter.set(film.id, filmCardPresenter);
          });

        renderFilmCount += FILM_COUNT;

        if (renderFilmCount >= this.films.length) {
          loadMoreBtn.remove();
        }
      });
    }
  }

  #handleFilmChange = (updateType, update) => {
    this.#filmsModel.update(updateType, update);
  }

  #handleModeChange = () => {
    this.#filmPresenter.forEach((presenter) => presenter.resetView());
  }

  #sortFilms = (sortFilms) => {
    switch (sortFilms) {
      case SortType.DEFAULT:
        this.#filmsModel.films = [...this.#sourcedFilms];
        break;
      case SortType.DATE:
        getSortedFilms(this.#filmsModel.films, SortType.DATE);
        break;
      case SortType.RATING:
        this.#filmsModel.films.sort(sortRating);
        break;
      default:
        this.#filmsModel.films = [...this.#sourcedFilms];
    }

    this.#currentSortType = this.#filmsSortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#filmsSortType === sortType) {
      return;
    }
    this.#filmsSortType = sortType;
    this.#clearFilmList();
    this.#renderBoard();
  }

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#filmsSortType);
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

  #handleModelEvent = (updateType, data) => {

    switch (updateType) {
      case UpdateType.PATCH:
        this.#filmPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#filmPresenter.get(data.id).init(data);
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetRenderedFilmCount: true, resetSortType: true});
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
      default:
        break;
    }
  }

  #clearBoard = ({resetRenderedFilmCount = false, resetSortType = false} = {}) => {

    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    remove(this.#sortComponent);
    remove(this.#showMoreBtnComponent);
    remove(this.#filterComponent);
    remove(this.#loadingComponent);

    if (this.#emptyListComponent) {
      remove(this.#emptyListComponent);
    }

    if (resetRenderedFilmCount) {
      this.#renderedFilmCount = FILM_COUNT;
    } else {
      const filmCount = this.films.length;
      this.#renderedFilmCount = Math.min(filmCount, this.#renderedFilmCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }

  #renderLoading = () => {
    render(this.#siteMain, this.#loadingComponent, RenderPosition.BEFOREEND);
  }

  #renderBoard = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    const filmCount = this.films.length;
    if (filmCount === 0) {
      this.#renderEmptyFilmList();
      return;
    }

    render(this.#siteMain, this.#containerComponent, RenderPosition.BEFOREEND);

    this.#renderSort();
    this.#renderRank();
    this.#renderCards();
    this.#renderEmptyFilmList();
    this.#renderShowMoreBtn();

    if (filmCount < this.#renderedFilmCount) {
      this.#renderShowMoreBtn();
    }
  }

  #handleCommentEvent = (updateType, data) => {
    this.#handleModelEvent(updateType, this.#filmsModel.getFilmById(data.filmId));
  }


  #handleCommentChange = async (actionType, updateType, update) => {
    switch (actionType) {
      case CommentAction.DELETE:
        await this.#commentsModel.delete(updateType, update.id);
        break;
      case CommentAction.ADD:
        await this.#commentsModel.add(updateType, update);
        break;
    }
  }

  destroy = () => {
    this.#clearBoard({resetRenderedFilmCount: true, resetSortType: true});
    this.#filmsModel.removeObserver(this.#handleModelEvent);
    this.#filterModel.removeObserver(this.#handleModelEvent);
    this.#commentsModel.removeObserver(this.#handleCommentEvent);
  }
}
