import NodeCache from 'node-cache';
import axios from 'axios';

// Cache con un TTL (Time To Live) de 120 segundos (2 minutos)
const pokeCache = new NodeCache({ stdTTL: 120 });

export async function getPokemonDetails(pokemonIdOrName) {
    const nameOrId = String(pokemonIdOrName).toLowerCase();

    const cacheKey = `pokemon_${nameOrId}`;
    const cachedData = pokeCache.get(cacheKey);

    if (cachedData) {
        console.log(`HIT: Devolviendo datos cacheados para ${pokemonIdOrName}`);
        return cachedData;
    }

    console.log(`MISS: Consultando PokeAPI para ${pokemonIdOrName}`);

    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${nameOrId}`);
        const { id, name, types, sprites, stats } = response.data;

        // Extraemos solo lo que necesitamos
        const relevantData = {
            id,
            name,
            types: types.map(t => t.type.name),
            sprite: sprites.front_default,
            stats: stats.map(s => ({
                name: s.stat.name,
                value: s.base_stat
            }))
        };

        // Guardamos en cache
        pokeCache.set(cacheKey, relevantData);
        return relevantData;

    } catch (error) {
        if (error.response && error.response.status === 404) {
            throw new Error(`Pokémon "${pokemonIdOrName}" no encontrado en PokeAPI.`);
        }
        console.error(`Error al obtener datos de PokeAPI: ${error.message}`);
        throw new Error('Servicio de PokeAPI no disponible en este momento.');
    }
}
