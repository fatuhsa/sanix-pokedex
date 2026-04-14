<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import { pokeApi } from '$lib/pokeapi';
	import { getTypeStyle } from '$lib/styles.svelte';
	import PokemonCard from '$lib/PokemonCard.svelte';
	import PokemonDetailModal from '$lib/PokemonDetailModal.svelte';
	import { accent } from '$lib/accent.svelte';
	import type { Pokemon, PokemonDetail, SpeciesData, EvolutionStep, SpecialForm } from '$lib/types';
	import type { Ability } from 'pokenode-ts';

	let shinyIds = new SvelteSet<number>();
	let favoriteNames = new SvelteSet<string>();
	let activeTab = $state<'shiny' | 'favorites'>('shiny');
	let loading = $state(true);
	
	let shinyPokemons = $state<Pokemon[]>([]);
	let favoritePokemons = $state<Pokemon[]>([]);

	// --- Detail Panel State ---
	let selectedPokemon = $state<Pokemon | null>(null);
	let detailData = $state<PokemonDetail | null>(null);
	let speciesData = $state<SpeciesData | null>(null);
	let abilitiesDetails = $state<Ability[]>([]);
	let specialForms = $state<SpecialForm[]>([]);
	let evolutionChain = $state<EvolutionStep[]>([]);
	let detailLoading = $state(false);
	let secondaryLoading = $state(false);
	let isPlayingCry = $state(false);
	let modalContentElement = $state<HTMLElement | null>(null);

	let isAbilitiesExpanded = $state(false);
	let isMovesExpanded = $state(false);
	let selectedVersionGroup = $state<string>('');
	let selectedMoveMethod = $state<'level-up' | 'machine' | 'all'>('all');

	async function loadCollection() {
		loading = true;
		const savedShinyIds = localStorage.getItem('shiny_pokemon_ids');
		const savedFavorites = localStorage.getItem('poke_favorites');
		
		shinyIds.clear();
		if (savedShinyIds) JSON.parse(savedShinyIds).forEach((id: number) => shinyIds.add(id));
		
		favoriteNames.clear();
		if (savedFavorites) JSON.parse(savedFavorites).forEach((name: string) => favoriteNames.add(name));

		try {
			// Load shiny data
			const shinyPromises = Array.from(shinyIds).map(async (id) => {
				const data = await pokeApi.getPokemonById(id);
				return { name: data.name, url: `https://pokeapi.co/api/v2/pokemon/${id}/` };
			});
			
			// Load favorites data
			const favPromises = Array.from(favoriteNames).map(async (name) => {
				const data = await pokeApi.getPokemon(name);
				return { name: data.name, url: `https://pokeapi.co/api/v2/pokemon/${data.id}/` };
			});

			shinyPokemons = await Promise.all(shinyPromises);
			favoritePokemons = await Promise.all(favPromises);
		} catch (e) {
			console.error(e);
		} finally {
			loading = false;
		}
	}

	function toggleFavorite(pokemonName: string, event: MouseEvent) {
		event.stopPropagation();
		if (favoriteNames.has(pokemonName)) {
			favoriteNames.delete(pokemonName);
		} else {
			favoriteNames.add(pokemonName);
		}
		localStorage.setItem('poke_favorites', JSON.stringify(Array.from(favoriteNames)));
		loadCollection(); // Refresh
	}

	// Re-using common logic from +page.svelte
	async function openDetail(pokemon: Pokemon | { name: string; url: string }, keepScroll = false) {
		const currentScroll = modalContentElement?.scrollTop || 0;
		selectedPokemon = pokemon as Pokemon;
		detailLoading = true;
		secondaryLoading = false;
		
		if (!keepScroll) {
			detailData = null;
			speciesData = null;
			abilitiesDetails = [];
			specialForms = [];
			evolutionChain = [];
		}
		
		isPlayingCry = false;
		isAbilitiesExpanded = false;
		isMovesExpanded = false;

		try {
			const newDetail = await pokeApi.getPokemon(pokemon.name) as unknown as PokemonDetail;
			const newSpecies = await pokeApi.getPokemonSpecies(newDetail.species.name) as unknown as SpeciesData;
			
			detailData = newDetail;
			speciesData = newSpecies;
			
			const groups = new Set<string>();
			detailData.moves.forEach((m) => {
				m.version_group_details.forEach((v) => groups.add(v.version_group.name));
			});
			const sortedGroups = Array.from(groups).sort();
			if (!selectedVersionGroup || !groups.has(selectedVersionGroup)) {
				selectedVersionGroup = sortedGroups.pop() || '';
			}

			detailLoading = false;
			secondaryLoading = true;
			
			const abilityPromises = newDetail.abilities.map(a => pokeApi.getAbility(a.ability.name));
			const newAbilities = await Promise.all(abilityPromises);

			const evoId = parseInt(newSpecies.evolution_chain.url.split('/').filter(Boolean).pop() || '0');
			const evoData = await pokeApi.getEvolutionChain(evoId);
			
			let chain: EvolutionStep[] = [];
			let currentEvo: any = evoData.chain;
			while (currentEvo) {
				chain.push({
					name: currentEvo.species.name,
					requirements: formatEvolutionRequirement(currentEvo.evolution_details)
				});
				currentEvo = currentEvo.evolves_to[0];
			}

			const specialVarieties = newSpecies.varieties.filter(v => 
				!v.is_default && (v.pokemon.name.includes('-mega') || v.pokemon.name.includes('-gmax'))
			);
			const formsPromises = specialVarieties.map(async v => {
				const data = await pokeApi.getPokemon(v.pokemon.name);
				return {
					name: data.name.replace(/-/g, ' '),
					imageUrl: data.sprites.other?.['official-artwork'].front_default || '',
					types: data.types.map(t => t.type.name)
				};
			});
			const newSpecialForms = await Promise.all(formsPromises);

			abilitiesDetails = newAbilities;
			evolutionChain = chain;
			specialForms = newSpecialForms;

			if (keepScroll) {
				await tick();
				if (modalContentElement) modalContentElement.scrollTop = currentScroll;
			}
		} catch (error) {
			console.error(error);
		} finally {
			detailLoading = false;
			secondaryLoading = false;
		}
	}

	function formatStatName(name: string) {
		const names: Record<string, string> = {
			hp: 'HP', attack: 'ATK', defense: 'DEF',
			'special-attack': 'SP.A', 'special-defense': 'SP.D', speed: 'SPD'
		};
		return names[name] || name.toUpperCase();
	}

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
			if (d.held_item) parts.push(`HOLD ${d.held_item.name.replace(/-/g, ' ')}`);
		}
		return parts.join(' ').toUpperCase();
	}

	function playCry() {
		if (!detailData || isPlayingCry) return;
		const cryUrl = detailData.cries?.latest || detailData.cries?.legacy;
		if (cryUrl) {
			isPlayingCry = true;
			const audio = new Audio(cryUrl);
			audio.onended = () => (isPlayingCry = false);
			audio.play();
		}
	}

	function navigateToEvo(name: string) {
		openDetail({ name, url: `https://pokeapi.co/api/v2/pokemon/${name}/` }, true);
	}

	let availableVersionGroups = $derived.by(() => {
		if (!detailData) return [];
		const groups = new Set<string>();
		detailData.moves.forEach((m) => {
			m.version_group_details.forEach((v) => groups.add(v.version_group.name));
		});
		return Array.from(groups).sort();
	});

	let filteredMoves = $derived.by(() => {
		if (!detailData || !selectedVersionGroup) return [];
		return detailData.moves
			.map((m) => {
				const versionDetail = m.version_group_details.find((v) => v.version_group.name === selectedVersionGroup);
				if (!versionDetail) return null;
				if (selectedMoveMethod !== 'all' && versionDetail.move_learn_method.name !== selectedMoveMethod) return null;
				return {
					name: m.move.name.replace(/-/g, ' '),
					method: versionDetail.move_learn_method.name,
					level: versionDetail.level_learned_at
				};
			})
			.filter((m) => m !== null)
			.sort((a, b) => (a!.level || 0) - (b!.level || 0));
	});

	onMount(() => {
		loadCollection();
	});
