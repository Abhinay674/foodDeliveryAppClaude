import React from 'react';

const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-4">
    <div
      className="w-12 h-12 border-4 border-gray-200 rounded-full animate-spin"
      style={{ borderTopColor: '#FF5200' }}
    />
    <p className="text-gray-500 text-sm">{message}</p>
  </div>
);

export default LoadingSpinner;
