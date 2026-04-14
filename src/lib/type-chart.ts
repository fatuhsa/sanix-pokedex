export const TYPE_CHART: Record<string, { weaknesses: string[], resistances: string[], immunities: string[] }> = {
	normal: { weaknesses: ['fighting'], resistances: [], immunities: ['ghost'] },
	fire: { weaknesses: ['water', 'ground', 'rock'], resistances: ['fire', 'grass', 'ice', 'bug', 'steel', 'fairy'], immunities: [] },
	water: { weaknesses: ['electric', 'grass'], resistances: ['fire', 'water', 'ice', 'steel'], immunities: [] },
	grass: { weaknesses: ['fire', 'ice', 'poison', 'flying', 'bug'], resistances: ['water', 'electric', 'grass', 'ground'], immunities: [] },
	electric: { weaknesses: ['ground'], resistances: ['electric', 'flying', 'steel'], immunities: [] },
	ice: { weaknesses: ['fire', 'fighting', 'rock', 'steel'], resistances: ['ice'], immunities: [] },
	fighting: { weaknesses: ['flying', 'psychic', 'fairy'], resistances: ['bug', 'rock', 'dark'], immunities: [] },
	poison: { weaknesses: ['ground', 'psychic'], resistances: ['grass', 'fighting', 'poison', 'bug', 'fairy'], immunities: [] },
	ground: { weaknesses: ['water', 'grass', 'ice'], resistances: ['poison', 'rock'], immunities: ['electric'] },
	flying: { weaknesses: ['electric', 'ice', 'rock'], resistances: ['grass', 'fighting', 'bug'], immunities: ['ground'] },
	psychic: { weaknesses: ['bug', 'ghost', 'dark'], resistances: ['fighting', 'psychic'], immunities: [] },
	bug: { weaknesses: ['fire', 'flying', 'rock'], resistances: ['grass', 'fighting', 'ground'], immunities: [] },
	rock: { weaknesses: ['water', 'grass', 'fighting', 'ground', 'steel'], resistances: ['normal', 'fire', 'poison', 'flying'], immunities: [] },
	ghost: { weaknesses: ['ghost', 'dark'], resistances: ['poison', 'bug'], immunities: ['normal', 'fighting'] },
	dragon: { weaknesses: ['ice', 'dragon', 'fairy'], resistances: ['fire', 'water', 'electric', 'grass'], immunities: [] },
	dark: { weaknesses: ['fighting', 'bug', 'fairy'], resistances: ['ghost', 'dark'], immunities: ['psychic'] },
	steel: { weaknesses: ['fire', 'fighting', 'ground'], resistances: ['normal', 'grass', 'ice', 'flying', 'psychic', 'bug', 'rock', 'dragon', 'steel', 'fairy'], immunities: ['poison'] },
	fairy: { weaknesses: ['poison', 'steel'], resistances: ['fighting', 'bug', 'dark'], immunities: ['dragon'] }
};

export type TypeEffectiveness = Record<string, number>;

export function calculateTeamCoverage(teamTypes: string[][]): TypeEffectiveness {
	const coverage: TypeEffectiveness = {};
	const allTypes = Object.keys(TYPE_CHART);
	
	allTypes.forEach(type => coverage[type] = 1);

	teamTypes.forEach(pokemonTypes => {
		const pokemonEffectiveness: TypeEffectiveness = {};
		allTypes.forEach(t => pokemonEffectiveness[t] = 1);

		pokemonTypes.forEach(pType => {
			const chart = TYPE_CHART[pType];
			if (chart) {
				chart.weaknesses.forEach(w => pokemonEffectiveness[w] *= 2);
				chart.resistances.forEach(r => pokemonEffectiveness[r] *= 0.5);
				chart.immunities.forEach(i => pokemonEffectiveness[i] *= 0);
			}
		});

		// Add this pokemon's defensive profile to the team total
		allTypes.forEach(t => {
			// We sum up the scores: > 1 means weakness, < 1 means resistance
			// For team analysis, it's often better to count HOW MANY are weak/resistant
			if (pokemonEffectiveness[t] > 1) coverage[t] += 1;
			if (pokemonEffectiveness[t] < 1 && pokemonEffectiveness[t] > 0) coverage[t] -= 1;
			if (pokemonEffectiveness[t] === 0) coverage[t] -= 2; // Immunities are great
		});
	});

	return coverage;
}
