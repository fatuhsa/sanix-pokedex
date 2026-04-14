import { PokemonClient, EvolutionClient, GameClient, type Pokemon, type PokemonSpecies, type EvolutionChain, type Ability } from 'pokenode-ts';

export const pokemonClient = new PokemonClient();
export const evolutionClient = new EvolutionClient();
export const gameClient = new GameClient();

// Centralized Cache with consistent string keys
const cache = {
    pokemon: new Map<string, Pokemon>(),
    species: new Map<string, PokemonSpecies>(),
    evolution: new Map<string, EvolutionChain>(),
    ability: new Map<string, Ability>()
};

export const pokeApi = {
    /**
     * Fetch all Pokemon. 
     * Default limit is set to a high number to cover future gens, 
     * but can be adjusted or fetched dynamically.
     */
    async getAllPokemon(offset = 0, limit = 2000) {
        return await pokemonClient.listPokemons(offset, limit);
    },

    async getPokemon(name: string) {
        const normalized = name.toLowerCase();
        if (cache.pokemon.has(normalized)) return cache.pokemon.get(normalized)!;
        
        const data = await pokemonClient.getPokemonByName(normalized);
        cache.pokemon.set(normalized, data);
        return data;
    },

    async getPokemonById(id: number) {
        const key = id.toString();
        if (cache.pokemon.has(key)) return cache.pokemon.get(key)!;
        
        const data = await pokemonClient.getPokemonById(id);
        cache.pokemon.set(key, data);
        return data;
    },

    async getPokemonSpecies(name: string) {
        const normalized = name.toLowerCase();
        if (cache.species.has(normalized)) return cache.species.get(normalized)!;
        
        const data = await pokemonClient.getPokemonSpeciesByName(normalized);
        cache.species.set(normalized, data);
        return data;
    },

    async getEvolutionChain(id: number) {
        const key = id.toString();
        if (cache.evolution.has(key)) return cache.evolution.get(key)!;
        
        const data = await evolutionClient.getEvolutionChainById(id);
        cache.evolution.set(key, data);
        return data;
    },

    async getPokemonsByType(typeName: string) {
        return await pokemonClient.getTypeByName(typeName.toLowerCase());
    },

    async getAbility(name: string) {
        const normalized = name.toLowerCase();
        if (cache.ability.has(normalized)) return cache.ability.get(normalized)!;
        
        const data = await pokemonClient.getAbilityByName(normalized);
        cache.ability.set(normalized, data);
        return data;
    }
};
