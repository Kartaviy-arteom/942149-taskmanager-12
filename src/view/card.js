import {isExpired, isCardRepeating, formatTaskDueDate} from "../utils/card.js";
import BaseComponent from "./base-component.js";

const createCardHtml = (cardData) => {
  const {description, dueDate, repeating, color, isFavorite, isArchive} = cardData;
  const date = dueDate !== null ? formatTaskDueDate(dueDate) : ``;

  const deadlineClassName = isExpired(dueDate) ? `card--deadline` : ``;
  const repeatingClassName = isCardRepeating(repeating) ? `card--repeat` : ``;
  const archiveClassName = isArchive ? `card__btn--archive card__btn--disabled` : `card__btn--archive`;
  const favoriteClassName = isFavorite ? `card__btn--favorites card__btn--disabled` : `card__btn--favorites`;

  return (
    `<article class="card card--${color} ${deadlineClassName} ${repeatingClassName}">
      <div class="card__form">
        <div class="card__inner">
          <div class="card__control">
            <button type="button" class="card__btn card__btn--edit">
              edit
            </button>
            <button type="button" class="card__btn ${archiveClassName}">
              archive
            </button>
            <button
              type="button"
              class="card__btn ${favoriteClassName}"
            >
              favorites
            </button>
          </div>

          <div class="card__color-bar">
            <svg class="card__color-bar-wave" width="100%" height="10">
              <use xlink:href="#wave"></use>
            </svg>
          </div>

          <div class="card__textarea-wrap">
            <p class="card__text">${description}</p>
          </div>

          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                <div class="card__date-deadline">
                  <p class="card__input-deadline-wrap">
                    <span class="card__date">${date}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>`
  );
};

export default class Card extends BaseComponent {
  constructor(cardData) {
    super();
    this._cardData = cardData;
  }

  _getTemplate() {
    return createCardHtml(this._cardData);
  }

  setEditHandler(callback) {
    this._callback.edit = callback;
    this._btnEdit = this.getElement().querySelector(`.card__btn--edit`);
    this._btnEdit.addEventListener(`click`, this._callback.edit);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`.card__btn--favorites`).addEventListener(`click`, this._callback.favoriteClick);
  }

  setArchiveClickHandler(callback) {
    this._callback.archiveClick = callback;
    this.getElement().querySelector(`.card__btn--archive`).addEventListener(`click`, this._callback.archiveClick);
  }


  _removeFavoriteClickHandler() {
    this.getElement().querySelector(`.card__btn--favorites`).removeEventListener(`click`, this._callback.favoriteClick);
  }

  _removeArchiveClickHandler() {
    this.getElement().querySelector(`.card__btn--archive`).removeEventListener(`click`, this._callback.archiveClick);
  }
  _removeEditHandler() {
    this._btnEdit.removeEventListener(`click`, this._callback.edit);
  }

  removeElement() {
    this._removeFavoriteClickHandler();
    this._removeArchiveClickHandler();
    this._removeEditHandler();
    super.removeElement();
  }
}
