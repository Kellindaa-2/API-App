// Handle search form submission
document.getElementById('search-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const pokemonName = this.elements['name'].value.trim();
  if (pokemonName) {
    window.location.href = `/pokemon/${encodeURIComponent(pokemonName)}`;
  }
});

// Handle random Pokémon button
document.getElementById('random-btn').addEventListener('click', function() {
  window.location.href = '/random';
});