</script>

<svelte:head>
	<title>Collection | Sanix Pokedex</title>
</svelte:head>

<div class="animate-[fadeIn_0.3s_ease-out] pt-0">
	<!-- Top Bar -->
	<div class="mb-6 flex items-center justify-between border-b border-white/5 pb-4">
		<div>
			<h1 
				onclick={() => accent.cycle()}
				onkeydown={(e) => e.key === 'Enter' && accent.cycle()}
				role="button"
				tabindex="0"
				class="text-2xl font-bold tracking-tight text-white cursor-pointer select-none active:scale-95 transition-transform"
			>
				My Collection
			</h1>
			<p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">
				Personal Records & Trophies
			</p>
		</div>
		<div class="flex h-9 w-9 items-center justify-center bg-primary/5 border border-primary/10 rounded-full shadow-[0_0_15px_rgba(0,243,255,0.08)] text-primary">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
			</svg>
		</div>
	</div>

	<!-- Tab Switcher -->
	<div class="mb-6 flex gap-2">
		<button 
			onclick={() => activeTab = 'shiny'}
			class="flex-1 h-11 rounded-2xl text-[11px] font-bold transition-all border {activeTab === 'shiny' ? 'bg-primary text-space border-primary' : 'bg-panel text-outline border-white/10 hover:bg-white/5'}"
		>
			SHINY DEX ({shinyIds.size})
		</button>
		<button 
			onclick={() => activeTab = 'favorites'}
			class="flex-1 h-11 rounded-2xl text-[11px] font-bold transition-all border {activeTab === 'favorites' ? 'bg-primary text-space border-primary' : 'bg-panel text-outline border-white/10 hover:bg-white/5'}"
		>
			FAVORITES ({favoriteNames.size})
		</button>
	</div>

	{#if loading}
		<div class="grid grid-cols-2 gap-4">
			{#each Array(4) as _, i (i)}
				<div class="bg-panel/40 flex h-44 animate-pulse flex-col items-center justify-center rounded-xl border border-white/5 p-4">
					<div class="mb-4 h-16 w-16 rounded-full bg-white/5"></div>
					<div class="mt-2 h-3 w-20 rounded-full bg-white/10"></div>
				</div>
			{/each}
		</div>
	{:else}
		{@const currentList = activeTab === 'shiny' ? shinyPokemons : favoritePokemons}
		
		{#if currentList.length > 0}
			<div class="grid grid-cols-2 gap-4">
				{#each currentList as pokemon (pokemon.name)}
					<PokemonCard
						name={pokemon.name}
						isFavorite={favoriteNames.has(pokemon.name)}
						onToggleFavorite={(e) => toggleFavorite(pokemon.name, e)}
						onprefetch={() => {}}
						onclick={() => openDetail(pokemon)}
					/>
				{/each}
			</div>
		{:else}
			<div class="rounded-3xl border border-dashed border-white/5 py-24 text-center bg-panel/20">
				<div class="mb-4 flex justify-center text-gray-700">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
					</svg>
				</div>
				<p class="text-xs font-bold text-gray-500 uppercase tracking-widest">NO ENTRIES FOUND</p>
				<p class="mt-2 text-[10px] text-gray-600 px-10 leading-relaxed font-medium">
					{activeTab === 'shiny' ? 'Discover shiny Pokémon through the scanner to see them here.' : 'Mark your favorite Pokémon to quickly access them here.'}
				</p>
			</div>
		{/if}
	{/if}
</div>

<PokemonDetailModal 
	{selectedPokemon}
	{detailData}
	{speciesData}
	{abilitiesDetails}
	{evolutionChain}
	{specialForms}
	{detailLoading}
	{secondaryLoading}
	{isPlayingCry}
	bind:isAbilitiesExpanded
	bind:isMovesExpanded
	bind:selectedVersionGroup
	bind:selectedMoveMethod
	{availableVersionGroups}
	{filteredMoves}
	bind:modalContentElement
	closeDetail={() => selectedPokemon = null}
	handleModalKeyDown={(e) => e.key === 'Escape' && (selectedPokemon = null)}
	{playCry}
	{getTypeStyle}
	{formatStatName}
	{navigateToEvo}
/>
