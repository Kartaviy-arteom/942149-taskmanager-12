import ControlPanel from "./view/control-panel.js";
import FilterPanel from "./view/filter-panel.js";
import {createTask} from "./mock/task.js";
import {generateFilter} from "./mock/filter.js";
import {render} from "./utils/render.js";
import {RenderPosition} from "./consts.js";
import BoardPresenter from "./presenter/board.js";

const CARD_QUANTITY = 70;

const tasks = Array.from(Array(CARD_QUANTITY), createTask);
const filters = generateFilter(tasks);

const pageMainBlock = document.querySelector(`.main`);
const controlPanelWrapper = pageMainBlock.querySelector(`.main__control`);

render(controlPanelWrapper, new ControlPanel().getElement(), RenderPosition.BEFOREEND);
render(pageMainBlock, new FilterPanel(filters).getElement(), RenderPosition.BEFOREEND);
const boardPresenter = new BoardPresenter(pageMainBlock);
boardPresenter.init(tasks);
