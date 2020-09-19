import BaseComponent from "./base-component.js";

export default class BaseSmartComponent extends BaseComponent {
  constructor() {
    super();
    this._data = {};
  }

  _restoreHandlers() {
    throw new Error(`method not implemented`);
  }

  updateElement() {
    let prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this._element.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);

    prevElement.removeElement();
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
