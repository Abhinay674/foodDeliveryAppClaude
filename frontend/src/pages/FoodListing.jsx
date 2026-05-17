import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { fetchFoods, fetchCategories } from '../api/api';
import FoodCard from '../components/FoodCard';
import CategoryFilter from '../components/CategoryFilter';
import LoadingSpinner from '../components/LoadingSpinner';

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const FoodListing = ({ searchQuery, setSearchQuery }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const categoryParam = searchParams.get('category') || 'All';
  const searchParam = searchParams.get('search') || '';

  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [activeCategory, setActiveCategory] = useState(categoryParam);
  const [localSearch, setLocalSearch] = useState(searchParam || searchQuery || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories()
      .then((res) => setCategories(res.data.data))
      .catch(() => setCategories(['All', 'Pizza', 'Burgers', 'Drinks', 'Desserts']));
  }, []);

  const loadFoods = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (activeCategory !== 'All') params.category = activeCategory;
      if (localSearch.trim()) params.search = localSearch.trim();
      const res = await fetchFoods(params);
      setFoods(res.data.data);
    } catch (err) {
      setError('Failed to load food items. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [activeCategory, localSearch]);

  useEffect(() => {
    loadFoods();
  }, [loadFoods]);

  useEffect(() => {
    setActiveCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    if (searchParam) setLocalSearch(searchParam);
  }, [searchParam]);

  const handleCategorySelect = (cat) => {
    setActiveCategory(cat);
    const params = {};
    if (cat !== 'All') params.category = cat;
    if (localSearch.trim()) params.search = localSearch.trim();
    setSearchParams(params);
  };

  const handleSearchChange = (e) => {
    setLocalSearch(e.target.value);
    if (setSearchQuery) setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = {};
    if (activeCategory !== 'All') params.category = activeCategory;
    if (localSearch.trim()) params.search = localSearch.trim();
    setSearchParams(params);
  };

  const clearSearch = () => {
    setLocalSearch('');
    if (setSearchQuery) setSearchQuery('');
    const params = {};
    if (activeCategory !== 'All') params.category = activeCategory;
    setSearchParams(params);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {activeCategory === 'All' ? 'All Items' : activeCategory}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {!loading && `${foods.length} item${foods.length !== 1 ? 's' : ''} available`}
        </p>
      </div>

      {/* Search Bar (mobile - inline) */}
      <form onSubmit={handleSearchSubmit} className="mb-4 md:hidden">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Search food..."
            value={localSearch}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-full bg-white text-sm focus:outline-none focus:border-orange-400 transition"
          />
          {localSearch && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg leading-none"
            >
              ×
            </button>
          )}
        </div>
      </form>

      {/* Category Filter */}
      <div className="mb-6">
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onSelect={handleCategorySelect}
        />
      </div>

      {/* Search indicator */}
      {localSearch.trim() && (
        <div className="mb-4 flex items-center gap-2">
          <span className="text-sm text-gray-500">
            Results for: <span className="font-semibold text-gray-700">"{localSearch}"</span>
          </span>
          <button
            onClick={clearSearch}
            className="text-xs text-orange-500 hover:text-orange-600 font-medium underline"
          >
            Clear
          </button>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <LoadingSpinner message="Loading delicious food..." />
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button
            onClick={loadFoods}
            className="text-white px-6 py-2 rounded-full font-medium hover:opacity-90"
            style={{ backgroundColor: '#FF5200' }}
          >
            Retry
          </button>
        </div>
      ) : foods.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🍽️</p>
          <p className="text-gray-600 text-lg font-semibold">No items found</p>
          <p className="text-gray-400 text-sm mt-2">
            Try a different search or category
          </p>
          <button
            onClick={() => { setLocalSearch(''); setActiveCategory('All'); setSearchParams({}); }}
            className="mt-4 text-white px-6 py-2 rounded-full font-medium hover:opacity-90"
            style={{ backgroundColor: '#FF5200' }}
          >
            Show All
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {foods.map((food) => (
            <FoodCard key={food._id} food={food} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FoodListing;
