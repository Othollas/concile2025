import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Utensils, MapPin } from 'lucide-react';
import Image from 'next/image';

export default function RestaurantDetailsModal({ restaurant, onClose }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % restaurant.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? restaurant.images.length - 1 : prev - 1
    );
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        <button
          onClick={onClose}
          className="fixed top-8 right-4 z-10 bg-white hover:bg-gray-100 rounded-full p-2 shadow-lg transition-all duration-300 hover:scale-110"
        >
          <X size={24} className="text-gray-700 " />
        </button>

        <div className="relative h-64 bg-gray-200 overflow-hidden rounded-t-2xl">
          <img
            src={restaurant.images[currentImageIndex]}
            // width={290}
            alt={restaurant.name}
            fill={true}
            className="w-full h-full object-cover"
          />
          {/* Pour utiliser Image, je dois d'abord modifier le remote pattern de next.js */}
          {/* <Image
          src={restaurant.images[currentImageIndex]}
            width={500}
            height={500}
alt={restaurant.name}
className="w-full h-full object-cover"
          /> */}

          {restaurant.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all duration-300 hover:scale-110"
              >
                <ChevronLeft size={24} className="text-gray-700" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all duration-300 hover:scale-110"
              >
                <ChevronRight size={24} className="text-gray-700" />
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {restaurant.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentImageIndex
                      ? 'bg-white w-6'
                      : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                      }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-5xl">{restaurant.emoji}</span>
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">{restaurant.name}</h2>
                  <div className="text-orange-500 font-semibold text-lg">{restaurant.priceRange}</div>
                </div>
              </div>
            </div>
          </div>

          <p className="text-gray-600 text-lg mb-6 leading-relaxed">{restaurant.description}</p>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Utensils size={20} />
              Spécialités
            </h3>
            <div className="flex flex-wrap gap-2">
              {restaurant.specialties.map((specialty, index) => (
                <span
                  key={index}
                  className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <MapPin size={20} />
              Adresse
            </h3>
            <p className="text-gray-600 mb-3">{restaurant.address}</p>

            <div className="rounded-xl overflow-hidden border-2 border-gray-200 h-64">
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(restaurant.address)}&zoom=15`}
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}