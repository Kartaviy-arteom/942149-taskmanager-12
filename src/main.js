import {createControlPanelHtml} from "./view/control-panel.js";
import {createFilterPanelHtml} from "./view/filter-panel.js";
import {createBoardContainerHtml} from "./view/board-container.js";
import {createSortListHtml} from "./view/sort-list.js";
import {createBordTaskListHtml} from "./view/bord-task-list.js";
import {createCardHtml} from "./view/card.js";
import {createShowMoreBtnHtml} from "./view/show-more-btn.js";
import {createEditFormHtml} from "./view/edit-form.js";
import {createTask} from "./mock/task.js";
import {generateFilter} from "./mock/filter.js";

const CARD_QUANTITY = 15;
const TASK_COUNT_PER_STEP = 8;

const tasks = new Array(CARD_QUANTITY).fill().map(createTask);
const filters = generateFilter(tasks);

const pageMainBlock = document.querySelector(`.main`);
const controlPanelWrapper = pageMainBlock.querySelector(`.main__control`);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

render(controlPanelWrapper, createControlPanelHtml(), `beforeend`);
render(pageMainBlock, createFilterPanelHtml(filters), `beforeend`);
render(pageMainBlock, createBoardContainerHtml(), `beforeend`);
const boardContainer = pageMainBlock.querySelector(`.board.container`);
render(boardContainer, createSortListHtml(), `afterbegin`);
render(boardContainer, createBordTaskListHtml(), `beforeend`);
const bordTaskList = boardContainer.querySelector(`.board__tasks`);

for (let i = 1; i < Math.min(tasks.length, TASK_COUNT_PER_STEP); i++) {
  render(bordTaskList, createCardHtml(tasks[i]), `beforeend`);
}

render(bordTaskList, createEditFormHtml(tasks[0]), `afterbegin`);

if (tasks.length > TASK_COUNT_PER_STEP) {
  let renderedTaskCount = TASK_COUNT_PER_STEP;
  render(boardContainer, createShowMoreBtnHtml(), `beforeend`);

  const loadMoreButton = boardContainer.querySelector(`.load-more`);

  loadMoreButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    tasks.slice(renderedTaskCount, renderedTaskCount + TASK_COUNT_PER_STEP).forEach((task) => render(bordTaskList, createCardHtml(task), `beforeend`));
    renderedTaskCount += TASK_COUNT_PER_STEP;

    if (renderedTaskCount >= tasks.length) {
      loadMoreButton.remove();
    }
  });
}
