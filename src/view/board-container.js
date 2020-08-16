import {createElement} from "../utils.js";

const createBoardContainerHtml = () => {
  return (
    `<section class="board container">
    </section>`
  );
};

export default class BoardContainer {
  constructor() {
    this._element = null;
  }

  _getTemplate() {
    return createBoardContainerHtml();
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
