import { Pokemon, PokemonSpecies, PokemonListItem } from '../types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

export const pokemonApi = {
  async getPokemonList(limit: number = 151): Promise<PokemonListItem[]> {
    const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}`);
    const data = await response.json();
    return data.results;
  },

  async getPokemon(nameOrId: string | number): Promise<Pokemon> {
    const response = await fetch(`${BASE_URL}/pokemon/${nameOrId}`);
    if (!response.ok) {
      throw new Error('Pokémon not found');
    }
    return response.json();
  },

  async getPokemonSpecies(id: number): Promise<PokemonSpecies> {
    const response = await fetch(`${BASE_URL}/pokemon-species/${id}`);
    return response.json();
  },

  async searchPokemon(query: string): Promise<Pokemon[]> {
    try {
      // Try to get by exact name first
      const pokemon = await this.getPokemon(query.toLowerCase());
      return [pokemon];
    } catch {
      // If not found, return empty array
      return [];
    }
  }
};