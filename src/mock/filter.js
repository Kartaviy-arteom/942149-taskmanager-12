import {isExpired, isCardRepeating, isExpiringToday} from "../utils/card.js";

export const generateFilter = (tasks) => {
  return [
    {
      name: `all`,
      count: tasks.filter((task) => !task.isArchive).length,
    },
    {
      name: `overdue`,
      count: tasks
      .filter((task) => !task.isArchive)
      .filter((task) => isExpired(task.dueDate)).length
    },
    {
      name: `today`,
      count: tasks
      .filter((task) => !task.isArchive)
      .filter((task) => isExpiringToday(task.dueDate)).length
    },
    {
      name: `repeating`,
      count: tasks
      .filter((task) => !task.isArchive)
      .filter((task) => isCardRepeating(task.repeating)).length
    },
    {
      name: `archive`,
      count: tasks.filter((task) => task.isArchive).length
    },
  ];
};
