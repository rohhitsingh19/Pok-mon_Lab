"use client";
import { useState} from 'react';
import { SearchBar } from './components/SearchBar';
import { PokemonCard } from './components/PokemonCard';
import { PokemonDetails } from './components/PokemonDetails';
import { LoadingSpinner } from './components/LoadingSpinner';
import { TypeFilter } from './components/TypeFilter';
import { Pokemon } from './types/pokemon';
import { pokemonApi } from './services/pokemonApi';
import { usePokemonData } from './hooks/usePokemonData';
import { Database, Beaker, Search } from 'lucide-react';

function App() {
  const { pokemonData, loading, error, loadMorePokemon, totalCount } = usePokemonData();
  const [searchResults, setSearchResults] = useState<Pokemon[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [displayedCount, setDisplayedCount] = useState(20);

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    setSearchQuery(query);
    
    try {
      const results = await pokemonApi.searchPokemon(query);
      setSearchResults(results);
    } catch (err) {
      console.error('Search failed:', err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleClearFilters = () => {
    setSelectedTypes([]);
    setSearchQuery('');
    setSearchResults([]);
  };

  const loadMore = () => {
    if (displayedCount < totalCount) {
      const newCount = Math.min(displayedCount + 20, totalCount);
      loadMorePokemon(displayedCount, 20);
      setDisplayedCount(newCount);
    }
  };

  const getFilteredPokemon = () => {
    const dataToFilter = searchQuery ? searchResults : pokemonData;
    
    if (selectedTypes.length === 0) {
      return dataToFilter;
    }
    
    return dataToFilter.filter(pokemon =>
      pokemon.types.some(type => selectedTypes.includes(type.type.name))
    );
  };

  const filteredPokemon = getFilteredPokemon();

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️ Research Station Offline</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-xl">
                <Database className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Pokémon Research Lab</h1>
                <p className="text-gray-600">Advanced Species Analysis & Database</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Beaker className="h-4 w-4" />
                <span>{filteredPokemon.length} Specimens</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <SearchBar onSearch={handleSearch} isLoading={isSearching} />
          </div>
          
          {searchQuery && (
            <div className="mb-4">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm">
                <Search className="h-4 w-4" />
                Search results for: <strong>{searchQuery}</strong>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                  }}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Type Filter */}
        <TypeFilter
          selectedTypes={selectedTypes}
          onTypeToggle={handleTypeToggle}
          onClear={handleClearFilters}
        />

        {/* Results Section */}
        {loading && pokemonData.length === 0 ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {searchQuery ? 'Search Results' : 'Research Database'}
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({filteredPokemon.length} found)
                </span>
              </h2>
            </div>

            {filteredPokemon.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-2">🔍 No specimens found</div>
                <p className="text-gray-500">
                  {searchQuery || selectedTypes.length > 0
                    ? 'Try adjusting your search criteria or filters'
                    : 'Loading research data...'}
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                  {filteredPokemon.map((pokemon) => (
                    <PokemonCard
                      key={pokemon.id}
                      pokemon={pokemon}
                      onClick={() => setSelectedPokemon(pokemon)}
                    />
                  ))}
                </div>

                {/* Load More Button */}
                {!searchQuery && displayedCount < totalCount && (
                  <div className="text-center">
                    <button
                      onClick={loadMore}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-colors"
                    >
                      Load More Research Data ({displayedCount}/{totalCount})
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>

      {/* Pokemon Details Modal */}
      {selectedPokemon && (
        <PokemonDetails
          pokemon={selectedPokemon}
          onClose={() => setSelectedPokemon(null)}
        />
      )}
    </div>
  );
}

export default App;