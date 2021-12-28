import FilmsCardsView from "../view/films-cards-view";
import AdditionalInfoPopupView from "../view/additional-info-popup-view";
import {replace, remove, render, RenderPosition} from "../render";

export default class cardPresenter {
  #film = null;
  #changeData = null;
  #filmContainer = null;
  #filmCardComponent = null;
  #filmPopupComponent = null;
  #siteFooter = document.querySelector('body');

  constructor(changeData, filmCardContainer) {
    this.#changeData = changeData;
    this.#filmContainer = filmCardContainer;
  }

  init = (film) => {
    this.#film = film;
    const prevFilmCardComponent = this.#filmCardComponent;
    const prevPopupComponent = this.#filmPopupComponent;
    this.#filmCardComponent = new FilmsCardsView(this.#film);
    this.#filmPopupComponent = new AdditionalInfoPopupView(this.#film);

    this.#filmCardComponent.setWatchlistAddedClickHandler(this.#handleWatchlistAddedClick);
    this.#filmCardComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#filmCardComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#filmPopupComponent.setWatchlistAddedClickHandler(this.#handleWatchlistAddedClick);
    this.#filmPopupComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#filmPopupComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    if (prevFilmCardComponent === null) {
      render(this.#filmContainer, this.#filmCardComponent, RenderPosition.BEFOREEND);
    } else if (this.#filmContainer.contains(prevFilmCardComponent.element)) {
      replace(this.#filmCardComponent, prevFilmCardComponent);
      remove(prevFilmCardComponent);
    }
    this.#filmCardComponent.setClickHandler(() => {
      render(this.#siteFooter, this.#filmPopupComponent, RenderPosition.BEFOREEND);
      if(prevPopupComponent === null) {
        render(this.#siteFooter, this.#filmPopupComponent, RenderPosition.BEFOREEND);
        return;
      }

      replace(this.#filmPopupComponent, prevPopupComponent);
      remove(prevPopupComponent);

      document.body.classList.add('hide-overflow');
      document.addEventListener('keydown', this.#removePopup);
    });

    this.#filmPopupComponent.setPopupCloseBtnHandler(this.#removePopup);
  }

  #removePopup = () => {
    remove(this.#filmPopupComponent);
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#onKeyDownClosePopup);
  }

  #onKeyDownClosePopup = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      this.#removePopup();
    }
  };

  #handleWatchlistAddedClick = () => {
    this.#changeData({...this.#film, isInWatchlist: !this.#film.isInWatchlist});
  }

  #handleWatchedClick = () => {
    this.#changeData({...this.#film, isWatched: !this.#film.isWatched});
  }

  #handleFavoriteClick = () => {
    this.#changeData({...this.#film, isInFavorites: !this.#film.isInFavorites});
  }

  destroy = () => {
    remove(this.#filmCardComponent);
  }

}
