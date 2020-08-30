import {isExpired, isRepeating, humanizeDueDate} from "../utils/card.js";
import BaseComponent from "./base-component.js";

const createCardHtml = (cardData) => {
  const {description, dueDate, repeating, color, isFavorite, isArchive} = cardData;
  const date = dueDate !== null ? humanizeDueDate(dueDate) : ``;

  const deadlineClassName = isExpired(dueDate) ? `card--deadline` : ``;
  const repeatingClassName = isRepeating(repeating) ? `card--repeat` : ``;
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
    this._editHandler = this._editHandler.bind(this);
  }

  _getTemplate() {
    return createCardHtml(this._cardData);
  }

  _editHandler(evt) {
    evt.preventDefault();
    this._callback.edit();
  }

  setEditHandler(callback) {
    this._callback.edit = callback;
    this.getElement().querySelector(`.card__btn--edit`).addEventListener(`click`, this._callback.edit);
  }
}
