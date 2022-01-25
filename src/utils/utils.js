import dayjs from 'dayjs';
import {StatsFilterType} from '../const';

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};


export const isFilmWatchedInPeriod = ({watchingDate}, period) => {
  if (period === StatsFilterType.ALL.type) {
    return true;
  }
  if (period === StatsFilterType.TODAY.type) {
    return dayjs(watchingDate).isToday();
  }
  return dayjs(watchingDate).isSameOrAfter(dayjs().subtract(1, period));
};

export const getGenresStats = (films) => {
  const stats = new Map();

  films.forEach(({genres}) => {
    genres.forEach((item) => {
      const count = stats.has(item) ? stats.get(item) : 0;
      stats.set(item, count + 1);
    });
  });

  return new Map([...stats.entries()].sort((current, next) => next[1] - current[1]));
};
