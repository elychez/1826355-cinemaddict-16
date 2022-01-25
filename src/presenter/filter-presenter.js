import {render, RenderPosition, replace, remove} from '../render.js';
import {FilterType, UpdateType} from '../const.js';
import FilterMenuView from '../view/site-filter-view';
import {filter} from '../utils/filters';
import {ScreenType} from '../const';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #filmsModel = null;
  #filterComponent = null;
  #screenType = ScreenType.FILMS;
  #handleNavigationClick = () => {};
  activeItem = FilterType.ALL

  constructor(filterContainer, filterModel, filmsModel, handleNavClick ) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#filmsModel = filmsModel;
    this.#handleNavigationClick = handleNavClick;


    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const films = this.#filmsModel.films;

    return [
      {
        type: FilterType.ALL,
        name: 'All',
        count: filter[FilterType.ALL](films).length,
      },
      {
        type: FilterType.WATCHLIST,
        name: 'Watchlist',
        count: filter[FilterType.WATCHLIST](films).length,
      },
      {
        type: FilterType.HISTORY,
        name: 'History',
        count: filter[FilterType.HISTORY](films).length,
      },
      {
        type: FilterType.FAVORITES,
        name: 'Favorites',
        count: filter[FilterType.FAVORITES](films).length,
      },
    ];
  }

  init = () => {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterMenuView(filters, this.activeItem);
    this.#filterComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this.#filterContainer, this.#filterComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  destroy = () => {
    remove(this.#filterComponent);
    this.#filterComponent = null;

    this.#filmsModel.removeObserver(this.#handleModelEvent);
    this.#filterModel.removeObserver(this.#handleModelEvent);

    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.ALL);
  }

  #handleModelEvent = () => {
    this.init();
  }

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }
    this.activeItem = filterType;

    const prevScreenType = this.#screenType;

    if (this.filters.some((item) => item.type === filterType)) {
      this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
      this.#screenType = ScreenType.FILMS;
    } else {
      this.#screenType = filterType;
    }

    if (prevScreenType !== this.#screenType) {
      this.#handleNavigationClick(this.#screenType);
    }

    this.init();

  }
}
