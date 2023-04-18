const pokeApi = {};

function convertPokeApiToPokemonModel(pokemonDetails) {
    let pokemon = new Pokemon();
    pokemon.id = pokemonDetails.id;
    pokemon.name = pokemonDetails.name;
    pokemon.types = pokemonDetails.types.map(typeSlot => typeSlot.type.name);
    [pokemon.mainType] = pokemon.types;
    pokemon.image = pokemonDetails['sprites']['other']['official-artwork']['front_default'];
    pokemon.stats = pokemonDetails.stats.map(stats => {
        return {
            name: stats.stat.name,
            baseStat: stats.base_stat 
        }
    });
    return pokemon;
}

pokeApi.getPokemonDetails = pokemon => {
    return fetch(pokemon.url)
        .then(response => response.json())
        .then(convertPokeApiToPokemonModel);
};

pokeApi.getPokemonList = (offset=0, limit=20) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
    return fetch(url)
        .then(response => response.json())
        .then(jsonBody => jsonBody.results)
        .then(pokemonList => pokemonList.map(pokeApi.getPokemonDetails))
        .then(detailsRequests => Promise.all(detailsRequests))
        .catch(error => console.log(error));
};