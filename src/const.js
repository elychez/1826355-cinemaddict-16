export const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

export const FilterType = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
  STATS: 'stats',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT'
};

export const CommentAction = {
  ADD: 'add',
  DELETE: 'delete',
};

export const ScreenType = {
  FILMS: 'films',
  STATS: 'stats'
};

export const StatsFilterType = {
  ALL: {type: 'all-time', name: 'All time'},
  TODAY: {type: 'today', name: 'Today'},
  WEEK: {type: 'week', name: 'Week'},
  MONTH: {type: 'month', name: 'Month'},
  YEAR: {type: 'year', name: 'Year'}
};
