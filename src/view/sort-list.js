import BaseComponent from "./base-component.js";
import {sortType} from "../consts.js";

const createSortListHtml = () => {
  return (
    `<div class="board__filter-list">
      <a href="#" class="board__filter" data-sort-type="${sortType.DEFAULT}">SORT BY DEFAULT</a>
      <a href="#" class="board__filter" data-sort-type="${sortType.DATE_DOWN}">SORT BY DATE up</a>
      <a href="#" class="board__filter" data-sort-type="${sortType.DATE_UP}">SORT BY DATE down</a>
    </div>`
  );
};

export default class SortList extends BaseComponent {
  constructor() {
    super();
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  _getTemplate() {
    return createSortListHtml();
  }

  _sortTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().querySelectorAll(`.board__filter`).forEach((el) => (el.addEventListener(`click`, this._sortTypeChangeHandler)));
  }
}
