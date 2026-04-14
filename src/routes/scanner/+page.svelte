<script lang="ts">
	import ScannerSection from '$lib/ScannerSection.svelte';
	import PokemonDetailModal from '$lib/PokemonDetailModal.svelte';
	import { onMount, tick } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import { pokeApi } from '$lib/pokeapi';
	import { getTypeStyle } from '$lib/styles.svelte';
	import type { Pokemon, PokemonDetail, SpeciesData, EvolutionStep, SpecialForm } from '$lib/types';
	import type { Ability } from 'pokenode-ts';

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

	// --- SCANNER State ---
	let dailyPokemon = $state<PokemonDetail | null>(null);
	let isShiny = $state(false);
	let isScanning = $state(false);
	let scanProgress = $state(0);
	let lastScanTime = $state<number>(0);
	let currentTime = $state<number>(Date.now());
	let discoveredIds = new SvelteSet<number>();
	let shinyIds = new SvelteSet<number>();

	let discoveryPercentage = $derived(
		((discoveredIds.size / 1025) * 100).toFixed(1)
	);

	let cooldownRemaining = $derived(
		Math.max(0, Math.ceil((lastScanTime + 5000 - currentTime) / 1000))
	);

	$effect(() => {
		if (cooldownRemaining > 0) {
			const interval = setInterval(() => {
				currentTime = Date.now();
			}, 100);
			return () => clearInterval(interval);
		}
	});

	// --- Helpers ---
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

	function navigateToEvo(name: string) {
		openDetail({ 
			name, 
			url: `https://pokeapi.co/api/v2/pokemon/${name}/` 
		}, true);
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

	function closeDetail() {
		selectedPokemon = null;
	}

	async function activateScanner() {
		if (isScanning || cooldownRemaining > 0) return;
		isScanning = true;
		scanProgress = 0;
		dailyPokemon = null;

		const startTime = Date.now();
		const minScanDuration = 2000;
		let fetchDone = false;
		let fetchedPokemon: PokemonDetail | null = null;

		(async () => {
			try {
				const randomId = Math.floor(Math.random() * 1025) + 1;
				fetchedPokemon = await pokeApi.getPokemonById(randomId) as unknown as PokemonDetail;
				fetchDone = true;
			} catch (e) {
				fetchDone = true;
			}
		})();

		const interval = setInterval(() => {
			const elapsed = Date.now() - startTime;
			if (!fetchDone) {
				if (scanProgress < 90) scanProgress += 1;
			} else {
				if (elapsed >= minScanDuration) {
					scanProgress += 5;
					if (scanProgress >= 100) {
						scanProgress = 100;
						clearInterval(interval);
						completeScan(fetchedPokemon);
					}
				} else {
					if (scanProgress < 95) scanProgress += 2;
				}
			}
		}, 30);
	}

	function completeScan(pokemon: PokemonDetail | null) {
		if (pokemon) {
			dailyPokemon = pokemon;
			isShiny = Math.random() < 0.01; // 1% chance
			lastScanTime = Date.now();
			currentTime = Date.now();

			// Add to discovered
			discoveredIds.add(pokemon.id);
			localStorage.setItem('discovered_pokemon_ids', JSON.stringify(Array.from(discoveredIds)));
			
			if (isShiny) {
				shinyIds.add(pokemon.id);
				localStorage.setItem('shiny_pokemon_ids', JSON.stringify(Array.from(shinyIds)));
			}
			
			localStorage.setItem('last_scan_time', lastScanTime.toString());
			localStorage.setItem('daily_pokemon', JSON.stringify(dailyPokemon));
			localStorage.setItem('is_shiny_scan', isShiny.toString());
		}
		isScanning = false;
	}

	onMount(() => {
		const savedTime = localStorage.getItem('last_scan_time');
		const savedPoke = localStorage.getItem('daily_pokemon');
		const savedShiny = localStorage.getItem('is_shiny_scan');
		const savedDiscovered = localStorage.getItem('discovered_pokemon_ids');
		const savedShinyIds = localStorage.getItem('shiny_pokemon_ids');
		
		if (savedTime) lastScanTime = parseInt(savedTime);
		if (savedPoke) dailyPokemon = JSON.parse(savedPoke);
		if (savedShiny) isShiny = savedShiny === 'true';
		if (savedDiscovered) {
			JSON.parse(savedDiscovered).forEach((id: number) => discoveredIds.add(id));
		}
		if (savedShinyIds) {
			JSON.parse(savedShinyIds).forEach((id: number) => shinyIds.add(id));
		}
	});

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
</script>

<svelte:head>
	<title>Scanner | Sanix Pokedex</title>
</svelte:head>

<ScannerSection 
	{isScanning} 
	{scanProgress} 
	{dailyPokemon} 
	{isShiny}
	{discoveryPercentage}
	{cooldownRemaining}
	{getTypeStyle}
	{activateScanner}
	{openDetail}
/>

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
	handleModalKeyDown={(e) => e.key === 'Escape' && closeDetail()}
	{playCry}
	{getTypeStyle}
	{formatStatName}
	{navigateToEvo}
/>
