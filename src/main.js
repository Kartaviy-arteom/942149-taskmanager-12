import ControlPanel from "./view/control-panel.js";
import FilterPanel from "./view/filter-panel.js";
import BoardContainer from "./view/board-container.js";
import SortList from "./view/sort-list.js";
import BordTaskList from "./view/bord-task-list.js";
import Card from "./view/card.js";
import ShowMoreBtn from "./view/show-more-btn.js";
import EditForm from "./view/edit-form.js";
import NoCard from "./view/no-card.js";
import {createTask} from "./mock/task.js";
import {generateFilter} from "./mock/filter.js";
import {render} from "./utils.js";
import {RenderPosition} from "./consts.js";

const CARD_QUANTITY = 110;
const TASK_COUNT_PER_STEP = 8;
const ESC_KEY_CODE = 27;
const GROUP_COUNT_PER_STEP = 1;

const tasks = Array.from(Array(CARD_QUANTITY), createTask);
let transformedTasks = [];
for (let i = 0; i < tasks.length; i += TASK_COUNT_PER_STEP) {
  transformedTasks.push(tasks.slice(i, i + TASK_COUNT_PER_STEP));
}
const numberOfTasksGroup = transformedTasks.length;

const filters = generateFilter(tasks);

const renderCard = (cardListElement, cardData) => {
  const cardComponent = new Card(cardData);
  const cardEditComponent = new EditForm(cardData);

  const replaceEditToCard = () => {
    cardListElement.replaceChild(cardComponent.getElement(), cardEditComponent.getElement());
  };

  const replaceCardToEditForm = () => {
    cardListElement.replaceChild(cardEditComponent.getElement(), cardComponent.getElement());
  };

  const onEscKeyDown = (evt) => {
    if (evt.keyCode === ESC_KEY_CODE) {
      evt.preventDefault();
      replaceEditToCard();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  cardComponent.getElement().querySelector(`.card__btn--edit`).addEventListener(`click`, () => {
    replaceCardToEditForm();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  cardEditComponent.getElement().querySelector(`form`).addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceEditToCard();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(cardListElement, cardComponent.getElement(), RenderPosition.BEFOREEND);
};

const pageMainBlock = document.querySelector(`.main`);
const controlPanelWrapper = pageMainBlock.querySelector(`.main__control`);

render(controlPanelWrapper, new ControlPanel().getElement(), RenderPosition.BEFOREEND);
render(pageMainBlock, new FilterPanel(filters).getElement(), RenderPosition.BEFOREEND);

const boardContainer = new BoardContainer();
render(pageMainBlock, boardContainer.getElement(), RenderPosition.BEFOREEND);

const renderCardBoard = (wrapper) => {
  if (tasks.every((task) => task.isArchive)) {
    render(wrapper, new NoCard().getElement(), RenderPosition.BEFOREEND);
    return;
  }

  render(wrapper, new SortList().getElement(), RenderPosition.AFTERBEGIN);

  const bordTaskList = new BordTaskList();
  render(wrapper, bordTaskList.getElement(), RenderPosition.BEFOREEND);

  transformedTasks[0].forEach((el) => renderCard(bordTaskList.getElement(), el, `beforeend`));

  if (numberOfTasksGroup > GROUP_COUNT_PER_STEP) {
    let renderedTaskGroupCount = GROUP_COUNT_PER_STEP;
    const showMoreBtnComponent = new ShowMoreBtn();
    render(boardContainer.getElement(), showMoreBtnComponent.getElement(), RenderPosition.BEFOREEND);

    showMoreBtnComponent.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();
      transformedTasks[renderedTaskGroupCount].forEach((el) => renderCard(bordTaskList.getElement(), el));
      renderedTaskGroupCount += GROUP_COUNT_PER_STEP;

      if (renderedTaskGroupCount >= numberOfTasksGroup) {
        showMoreBtnComponent.getElement().remove();
        showMoreBtnComponent.removeElement();
      }
    });
  }
};

renderCardBoard(boardContainer.getElement());
