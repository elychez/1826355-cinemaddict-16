import AbstractView from './abstract-view';

const activeClass = 'main-navigation__item--active';

const createFilterItemTemplate = (filter, currentFilter) => {
  const {type, name, count} = filter;

  return (
    `<a href="#" data-menu="${type}" class="main-navigation__item ${type === currentFilter ? activeClass : ''}" data-filter-type="${type}">
      ${name}
      <span class="main-navigation__item-count">${count}</span>
    </a>`
  );
};

const createFilterMenuTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');

  return `<nav class="main-navigation">
            <div class="main-navigation__items">
               ${filterItemsTemplate}
            </div>
            <a href="#stats" data-menu="stats" class="main-navigation__additional ${currentFilterType === 'stats' ? 'main-navigation__additional--active' : ''}"">Stats</a>
          </nav>`;
};

export default class FilterMenuView extends AbstractView {
  #currentFilter = null;
  #filters = null;


  constructor(filters, currentFilter) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilter;
  }

  get template() {
    return createFilterMenuTemplate(this.#filters, this.#currentFilter);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.querySelectorAll('[data-menu]').forEach((item) => {
      item.addEventListener('click', this.#filterTypeChangeHandler);
    });
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.closest('[data-menu]').dataset.menu);
  }
}
