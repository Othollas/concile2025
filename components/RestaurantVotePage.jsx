import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { RESTAURANTS } from '../lib/restaurants';
import RestaurantDetailsModal from './RestaurantDetailsModal';

export default function RestaurantVotePage({ pseudo, participants, onVote, existingVote }) {
  const [selectedRestaurant, setSelectedRestaurant] = useState(existingVote || null);
  const [detailsRestaurant, setDetailsRestaurant] = useState(null);
  const isModifying = !!existingVote;

  const handleVote = () => {
    if (selectedRestaurant) {
      onVote(selectedRestaurant);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 to-pink-50 p-4 py-8">
      <div className="max-w-3xl mx-auto animate-fade-in">
        <h2 className="text-4xl font-bold text-gray-800 mb-2 text-center">
          {isModifying ? 'Modifier votre vote' : 'Choisissez votre restaurant'}
        </h2>
        <p className="text-gray-600 mb-8 text-center">
          {`Bonjour : ${pseudo} `}
          <br/>
          {participants.adults} adulte{participants.adults > 1 ? 's' : ''} 
          {participants.children > 0 && ` et ${participants.children} enfant${participants.children > 1 ? 's' : ''}`}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {RESTAURANTS.map((restaurant) => (
            <div key={restaurant.id} className="relative group">
              <button
                onClick={() => setSelectedRestaurant(restaurant)}
                className={`w-full p-6 rounded-xl border-3 transition-all duration-300 hover:scale-105 ${
                  selectedRestaurant?.id === restaurant.id
                    ? 'border-orange-500 bg-orange-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-orange-300'
                }`}
              >
                <div className="text-5xl mb-3">{restaurant.emoji}</div>
                <div className="text-xl font-semibold text-gray-800">{restaurant.name}</div>
                <div className="text-sm text-orange-500 font-medium mt-1">{restaurant.priceRange}</div>
              </button>
              
              <button
                onClick={() => setDetailsRestaurant(restaurant)}
                className="absolute top-3 right-3 bg-white hover:bg-orange-50 rounded-full p-2 shadow-md transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100"
                title="Voir les détails"
              >
                <Info size={20} className="text-orange-500" />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={handleVote}
          disabled={!selectedRestaurant}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-semibold px-6 py-4 rounded-lg text-lg transition-all duration-300 hover:scale-105"
        >
          {isModifying ? 'Mettre à jour mon vote' : 'Valider mon vote'}
        </button>
      </div>

      {detailsRestaurant && (
        <RestaurantDetailsModal
          restaurant={detailsRestaurant}
          onClose={() => setDetailsRestaurant(null)}
        />
      )}
    </div>
  );
}
