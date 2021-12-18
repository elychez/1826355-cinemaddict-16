import AbstractView from './abstract-view.js';

const createFilmsCardsTemplate = (mocks) => {
  const {title, rating, release, length, genres, poster, description, comment, isInWatchlist, isWatched, isInFavorites} = mocks;
  const addStatus = (status) => {
    const statusType = status === true ? '--active' : '';
    return `film-card__controls-item${statusType}`;
  };

  return (`<article class="film-card">
          <a class="film-card__link">
            <h3 class="film-card__title">${title}</h3>
            <p class="film-card__rating">${rating}</p>
            <p class="film-card__info">
              <span class="film-card__year">${release}</span>
              <span class="film-card__duration">${length}</span>
              <span class="film-card__genre">${genres}</span>
            </p>
            <img src="${poster}" alt="" class="film-card__poster">
            <p class="film-card__description">${description}</p>
            <span class="film-card__comments">${comment.length} comments</span>
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
    this.element.querySelector('.film-card__comments').addEventListener('click', this.#clickHandler);
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  }

  #isInWatchlistHandler = () => {
    this._callbackWatchlist.click();
  }

  #isWatchedHandler = () => {
    this._callbackWatched.click();
  }

  #isInFavoritesHandler = () => {
    this._callbackInFavorites.click();
  }

  setWatchedHandler(callback) {
    this._callbackWatched.click = callback;
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#isWatchedHandler);
  }

  setWatchlistHandler(callback) {
    this._callbackWatchlist.click = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#isInWatchlistHandler);
  }

  setFavoritesHandler(callback) {
    this._callbackInFavorites.click = callback;
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#isInFavoritesHandler);
  }
}
