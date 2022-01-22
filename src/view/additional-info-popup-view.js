import SmartView from './smart-view';
import dayjs from 'dayjs';
import he from 'he';
import {CommentAction} from '../const';

const getCommentsContent = (comments) => comments.map(({id, text, emoji, author, data}) =>
  `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${he.encode(emoji)}.png" width="55" height="55" alt="emoji-${he.encode(emoji)}">
    </span>
    <div>
      <p class="film-details__comment-text">${he.encode(text)}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${he.encode(author)}</span>
        <span class="film-details__comment-day">${he.encode(dayjs(data).format('YYYY/MM/DD HH:mm'))}</span>
        <button class="film-details__comment-delete" data-id="${id}">Delete</button>
      </p>
    </div>
  </li>`).join('');


const createAdditionalFilmInfoPopupTemplate = (mock, comments) => {
  const {title, rating, release, length, genres, poster, description, director, screenwriters, actors, country, isInWatchlist, isWatched, isInFavorites, newCommentText, newCommentEmoji} = mock;
  const addStatus = (status) => {
    const statusType = status === true ? '--active' : '';
    return `film-details__control-button${statusType}`;
  };

  const formattedDate = dayjs(release).format('DD MMMM YYYY');

  return (`<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${poster}" alt="">

          <p class="film-details__age">18+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">Original: ${title}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${rating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${screenwriters}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actors}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${formattedDate}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${length}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${country}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Genres</td>
              <td class="film-details__cell">
                ${genres.map((genre) => `<span class="film-details__genre">${genre}</span>`)}</td>
            </tr>
          </table>

          <p class="film-details__film-description">
            ${description}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
        <button type="button" class="film-details__control-button ${addStatus(isInWatchlist)} film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>
        <button type="button" class="film-details__control-button ${addStatus(isWatched)} film-details__control-button--watched" id="watched" name="watched">Already watched</button>
        <button type="button" class="film-details__control-button ${addStatus(isInFavorites)} film-details__control-button--favorite" id="favorite" name="favorite">Add to favorites</button>
      </section>
    </div>

    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

        <ul class="film-details__comments-list">
            ${getCommentsContent(comments)}
          </ul>

        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label">  ${newCommentEmoji ? `<img src="images/emoji/${newCommentEmoji}.png" width="55" height="55" alt="emoji-${newCommentEmoji}">` : ''}</div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${ newCommentText ? he.encode(newCommentText) : ''}</textarea>
          </label>

          <div class="film-details__emoji-list">
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
            <label class="film-details__emoji-label" for="emoji-smile">
              <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
            <label class="film-details__emoji-label" for="emoji-sleeping">
              <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
            <label class="film-details__emoji-label" for="emoji-puke">
              <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
            <label class="film-details__emoji-label" for="emoji-angry">
              <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
            </label>
          </div>
        </div>
      </section>
    </div>
  </form>
</section>`);
};

export class AdditionalInfoPopupView extends SmartView {
  #comments = [];
  #callback = {};

  constructor(mock, comments) {
    super();
    this._data = AdditionalInfoPopupView.parseCardToData(mock);
    this.#comments = comments;
    this._setInnerHandlers();
  }

  get template() {
    return createAdditionalFilmInfoPopupTemplate(this._data, this.#comments);
  }


  setPopupCloseBtnHandler = (callback) => {
    this.#callback.click = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#popupCloseBtnHandler);
  }

  #popupCloseBtnHandler = (evt) => {
    evt.preventDefault();
    this.#callback.click();
  }

  setWatchlistAddedClickHandler = (callback) => {
    this.#callback.watchlistAddedClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#watchlistAddedClickHandler);
  }

  setWatchedClickHandler = (callback) => {
    this.#callback.watchedClick = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#watchedClickHandler);
  }

  setFavoriteClickHandler = (callback) => {
    this.#callback.favoriteClick = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoriteClickHandler);
  }

  #watchlistAddedClickHandler = (evt) => {
    evt.preventDefault();
    this.#callback.watchlistAddedClick();
    this.element.querySelector('.film-details__control-button--watchlist').classList.toggle('film-details__control-button--active');
  }

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    this.#callback.watchedClick();
    this.element.querySelector('.film-details__control-button--watched').classList.toggle('film-details__control-button--active');
  }

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#callback.favoriteClick();
    this.element.querySelector('.film-details__control-button--favorite').classList.toggle('film-details__control-button--active');
  }


  reset = (film) => {
    this.updateData(
      AdditionalInfoPopupView.parseCardToData(film)
    );
  }

  restoreHandlers = () => {
    this._setInnerHandlers();
    this.setFavoriteClickHandler(this.#callback.favoriteClick);
    this.setWatchedClickHandler(this.#callback.watchedClick);
    this.setWatchlistAddedClickHandler(this.#callback.watchlistAddedClick);
    this.setPopupCloseBtnHandler(this.#callback.click);
    this.setCommentActionHandler(this.#callback.commentAction);
  }

  static parseCardToData = (card) => ({...card,
    newCommentText: '',
    newCommentEmoji: null,
    scrollPosition: null
  });

  updateElement() {
    super.updateElement();

    if (this._data.scrollPosition) {
      this.element.scrollTo(0, this._data.scrollPosition);
    }
  }

  _setInnerHandlers() {
    this.element.querySelectorAll('.film-details__emoji-item').forEach((item) => item.addEventListener('change', this.#emojiClickHandler));
    this.element.querySelector('.film-details__comment-input').addEventListener('input', this.#commentInputHandler);
  }

  #emojiClickHandler = (evt) => {
    evt.preventDefault();

    this.updateData({
      newCommentEmoji: evt.target.value,
      scrollPosition: this.element.scrollTop
    });
  }

  setCommentActionHandler = (callback) => {
    this.#callback.commentAction = callback;

    this.element.querySelectorAll('.film-details__comment-delete').forEach((button) => {
      button.addEventListener('click', this.#deleteCommentHandler);
    });
  }

  #deleteCommentHandler = (evt) => {
    evt.preventDefault();
    const commentId = evt.target.dataset.id;
    const index = this.#comments.findIndex((comment) => comment.id === commentId);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }
    this.#callback.commentAction(CommentAction.DELETE, this.#comments[index]);
  }

  addCommentHandler = () => {
    if (this._data.newCommentEmoji === null || this._data.newCommentText.length === 0) {
      return;
    }

    const newComment = {
      filmId: this._data.id,
      emoji: this._data.newCommentEmoji ? this._data.newCommentEmoji : null,
      text: this._data.newCommentText,
      data: '',
    };
    this.#callback.commentAction(CommentAction.ADD, newComment);
  }

  #commentInputHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      newCommentText: evt.target.value,
      scrollPosition: this.element.scrollTop
    }, true);
  }

  static = (data) => {
    const film = {...data};
    delete film.newCommentText;
    delete film.newCommentEmoji;

    return film;
  }
}
