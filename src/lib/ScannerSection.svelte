<script lang="ts">
	import type { Pokemon, PokemonDetail } from '$lib/types';
	import { accent } from '$lib/accent.svelte';

	interface Props {
		isScanning: boolean;
		scanProgress: number;
		dailyPokemon: PokemonDetail | null;
		isShiny: boolean;
		discoveryPercentage: string;
		cooldownRemaining: number;
		getTypeStyle: (type: string) => string;
		activateScanner: () => void;
		openDetail: (pokemon: Pokemon | { name: string; url: string }) => void;
	}

	let { 
		isScanning, 
		scanProgress, 
		dailyPokemon, 
		isShiny,
		discoveryPercentage,
		cooldownRemaining, 
		getTypeStyle, 
		activateScanner, 
		openDetail 
	}: Props = $props();
</script>

<div class="animate-[fadeIn_0.3s_ease-out] pt-0">
	<!-- Standardized Top Bar -->
	<div class="mb-6 flex items-center justify-between border-b border-white/5 pb-4">
		<div>
			<h1 
				onclick={() => accent.cycle()} onkeydown={(e) => e.key === 'Enter' && accent.cycle()} role='button' tabindex='0'
				class="text-2xl font-bold tracking-tight text-white cursor-pointer select-none active:scale-95 transition-transform"
			>
				Scanner
			</h1>
			<p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">
				Collection Progress: {discoveryPercentage}%
			</p>
		</div>
		<div class="flex h-9 w-9 items-center justify-center bg-primary/5 border border-primary/10 rounded-full shadow-[0_0_15px_rgba(0,243,255,0.08)] text-primary">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
			</svg>
		</div>
	</div>

	<div class="bg-panel relative flex min-h-[340px] flex-col items-center justify-center rounded-[28px] border border-white/5 p-6 text-center shadow-sm">
		{#if isScanning}
			<div class="relative mb-6 h-32 w-32 flex items-center justify-center">
				<div class="absolute inset-0 border border-white/5 rounded-full"></div>
				<svg class="absolute inset-0 h-full w-full -rotate-90">
					<circle
						cx="64"
						cy="64"
						r="60"
						fill="transparent"
						stroke="currentColor"
						stroke-width="3"
						stroke-dasharray="377"
						stroke-dashoffset={377 - (377 * scanProgress) / 100}
						class="text-primary transition-all duration-300 ease-out"
					/>
				</svg>
				<div class="flex flex-col items-center">
					<span class="text-2xl font-bold text-white">{scanProgress}%</span>
					<span class="text-[8px] font-bold text-gray-500 uppercase">Processing</span>
				</div>
			</div>
			<p class="text-xs font-bold text-primary animate-pulse uppercase tracking-wider">Looking for Pokémon...</p>
		{:else}
			{#if dailyPokemon}
				<div class="animate-[fadeIn_0.5s_ease-out] w-full flex flex-col items-center">
					<div class="flex items-center gap-2 mb-4">
						<div class="bg-primary/10 px-3 py-0.5 rounded-full border border-primary/20">
							<p class="text-[8px] font-bold text-primary tracking-widest uppercase">Pokémon Found</p>
						</div>
						{#if isShiny}
							<div class="bg-yellow-500/10 px-3 py-0.5 rounded-full border border-yellow-500/30 animate-pulse">
								<p class="text-[8px] font-bold text-yellow-500 tracking-widest uppercase flex items-center gap-1">
									✨ SHINY
								</p>
							</div>
						{/if}
					</div>

					<div class="relative mb-2 group">
						<div class="bg-primary/5 absolute inset-0 rounded-full blur-2xl scale-110 opacity-40"></div>
						{#if isShiny}
							<div class="absolute inset-0 bg-yellow-400/10 rounded-full blur-3xl scale-125 opacity-30 animate-pulse"></div>
						{/if}
						<img
							src={isShiny ? (dailyPokemon.sprites.other?.['official-artwork']?.front_shiny || dailyPokemon.sprites.other?.['official-artwork']?.front_default) : dailyPokemon.sprites.other?.['official-artwork']?.front_default}
							alt={dailyPokemon.name}
							class="relative z-10 h-32 w-32 object-contain drop-shadow-xl transition-transform duration-500 group-hover:scale-105"
						/>
					</div>

					<h3 class="mb-1 text-xl font-bold text-white capitalize tracking-tight">
						{dailyPokemon.name}
					</h3>
					
					<div class="mb-6 flex justify-center gap-1.5">
						{#each dailyPokemon.types as type (type.type.name)}
							<span class="rounded-lg px-3 py-0.5 text-[9px] font-bold uppercase border {getTypeStyle(type.type.name)}">
								{type.type.name}
							</span>
						{/each}
					</div>

					<button
						onclick={() =>
							openDetail({
								name: dailyPokemon!.name,
								url: `https://pokeapi.co/api/v2/pokemon/${dailyPokemon!.id}/`
							})}
						class="bg-white/5 hover:bg-white/10 text-white font-bold w-full rounded-xl py-3 text-[10px] tracking-wide transition-all active:scale-95 border border-white/5"
					>
						VIEW DETAILS
					</button>
				</div>
			{:else}
				<div class="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-surface-variant/10 border border-dashed border-white/5">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
					</svg>
				</div>
				<h3 class="text-sm font-bold text-white mb-1">Scanner Idle</h3>
				<p class="text-[10px] font-medium text-gray-600 max-w-[160px] leading-snug">
					Initiate a scan to detect nearby Pokémon
				</p>
			{/if}

			<div class="mt-6 w-full">
				{#if cooldownRemaining > 0}
					<button disabled class="bg-surface-variant/10 text-gray-600 font-bold h-12 w-full rounded-xl border border-white/5 text-[10px] tracking-widest flex items-center justify-center gap-2">
						<div class="h-1 w-1 rounded-full bg-gray-700 animate-ping"></div>
						COOLDOWN ({cooldownRemaining}s)
					</button>
				{:else}
					<button
						onclick={activateScanner}
						class="bg-primary text-space font-bold h-12 w-full rounded-xl text-[10px] tracking-widest transition-all hover:opacity-90 active:scale-[0.98] shadow-md shadow-primary/5 uppercase"
					>
						{dailyPokemon ? 'Scan Again' : 'Start Scanning'}
					</button>
				{/if}
			</div>
		{/if}
	</div>
</div>
