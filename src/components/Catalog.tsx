import { useState, useEffect } from 'react';
import type { EquipmentCategory, EquipmentItem } from '../data/types';
import { propertyLabels } from '../data/types';
import { categoryImages } from '../data/categoryImages';

interface Props {
  categories: EquipmentCategory[];
  showFilters?: boolean;
  storageKey?: string;
}

const MAX_CARD_PROPS = 4;

export default function Catalog({
  categories,
  showFilters = false,
  storageKey = 'selected',
}: Props) {
  const [activeCategoryId, setActiveCategoryId] = useState<string>(() => {
    if (!showFilters) return categories[0]?.id ?? '';
    if (typeof localStorage === 'undefined') return categories[0]?.id ?? '';
    const saved = localStorage.getItem(storageKey);
    if (saved && saved !== 'allTechnics') {
      const found = categories.find((c) => c.id === saved);
      if (found) return found.id;
    }
    return categories[0]?.id ?? '';
  });

  const [showAll, setShowAll] = useState(() => {
    if (!showFilters) return false;
    if (typeof localStorage === 'undefined') return false;
    return localStorage.getItem(storageKey) === 'allTechnics';
  });

  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!showFilters) return;
    if (showAll) {
      localStorage.setItem(storageKey, 'allTechnics');
    } else {
      localStorage.setItem(storageKey, activeCategoryId);
    }
  }, [activeCategoryId, showAll, showFilters, storageKey]);

  function selectCategory(id: string) {
    setQuery('');
    if (id === 'allTechnics') {
      setShowAll(true);
    } else {
      setShowAll(false);
      setActiveCategoryId(id);
    }
  }

  const visibleCategories =
    showFilters && showAll ? categories : categories.filter((c) => c.id === activeCategoryId);

  const normalizedQuery = query.trim().toLowerCase();
  const isSearching = showFilters && normalizedQuery.length > 0;

  // While searching, look across every category by machine name; otherwise
  // respect the selected category / «Вся техника» filter.
  const results: { cat: EquipmentCategory; item: EquipmentItem }[] = (
    isSearching ? categories : visibleCategories
  ).flatMap((cat) =>
    cat.items
      .filter((item) => !isSearching || item.title.toLowerCase().includes(normalizedQuery))
      .map((item) => ({ cat, item }))
  );

  return (
    <div>
      {showFilters && (
        <div className="technics__search">
          <input
            type="search"
            className="technics__search-input"
            placeholder="Поиск по технике…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Поиск по технике"
          />
          {query && (
            <button
              type="button"
              className="technics__search-clear"
              aria-label="Очистить поиск"
              onClick={() => setQuery('')}
            >
              ×
            </button>
          )}
        </div>
      )}

      {showFilters && (
        <ul className="technics__menu">
          <li>
            <button
              id="allTechnicsBtn"
              type="button"
              className={`btn techs${showAll ? ' techs-active' : ''}`}
              onClick={() => selectCategory('allTechnics')}
            >
              Вся техника
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                id={cat.id}
                type="button"
                className={`btn techs${!showAll && activeCategoryId === cat.id ? ' techs-active' : ''}`}
                onClick={() => selectCategory(cat.id)}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      )}

      {isSearching && results.length === 0 ? (
        <p className="technics__empty">
          По запросу «{query.trim()}» ничего не найдено
        </p>
      ) : (
        <div className="catalog-grid">
          {results.map(({ cat, item }) => (
            <a key={item.id} className="card" href={item.link}>
              <img
                className="card-image"
                src={categoryImages[cat.urlSlug] ?? item.img}
                alt={item.title}
                loading="lazy"
                width={400}
                height={300}
              />
              <div className="card-body">
                <h3 className="card-title">{item.title}</h3>
                <p className="card-price">
                  от <b>{item.price.toLocaleString('ru-RU')}&nbsp;₽</b> / смена
                </p>
                <ul className="card-specs">
                  {cat.properties.slice(0, MAX_CARD_PROPS).map((prop) => (
                    <li key={prop}>
                      <span className="card-specs__label">{propertyLabels[prop]}</span>
                      <span className="card-specs__value">{item.props[prop] ?? '—'}</span>
                    </li>
                  ))}
                </ul>
                <span className="card-more">Подробнее</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
