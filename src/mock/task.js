const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

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
  return {
    mo: false,
    tu: false,
    we: !!(getRandomInteger(0, 1)),
    th: false,
    fr: !!(getRandomInteger(0, 1)),
    sa: false,
    su: false,
  };
};

const getRandomColor = () => {
  const colors = [`black`, `yellow`, `blue`, `green`, `pink`];
  return colors[getRandomInteger(0, colors.length - 1)];
};

export const createTask = () => {
  const dueDate = generateDate();
  const repeating = dueDate === null ? generateRepeating() : {
    mo: false,
    tu: false,
    we: !!(getRandomInteger(0, 1)),
    th: false,
    fr: !!(getRandomInteger(0, 1)),
    sa: false,
    su: false,
  };

  return {
    description: generateDescription(),
    dueDate,
    repeating,
    color: getRandomColor(),
    isFavorite: !!(getRandomInteger(0, 1)),
    isArchive: !!(getRandomInteger(0, 1)),
  };
};
