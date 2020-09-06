import {CARD_MARK_COLORS} from "../consts.js";
import {isExpired, isCardRepeating, humanizeDueDate} from "../utils/card.js";
import BaseComponent from "./base-component.js";

const BLANK_EDIT_FORM = {
  color: CARD_MARK_COLORS[0],
  description: ``,
  dueDate: null,
  repeating: {
    mo: false,
    tu: false,
    we: false,
    th: false,
    fr: false,
    sa: false,
    su: false
  },
  isArchive: false,
  isFavorite: false
};

const createTaskEditDateTemplate = (dueDate, isDueDate) => {
  return `<button class="card__date-deadline-toggle" type="button">
      date: <span class="card__date-status">${isDueDate ? `yes` : `no`}</span>
    </button>
    ${isDueDate ? `<fieldset class="card__date-deadline"><label class="card__input-deadline-wrap"><input class="card__date" type="text" placeholder="" name="date" value="${humanizeDueDate(dueDate)}"/></label></fieldset>` : ``}
  `;
};

const createTaskEditColorsTemplate = (currentColor) => {

  return CARD_MARK_COLORS.map((color) => `<input
    type="radio"
    id="color-${color}"
    class="card__color-input card__color-input--${color} visually-hidden"
    name="color"
    value="${color}"
    ${currentColor === color ? `checked` : ``}
  />
  <label
    for="color-${color}"
    class="card__color card__color--${color}"
    >${color}</label
  >`).join(``);
};

const createTaskEditRepeatingTemplate = (repeating, isRepeating) => {
  return `<button class="card__repeat-toggle" type="button">
    repeat:<span class="card__repeat-status">${isRepeating ? `yes` : `no`}</span>
  </button>
  ${isRepeating ? `<fieldset class="card__repeat-days">
    <div class="card__repeat-days-inner">
      ${Object.entries(repeating).map(([day, repeat]) => `<input
        class="visually-hidden card__repeat-day-input"
        type="checkbox"
        id="repeat-${day}"
        name="repeat"
        value="${day}"
        ${repeat ? `checked` : ``}
      />
      <label class="card__repeat-day" for="repeat-${day}"
        >${day}</label
      >`).join(``)}
    </div>
  </fieldset>` : ``}`;
};

export const createEditFormHtml = (editFormData) => {
  const {color, description, dueDate, repeating, isDueDate, isRepeating} = editFormData;

  const dateTemplate = createTaskEditDateTemplate(dueDate, isDueDate);
  const deadlineClassName = isDueDate ? `card--deadline` : ``;
  const repeatingClassName = isRepeating ? `card--repeat` : ``;

  return (
    `<article class="card card--edit card--${color} ${deadlineClassName} ${repeatingClassName}">
      <form class="card__form" method="get">
        <div class="card__inner">
          <div class="card__color-bar">
            <svg class="card__color-bar-wave" width="100%" height="10">
              <use xlink:href="#wave"></use>
            </svg>
          </div>

          <div class="card__textarea-wrap">
            <label>
              <textarea
                class="card__text"
                placeholder="Start typing your text here..."
                name="text"
              >${description}</textarea>
            </label>
          </div>

          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">

              ${dateTemplate}
              ${createTaskEditRepeatingTemplate(repeating, isRepeating)}
              </div>
            </div>

            <div class="card__colors-inner">
              <h3 class="card__colors-title">Color</h3>
              <div class="card__colors-wrap">
                ${createTaskEditColorsTemplate(color)}
              </div>
            </div>
          </div>

          <div class="card__status-btns">
            <button class="card__save" type="submit">save</button>
            <button class="card__delete" type="button">delete</button>
          </div>
        </div>
      </form>
    </article>`
  );
};

export default class EditForm extends BaseComponent {
  constructor(formData = BLANK_EDIT_FORM) {
    super();
    this._formData = formData;
    this._data = this._parseCardToData(this._formData);
    this._submitHandler = this._submitHandler.bind(this);

    this._setInnerHandlers();
  }

  _getTemplate() {
    return createEditFormHtml(this._data);
  }

  _setInnerHandlers() {
    this._descriptionInputHandler = this._descriptionInputHandler.bind(this);
    this._dateDeadlineToggleHandler = this._dateDeadlineToggleHandler.bind(this);
    this._repeatingToggleHandler = this._repeatingToggleHandler.bind(this);

    this.getElement().querySelector(`.card__text`).addEventListener(`input`, this._descriptionInputHandler);
    this.getElement().querySelector(`.card__date-deadline-toggle`).addEventListener(`click`, this._dateDeadlineToggleHandler);
    this.getElement().querySelector(`.card__repeat-toggle`).addEventListener(`click`, this._repeatingToggleHandler);
  }

  _restoreHandlers() {
    this._setInnerHandlers();
    this.setSubmitHandler(this._callback.submit);
  }

  _descriptionInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      description: evt.target.value
    }, true);
  }

  _dateDeadlineToggleHandler(evt) {
    evt.preventDefault();
    this.updateData({
      isDueDate: !this._data.isDueDate
    });
  }

  _repeatingToggleHandler(evt) {
    evt.preventDefault();
    this.updateData({
      isRepeating: !this._data.isRepeating
    });
  }

  _submitHandler(evt) {
    evt.preventDefault();
    this._callback.submit(this._parseDataToCard(this._data));
  }

  setSubmitHandler(callback) {
    this._callback.submit = callback;
    this.getElement().querySelector(`form`).addEventListener(`submit`, this._submitHandler);
  }

  _removeSubmitHandler() {
    this.getElement().querySelector(`form`).removeEventListener(`submit`, this._submitHandler);
  }

  removeElement() {
    this._removeSubmitHandler();
    super.removeElement();
  }

  _parseCardToData(card) {
    return Object.assign(
        {},
        card,
        {
          isDueDate: card.dueDate !== null,
          isRepeating: isCardRepeating(card.repeating)
        }
    );
  }

  _parseDataToCard(data) {
    data = Object.assign({}, data);

    if (!data.isDueDate) {
      data.dueDate = null;
    }

    if (!data.isRepeating) {
      data.repeating = {
        mo: false,
        tu: false,
        we: false,
        th: false,
        fr: false,
        sa: false,
        su: false
      };
    }

    delete data.isDueDate;
    delete data.isRepeating;

    return data;
  }

  updateElement() {
    let prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this._element = null;

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);

    prevElement = null;
    this._restoreHandlers();

  }

  updateData(update, isOnlyData) {
    if (!update) {
      return;
    }

    this._data = Object.assign(
        {},
        this._data,
        update
    );

    if (isOnlyData) {
      return;
    }

    this.updateElement();
  }
}
