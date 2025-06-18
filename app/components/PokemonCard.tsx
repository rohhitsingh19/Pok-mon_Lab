/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { Pokemon } from '../types/pokemon';
import { TypeBadge } from './TypeBadge';

interface PokemonCardProps {
  pokemon: Pokemon;
  onClick: () => void;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 border border-gray-100"
    >
      <div className="p-6">
        <div className="text-center mb-4">
          <div className="relative inline-block">
            <img
              src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
              alt={pokemon.name}
              className="w-32 h-32 mx-auto object-contain"
              loading="lazy"
            />
            <div className="absolute -top-2 -right-2 bg-blue-100 text-blue-800 text-sm font-bold px-2 py-1 rounded-full">
              #{pokemon.id.toString().padStart(3, '0')}
            </div>
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-gray-800 capitalize text-center mb-3">
          {pokemon.name}
        </h3>
        
        <div className="flex justify-center gap-2 mb-4">
          {pokemon.types.map((type, index) => (
            <TypeBadge key={index} type={type.type.name} />
          ))}
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-center">
            <div className="text-gray-500">Height</div>
            <div className="font-semibold text-gray-700">{(pokemon.height / 10).toFixed(1)}m</div>
          </div>
          <div className="text-center">
            <div className="text-gray-500">Weight</div>
            <div className="font-semibold text-gray-700">{(pokemon.weight / 10).toFixed(1)}kg</div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="text-sm text-gray-600 mb-2">Base Stats</div>
          <div className="space-y-1">
            {pokemon.stats.slice(0, 3).map((stat, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-xs text-gray-500 capitalize">
                  {stat.stat.name.replace('-', ' ')}
                </span>
                <span className="text-xs font-semibold text-gray-700">{stat.base_stat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};