<script lang="ts">
	import { POKEMON_TYPES } from '$lib/types';

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
	<!-- Standardized Top Bar -->
	<div class="mb-6 flex items-center justify-between border-b border-white/5 pb-4">
		<div>
			<h1 class="text-2xl font-bold tracking-tight text-white">
				Pokédex
			</h1>
			<p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">
				{matchesCount} Matches // {displayedCount} Showing
			</p>
		</div>
		<div class="flex items-center gap-2 bg-primary/5 border border-primary/10 px-2.5 py-1 rounded-full shadow-[0_0_10px_rgba(0,243,255,0.05)]">
			<div class="relative flex h-1.5 w-1.5">
				<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
				<span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
			</div>
			<span class="text-[9px] font-bold text-primary uppercase tracking-[0.15em]">Live</span>
		</div>
	</div>

	<!-- Search Bar - Material Surface Style -->
	<div class="relative mb-6">
		<div
			class="bg-panel flex items-center rounded-2xl border border-white/5 px-4 py-3.5 shadow-sm transition-all focus-within:border-primary/30 focus-within:ring-1 focus-within:ring-primary/30"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="mr-3 h-5 w-5 text-gray-400"
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
				class="w-full border-none bg-transparent text-sm font-medium text-white placeholder-gray-500 outline-none"
			/>
		</div>
	</div>

	<!-- Filter Controls - Pill Shapes -->
	<div class="flex flex-wrap items-center gap-3">
		<button
			onclick={() => (onlyFavorites = !onlyFavorites)}
			class="flex items-center gap-2 rounded-full border px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wide transition-all {onlyFavorites
				? 'border-primary bg-primary text-space'
				: 'border-white/10 bg-surface-variant/30 text-gray-400 hover:border-white/20'}"
		>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill={onlyFavorites ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
			</svg>
			Favorites ({favoritesCount})
		</button>

		<button
			onclick={toggleMega}
			class="flex items-center gap-2 rounded-full border px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wide transition-all {onlyMega
				? 'border-primary bg-primary text-space'
				: 'border-white/10 bg-surface-variant/30 text-gray-400 hover:border-white/20'}"
		>
			MEGA
		</button>

		<button
			onclick={toggleGmax}
			class="flex items-center gap-2 rounded-full border px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wide transition-all {onlyGmax
				? 'border-primary bg-primary text-space'
				: 'border-white/10 bg-surface-variant/30 text-gray-400 hover:border-white/20'}"
		>
			GMAX
		</button>

		<div class="relative flex-1 min-w-[120px]">
			<select
				bind:value={selectedType}
				class="w-full appearance-none rounded-full border border-white/10 bg-surface-variant/30 px-5 py-2.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wide outline-none transition-all focus:border-primary/50 focus:text-white"
			>
				<option value={null}>All Types</option>
				{#each POKEMON_TYPES as type}
					<option value={type}>{type}</option>
				{/each}
			</select>
			<div class="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-500">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
				</svg>
			</div>
		</div>
	</div>
</header>
