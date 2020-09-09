import BaseComponent from "../view/base-component.js";
import {RenderPosition} from "../consts.js";

export const renderTemplate = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

export const render = (container, element, place) => {
  if (container instanceof BaseComponent) {
    container = container.getElement();
  }

  if (element instanceof BaseComponent) {
    element = element.getElement();
  }

  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
    default:
      container.append(element);
  }
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const replace = (newChild, oldChild) => {
  if (oldChild instanceof BaseComponent) {
    oldChild = oldChild.getElement();
  }

  if (newChild instanceof BaseComponent) {
    newChild = newChild.getElement();
  }

  const parent = oldChild.parentElement;

  if (parent === null || oldChild === null || newChild === null) {
    throw new Error(`Щэф, все пропало...`);
  }

  parent.replaceChild(newChild, oldChild);
};
