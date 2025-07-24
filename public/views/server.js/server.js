const express = require('express');
const axios = require('axios');
const app = express();


app.set('view engine', 'ejs');


app.use(express.static('public'));


app.get('/', (req, res) => {
  res.render('index', { error: null });
});


app.get('/random', async (req, res) => {
  try {
    // Get total number of Pokémon (currently 1010 as of 2023)
    const countResponse = await axios.get('https://pokeapi.co/api/v2/pokemon-species?limit=0');
    const totalPokemon = countResponse.data.count;
    const randomId = Math.floor(Math.random() * totalPokemon) + 1;
    
    res.redirect(`/pokemon/${randomId}`);
  } catch (error) {
    res.render('index', { error: 'Failed to get random Pokémon' });
  }
});

app.get('/pokemon/:name', async (req, res) => {
  try {
    const pokemonName = req.params.name.toLowerCase();
    
    
    const apiResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    
    
    const speciesResponse = await axios.get(apiResponse.data.species.url);
    
   
    const evolutionResponse = await axios.get(speciesResponse.data.evolution_chain.url);
    const evolutions = getEvolutionChain(evolutionResponse.data.chain);
    
    
    const flavorTextEntries = speciesResponse.data.flavor_text_entries.filter(
      entry => entry.language.name === 'en'
    );
    const randomFlavorText = flavorTextEntries.length > 0 
      ? flavorTextEntries[Math.floor(Math.random() * flavorTextEntries.length)].flavor_text 
      : 'No description available';
    
    
    const pokemonData = {
      name: apiResponse.data.name,
      id: apiResponse.data.id,
      sprite: apiResponse.data.sprites.front_default,
      types: apiResponse.data.types.map(type => type.type.name),
      abilities: apiResponse.data.abilities.map(ability => ability.ability.name),
      height: apiResponse.data.height / 10, 
      weight: apiResponse.data.weight / 10, 
      description: randomFlavorText,
      evolutions: evolutions
    };
    
    res.render('pokemon', { pokemon: pokemonData, error: null });
  } catch (error) {
    res.render('index', { error: 'Pokémon not found. Please try another name or number.' });
  }
});


function getEvolutionChain(chain) {
  const evolutions = [];
  
  function traverseChain(link) {
    evolutions.push({
      name: link.species.name,
      url: link.species.url.split('/').slice(-2, -1)[0] 
    });
    
    if (link.evolves_to.length > 0) {
      link.evolves_to.forEach(traverseChain);
    }
  }
  
  traverseChain(chain);
  return evolutions;
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});