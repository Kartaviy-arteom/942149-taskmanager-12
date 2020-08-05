const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const generateDescription = () => {
  const descriptions = [`Изучить теорию`, `Сделать домашку`, `Пройти интенсив на соточку`];
  const descriptionIndex = getRandomInteger(0, descriptions.length - 1);
  
  return descriptions[descriptionIndex];
}

export const createTask = () => {
  return {
    description:,
    dueDate: null,
    repeatingDays: {
      mo: false,
      tu: false, 
      we: false,
      th: false,
      fr: false, 
      sa: false,
      su: false,
    },
    color: `black`,
    isFavorite: false,
    isArchive: false,
  }
};
    
