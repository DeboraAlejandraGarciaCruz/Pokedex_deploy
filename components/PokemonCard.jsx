import React from 'react';
import './PokemonCard.css';

const PokemonCard = ({ pokemon }) => {
  const types = pokemon.types.map((t, index) => ({ id: index, name: t.type.name }));
  const stats = Object.fromEntries(pokemon.stats.map(s => [s.stat.name, s.base_stat]));

  return (
    <div className="card">
      <h2 className="card-title">{pokemon.name}</h2>
      <div className="sprite-container">
        <img
          src={pokemon.sprites.other['official-artwork'].front_default}
          alt={pokemon.name}
          className="sprite"
        />
      </div>
      <div className="type-container">
        {types.map((type) => (
          <span
            key={`type-${pokemon.id}-${type.id}`}
            className={`type-badge ${type.name}`}
          >
            {type.name}
          </span>
        ))}
      </div>
      <div className="stats-grid">
        {['hp', 'attack', 'defense', 'special-attack'].map((statName) => (
          <div key={statName} className="stat">
            <strong>{statName.replace('-', ' ')}:</strong>
            <span>{stats[statName]}/150</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PokemonCard;
