export interface Pokemon {
	name: string;
	url: string;
}

export interface PokemonDetail {
	id: number;
	name: string;
	height: number;
	weight: number;
	sprites: {
		other: {
			'official-artwork': {
				front_default: string;
				front_shiny?: string;
			};
		};
	};
	types: Array<{
		type: {
			name: string;
		};
	}>;
	stats: Array<{
		base_stat: number;
		stat: {
			name: string;
		};
	}>;
	abilities: Array<{
		ability: {
			name: string;
		};
		is_hidden: boolean;
	}>;
	moves: Array<{
		move: {
			name: string;
		};
		version_group_details: Array<{
			level_learned_at: number;
			move_learn_method: {
				name: string;
			};
			version_group: {
				name: string;
			};
		}>;
	}>;
	species: {
		name: string;
		url: string;
	};
	cries?: {
		latest?: string;
		legacy?: string;
	};
}

export interface SpeciesData {
	flavor_text_entries: Array<{
		flavor_text: string;
		language: {
			name: string;
		};
	}>;
	evolution_chain: {
		url: string;
	};
	varieties: Array<{
		is_default: boolean;
		pokemon: {
			name: string;
			url: string;
		};
	}>;
}

// Alias for consistency with external libraries
export type PokemonSpecies = SpeciesData;

export interface EvolutionStep {
	name: string;
	id: number;
	requirements: string | null;
	evolves_to: EvolutionStep[];
}

export interface SpecialForm {
	name: string;
	imageUrl: string;
	types: string[];
}

export interface Region {
	name: string;
	url: string;
}

export interface Location {
	name: string;
	url: string;
}

export const POKEMON_TYPES = [
	'normal', 'fire', 'water', 'grass', 'electric', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];
