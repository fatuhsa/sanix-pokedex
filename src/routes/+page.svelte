<script lang="ts">
	import PokemonCard from '$lib/PokemonCard.svelte';
	import Filters from '$lib/Filters.svelte';
	import PokemonDetailModal from '$lib/PokemonDetailModal.svelte';
	import { onMount, tick } from 'svelte';
	import { pokeApi } from '$lib/pokeapi';
	import { type Pokemon, POKEMON_TYPES } from '$lib/types';
	import type { Pokemon as PokemonDetail, PokemonSpecies, Ability } from 'pokenode-ts';

	// --- Core State ---
	let allPokemons = $state<Pokemon[]>([]);
	let searchQuery = $state('');
	let selectedType = $state<string | null>(null);
	let typeFilteredNames = $state<Set<string>>(new Set());
	let typeLoading = $state(false);

	let onlyFavorites = $state(false);
	let onlyMega = $state(false);
	let onlyGmax = $state(false);
	let favorites = $state<Set<string>>(new Set());

	let loading = $state(true);
	let displayedLimit = $state(20);
	const increment = 20;

	let showScrollToTop = $state(false);

	// --- Detail Panel State ---
	let selectedPokemon = $state<Pokemon | null>(null);
	let detailData = $state<PokemonDetail | null>(null);
	let speciesData = $state<PokemonSpecies | null>(null);
	let abilitiesDetails = $state<Ability[]>([]);
	let specialForms = $state<any[]>([]);
	let evolutionChain = $state<any[]>([]);
	let detailLoading = $state(false);
	let secondaryLoading = $state(false);
	let isPlayingCry = $state(false);
	let modalContentElement = $state<HTMLElement | null>(null);

	// --- Accordion State ---
	let isAbilitiesExpanded = $state(false);
	let isMovesExpanded = $state(false);

	// --- Moves State ---
	let selectedVersionGroup = $state<string>('');
	let selectedMoveMethod = $state<'level-up' | 'machine' | 'all'>('all');
	
	// --- Intersection Observer for Infinite Scroll ---
	let observerTarget = $state<HTMLElement | null>(null);

	$effect(() => {
		if (!observerTarget) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && displayedLimit < filteredPokemons.length) {
					displayedLimit += increment;
				}
			},
			{ threshold: 0.1, rootMargin: '100px' }
		);

		observer.observe(observerTarget);
		return () => observer.disconnect();
	});

	// --- Scroll Position for Back to Top ---
	$effect(() => {
		const handleScroll = () => {
			showScrollToTop = window.scrollY > 400;
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});

	function scrollToTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
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
				const versionDetail = m.version_group_details.find(
					(v) => v.version_group.name === selectedVersionGroup
				);
				if (!versionDetail) return null;
				
				if (selectedMoveMethod !== 'all' && versionDetail.move_learn_method.name !== selectedMoveMethod) {
					return null;
				}

				return {
					name: m.move.name.replace(/-/g, ' '),
					method: versionDetail.move_learn_method.name,
					level: versionDetail.level_learned_at
				};
			})
			.filter((m) => m !== null)
			.sort((a, b) => (a!.level || 0) - (b!.level || 0));
	});

	// --- Helper Functions ---
	function formatStatName(name: string) {
		const names: Record<string, string> = {
			hp: 'HP', attack: 'ATK', defense: 'DEF',
			'special-attack': 'SP.A', 'special-defense': 'SP.D', speed: 'SPD'
		};
		return names[name] || name.toUpperCase();
	}

	function getTypeStyle(type: string) {
		const colors: Record<string, string> = {
			normal: 'text-gray-400 border-gray-400/50 bg-gray-400/10',
			fire: 'text-orange-400 border-orange-400/50 bg-orange-400/10 shadow-[0_0_10px_rgba(251,146,60,0.2)]',
			water: 'text-blue-400 border-blue-400/50 bg-blue-400/10 shadow-[0_0_10px_rgba(96,165,250,0.2)]',
			grass: 'text-green-400 border-green-400/50 bg-green-400/10 shadow-[0_0_10px_rgba(74,222,128,0.2)]',
			electric: 'text-yellow-400 border-yellow-400/50 bg-yellow-400/10 shadow-[0_0_10px_rgba(250,204,21,0.2)]',
			ice: 'text-cyan-300 border-cyan-300/50 bg-cyan-300/10',
			fighting: 'text-red-500 border-red-500/50 bg-red-500/10',
			poison: 'text-purple-400 border-purple-400/50 bg-purple-400/10',
			ground: 'text-yellow-600 border-yellow-600/50 bg-yellow-600/10',
			flying: 'text-indigo-300 border-indigo-300/50 bg-indigo-300/10',
			psychic: 'text-pink-400 border-pink-400/50 bg-pink-400/10',
			bug: 'text-lime-400 border-lime-400/50 bg-lime-400/10',
			rock: 'text-yellow-700 border-yellow-700/50 bg-yellow-700/10',
			ghost: 'text-indigo-400 border-indigo-400/50 bg-indigo-400/10',
			dragon: 'text-violet-500 border-violet-500/50 bg-violet-500/10',
			dark: 'text-gray-600 border-gray-600/50 bg-gray-600/10',
			steel: 'text-slate-400 border-slate-400/50 bg-slate-400/10',
			fairy: 'text-pink-300 border-pink-300/50 bg-pink-300/10'
		};
		return colors[type] || 'text-gray-300 border-white/10 bg-white/5';
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

	async function prefetchPokemon(name: string) {
		try {
			const poke = await pokeApi.getPokemon(name);
			if (poke) {
				await pokeApi.getPokemonSpecies(poke.species.name);
			}
		} catch (e) { }
	}

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

		if (keepScroll && modalContentElement) {
			await tick();
			modalContentElement.scrollTop = currentScroll;
		}

		try {
			const newDetail = await pokeApi.getPokemon(pokemon.name);
			const newSpecies = await pokeApi.getPokemonSpecies(newDetail.species.name);
			
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

			if (keepScroll && modalContentElement) {
				await tick();
				modalContentElement.scrollTop = currentScroll;
			}

			secondaryLoading = true;
			
			const abilityPromises = newDetail.abilities.map(a => pokeApi.getAbility(a.ability.name));
			const newAbilities = await Promise.all(abilityPromises);

			const evoId = parseInt(newSpecies.evolution_chain.url.split('/').filter(Boolean).pop() || '0');
			const evoData = await pokeApi.getEvolutionChain(evoId);
			
			let chain: any[] = [];
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

		} catch (error) {
			console.error(error);
		} finally {
			detailLoading = false;
			secondaryLoading = false;
		}
	}

	function playCry() {
		if (!detailData || isPlayingCry) return;
		// @ts-ignore
		const cryUrl = detailData.cries?.latest || detailData.cries?.legacy;
		if (cryUrl) {
			isPlayingCry = true;
			const audio = new Audio(cryUrl);
			audio.onended = () => (isPlayingCry = false);
			audio.onerror = () => (isPlayingCry = false);
			audio.play();
		}
	}

	function navigateToEvo(name: string) {
		const target = allPokemons.find((p) => p.name === name);
		if (target) openDetail(target, true);
	}

	function toggleFavorite(pokemonName: string, event: MouseEvent) {
		event.stopPropagation();
		if (favorites.has(pokemonName)) {
			favorites.delete(pokemonName);
		} else {
			favorites.add(pokemonName);
		}
		favorites = new Set(favorites);
		localStorage.setItem('poke_favorites', JSON.stringify(Array.from(favorites)));
	}

	function closeDetail() {
		selectedPokemon = null;
		detailData = null;
		speciesData = null;
		abilitiesDetails = [];
		specialForms = [];
	}

	function handleModalKeyDown(event: KeyboardEvent) {
		if (event.key === 'Escape') closeDetail();
	}

	async function fetchByType(type: string) {
		typeLoading = true;
		try {
			const data = await pokeApi.getPokemonsByType(type);
			const names = data.pokemon.map((p: any) => p.pokemon.name);
			typeFilteredNames = new Set(names);
		} catch (error) {
			console.error('Gagal fetch tipe:', error);
		} finally {
			typeLoading = false;
		}
	}

	$effect(() => {
		if (selectedType) {
			fetchByType(selectedType);
		} else {
			typeFilteredNames = new Set();
		}
	});

	async function fetchAllPokemons() {
		loading = true;
		try {
			const data = await pokeApi.getAllPokemon();
			allPokemons = data.results;
		} catch (error) {
			console.error(error);
		} finally {
			loading = false;
		}
	}

	// Filter Logic
	let filteredPokemons = $derived.by(() => {
		let res = allPokemons;
		if (searchQuery) {
			res = res.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
		}
		if (onlyFavorites) {
			res = res.filter((p) => favorites.has(p.name));
		}
		if (onlyMega) {
			res = res.filter((p) => p.name.toLowerCase().includes('-mega'));
		}
		if (onlyGmax) {
			res = res.filter((p) => p.name.toLowerCase().includes('-gmax'));
		}
		if (selectedType && typeFilteredNames.size > 0) {
			res = res.filter((p) => typeFilteredNames.has(p.name));
		}
		return res;
	});

	let displayedPokemons = $derived(filteredPokemons.slice(0, displayedLimit));

	$effect(() => {
		if (selectedPokemon) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
	});

	$effect(() => {
		if (searchQuery !== null || onlyFavorites || onlyMega || onlyGmax || selectedType) {
			displayedLimit = increment;
		}
	});

	onMount(() => {
		fetchAllPokemons();
		const savedFavs = localStorage.getItem('poke_favorites');
		if (savedFavs) favorites = new Set(JSON.parse(savedFavs));
	});
