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
import {render, RenderPosition} from "./utils.js";

const CARD_QUANTITY = 110;
const TASK_COUNT_PER_STEP = 8;
const ESC_KEY_CODE = 27;

const tasks = new Array(CARD_QUANTITY).fill().map(createTask);
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

const renderCardBoard = (wrapper, cardsData) => {
  if (tasks.every((task) => task.isArchive)) {
    render(wrapper, new NoCard().getElement(), RenderPosition.BEFOREEND);
    return;
  }

  render(wrapper, new SortList().getElement(), RenderPosition.AFTERBEGIN);

  const bordTaskList = new BordTaskList();
  render(wrapper, bordTaskList.getElement(), RenderPosition.BEFOREEND);


  for (let i = 0; i < Math.min(cardsData.length, TASK_COUNT_PER_STEP); i++) {
    renderCard(bordTaskList.getElement(), cardsData[i]);
  }

  if (cardsData.length > TASK_COUNT_PER_STEP) {
    let renderTemplateedTaskCount = TASK_COUNT_PER_STEP;
    const showMoreBtnComponent = new ShowMoreBtn();
    render(boardContainer.getElement(), showMoreBtnComponent.getElement(), RenderPosition.BEFOREEND);

    showMoreBtnComponent.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();
      cardsData.slice(renderTemplateedTaskCount, renderTemplateedTaskCount + TASK_COUNT_PER_STEP).forEach((task) => renderCard(bordTaskList.getElement(), task));
      renderTemplateedTaskCount += TASK_COUNT_PER_STEP;

      if (renderTemplateedTaskCount >= cardsData.length) {
        showMoreBtnComponent.getElement().remove();
        showMoreBtnComponent.removeElement();
      }
    });
  }
};

renderCardBoard(boardContainer.getElement(), tasks);
