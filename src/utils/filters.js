import {FilterType} from '../const';

export const filter = {
  [FilterType.ALL]: (films) => films,
  [FilterType.FAVORITES]: (films) => films.filter((film) => film.userDetails.favorite),
  [FilterType.HISTORY]: (films) => films.filter((film) => film.userDetails.alreadyWatched),
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.userDetails.watchlist),
};