</script>

<svelte:head>
	<title>Pokédex | Terminal Core</title>
</svelte:head>

<Filters 
	bind:searchQuery 
	bind:onlyFavorites 
	onlyMega={onlyMega}
	onlyGmax={onlyGmax}
	toggleMega={() => {
		onlyMega = !onlyMega;
		if (onlyMega) onlyGmax = false;
	}}
	toggleGmax={() => {
		onlyGmax = !onlyGmax;
		if (onlyGmax) onlyMega = false;
	}}
	bind:selectedType 
	favoritesCount={favorites.size}
	matchesCount={filteredPokemons.length}
	displayedCount={displayedPokemons.length}
/>

<div class="animate-[fadeIn_0.4s_ease-out]">
	{#if loading || (selectedType && typeLoading)}
		<div class="grid grid-cols-2 gap-4">
			{#each Array(6) as _}
				<div
					class="bg-panel/40 flex h-44 animate-pulse flex-col items-center justify-center rounded-xl border border-white/5 p-4"
				>
					<div class="mb-4 h-16 w-16 rounded-full bg-white/5"></div>
					<div class="mt-2 h-3 w-20 rounded-full bg-white/10"></div>
				</div>
			{/each}
		</div>
	{:else}
		{#if displayedPokemons.length > 0}
			<div class="grid grid-cols-2 gap-4">
				{#each displayedPokemons as pokemon (pokemon.name)}
					<PokemonCard
						name={pokemon.name}
						url={pokemon.url}
						isFavorite={favorites.has(pokemon.name)}
						onToggleFavorite={(e) => toggleFavorite(pokemon.name, e)}
						onprefetch={() => prefetchPokemon(pokemon.name)}
						onclick={() => openDetail(pokemon)}
					/>
				{/each}
			</div>

			<div 
				bind:this={observerTarget} 
				class="h-20 w-full flex items-center justify-center"
			>
				{#if displayedLimit < filteredPokemons.length}
					<div class="flex items-center gap-2 text-gray-600 font-orbitron text-[9px] tracking-widest">
						<div class="h-1 w-1 rounded-full bg-neon animate-pulse"></div>
						LOADING MORE POKÉMON...
					</div>
				{/if}
			</div>
		{:else}
			<div class="rounded-xl border border-dashed border-white/10 py-20 text-center">
				<p class="font-orbitron text-xs text-gray-500">NO POKÉMON FOUND</p>
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
	{closeDetail}
	{handleModalKeyDown}
	{playCry}
	{getTypeStyle}
	{formatStatName}
	{navigateToEvo}
	toggleAbilities={() => isAbilitiesExpanded = !isAbilitiesExpanded}
	toggleMoves={() => isMovesExpanded = !isMovesExpanded}
/>

{#if showScrollToTop}
	<button
		onclick={scrollToTop}
		class="bg-primary text-space fixed bottom-24 right-6 z-50 flex h-12 w-12 animate-[fadeIn_0.2s_ease-out] items-center justify-center rounded-[16px] shadow-lg transition-all active:scale-90"
		aria-label="Back to top"
	>
		<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
		</svg>
	</button>
{/if}
