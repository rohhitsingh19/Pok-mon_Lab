import React from 'react';

interface TypeFilterProps {
  selectedTypes: string[];
  onTypeToggle: (type: string) => void;
  onClear: () => void;
}

const pokemonTypes = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

const typeColors: Record<string, string> = {
  normal: 'bg-gray-400 hover:bg-gray-500',
  fire: 'bg-red-500 hover:bg-red-600',
  water: 'bg-blue-500 hover:bg-blue-600',
  electric: 'bg-yellow-400 hover:bg-yellow-500',
  grass: 'bg-green-500 hover:bg-green-600',
  ice: 'bg-blue-300 hover:bg-blue-400',
  fighting: 'bg-red-700 hover:bg-red-800',
  poison: 'bg-purple-500 hover:bg-purple-600',
  ground: 'bg-yellow-600 hover:bg-yellow-700',
  flying: 'bg-indigo-400 hover:bg-indigo-500',
  psychic: 'bg-pink-500 hover:bg-pink-600',
  bug: 'bg-green-400 hover:bg-green-500',
  rock: 'bg-yellow-800 hover:bg-yellow-900',
  ghost: 'bg-purple-700 hover:bg-purple-800',
  dragon: 'bg-indigo-700 hover:bg-indigo-800',
  dark: 'bg-gray-800 hover:bg-gray-900',
  steel: 'bg-gray-500 hover:bg-gray-600',
  fairy: 'bg-pink-300 hover:bg-pink-400',
};

export const TypeFilter: React.FC<TypeFilterProps> = ({ selectedTypes, onTypeToggle, onClear }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Filter by Type</h3>
        {selectedTypes.length > 0 && (
          <button
            onClick={onClear}
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {pokemonTypes.map((type) => (
          <button
            key={type}
            onClick={() => onTypeToggle(type)}
            className={`px-4 py-2 rounded-full text-white text-sm font-medium transition-all transform hover:scale-105 ${
              selectedTypes.includes(type)
                ? `${typeColors[type]} ring-2 ring-white ring-offset-2`
                : `${typeColors[type]} opacity-60`
            } capitalize`}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
};