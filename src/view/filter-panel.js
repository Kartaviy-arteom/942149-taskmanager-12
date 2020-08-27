import BaseComponent from "./base-component.js";

const createFilterTemplate = (filter, isChecked) => {
  const {name, count} = filter;

  return (
    `<input
      type="radio"
      id="filter__${name}"
      class="filter__input visually-hidden"
      name="filter"
      ${isChecked ? `checked` : ``}
      ${count === 0 ? `disabled` : ``}
    />
    <label for="filter__${name}" class="filter__label">
      ${name} <span class="filter__${name}-count">${count}</span></label
    >`
  );
};

const createFilterPanelHtml = (filterItems) => {
  const filterItemsTemplate = filterItems
    .map((filter, index) => createFilterTemplate(filter, index === 0))
    .join(``);

  return `<section class="main__filter filter container">
    ${filterItemsTemplate}
  </section>`;
};

export default class FilterPanel extends BaseComponent {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  _getTemplate() {
    return createFilterPanelHtml(this._filters);
  }
}
