import { PokemonClient, EvolutionClient, GameClient, type Pokemon, type PokemonSpecies, type EvolutionChain, type Ability } from 'pokenode-ts';
import type { EvolutionStep } from '$lib/types';

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

// Helper: Format evolution requirements (translated from +page.svelte)
function formatEvolutionRequirement(details: any[]): string | null {
    if (!details || details.length === 0) return null;
    const d = details[0];
    let parts = [];
    if (d.trigger.name === 'level-up') {
        if (d.min_level) parts.push(`LV.${d.min_level}`);
        if (d.min_happiness) parts.push(`HAPPY`);
        if (d.held_item) parts.push(`HOLD ${d.held_item.name.replace(/-/g, ' ')}`);
        if (d.known_move) parts.push(`KNOW ${d.known_move.name.replace(/-/g, ' ')}`);
        if (d.time_of_day) parts.push(`${d.time_of_day.toUpperCase()}`);
        if (d.location) parts.push(`AT ${d.location.name.replace(/-/g, ' ')}`);
        if (parts.length === 0) parts.push('LVL_UP');
    } else if (d.trigger.name === 'use-item') {
        parts.push(d.item.name.replace(/-/g, ' '));
    } else if (d.trigger.name === 'trade') {
        parts.push('TRADE');
    }
    return parts.length > 0 ? parts.join(' + ') : 'EVO';
}

// Helper: Recursive evolution node parser
function parseEvolutionNode(node: any): EvolutionStep {
    const id = parseInt(node.species.url.split('/').filter(Boolean).pop() || '0');
    return {
        name: node.species.name,
        id,
        requirements: formatEvolutionRequirement(node.evolution_details),
        evolves_to: node.evolves_to.map((child: any) => parseEvolutionNode(child))
    };
}

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

    async getParsedEvolutionChain(id: number): Promise<EvolutionStep> {
        const data = await this.getEvolutionChain(id);
        return parseEvolutionNode(data.chain);
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
