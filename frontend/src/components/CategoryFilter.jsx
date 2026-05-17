import React from 'react';

const CATEGORY_ICONS = {
  All: '🍽️',
  Pizza: '🍕',
  Burgers: '🍔',
  Drinks: '🥤',
  Desserts: '🍰'
};

const CategoryFilter = ({ categories, activeCategory, onSelect }) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all active:scale-95 flex-shrink-0 ${
            activeCategory === cat
              ? 'text-white shadow-md'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300 hover:text-orange-500'
          }`}
          style={activeCategory === cat ? { backgroundColor: '#FF5200' } : {}}
        >
          <span>{CATEGORY_ICONS[cat] || '🍴'}</span>
          <span>{cat}</span>
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
