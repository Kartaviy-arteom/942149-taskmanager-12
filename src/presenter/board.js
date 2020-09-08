import NoCard from "../view/no-card.js";
import SortList from "../view/sort-list.js";
import BordTaskList from "../view/bord-task-list.js";
import Board from "../view/board.js";
import ShowMoreBtn from "../view/show-more-btn.js";
import {render} from "../utils/render.js";
import {RenderPosition} from "../consts.js";
import {sortTaskUp, sortTaskDown} from "../utils/card.js";
import {sortType} from "../consts.js";
import CardPresenter from "./card.js";
import {updateItem} from "../utils/common.js";

const TASK_COUNT_PER_STEP = 8;
const GROUP_COUNT_PER_STEP = 1;

export default class BoardPresenter {
  constructor(boardWrappper) {
    this._boardWrapper = boardWrappper;
    this._noCardComponent = new NoCard();
    this._sortListComponent = new SortList();
    this._boardTaskListComponent = new BordTaskList();
    this._boardComponent = new Board();
    this._showMoreBtnComponent = new ShowMoreBtn();

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleCardChange = this._handleCardChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);

    this._currentSortType = sortType.DEFAULT;
    this._transformedCardsData = [];
    this._cardPresenter = {};
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

  _handleCardChange(updatedCard) {
    this._cardsData = updateItem(this._cardsData, updatedCard);
    this._sourcedBoardCards = updateItem(this._sourcedBoardCards, updatedCard);
    this._cardPresenter[updatedCard.id].init(updatedCard);
  }

  _renderNoCard() {
    render(this._boardComponent, this._noCardComponent, RenderPosition.BEFOREEND);
  }

  _renderCard(cardListElement, cardData) {
    const cardPresenter = new CardPresenter(cardListElement, this._handleCardChange, this._handleModeChange);
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
    Object.values(this._cardPresenter).forEach((presenter) => presenter.destroy());
    this._cardPresenter = {};
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

  _handleModeChange() {
    Object
      .values(this._cardPresenter).forEach((presenter) => presenter.resetView());
  }
}
