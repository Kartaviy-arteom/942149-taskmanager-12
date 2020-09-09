import CardView from "../view/card.js";
import EditForm from "../view/edit-form.js";
import {RenderPosition} from "../consts.js";
import {render, replace} from "../utils/render.js";

const ESC_KEY_CODE = 27;
const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export default class Card {
  constructor(cardListContainer, changeData, changeMode) {
    this._cardListContainer = cardListContainer.getElement();
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._cardComponent = null;
    this._cardEditComponent = null;
    this._mode = Mode.DEFAULT;
    this._onCardEdit = this._onCardEdit.bind(this);
    this._onEditFormSubmit = this._onEditFormSubmit.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._onFavoriteClick = this._onFavoriteClick.bind(this);
    this._onArchiveClick = this._onArchiveClick.bind(this);
  }

  init(cardData) {
    this._cardData = cardData;

    const prevCardComponent = this._cardComponent;
    const prevCardEditComponent = this._cardEditComponent;

    this._cardComponent = new CardView(cardData);
    this._cardEditComponent = new EditForm(cardData);

    this._cardComponent.setEditHandler(this._onCardEdit);
    this._cardComponent.setFavoriteClickHandler(this._onFavoriteClick);
    this._cardComponent.setArchiveClickHandler(this._onArchiveClick);
    this._cardEditComponent.setSubmitHandler(this._onEditFormSubmit);

    if (!prevCardComponent || !prevCardEditComponent) {
      render(this._cardListContainer, this._cardComponent.getElement(), RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._cardComponent, prevCardComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._cardEditComponent, prevCardEditComponent);
    }

    prevCardComponent.removeElement();
    prevCardEditComponent.removeElement();
  }

  destroy() {
    this._cardComponent.removeElement();
    this._cardEditComponent.removeElement();
  }

  _replaceEditToCard() {
    this._cardListContainer.replaceChild(this._cardComponent.getElement(), this._cardEditComponent.getElement());
    this._mode = Mode.DEFAULT;
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _replaceCardToEditForm() {
    this._cardListContainer.replaceChild(this._cardEditComponent.getElement(), this._cardComponent.getElement());

    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _onEscKeyDown(evt) {
    if (evt.keyCode === ESC_KEY_CODE) {
      evt.preventDefault();
      this._cardEditComponent.reset(this._cardData);
      this._replaceEditToCard();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

  _onFavoriteClick(evt) {
    evt.preventDefault();
    this._changeData(
        Object.assign(
            {},
            this._cardData,
            {
              isFavorite: !this._cardData.isFavorite
            }
        )
    );
  }

  _onArchiveClick(evt) {
    evt.preventDefault();
    this._changeData(
        Object.assign(
            {},
            this._cardData,
            {
              isArchive: !this._cardData.isArchive
            }
        )
    );
  }

  _onCardEdit(evt) {
    evt.preventDefault();
    this._replaceCardToEditForm();
    document.addEventListener(`keydown`, this._onEscKeyDown);
  }

  _onEditFormSubmit(data) {
    this._changeData(data);
    this._replaceEditToCard();
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToCard();
    }
  }
}
