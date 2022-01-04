import FilmsCardsView from '../view/films-cards-view';
import AdditionalInfoPopupView from '../view/additional-info-popup-view';
import {replace, remove, render, RenderPosition} from '../render';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class cardPresenter {
  #film = null;
  #changeData = null;
  #filmContainer = null;
  #filmCardComponent = null;
  #filmPopupComponent = null;
  #modeChange = null;
  #mode = Mode.DEFAULT
  #siteFooter = document.querySelector('body');

  constructor(changeData, filmCardContainer, changeMode) {
    this.#changeData = changeData;
    this.#filmContainer = filmCardContainer;
    this.#modeChange = changeMode;
  }

  init = (film) => {
    this.#film = film;
    const prevFilmCardComponent = this.#filmCardComponent;
    const prevPopupComponent = this.#filmPopupComponent;
    this.#filmCardComponent = new FilmsCardsView(film);
    this.#filmPopupComponent = new AdditionalInfoPopupView(film);

    this.#filmPopupComponent.setPopupCloseBtnHandler(() => {
      this.#removePopup();
    });

    this.#filmCardComponent.setClickHandler(() => {
      this.#openPopup();
      document.addEventListener('keydown', this.#onKeyDownClosePopup);
    });

    this.#filmCardComponent.setWatchlistAddedClickHandler(this.#handleWatchlistAddedClick);
    this.#filmCardComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#filmCardComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#filmPopupComponent.setWatchlistAddedClickHandler(this.#handleWatchlistAddedClick);
    this.#filmPopupComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#filmPopupComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    if (prevFilmCardComponent === null || prevPopupComponent === null) {
      render(this.#filmContainer, this.#filmCardComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#filmCardComponent, prevFilmCardComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#filmPopupComponent, prevPopupComponent);
      replace(this.#filmCardComponent, prevFilmCardComponent);
    }

    remove(prevFilmCardComponent);
    remove(prevPopupComponent);
  }

  #removePopup = () => {
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#onKeyDownClosePopup);
    this.#mode = Mode.DEFAULT;
    this.init(this.#film);
  }

  #onKeyDownClosePopup = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#removePopup();
      document.removeEventListener('keydown', this.#onKeyDownClosePopup);
    }
  };

  #handleWatchlistAddedClick = () => {
    const scrollHeight = this.#filmPopupComponent.element.scrollTop;
    this.#changeData({...this.#film, isInWatchlist: !this.#film.isInWatchlist});
    this.#filmPopupComponent.element.scrollTo(0, scrollHeight);
  }

  #handleWatchedClick = () => {
    const scrollHeight = this.#filmPopupComponent.element.scrollTop;
    this.#changeData({...this.#film, isWatched: !this.#film.isWatched});
    this.#filmPopupComponent.element.scrollTo(0, scrollHeight);
  }

  #handleFavoriteClick = () => {
    const scrollHeight = this.#filmPopupComponent.element.scrollTop;
    this.#changeData({...this.#film, isInFavorites: !this.#film.isInFavorites});
    this.#filmPopupComponent.element.scrollTo(0, scrollHeight);
  }

  destroy = () => {
    remove(this.#filmCardComponent);
    remove(this.#filmPopupComponent);
  }

  #openPopup = () => {
    this.#siteFooter.appendChild(this.#filmPopupComponent.element);
    this.#modeChange();
    this.#mode = Mode.EDITING;
    document.body.classList.add('hide-overflow');
  }

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#filmPopupComponent.reset(this.#film);
      this.#removePopup();
    }
  }
}
