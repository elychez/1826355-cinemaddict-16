import {FilterType} from '../const';

export const filter = {
  [FilterType.ALL]: (films) => films,
  [FilterType.FAVORITES]: (films) => films.filter((film) => film.isInFavorites),
  [FilterType.HISTORY]: (films) => films.filter((film) => film.isWatched),
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.isInWatchlist),
};
