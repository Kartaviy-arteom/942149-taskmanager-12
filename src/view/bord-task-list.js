import {createElement} from "../utils.js";

const createBordTaskListHtml = () => {
  return (
    `<div class="board__tasks">
    </div>`
  );
};

export default class BordTaskList {
  constructor() {
    this._element = null;
  }

  _getTemplate() {
    return createBordTaskListHtml();
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
