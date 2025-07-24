document.getElementById('search-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const pokemonName = this.elements['name'].value.trim();
    if (pokemonName) {
      window.location.href = `/pokemon/${encodeURIComponent(pokemonName)}`;
    }
  });