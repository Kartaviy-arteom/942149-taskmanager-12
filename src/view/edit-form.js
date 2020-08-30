import {CARD_MARK_COLORS} from "../consts.js";
import {isExpired, isRepeating, humanizeDueDate} from "../utils/card.js";
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

const createTaskEditDateTemplate = (dueDate) => {
  return `<button class="card__date-deadline-toggle" type="button">
      date: <span class="card__date-status">${dueDate !== null ? `yes` : `no`}</span>
    </button>
    ${dueDate !== null ? `<fieldset class="card__date-deadline">
      <label class="card__input-deadline-wrap">
        <input
          class="card__date"
          type="text"
          placeholder=""
          name="date"
          value="${humanizeDueDate(dueDate)}"
        />
      </label>
    </fieldset>` : ``}
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

const createTaskEditRepeatingTemplate = (repeating) => {
  return `<button class="card__repeat-toggle" type="button">
    repeat:<span class="card__repeat-status">${isRepeating(repeating) ? `yes` : `no`}</span>
  </button>
  ${isRepeating(repeating) ? `<fieldset class="card__repeat-days">
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
  const {color, description, dueDate, repeating} = editFormData;

  const dateTemplate = createTaskEditDateTemplate(dueDate);
  const deadlineClassName = isExpired(dueDate) ? `card--deadline` : ``;
  const repeatingClassName = isRepeating(repeating) ? `card--repeat` : ``;

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
              ${createTaskEditRepeatingTemplate(repeating)}
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
  constructor(formData) {
    super();
    this._formData = formData || BLANK_EDIT_FORM;
    this._submitHandler = this._submitHandler.bind(this);
  }

  _getTemplate() {
    return createEditFormHtml(this._formData);
  }

  _submitHandler(evt) {
    evt.preventDefault();
    this._callback.submit();
  }

  setSubmitHandler(callback) {
    this._callback.submit = callback;
    this.getElement().querySelector(`form`).addEventListener(`submit`, this._callback.submit);
  }
}
