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
import {sortTaskUp, sortTaskDown} from "../utils/card.js";
import {sortType} from "../consts.js";

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

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._currentSortType = sortType.DEFAULT;
    this._transformedCardsData = [];
  }

  init(cardsData) {
    this._cardsData = cardsData.slice();
    this._sourcedBoardCards = cardsData.slice();
    this._transformCardData();
    this._numberOfTasksGroup = this._transformedCardsData.length;
    render(this._boardWrapper, this._boardComponent, RenderPosition.BEFOREEND);
    this._renderBoard();
  }

  _transformCardData() {
    for (let i = 0; i < this._cardsData.length; i += TASK_COUNT_PER_STEP) {
      this._transformedCardsData.push(this._cardsData.slice(i, i + TASK_COUNT_PER_STEP));
    }
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

    cardComponent.setEditHandler((evt) => {
      evt.preventDefault();
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

  _handleSortTypeChange(chosenSortType) {
    if (this._currentSortType === chosenSortType) {
      return;
    }

    this._sortCards(chosenSortType);
    this._clearBordCardList();
    this._transformedCardsData = [];
    this._transformCardData();
    this._renderGroupOfCards(GROUP_COUNT_PER_STEP);
    if (this._numberOfTasksGroup > GROUP_COUNT_PER_STEP) {
      this._renderShowMoreBtn();
    }
  }

  _sortCards(chosenSortType) {
    switch (chosenSortType) {
      case sortType.DATE_UP:
        this._cardsData.sort(sortTaskUp);
        break;
      case sortType.DATE_DOWN:
        this._cardsData.sort(sortTaskDown);
        break;
      default:
        this._cardsData = this._sourcedBoardCards.slice();
    }

    this._currentSortType = sortType;
  }

  _renderSortList() {
    render(this._boardComponent, this._sortListComponent, RenderPosition.AFTERBEGIN);
    this._sortListComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _clearBordCardList() {
    this._boardTaskListComponent.getElement().innerHTML = ``;
    this._renderedTaskGroupCount = GROUP_COUNT_PER_STEP;
  }

  _renderBordCardList() {
    render(this._boardComponent, this._boardTaskListComponent, RenderPosition.BEFOREEND);
  }

  _renderBoard() {
    if (this._cardsData.every((cardData) => cardData.isArchive)) {
      this._renderNoCard();
      return;
    }

    this._renderSortList();

    this._renderBordCardList();

    this._renderGroupOfCards(0);

    if (this._numberOfTasksGroup > GROUP_COUNT_PER_STEP) {
      this._renderShowMoreBtn();
    }
  }

  _renderShowMoreBtn() {
    render(this._boardComponent, this._showMoreBtnComponent, RenderPosition.BEFOREEND);
    this._renderedTaskGroupCount = GROUP_COUNT_PER_STEP;
    this._showMoreBtnComponent.setClickHandler((evt) => {
      evt.preventDefault();
      this._renderGroupOfCards(this._renderedTaskGroupCount);
      this._renderedTaskGroupCount += GROUP_COUNT_PER_STEP;

      if (this._renderedTaskGroupCount >= this._numberOfTasksGroup) {
        this._showMoreBtnComponent.removeElement();
      }
    });
  }
}
