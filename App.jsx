import React, { useState, useEffect } from 'react';
import PokemonCard from './components/PokemonCard';
import './App.css'; 

const App = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [nextUrl, setNextUrl] = useState('https://pokeapi.co/api/v2/pokemon?limit=12');
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filteredPokemon, setFilteredPokemon] = useState([]);

  const fetchPokemon = async () => {
    if (!nextUrl || loading) return;
    setLoading(true);
    try {
      const res = await fetch(nextUrl);
      const data = await res.json();
      setNextUrl(data.next);
      const pokemonData = await Promise.all(
        data.results.map(async (pokemon) => {
          const res = await fetch(pokemon.url);
          return await res.json();
        })
      );
      setPokemonList((prev) => {
        const uniquePokemonMap = new Map(prev.map(p => [p.id, p]));
        pokemonData.forEach(p => uniquePokemonMap.set(p.id, p));
        return Array.from(uniquePokemonMap.values());
      });
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemon();
  }, []);

  useEffect(() => {
    setFilteredPokemon(filterPokemonList());
  }, [search, pokemonList]);

  const filterPokemonList = () => {
    if (!search) return pokemonList;
    return pokemonList.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  };

  return (
    <div className="app-container">
      <h1 className="title">Pokédex</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar Pokémon..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>
      <div className="pokemon-grid">
        {filteredPokemon.map((pokemon) => (
          <div key={pokemon.id} className="pokemon-card-wrapper">
            <PokemonCard pokemon={pokemon} />
          </div>
        ))}
      </div>
      {nextUrl && (
        <div className="button-container">
          <button
            onClick={fetchPokemon}
            className="load-more-btn"
            disabled={loading}
          >
            {loading ? 'Cargando...' : 'Cargar más Pokémon'}
          </button>
        </div>
      )}
      {filteredPokemon.length === 0 && search && !loading && (
        <p className="no-results">No se encontraron Pokémon que coincidan con "{search}"</p>
      )}
      {loading && <p className="loading-text">Cargando Pokémon...</p>}
    </div>
  );
};

export default App;
