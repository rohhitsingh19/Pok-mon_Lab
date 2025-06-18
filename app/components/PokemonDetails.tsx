import React, { useEffect, useState } from 'react';
import { X, ArrowLeft } from 'lucide-react';
import { Pokemon, PokemonSpecies } from '../types/pokemon';
import { TypeBadge } from './TypeBadge';
import { pokemonApi } from '../services/pokemonApi';

interface PokemonDetailsProps {
  pokemon: Pokemon;
  onClose: () => void;
}

export const PokemonDetails: React.FC<PokemonDetailsProps> = ({ pokemon, onClose }) => {
  const [species, setSpecies] = useState<PokemonSpecies | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const speciesData = await pokemonApi.getPokemonSpecies(pokemon.id);
        setSpecies(speciesData);
      } catch (error) {
        console.error('Error fetching species data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecies();
  }, [pokemon.id]);

  const getEnglishFlavorText = () => {
    if (!species) return '';
    const englishEntry = species.flavor_text_entries.find(
      entry => entry.language.name === 'en'
    );
    return englishEntry?.flavor_text.replace(/\f/g, ' ') || '';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between rounded-t-2xl">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Research
          </button>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <img
                  src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
                  alt={pokemon.name}
                  className="w-64 h-64 mx-auto object-contain"
                />
                <div className="absolute -top-4 -right-4 bg-blue-100 text-blue-800 text-lg font-bold px-3 py-2 rounded-full">
                  #{pokemon.id.toString().padStart(3, '0')}
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-800 capitalize mb-4">
                {pokemon.name}
              </h1>
              
              <div className="flex justify-center gap-3 mb-6">
                {pokemon.types.map((type, index) => (
                  <TypeBadge key={index} type={type.type.name} />
                ))}
              </div>

              {!loading && (
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <h3 className="font-semibold text-gray-800 mb-2">Research Notes</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {getEnglishFlavorText() || 'No research data available.'}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Physical Characteristics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-gray-500 text-sm">Height</div>
                    <div className="text-xl text-gray-700 font-bold">{(pokemon.height / 10).toFixed(1)}m</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm">Weight</div>
                    <div className="text-xl text-gray-700 font-bold">{(pokemon.weight / 10).toFixed(1)}kg</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Base Statistics</h3>
                <div className="space-y-3">
                  {pokemon.stats.map((stat, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {stat.stat.name.replace('-', ' ')}
                        </span>
                        <span className="text-sm font-bold text-gray-800">{stat.base_stat}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min((stat.base_stat / 255) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Abilities</h3>
                <div className="space-y-2">
                  {pokemon.abilities.map((ability, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-700 capitalize">
                        {ability.ability.name.replace('-', ' ')}
                      </span>
                      {ability.is_hidden && (
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                          Hidden
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};