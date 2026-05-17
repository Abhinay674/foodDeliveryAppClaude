import React from 'react';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
  {
    name: 'Pizza',
    icon: '🍕',
    description: 'Cheesy & delicious',
    gradient: 'from-red-400 to-orange-400',
    bg: 'bg-red-50',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&h=200&fit=crop'
  },
  {
    name: 'Burgers',
    icon: '🍔',
    description: 'Juicy & satisfying',
    gradient: 'from-yellow-400 to-amber-500',
    bg: 'bg-yellow-50',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop'
  },
  {
    name: 'Drinks',
    icon: '🥤',
    description: 'Fresh & refreshing',
    gradient: 'from-blue-400 to-cyan-400',
    bg: 'bg-blue-50',
    image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=300&h=200&fit=crop'
  },
  {
    name: 'Desserts',
    icon: '🍰',
    description: 'Sweet & indulgent',
    gradient: 'from-pink-400 to-purple-400',
    bg: 'bg-pink-50',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&h=200&fit=crop'
  }
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #FF5200 0%, #ff8c00 100%)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-white">
              <div className="inline-flex items-center gap-2 bg-white bg-opacity-20 rounded-full px-4 py-1.5 mb-4">
                <span className="text-sm font-medium">⚡ Fast Delivery</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                Hungry? <br />
                We've got you <br />
                <span className="text-yellow-300">covered! 🍽️</span>
              </h1>
              <p className="text-white text-opacity-90 text-lg mb-8 max-w-md">
                Order from your favourite restaurants and get hot, fresh food delivered to your door.
              </p>
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => navigate('/foods')}
                  className="bg-white font-bold px-8 py-3 rounded-full hover:bg-gray-100 transition-all active:scale-95 shadow-lg"
                  style={{ color: '#FF5200' }}
                >
                  Order Now
                </button>
                <button
                  onClick={() => navigate('/foods')}
                  className="border-2 border-white text-white font-semibold px-8 py-3 rounded-full hover:bg-white hover:text-orange-500 transition-all active:scale-95"
                >
                  Browse Menu
                </button>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-10">
                {[
                  { value: '12+', label: 'Menu Items' },
                  { value: '4', label: 'Categories' },
                  { value: '30 min', label: 'Avg. Delivery' }
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-white text-opacity-80 text-sm">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero image */}
            <div className="flex-1 flex justify-center">
              <div className="relative w-72 h-72 md:w-96 md:h-96">
                <div className="absolute inset-0 bg-white bg-opacity-20 rounded-full" />
                <img
                  src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=600&fit=crop"
                  alt="Delicious food"
                  className="absolute inset-4 rounded-full object-cover shadow-2xl"
                />
                {/* Floating badges */}
                <div className="absolute -top-4 -right-4 bg-white rounded-2xl px-3 py-2 shadow-lg text-sm font-semibold text-gray-700">
                  🍕 Hot & Fresh
                </div>
                <div className="absolute -bottom-4 -left-4 bg-yellow-400 rounded-2xl px-3 py-2 shadow-lg text-sm font-semibold text-gray-800">
                  ⭐ 4.8 Rating
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 60" preserveAspectRatio="none" className="w-full h-8 fill-current text-gray-50">
            <path d="M0,60 C300,0 900,0 1200,60 L1200,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">What's on your mind?</h2>
          <p className="text-gray-500 mt-2">Choose from our delicious categories</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => navigate(`/foods?category=${cat.name}`)}
              className={`${cat.bg} rounded-2xl overflow-hidden group hover:shadow-lg transition-all duration-200 active:scale-95 text-left`}
            >
              <div className="relative h-32 overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${cat.gradient} opacity-60`} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl">{cat.icon}</span>
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-bold text-gray-800">{cat.name}</h3>
                <p className="text-xs text-gray-500">{cat.description}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Featured banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div
          className="rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6"
          style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}
        >
          <div className="text-white">
            <p className="text-orange-400 font-semibold text-sm mb-1">LIMITED TIME OFFER</p>
            <h3 className="text-2xl md:text-3xl font-bold mb-2">Get 20% off your<br />first order! 🎉</h3>
            <p className="text-gray-400 text-sm">Use code <span className="text-orange-400 font-bold">FOODRUSH20</span> at checkout</p>
          </div>
          <button
            onClick={() => navigate('/foods')}
            className="text-white font-bold px-8 py-3 rounded-full transition-all hover:opacity-90 active:scale-95 whitespace-nowrap"
            style={{ backgroundColor: '#FF5200' }}
          >
            Grab the Deal
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
