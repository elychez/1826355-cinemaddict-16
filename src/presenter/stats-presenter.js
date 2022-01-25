import {remove, render, RenderPosition} from '../render';
import {StatsFilterType, UpdateType} from '../const';
import {StatisticsView} from '../view/statistics-view';
import {getGenresStats, isFilmWatchedInPeriod} from '../utils/utils';
import {getDuration} from '../utils/date';

export default class StatsPresenter {
  #statsContainer = null;
  #statsComponent = null;

  #filmsModel = null;
  #activeFilter = null;

  constructor(statsContainer, filmsModel) {
    this.#statsContainer = statsContainer;
    this.#filmsModel = filmsModel;
  }

  init = () => {
    this.#activeFilter = StatsFilterType.ALL.type;
    this.#renderStats(this.stats);
    this.#filmsModel.addObserver(this.#handleModelEvent);
  }

  get films() {
    return this.#filmsModel.watchedFilms;
  }

  get stats() {
    const films = this.films.filter((film) => isFilmWatchedInPeriod(film, this.#activeFilter));
    const genresStats = getGenresStats(films);
    const totalDuration = getDuration((films.reduce((prev, film) => prev + film.length, 0)));

    return {
      rank: '',
      activeFilter: this.#activeFilter,
      totalCount: films.length,
      totalDuration,
      topGenre: genresStats ? [...genresStats.keys()][0] : null,
      genresStats
    };
  }

  destroy = () => {
    remove(this.#statsComponent);
    this.#filmsModel.removeObserver(this.#handleModelEvent);
  }

  #renderStats = (data) => {
    this.#statsComponent = new StatisticsView(data);
    render(this.#statsContainer, this.#statsComponent, RenderPosition.BEFOREEND);
    this.#statsComponent.setFilterChangeHandler(this.#handleFilterChange);
  }

  #handleFilterChange = (activeFilter) => {
    this.#activeFilter = activeFilter;
    remove(this.#statsComponent);
    this.#renderStats(this.stats);
  }

  #handleModelEvent = (updateType) => {
    if (updateType === UpdateType.MINOR) {
      remove(this.#statsComponent);
      this.#renderStats(this.stats);
    }
  }
}
