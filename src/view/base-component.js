import {createElement} from "../utils/render.js";

export default class BaseComponent {
  constructor() {
    if (new.target === BaseComponent) {
      throw new Error(`Code Red. Can't instantiate BaseComponent`);
    }

    this._element = null;
    this._callback = {};
  }

  _getTemplate() {
    throw new Error(`method not implemented`);
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
