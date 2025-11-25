import React from 'react';
import { Edit } from 'lucide-react';

export default function ConfirmationPage({ vote, onViewResults, onBackHome, onModify, isModification }) {
  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 to-pink-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center animate-fade-in">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          {isModification ? 'Vote mis à jour !' : 'Vote enregistré !'}
        </h2>
        <p className="text-gray-600 mb-2">
          Merci <strong>{vote.pseudo}</strong>
        </p>
        <p className="text-lg text-gray-700 mb-8">
          Vous avez voté pour <strong className="text-orange-500">{vote.restaurant.name}</strong>
        </p>
        
        <div className="space-y-3">
          <button
            onClick={onModify}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
          >
            <Edit size={20} />
            Modifier mon vote
          </button>
          <button
            onClick={onViewResults}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105"
          >
            Voir les résultats
          </button>
          <button
            onClick={onBackHome}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105"
          >
            {"Retour à l'accueil"}
          </button>
        </div>
      </div>
    </div>
  );
}
