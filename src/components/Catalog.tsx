import { useState, useEffect } from 'react';
import type { EquipmentCategory } from '../data/types';
import { propertyLabels } from '../data/types';

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

  useEffect(() => {
    if (!showFilters) return;
    if (showAll) {
      localStorage.setItem(storageKey, 'allTechnics');
    } else {
      localStorage.setItem(storageKey, activeCategoryId);
    }
  }, [activeCategoryId, showAll, showFilters, storageKey]);

  function selectCategory(id: string) {
    if (id === 'allTechnics') {
      setShowAll(true);
    } else {
      setShowAll(false);
      setActiveCategoryId(id);
    }
  }

  const visibleCategories =
    showFilters && showAll ? categories : categories.filter((c) => c.id === activeCategoryId);

  return (
    <div>
      {showFilters && (
        <div className="row text-center">
          <div className="techics__menu col-12">
            <ul className="technics__menu">
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
          </div>
        </div>
      )}

      <div className="row justify-content-center">
        <div className="technics__menu-items text-center">
          <div className="technics__menu-item">
            {visibleCategories.map((cat) =>
              cat.items.map((item) => (
                <a key={item.id} className="card border-warning" href={item.link}>
                  <img
                    className="card-image"
                    src={item.img}
                    alt={item.title}
                    loading="lazy"
                    width={400}
                    height={280}
                  />
                  <h3 className="text-dark">{item.title}</h3>
                  <div className="card-header">от {item.price} р. за смену</div>
                  <div className="card-body">
                    <table className="table table-sm table-hover">
                      <tbody>
                        {cat.properties.slice(0, MAX_CARD_PROPS).map((prop) => (
                          <tr key={prop}>
                            <td className="text-dark text-left">{propertyLabels[prop]}</td>
                            <td className="text-dark text-right">{item.props[prop] ?? '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="btn btn-information">
                      <span>Подробнее</span>
                    </div>
                  </div>
                </a>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
