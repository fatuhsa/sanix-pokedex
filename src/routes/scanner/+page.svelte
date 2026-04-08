<script lang="ts">
	import ScannerSection from '$lib/ScannerSection.svelte';
	import PokemonDetailModal from '$lib/PokemonDetailModal.svelte';
	import { onMount, tick } from 'svelte';
	import { pokeApi } from '$lib/pokeapi';
	import { getTypeStyle } from '$lib/styles.svelte';
	import type { Pokemon } from '$lib/types';
	import type { Pokemon as PokemonDetail, PokemonSpecies, Ability } from 'pokenode-ts';

	// --- Detail Panel State (Kopi dari +page.svelte) ---
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
	let discoveredIds = $state<Set<number>>(new Set());
	let shinyIds = $state<Set<number>>(new Set());

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

	async function openDetail(pokemon: any, keepScroll = false) {
		const currentScroll = modalContentElement?.scrollTop || 0;
		selectedPokemon = pokemon;
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
		// @ts-ignore
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

		const fetchPromise = (async () => {
			try {
				const randomId = Math.floor(Math.random() * 1025) + 1;
				fetchedPokemon = await pokeApi.getPokemonById(randomId);
				fetchDone = true;
			} catch (error) {
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
			discoveredIds = new Set(JSON.parse(savedDiscovered));
		}
		if (savedShinyIds) {
			shinyIds = new Set(JSON.parse(savedShinyIds));
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
	<title>Scanner | Terminal Core</title>
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
	toggleAbilities={() => isAbilitiesExpanded = !isAbilitiesExpanded}
	toggleMoves={() => isMovesExpanded = !isMovesExpanded}
/>
