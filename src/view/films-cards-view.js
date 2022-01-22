import AbstractView from './abstract-view.js';
import dayjs from 'dayjs';

const createFilmsCardsTemplate = (mocks) => {
  const {title, rating, release, length, genres, poster, description, comments, isInWatchlist, isWatched, isInFavorites} = mocks;
  const addStatus = (status) => {
    const statusType = status === true ? '--active' : '';
    return `film-card__controls-item${statusType}`;
  };

  const formattedDate = dayjs(release).format('DD MMMM YYYY');

  return (`<article class="film-card">
          <a class="film-card__link">
            <h3 class="film-card__title">${title}</h3>
            <p class="film-card__rating">${rating}</p>
            <p class="film-card__info">
              <span class="film-card__year">${formattedDate}</span>
              <span class="film-card__duration">${length}</span>
              <span class="film-card__genre">${genres}</span>
            </p>
            <img src="${poster}" alt="" class="film-card__poster">
            <p class="film-card__description">${description}</p>
            <span class="film-card__comments">${comments.length} comments</span>
          </a>
          <div class="film-card__controls">
            <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${addStatus(isInWatchlist)}" type="button">Add to watchlist</button>
            <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${addStatus(isWatched)}" type="button">Mark as watched</button>
            <button class="film-card__controls-item film-card__controls-item--favorite ${addStatus(isInFavorites)}" type="button">Mark as favorite</button>
          </div>
        </article>`);
};

export default class FilmsCardsView extends AbstractView {
  #mocks = null;

  constructor(mocks) {
    super();
    this.#mocks = mocks;
  }

  get template() {
    return createFilmsCardsTemplate(this.#mocks);
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('a.film-card__link').addEventListener('click', this.#clickHandler);
  }

  setWatchlistAddedClickHandler = (callback) => {
    this._callback.watchlistAddedClick = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#watchlistAddedClickHandler);
  }

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#watchedClickHandler);
  }

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#favoriteClickHandler);
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  }

  #watchlistAddedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchlistAddedClick();
  }

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchedClick();
  }

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  }
}
