import { browser } from '$app/environment';
import type { PokemonDetail } from './types';

export interface TeamMember {
	id: string; // Unique ID for dnd-action
	pokemon: PokemonDetail;
}

class TeamStore {
	members = $state<TeamMember[]>([]);
	isDrawerOpen = $state(false);
	isAnalysisOpen = $state(false);

	constructor() {
		if (browser) {
			const saved = localStorage.getItem('poke_team');
			if (saved) {
				try {
					this.members = JSON.parse(saved);
				} catch (e) {
					console.error('Failed to load team', e);
				}
			}
		}
	}

	addPokemon(pokemon: PokemonDetail) {
		if (this.members.length >= 6) return false;
		
		// Prevent duplicates
		if (this.members.some(m => m.pokemon.id === pokemon.id)) return false;
		
		const newMember: TeamMember = {
			id: `member-${pokemon.id}-${Date.now()}`,
			pokemon: JSON.parse(JSON.stringify(pokemon))
		};
		
		this.members.push(newMember);
		return true;
	}

	removeMember(id: string) {
		this.members = this.members.filter(m => m.id !== id);
	}

	removePokemonById(pokemonId: number) {
		this.members = this.members.filter(m => m.pokemon.id !== pokemonId);
	}

	isInTeam(pokemonId: number) {
		return this.members.some(m => m.pokemon.id === pokemonId);
	}

	toggleDrawer() {
		this.isDrawerOpen = !this.isDrawerOpen;
	}
}

export const teamStore = new TeamStore();
