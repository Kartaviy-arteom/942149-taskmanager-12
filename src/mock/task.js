import {CARD_MARK_COLORS} from "../consts.js";
import {getRandomInteger} from "../utils/common.js";

const generateDescription = () => {
  const descriptions = [`Изучить теорию`, `Сделать домашку`, `Пройти интенсив на соточку`];
  const descriptionIndex = getRandomInteger(0, descriptions.length - 1);

  return descriptions[descriptionIndex];
};

const generateDate = () => {
  const isDate = !!(getRandomInteger(0, 1));

  if (!isDate) {
    return null;
  }

  const maxDaysGap = 7;
  const daysGap = getRandomInteger(-maxDaysGap, maxDaysGap);

  const currentDate = new Date();
  currentDate.setHours(23, 59, 59, 999);
  currentDate.setDate(currentDate.getDate() + daysGap);

  return new Date(currentDate);
};

const generateRepeating = () => {
  const isDueDate = Boolean(generateDate());
  return {
    mo: false,
    tu: false,
    we: isDueDate ? false : !!(getRandomInteger(0, 1)),
    th: false,
    fr: isDueDate ? false : !!(getRandomInteger(0, 1)),
    sa: false,
    su: false,
  };
};

const getRandomColor = () => {
  return CARD_MARK_COLORS[getRandomInteger(0, CARD_MARK_COLORS.length - 1)];
};

const generateID = () => Date.now() + parseInt(Math.random() * 10000, 10);

export const createTask = () => {
  const dueDate = generateDate();
  const repeating = generateRepeating();

  return {
    id: generateID(),
    description: generateDescription(),
    dueDate,
    repeating,
    color: getRandomColor(),
    isFavorite: !!(getRandomInteger(0, 1)),
    isArchive: !!(getRandomInteger(0, 1)),
  };
};
