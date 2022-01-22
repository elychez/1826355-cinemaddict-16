import FilmsCardsView from '../view/films-cards-view';
import {AdditionalInfoPopupView} from '../view/additional-info-popup-view';
import {replace, remove, render, RenderPosition} from '../render';
import {UpdateType} from '../const';

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
  #changeComment = null;
  #commentsModel = null;
  #mode = Mode.DEFAULT
  #siteFooter = document.querySelector('body');


  constructor(changeData, filmCardContainer, changeMode, changeComment, commentsModal) {
    this.#changeData = changeData;
    this.#filmContainer = filmCardContainer;
    this.#modeChange = changeMode;
    this.#changeComment = changeComment;
    this.#commentsModel = commentsModal;
  }

  init(film) {
    this.#film = film;
    const prevFilmCardComponent = this.#filmCardComponent;
    const prevPopupComponent = this.#filmPopupComponent;
    this.#filmCardComponent = new FilmsCardsView(film);
    const filmComments = this.#commentsModel.getCommentsByFilmId(this.#film.id);
    this.#filmPopupComponent = new AdditionalInfoPopupView(film, filmComments);

    this.#filmPopupComponent.setPopupCloseBtnHandler(() => {
      this.#removePopup();
    });

    this.#filmCardComponent.setClickHandler(() => {
      this.#openPopup();
    });
    this.#filmCardComponent.setWatchlistAddedClickHandler(this.#handleWatchlistAddedClick);
    this.#filmCardComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#filmCardComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#filmPopupComponent.setCommentActionHandler(this.#handlerCommentAction);
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
    document.removeEventListener('keydown', this.#ctrlEnterDownHandler);
    this.#mode = Mode.DEFAULT;
    this.init(this.#film);
  }

  #onKeyDownClosePopup = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#removePopup();
      this.#filmPopupComponent.reset(this.#film);
      document.removeEventListener('keydown', this.#onKeyDownClosePopup);
    }
  };

  #handleWatchlistAddedClick = () => {
    const scrollHeight = this.#filmPopupComponent.element.scrollTop;
    this.#changeData(UpdateType.MINOR, {...this.#film, isInWatchlist: !this.#film.isInWatchlist});
    this.#filmPopupComponent.element.scrollTo(0, scrollHeight);
  }

  #handleWatchedClick = () => {
    const scrollHeight = this.#filmPopupComponent.element.scrollTop;
    this.#changeData(UpdateType.MINOR ,{...this.#film, isWatched: !this.#film.isWatched});
    this.#filmPopupComponent.element.scrollTo(0, scrollHeight);
  }

  #handleFavoriteClick = () => {
    const scrollHeight = this.#filmPopupComponent.element.scrollTop;
    this.#changeData(UpdateType.MINOR,{...this.#film, isInFavorites: !this.#film.isInFavorites});
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
    document.addEventListener('keydown', this.#onKeyDownClosePopup);
    document.addEventListener('keydown', this.#ctrlEnterDownHandler);
  }

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#filmPopupComponent.reset(this.#film);
      this.#removePopup();
    }
  }

  #handlerCommentAction = (type, comment) => {
    this.#changeComment(type, UpdateType.MINOR, comment);
  }

  #ctrlEnterDownHandler = (evt) => {
    if (evt.key === 'Enter' && evt.ctrlKey) {
      evt.preventDefault();
      this.#filmPopupComponent.addCommentHandler();
    }
  }

}
