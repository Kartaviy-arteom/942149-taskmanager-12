import BaseComponent from "./base-component.js";

const createBordTaskListHtml = () => {
  return (
    `<div class="board__tasks">
    </div>`
  );
};

export default class BordTaskList extends BaseComponent {
  _getTemplate() {
    return createBordTaskListHtml();
  }
}
