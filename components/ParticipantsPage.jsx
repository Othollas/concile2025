import React, { useState } from 'react';

export default function ParticipantsPage({ pseudo, onSubmit, existingData }) {
  console.log(!!existingData)
  const [adults, setAdults] = useState(existingData?.adults || 1);
  const [children, setChildren] = useState(existingData?.children || 0);
  const isModifying = !!existingData;

  const handleSubmit = () => {
    onSubmit({ adults, children });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 to-pink-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full animate-fade-in">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          {isModifying ? `Modifier les participants : ${pseudo}` : `Bonjour ${pseudo} !`} 👋
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          Combien de personnes allez-vous emmener ?
        </p>

        <div className="space-y-6">
          <div className="bg-orange-50 p-6 rounded-xl">
            <label className="block text-lg font-semibold text-gray-700 mb-3">Adultes</label>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setAdults(Math.max(0, adults - 1))}
                className="bg-white hover:bg-orange-100 text-orange-500 font-bold w-12 h-12 rounded-full transition-all duration-300 hover:scale-110 shadow"
              >
                −
              </button>
              <span className="text-3xl font-bold text-gray-800 w-12 text-center">{adults}</span>
              <button
                onClick={() => setAdults(adults + 1)}
                className="bg-white hover:bg-orange-100 text-orange-500 font-bold w-12 h-12 rounded-full transition-all duration-300 hover:scale-110 shadow"
              >
                +
              </button>
            </div>
          </div>

          <div className="bg-pink-50 p-6 rounded-xl">
            <label className="block text-lg font-semibold text-gray-700 mb-3">Enfants</label>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setChildren(Math.max(0, children - 1))}
                className="bg-white hover:bg-pink-100 text-pink-500 font-bold w-12 h-12 rounded-full transition-all duration-300 hover:scale-110 shadow"
              >
                −
              </button>
              <span className="text-3xl font-bold text-gray-800 w-12 text-center">{children}</span>
              <button
                onClick={() => setChildren(children < 6 ?  children + 1 : 6)}
                className="bg-white hover:bg-pink-100 text-pink-500 font-bold w-12 h-12 rounded-full transition-all duration-300 hover:scale-110 shadow"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full mt-8 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105"
        >
          {isModifying ? 'Mettre à jour' : 'Continuer'}
        </button>
      </div>
    </div>
  );
}