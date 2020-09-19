import NoCard from "../view/no-card.js";
import SortList from "../view/sort-list.js";
import BordTaskList from "../view/bord-task-list.js";
import Board from "../view/board.js";
import ShowMoreBtn from "../view/show-more-btn.js";
import {render} from "../utils/render.js";
import {RenderPosition} from "../consts.js";
import {sortTaskUp, sortTaskDown} from "../utils/card.js";
import {SortType, UpdateType, UserAction} from "../consts.js";
import CardPresenter from "./card.js";

const TASK_COUNT_PER_STEP = 8;
const GROUP_COUNT_PER_STEP = 1;

export default class BoardPresenter {
  constructor(boardWrappper, cardsModel) {
    this._cardsModel = cardsModel;
    this._boardWrapper = boardWrappper;
    this._noCardComponent = new NoCard();
    this._boardTaskListComponent = new BordTaskList();
    this._boardComponent = new Board();


    this._sortListComponent = null;
    this._showMoreBtnComponent = null;

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._cardsModel.addObserver(this._handleModelEvent);

    this._currentSortType = SortType.DEFAULT;
    this._transformedCardsData = [];
    this._cardPresenter = {};
  }

  _getCards() {
    switch (this._currentSortType) {
      case SortType.DATE_UP:
        return this._cardsModel.getCards().slice().sort(sortTaskUp);
      case SortType.DATE_DOWN:
        return this._cardsModel.getCards().slice().sort(sortTaskDown);
    }
    return this._cardsModel.getCards();
  }

  init() {
    this._transformCardData();
    this._numberOfTasksGroup = this._transformedCardsData.length;

    render(this._boardWrapper, this._boardComponent, RenderPosition.BEFOREEND);
    this._renderBoard();
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_CARD:
        this._cardsModel.updateCard(updateType, update);
        break;
      case UserAction.ADD_CARD:
        this._cardsModel.addCard(updateType, update);
        break;
      case UserAction.DELETE_CARD:
        this._cardsModel.deleteCard(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._cardPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearBoard();
        this._renderBoard();
        break;
      case UpdateType.MAJOR:

        break;
    }
  }

  _transformCardData() {
    const cardsData = this._getCards();
    for (let i = 0; i < cardsData.length; i += TASK_COUNT_PER_STEP) {
      this._transformedCardsData.push(cardsData.slice(i, i + TASK_COUNT_PER_STEP));
    }
  }

  _renderNoCard() {
    render(this._boardComponent, this._noCardComponent, RenderPosition.BEFOREEND);
  }

  _renderCard(cardListElement, cardData) {
    const cardPresenter = new CardPresenter(cardListElement, this._handleViewAction, this._handleModeChange);
    cardPresenter.init(cardData);
    this._cardPresenter[cardData.id] = cardPresenter;
  }

  _renderGroupOfCards(groupNumber) {
    this._transformedCardsData[groupNumber].forEach((el) => this._renderCard(this._boardTaskListComponent, el));
  }

  _handleSortTypeChange(chosenSortType) {
    if (this._currentSortType === chosenSortType) {
      return;
    }

    this._currentSortType = chosenSortType;
    this._clearBordCardList();
    this._transformedCardsData = [];
    this._transformCardData();
    this._renderGroupOfCards(0);
    if (this._numberOfTasksGroup > GROUP_COUNT_PER_STEP) {
      this._renderShowMoreBtn();
    }
  }

  _renderSortList() {
    render(this._boardComponent, this._sortListComponent, RenderPosition.AFTERBEGIN);
    this._sortListComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _clearBordCardList() {
    Object.values(this._cardPresenter).forEach((presenter) => presenter.destroy());
    this._cardPresenter = {};
    this._renderedTaskGroupCount = GROUP_COUNT_PER_STEP;
  }

  _renderBordCardList() {
    render(this._boardComponent, this._boardTaskListComponent, RenderPosition.BEFOREEND);
  }

  _renderBoard() {
    if (this._cardsModel.getCards().every((cardData) => cardData.isArchive)) {
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

  _handleModeChange() {
    Object
      .values(this._cardPresenter).forEach((presenter) => presenter.resetView());
  }
}
