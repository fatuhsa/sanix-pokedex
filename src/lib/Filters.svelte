<script lang="ts">
	import { POKEMON_TYPES } from '$lib/types';
	import { accent } from '$lib/accent.svelte';

	interface Props {
		searchQuery: string;
		onlyFavorites: boolean;
		onlyMega: boolean;
		onlyGmax: boolean;
		toggleMega: () => void;
		toggleGmax: () => void;
		selectedType: string | null;
		favoritesCount: number;
		matchesCount: number;
		displayedCount: number;
	}

	let { 
		searchQuery = $bindable(''), 
		onlyFavorites = $bindable(false), 
		onlyMega,
		onlyGmax,
		toggleMega,
		toggleGmax,
		selectedType = $bindable(null),
		favoritesCount,
		matchesCount,
		displayedCount
	}: Props = $props();
</script>

<header class="mb-6 animate-[fadeIn_0.3s_ease-out]">
	<!-- M3 Top Bar -->
	<div class="mb-6 flex items-center justify-between pb-4">
		<div>
			<h1 
				onclick={() => accent.cycle()}
				onkeydown={(e) => e.key === 'Enter' && accent.cycle()}
				role="button"
				tabindex="0"
				class="text-2xl font-bold tracking-tight text-[#e6e1e5] cursor-pointer select-none active:scale-95 transition-transform"
			>
				Pokédex
			</h1>
			<p class="text-[11px] font-bold text-outline uppercase tracking-widest mt-0.5">
				{matchesCount} Matches // {displayedCount} Showing
			</p>
		</div>
		<div class="flex h-9 w-9 items-center justify-center bg-primary/5 border border-primary/10 rounded-full shadow-[0_0_15px_rgba(0,243,255,0.08)] text-primary">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
			</svg>
		</div>
	</div>

	<!-- M3 Search Bar -->
	<div class="relative mb-6">
		<div
			class="bg-panel flex items-center rounded-[28px] border border-white/5 px-5 py-3.5 shadow-md transition-all focus-within:ring-2 focus-within:ring-primary/30"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="mr-3 h-5 w-5 text-outline"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
				/></svg
			>
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Search Pokémon..."
				class="w-full border-none bg-transparent text-sm font-medium text-[#e6e1e5] placeholder-outline outline-none"
			/>
		</div>
	</div>

	<!-- M3 Filter Chips -->
	<div class="flex flex-wrap items-center gap-2">
		<button
			onclick={() => (onlyFavorites = !onlyFavorites)}
			class="flex h-10 items-center gap-2 rounded-xl border px-4 text-[11px] font-bold transition-all whitespace-nowrap {onlyFavorites
				? 'border-primary bg-primary text-panel'
				: 'border-white/10 bg-panel text-outline hover:bg-surface-variant/20'}"
		>
			Favorites ({favoritesCount})
		</button>

		<button
			onclick={toggleMega}
			class="h-10 rounded-xl border px-4 text-[11px] font-bold transition-all {onlyMega
				? 'border-primary bg-primary text-panel'
				: 'border-white/10 bg-panel text-outline hover:bg-surface-variant/20'}"
		>
			MEGA
		</button>

		<button
			onclick={toggleGmax}
			class="h-10 rounded-xl border px-4 text-[11px] font-bold transition-all {onlyGmax
				? 'border-primary bg-primary text-panel'
				: 'border-white/10 bg-panel text-outline hover:bg-surface-variant/20'}"
		>
			G-MAX
		</button>

		<div class="relative flex-1 min-w-[120px]">
			<select 
				bind:value={selectedType}
				class="h-10 w-full appearance-none bg-panel border border-white/10 rounded-xl px-4 pr-10 text-[11px] font-bold text-outline outline-none hover:bg-surface-variant/20 transition-all cursor-pointer"
			>
				<option value={null}>ALL TYPES</option>
				{#each POKEMON_TYPES as type (type)}
					<option value={type}>{type.toUpperCase()}</option>
				{/each}
			</select>
			<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-outline/50">
				<svg class="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
					<path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
				</svg>
			</div>
		</div>
	</div>
</header>
