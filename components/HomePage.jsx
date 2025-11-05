import React from 'react';

export default function HomePage({ onStart }) {
  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 to-pink-50 flex items-center justify-center p-4">
      <div className="text-center animate-fade-in">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-800 mb-4 animate-slide-down">
            🍽️ Vote Restaurant
          </h1>
          <p className="text-xl text-gray-600">
            Choisissez votre restaurant préféré et indiquez le nombre de participants
          </p>
        </div>
        <button
          onClick={onStart}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 hover:scale-105 shadow-lg"
        >
          Commencer à voter
        </button>
      </div>
    </div>
  );
}