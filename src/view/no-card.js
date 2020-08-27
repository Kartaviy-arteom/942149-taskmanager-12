import BaseComponent from "./base-component.js";

const createNoCardTemplate = () => {
  return `<p class="board__no-tasks">
    Click «ADD NEW TASK» in menu to create your first task
  </p>`;
};

export default class NoCard extends BaseComponent {
  _getTemplate() {
    return createNoCardTemplate();
  }
}
