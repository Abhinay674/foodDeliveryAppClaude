import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const VegIcon = ({ isVeg }) => (
  <div
    className="w-4 h-4 border-2 flex items-center justify-center rounded-sm flex-shrink-0"
    style={{ borderColor: isVeg ? '#0f8a65' : '#e43b4f' }}
  >
    <div
      className="w-2 h-2 rounded-full"
      style={{ backgroundColor: isVeg ? '#0f8a65' : '#e43b4f' }}
    />
  </div>
);

const FoodCard = ({ food }) => {
  const { addItem, cart } = useCart();
  const [adding, setAdding] = useState(false);
  const [imgError, setImgError] = useState(false);

  const inCart = cart.items?.some(item => item.foodId?.toString() === food._id?.toString());

  const handleAdd = async () => {
    setAdding(true);
    await addItem(food);
    setAdding(false);
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden h-44">
        <img
          src={imgError ? 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=350&fit=crop' : food.image}
          alt={food.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={() => setImgError(true)}
          loading="lazy"
        />
        {/* Rating badge */}
        <div className="absolute top-2 left-2 bg-white rounded-full px-2 py-0.5 flex items-center gap-1 shadow-sm">
          <span className="text-green-600">
            <StarIcon />
          </span>
          <span className="text-xs font-semibold text-gray-700">{food.rating?.toFixed(1)}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-gray-800 text-sm leading-tight line-clamp-1">{food.title}</h3>
          <VegIcon isVeg={food.isVeg} />
        </div>

        <p className="text-gray-500 text-xs line-clamp-2 mb-3 flex-1 leading-relaxed">
          {food.description}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <span className="font-bold text-gray-800 text-base">
            ₹{(food.price * 83).toFixed(0)}
          </span>
          <button
            onClick={handleAdd}
            disabled={adding}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all active:scale-95 ${
              inCart
                ? 'text-white'
                : 'border-2 bg-white hover:bg-orange-50'
            }`}
            style={
              inCart
                ? { backgroundColor: '#FF5200', borderColor: '#FF5200', border: '2px solid #FF5200' }
                : { borderColor: '#FF5200', color: '#FF5200' }
            }
          >
            {adding ? '...' : inCart ? '+ Add More' : '+ Add'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
