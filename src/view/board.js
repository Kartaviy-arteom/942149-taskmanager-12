import BaseComponent from "./base-component.js";

const createBoardContainerHtml = () => {
  return (
    `<section class="board container">
    </section>`
  );
};

export default class Board extends BaseComponent {
  _getTemplate() {
    return createBoardContainerHtml();
  }
}
