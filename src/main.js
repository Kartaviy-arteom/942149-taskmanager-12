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

const CARD_QUANTITY = 35;
const TASK_COUNT_PER_STEP = 8;
const GROUP_COUNT_PER_STEP = 1;

const tasks = Array.from(Array(CARD_QUANTITY), createTask);
let transformedTasks = [];
for (let i = 0; i < tasks.length; i += TASK_COUNT_PER_STEP) {
  transformedTasks.push(tasks.slice(i, i + TASK_COUNT_PER_STEP));
}
const numberOfTasksGroup = transformedTasks.length;

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

transformedTasks[0].slice(1).forEach((el) => render(bordTaskList, createCardHtml(el), `beforeend`));

render(bordTaskList, createEditFormHtml(tasks[0]), `afterbegin`);

if (numberOfTasksGroup > GROUP_COUNT_PER_STEP) {
  let renderedTaskGroupCount = GROUP_COUNT_PER_STEP;
  render(boardContainer, createShowMoreBtnHtml(), `beforeend`);

  const loadMoreButton = boardContainer.querySelector(`.load-more`);

  loadMoreButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    transformedTasks[renderedTaskGroupCount].forEach((el) => render(bordTaskList, createCardHtml(el), `beforeend`));
    renderedTaskGroupCount += GROUP_COUNT_PER_STEP;

    if (renderedTaskGroupCount >= numberOfTasksGroup) {
      loadMoreButton.remove();
    }
  });
}
