import { useState, useEffect } from 'react';
import { Pokemon, PokemonListItem } from '../types/pokemon';
import { pokemonApi } from '../services/pokemonApi';

export const usePokemonData = () => {
  const [pokemonList, setPokemonList] = useState<PokemonListItem[]>([]);
  const [pokemonData, setPokemonData] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInitialPokemon = async () => {
      try {
        setLoading(true);
        const list = await pokemonApi.getPokemonList(151); // First generation
        setPokemonList(list);
        
        // Load first 20 Pokémon for initial display
        const initialPokemon = await Promise.all(
          list.slice(0, 20).map(async (item) => {
            const id = item.url.split('/').slice(-2, -1)[0];
            return pokemonApi.getPokemon(parseInt(id));
          })
        );
        
        setPokemonData(initialPokemon);
      } catch (err) {
        setError('Failed to load Pokémon data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadInitialPokemon();
  }, []);

  const loadMorePokemon = async (startIndex: number, count: number) => {
    try {
      const batch = pokemonList.slice(startIndex, startIndex + count);
      const newPokemon = await Promise.all(
        batch.map(async (item) => {
          const id = item.url.split('/').slice(-2, -1)[0];
          return pokemonApi.getPokemon(parseInt(id));
        })
      );
      
      setPokemonData(prev => [...prev, ...newPokemon]);
    } catch (err) {
      console.error('Failed to load more Pokémon:', err);
    }
  };

  return {
    pokemonData,
    loading,
    error,
    loadMorePokemon,
    totalCount: pokemonList.length
  };
};