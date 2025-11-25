import React, { useEffect, useState } from 'react';
import { ArrowLeft, BarChart3 } from 'lucide-react';
import { RESTAURANTS } from '@/lib/restaurants';



export default function ResultsPage({ votes, onBack }) {
  
  const restaurantVotes = RESTAURANTS.map(restaurant => {
 
    const restaurantVotesList = votes.filter(v => v.restaurant.id === restaurant.id);
    const totalAdults = restaurantVotesList.reduce((sum, v) => sum + v.participants.adults, 0);
    const totalChildren = restaurantVotesList.reduce((sum, v) => sum + v.participants.children, 0);
    
    return {
      ...restaurant,
      votes: restaurantVotesList.length,
      adults: totalAdults,
      children: totalChildren,
      total: totalAdults + totalChildren,
      voters: restaurantVotesList.map(v => v.pseudo)
    };
  }).sort((a, b) => b.total - a.total);

  const maxVotes = Math.max(...restaurantVotes.map(r => r.total), 1);

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 to-pink-50 p-4 py-8">
      <div className="max-w-3xl mx-auto animate-fade-in">
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft size={20} />
          {"Retour à l'accueil"}
        </button>

        <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center gap-3">
          <BarChart3 size={40} />
          Résultats
        </h2>

        <div className="space-y-4">
          {restaurantVotes.map((restaurant, index) => (
            <div
              key={restaurant.id}
              className="bg-white rounded-xl shadow-lg p-6 animate-slide-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{restaurant.emoji}</span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{restaurant.name}</h3>
                    <p className="text-sm text-gray-600">
                      {restaurant.votes} vote{restaurant.votes > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-orange-500">{restaurant.total}</div>
                  <div className="text-xs text-gray-500">
                    {restaurant.adults}👤 {restaurant.children}👶
                  </div>
                </div>
              </div>
              
              {restaurant.voters.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-1">Votants :</p>
                  <div className="flex flex-wrap gap-1">
                    {restaurant.voters.map((voter, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                      >
                        {voter}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-linear-to-r from-orange-400 to-orange-600 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${(restaurant.total / maxVotes) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {votes.length === 0 && (
          <div className="text-center text-gray-500 mt-12">
            Aucun vote pour le moment
          </div>
        )}
      </div>
    </div>
  );
}
