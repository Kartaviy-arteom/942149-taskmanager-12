import BaseComponent from "./base-component.js";

const createBoardContainerHtml = () => {
  return (
    `<section class="board container">
    </section>`
  );
};

export default class BoardContainer extends BaseComponent {
  _getTemplate() {
    return createBoardContainerHtml();
  }
}
