import {createControlPanelHtml} from "./view/control-panel.js";
import {createFilterPanelHtml} from "./view/filter-panel.js";
import {createBoardContainerHtml} from "./view/board-container.js";
import {createSortListHtml} from "./view/sort-list.js";
import {createBordTaskListHtml} from "./view/bord-task-list.js";
import {createCardHtml} from "./view/card.js";
import {createShowMoreBtnHtml} from "./view/show-more-btn.js";
import {createEditFormHtml} from "./view/edit-form.js";
import {createTask} from "./mock/task.js";

const CARD_QUANTITY = 3;
const tasks = new Array(CARD_QUANTITY).fill().map(createTask);

const pageMainBlock = document.querySelector(`.main`);
const controlPanelWrapper = pageMainBlock.querySelector(`.main__control`);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

render(controlPanelWrapper, createControlPanelHtml(), `beforeend`);
render(pageMainBlock, createFilterPanelHtml(), `beforeend`);
render(pageMainBlock, createBoardContainerHtml(), `beforeend`);
const boardContainer = pageMainBlock.querySelector(`.board.container`);
render(boardContainer, createSortListHtml(), `afterbegin`);
render(boardContainer, createBordTaskListHtml(), `beforeend`);
const bordTaskList = boardContainer.querySelector(`.board__tasks`);
for (let i = 0; i < CARD_QUANTITY; i++) {
  render(bordTaskList, createCardHtml(tasks[i]), `beforeend`);
}
render(boardContainer, createShowMoreBtnHtml(), `beforeend`);
render(bordTaskList, createEditFormHtml(), `afterbegin`);
