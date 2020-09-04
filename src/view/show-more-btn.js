import BaseComponent from "./base-component.js";

const createShowMoreBtnHtml = () => {
  return (
    `<button class="load-more" type="button">load more</button>`
  );
};

export default class ShowMoreBtn extends BaseComponent {
  constructor() {
    super();
  }

  _getTemplate() {
    return createShowMoreBtnHtml();
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().addEventListener(`click`, this._callback.click);
  }

  _removeClickHandler() {
    this.getElement().removeEventListener(`click`, this._callback.click);
  }

  removeElement() {
    this._removeClickHandler();
    super.removeElement();
  }
}
