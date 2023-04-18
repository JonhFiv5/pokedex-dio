const limit = 20;
let offset = 0;
let lastPokemon = 151;
const generationSelect = document.getElementById('pokemon-generation');
const loadMoreButton = document.getElementById('load-more');

// Modal elements
const detailsModal = document.getElementById('details-modal');
const modalContent = document.getElementById('modal-content');
const closeModalButton = document.getElementById('close-modal');

const pokemonColors = {
    normal: '#A8A77A',
    fire: '#EE8130',
    water: '#6390F0',
    electric: '#F7D02C',
    grass: '#7AC74C',
    ice: '#96D9D6',
    fighting: '#C22E28',
    poison: '#A33EA1',
    ground: '#E2BF65',
    flying: '#A98FF3',
    psychic: '#F95587',
    bug: '#A6B91A',
    rock: '#B6A136',
    ghost: '#735797',
    dragon: '#6F35FC',
    dark: '#705746',
    steel: '#B7B7CE',
    fairy: '#D685AD'
};

function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.substring(1);
}

function convertTypesToHtml(types) {
    return types.map(type => `<li class="type" style="background-color: ${pokemonColors[type]}">${capitalize(type)}</li>`).join('');
}

function convertStatsToHtml(stats) {
    return stats.map(stat => `<span class="stat-name">${stat.name}</span><div style="width: 10rem"><span class="stats-bar" style="width: ${stat.baseStat}%">${stat.baseStat}</span></div>`).join('');
}

function convertPokemonToHtml(pokemon) {
    const backgroundColor = pokemonColors[pokemon.mainType];
    return `<li class="pokemon" style="background-color: ${backgroundColor}" onclick="showModal(${JSON.stringify(pokemon).split('"').join("&quot;")})">
            <span class="number">#${pokemon.id.toString().padStart(3, '0')}</span >
            <span class="name">${capitalize(pokemon.name)}</span>
            <div class="details">
                <ol class="types">
                    ${convertTypesToHtml(pokemon.types)}
                </ol>
                <img src="${pokemon.image}" alt="${pokemon.name}">
            </div>
        </li > `;
}

function renderPokedex(pokemonList, replace=false) {
    let container = document.getElementById('pokemon-list');
    if (replace) {
        container.innerHTML = pokemonList.map(convertPokemonToHtml).join('');
    } else {
        container.innerHTML += pokemonList.map(convertPokemonToHtml).join('');
    }
}

function loadPokedex(offset, limit, replace=false) {
    pokeApi.getPokemonList(offset, limit)
        .then((pokemonList=[]) => renderPokedex(pokemonList, replace));
}

closeModalButton.addEventListener('click', closeModal);

function showModal(pokemon) {
    let statsList = `
        <span class="name">${pokemon.name}</span>
        <img class="pokemon-img-details" src="${pokemon.image}" alt="pokemon.name">
        <div class="types">
            ${convertTypesToHtml(pokemon.types)}
        </div>
        ${convertStatsToHtml(pokemon.stats)}
    `;
    modalContent.innerHTML = statsList;
    detailsModal.style.backgroundColor = pokemonColors[pokemon.mainType];
    detailsModal.style.display = 'block';
}

function closeModal() {
    detailsModal.style.display = 'none';
}

loadPokedex(offset, limit);

loadMoreButton.addEventListener('click', (event) => {
    let newLimit = limit;
    offset += limit;
    if (offset + limit >= lastPokemon) {
        newLimit = lastPokemon - offset;
        loadPokedex(offset, newLimit);
        event.target.style.display = 'none';
    } else{
        loadPokedex(offset, limit);
    }
});

function loadPokemonGeneration(generation) {
    /* 
    Pokemon per generation
        1° = 1 -> 151
        2° = 152 -> 251
        3° = 252 -> 386
        4° = 387 -> 493
        5° = 494 -> 649
        6° = 650 -> 721
        7° = 722 -> 809
        8° = 810 -> 905
        9° = 906 -> 1010

        Reference: https://bulbapedia.bulbagarden.net/wiki/List_of_Pok%C3%A9mon_by_National_Pok%C3%A9dex_number
    */
    const generationsInfo = {
        1: {
            offset: 0,
            lastPokemon: 151
        },
        2: {
            offset: 151,
            lastPokemon: 251
        },
        3: {
            offset: 251,
            lastPokemon: 386
        },
        4: {
            offset: 386,
            lastPokemon: 493
        },
        5: {
            offset: 493,
            lastPokemon: 649
        },
        6: {
            offset: 649,
            lastPokemon: 721
        },
        7: {
            offset: 721,
            lastPokemon: 809
        },
        8: {
            offset: 809,
            lastPokemon: 905
        },
        9: {
            offset: 905,
            lastPokemon: 1010
        },
    }
    offset = generationsInfo[generation].offset;
    lastPokemon = generationsInfo[generation].lastPokemon;
    loadMoreButton.style.display = 'block';
    loadPokedex(offset, limit, true);
}

generationSelect.addEventListener('change', (event) => {loadPokemonGeneration(event.target.value)});