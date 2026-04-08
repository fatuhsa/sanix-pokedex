export interface Pokemon {
	name: string;
	url: string;
}

export interface PokemonDetail {
	id: number;
	name: string;
	sprites: {
		other: {
			'official-artwork': {
				front_default: string;
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
	species: {
		url: string;
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
	'normal',
	'fire',
	'water',
	'grass',
	'electric',
	'ice',
	'fighting',
	'poison',
	'ground',
	'flying',
	'psychic',
	'bug',
	'rock',
	'ghost',
	'dragon',
	'dark',
	'steel',
	'fairy'
];
