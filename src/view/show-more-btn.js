import {createElement} from "../utils.js";

const createShowMoreBtnHtml = () => {
  return (
    `<button class="load-more" type="button">load more</button>`
  );
};

export default class ShowMoreBtn {
  constructor() {
    this._element = null;
  }

  _getTemplate() {
    return createShowMoreBtnHtml();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this._getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
