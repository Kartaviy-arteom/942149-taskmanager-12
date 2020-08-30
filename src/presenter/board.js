import NoCard from "../view/no-card.js";
import SortList from "../view/sort-list.js";
import BordTaskList from "../view/bord-task-list.js";
import Board from "../view/board.js";
import ShowMoreBtn from "../view/show-more-btn.js";
import Card from "../view/card.js";
import EditForm from "../view/edit-form.js";
import {render} from "../utils/render.js";
import {RenderPosition} from "../consts.js";
import BaseComponent from "../view/base-component.js";

const TASK_COUNT_PER_STEP = 8;
const GROUP_COUNT_PER_STEP = 1;
const ESC_KEY_CODE = 27;

export default class BoardPresenter {
  constructor(boardWrappper) {
    this._boardWrapper = boardWrappper;
    this._noCardComponent = new NoCard();
    this._sortListComponent = new SortList();
    this._boardTaskListComponent = new BordTaskList();
    this._boardComponent = new Board();
    this._showMoreBtnComponent = new ShowMoreBtn();
  }

  init(cardsData) {
    this._cardsData = cardsData.slice();
    this._transformedCardsData = [];
    for (let i = 0; i < cardsData.length; i += TASK_COUNT_PER_STEP) {
      this._transformedCardsData.push(cardsData.slice(i, i + TASK_COUNT_PER_STEP));
    }
    this._numberOfTasksGroup = this._transformedCardsData.length;
    render(this._boardWrapper, this._boardComponent, RenderPosition.BEFOREEND);
    this._renderBoard();
  }

  _renderNoCard() {
    render(this._boardComponent, this._noCardComponent, RenderPosition.BEFOREEND);
  }

  _renderCard(cardListElement, cardData) {
    if (cardListElement instanceof BaseComponent) {
      cardListElement = cardListElement.getElement();
    }
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

    cardComponent.setEditHandler(() => {
      replaceCardToEditForm();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    cardEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      replaceEditToCard();
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    render(cardListElement, cardComponent.getElement(), RenderPosition.BEFOREEND);
  }

  _renderGroupOfCards(groupNumber) {
    this._transformedCardsData[groupNumber].forEach((el) => this._renderCard(this._boardTaskListComponent, el));
  }

  _renderSortList() {
    render(this._boardComponent, this._sortListComponent, RenderPosition.AFTERBEGIN);
  }

  _renderBordTaskList() {
    render(this._boardComponent, this._boardTaskListComponent, RenderPosition.BEFOREEND);
  }

  _renderBoard() {
    if (this._cardsData.every((cardData) => cardData.isArchive)) {
      this._renderNoCard();
      return;
    }

    this._renderSortList();

    this._renderBordTaskList();

    this._renderGroupOfCards(0);

    if (this._numberOfTasksGroup > GROUP_COUNT_PER_STEP) {
      this._renderShowMoreBtn();
    }
  }

  _removeShowMoreBtn() {
    this._showMoreBtnComponent.getElement().remove();
    this._showMoreBtnComponent.removeElement();
  }

  _renderShowMoreBtn() {
    render(this._boardComponent, this._showMoreBtnComponent, RenderPosition.BEFOREEND);
    let renderedTaskGroupCount = GROUP_COUNT_PER_STEP;
    this._showMoreBtnComponent.setClickHandler(() => {
      this._renderGroupOfCards(renderedTaskGroupCount);
      renderedTaskGroupCount += GROUP_COUNT_PER_STEP;

      if (renderedTaskGroupCount >= this._numberOfTasksGroup) {
        this._removeShowMoreBtn();
      }
    });
  }
}
