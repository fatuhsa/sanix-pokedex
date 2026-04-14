<script lang="ts">
	import type { Pokemon, PokemonDetail, SpeciesData, EvolutionStep, SpecialForm } from '$lib/types';
	import type { Ability } from 'pokenode-ts';
	import { fade } from 'svelte/transition';

	interface MoveInfo {
		name: string;
		method: string;
		level: number;
	}

	interface Props {
		selectedPokemon: Pokemon | null;
		detailData: PokemonDetail | null;
		speciesData: SpeciesData | null;
		abilitiesDetails: Ability[];
		evolutionChain: EvolutionStep[];
		specialForms: SpecialForm[];
		detailLoading: boolean;
		secondaryLoading: boolean;
		isPlayingCry: boolean;
		isAbilitiesExpanded: boolean;
		isMovesExpanded: boolean;
		selectedVersionGroup: string;
		selectedMoveMethod: 'level-up' | 'machine' | 'all';
		availableVersionGroups: string[];
		filteredMoves: MoveInfo[];
		modalContentElement: HTMLElement | null;
		closeDetail: () => void;
		handleModalKeyDown: (e: KeyboardEvent) => void;
		playCry: () => void;
		getTypeStyle: (type: string) => string;
		formatStatName: (name: string) => string;
		navigateToEvo: (name: string) => void;
	}

	let { 
		selectedPokemon, 
		detailData, 
		speciesData, 
		abilitiesDetails, 
		evolutionChain, 
		specialForms,
		detailLoading,
		secondaryLoading,
		isPlayingCry,
		isAbilitiesExpanded = $bindable(),
		isMovesExpanded = $bindable(),
		selectedVersionGroup = $bindable(),
		selectedMoveMethod = $bindable(),
		availableVersionGroups,
		filteredMoves,
		modalContentElement = $bindable(),
		closeDetail,
		handleModalKeyDown,
		playCry,
		getTypeStyle,
		formatStatName,
		navigateToEvo
	}: Props = $props();
</script>

{#if selectedPokemon}
	<div
		class="bg-black/60 fixed inset-0 z-[60] animate-[fadeIn_0.2s_ease-out] backdrop-blur-sm"
		onclick={closeDetail}
		onkeydown={handleModalKeyDown}
		role="button"
		tabindex="-1"
		aria-label="Close detail modal"
	></div>

	<div
		class="bg-panel fixed bottom-0 left-0 z-[70] flex max-h-[90vh] w-full flex-col transform animate-[slideUp_0.4s_cubic-bezier(0.2,0.8,0.2,1)] rounded-t-[28px] shadow-2xl transition-transform border-t border-white/5"
	>
		<!-- Header - Compact -->
		<div class="px-6 pt-2 pb-2">
			<div class="h-1 w-10 rounded-full bg-white/10 mx-auto mb-3"></div>
			<div class="flex items-center justify-between">
				<p class="text-[10px] font-bold text-primary tracking-widest uppercase">
					#{String(detailData?.id || 0).padStart(3, '0')} LOG_ENTRY
				</p>
				<button onclick={closeDetail} aria-label="Close modal" class="text-gray-500 p-1.5 hover:text-white transition-colors">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>
		</div>

		<!-- Scrollable Content -->
		<div 
			bind:this={modalContentElement}
			class="flex-1 overflow-y-auto px-6 pb-10 custom-scrollbar"
		>
			{#if !detailData && detailLoading}
				<div class="flex w-full flex-col items-center animate-pulse">
					<!-- Main Info Skeleton -->
					<div class="mt-2 relative mb-2">
						<div class="h-36 w-32 rounded-full bg-surface-variant/30"></div>
					</div>
					<div class="h-8 w-40 rounded-lg bg-surface-variant/30 mb-2"></div>
					<div class="flex gap-1.5 mb-5">
						<div class="h-5 w-16 rounded-lg bg-surface-variant/20"></div>
						<div class="h-5 w-16 rounded-lg bg-surface-variant/20"></div>
					</div>

					<!-- Physical Specs Skeleton -->
					<div class="w-full mb-6 grid grid-cols-2 gap-2">
						<div class="h-10 rounded-xl bg-surface-variant/10 border border-white/5"></div>
						<div class="h-10 rounded-xl bg-surface-variant/10 border border-white/5"></div>
					</div>

					<!-- Flavor Text Skeleton -->
					<div class="w-full h-16 rounded-xl bg-surface-variant/5 border-l-2 border-white/10 mb-8"></div>

					<!-- Evolution Chain Skeleton -->
					<div class="w-full mb-8">
						<div class="h-3 w-24 bg-surface-variant/20 mb-3 rounded"></div>
						<div class="h-8 w-full bg-surface-variant/10 rounded-lg"></div>
					</div>

					<!-- Stats Skeleton -->
					<div class="w-full mb-8">
						<div class="h-3 w-24 bg-surface-variant/20 mb-4 rounded"></div>
						<div class="space-y-3">
							{#each Array(6) as _, i (i)}
								<div class="flex items-center gap-3">
									<div class="h-2 w-10 bg-surface-variant/20 rounded"></div>
									<div class="flex-1 h-1.5 bg-surface-variant/10 rounded-full"></div>
								</div>
							{/each}
						</div>
					</div>
				</div>
			{:else if detailData && speciesData}
				<div 
					in:fade={{ duration: 300 }}
					class="mt-2 flex flex-col items-center {detailLoading ? 'opacity-30 blur-[2px] pointer-events-none' : ''} transition-all duration-300"
				>
					<!-- Main Info - More Compact -->
					<div class="relative mb-2">
						<div class="bg-primary/5 absolute inset-0 rounded-full blur-2xl opacity-50"></div>
						<img
							src={detailData.sprites.other?.['official-artwork'].front_default}
							alt={detailData.name}
							class="relative z-10 h-36 w-32 object-contain drop-shadow-xl transition-all duration-500 {detailLoading ? 'scale-90 opacity-0' : 'scale-100 opacity-100'}"
						/>
					</div>
					
					<div class="flex items-center gap-3 mb-2">
						<h2 class="text-2xl font-bold tracking-tight text-white capitalize">
							{detailData.name}
						</h2>
						<button
							onclick={playCry}
							class="text-primary hover:scale-110 active:scale-95 transition-transform"
							title="Play Cry"
						>
							{#if isPlayingCry}
								<div class="flex items-center gap-0.5 h-5">
									<div class="h-2 w-0.5 animate-bounce bg-primary"></div>
									<div class="h-3 w-0.5 animate-bounce bg-primary" style="animation-delay: 0.1s"></div>
									<div class="h-2 w-0.5 animate-bounce bg-primary" style="animation-delay: 0.2s"></div>
								</div>
							{:else}
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
								</svg>
							{/if}
						</button>
					</div>

					<div class="mb-5 flex gap-1.5">
						{#each detailData.types as type (type.type.name)}
							<span class="rounded-lg px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider border {getTypeStyle(type.type.name)}">
								{type.type.name}
							</span>
						{/each}
					</div>
				</div>

				<!-- Physical Specs - Compact Grid -->
				<div class="mb-6 grid grid-cols-2 gap-2">
					<div class="bg-surface-variant/20 flex items-center justify-center gap-3 rounded-xl p-2.5 border border-white/5">
						<span class="text-[9px] font-bold text-gray-500 uppercase">HT</span>
						<span class="text-xs font-bold text-white">{detailData.height / 10}m</span>
					</div>
					<div class="bg-surface-variant/20 flex items-center justify-center gap-3 rounded-xl p-2.5 border border-white/5">
						<span class="text-[9px] font-bold text-gray-500 uppercase">WT</span>
						<span class="text-xs font-bold text-white">{detailData.weight / 10}kg</span>
					</div>
				</div>

				<!-- Flavor Text - More Subtle -->
				<div class="bg-white/[0.02] rounded-xl p-4 mb-8 border-l-2 border-primary/30">
					<p class="text-[11px] leading-relaxed text-gray-400 font-medium italic">
						"{speciesData.flavor_text_entries.find((e) => e.language.name === 'en')
							?.flavor_text.replace(/[\n\f\r]/g, ' ') || 'No data found.'}"
					</p>
				</div>

				<!-- Evolution Path - Compact -->
				<section class="mb-8">
					<h3 class="text-[10px] font-bold text-gray-500 mb-3 tracking-widest uppercase">EVOLUTION CHAIN</h3>
					{#if secondaryLoading && evolutionChain.length === 0}
						<div class="h-8 w-full animate-pulse rounded-lg bg-surface-variant/30"></div>
					{:else if evolutionChain.length > 0}
						<div class="flex flex-wrap items-center gap-1.5">
							{#each evolutionChain as evo, index (evo.name)}
								<button
									onclick={() => navigateToEvo(evo.name)}
									class="rounded-lg px-3 py-1.5 text-[10px] font-bold transition-all {evo.name === detailData.name
										? 'bg-primary text-space'
										: 'bg-surface-variant/40 text-gray-400 hover:text-white'}"
								>
									{evo.name}
								</button>
								{#if index < evolutionChain.length - 1}
									<span class="text-gray-700 text-xs font-bold">→</span>
								{/if}
							{/each}
						</div>
					{/if}
				</section>

				<!-- Base Stats - Returned to UX-Friendly Bars -->
				<section class="mb-8">
					<h3 class="text-[10px] font-bold text-gray-500 mb-4 tracking-widest uppercase">BASE STATS</h3>
					<div class="space-y-2.5">
						{#each detailData.stats as stat (stat.stat.name)}
							<div class="flex items-center text-[10px] font-bold">
								<span class="w-14 text-gray-500 uppercase tracking-tighter">{formatStatName(stat.stat.name)}</span>
								<span class="w-8 text-right text-white mr-3">{stat.base_stat}</span>
								<div class="flex-1 bg-surface-variant h-1.5 rounded-full overflow-hidden">
									<div
										class="bg-primary h-full transition-all duration-1000 ease-out shadow-[0_0_5px_rgba(208,188,255,0.2)]"
										style="width: {Math.min((stat.base_stat / 150) * 100, 100)}%"
									></div>
								</div>
							</div>
						{/each}
					</div>
				</section>

				<!-- Abilities & Moves - Compact Accordions -->
				<div class="space-y-2">
					<button 
						onclick={() => isAbilitiesExpanded = !isAbilitiesExpanded}
						class="flex w-full items-center justify-between bg-surface-variant/10 hover:bg-surface-variant/20 rounded-xl p-3 px-4 transition-colors border border-white/5"
					>
						<span class="text-[10px] font-bold text-white uppercase tracking-wider">ABILITIES</span>
						<div class="flex items-center gap-3">
							{#if secondaryLoading && abilitiesDetails.length === 0}
								<div class="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></div>
							{/if}
							<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-gray-500 transition-transform {isAbilitiesExpanded ? 'rotate-180' : ''}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7" />
							</svg>
						</div>
					</button>
					
					{#if isAbilitiesExpanded}
						<div class="space-y-2 px-1 py-1 animate-[fadeIn_0.2s_ease-out]">
							{#each abilitiesDetails as ability (ability.name)}
								<div class="bg-surface-variant/5 rounded-xl p-3.5 border border-white/5">
									<div class="flex items-center gap-2 mb-1">
										<span class="text-[10px] font-bold text-primary uppercase">{ability.name.replace(/-/g, ' ')}</span>
										{#if detailData.abilities.find(a => a.ability.name === ability.name)?.is_hidden}
											<span class="text-[8px] text-gray-500 font-bold uppercase opacity-60">Hidden</span>
										{/if}
									</div>
									<p class="text-[10px] text-gray-400 leading-normal">
										{ability.effect_entries.find(e => e.language.name === 'en')?.short_effect || 'No description.'}
									</p>
								</div>
							{/each}
						</div>
					{/if}

					<button 
						onclick={() => isMovesExpanded = !isMovesExpanded}
						class="flex w-full items-center justify-between bg-surface-variant/10 hover:bg-surface-variant/20 rounded-xl p-3 px-4 transition-colors border border-white/5"
					>
						<span class="text-[10px] font-bold text-white uppercase tracking-wider">MOVE SET</span>
						<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-gray-500 transition-transform {isMovesExpanded ? 'rotate-180' : ''}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7" />
						</svg>
					</button>
					
					{#if isMovesExpanded}
						<div class="py-2 animate-[fadeIn_0.2s_ease-out]">
							<div class="grid grid-cols-2 gap-2 mb-3">
								<select bind:value={selectedVersionGroup} class="bg-surface-variant/30 border border-white/5 rounded-lg px-2 py-1.5 text-[10px] font-bold text-primary outline-none">
									{#each availableVersionGroups as version (version)}
										<option value={version}>{version.replace(/-/g, ' ')}</option>
									{/each}
								</select>
								<select bind:value={selectedMoveMethod} class="bg-surface-variant/30 border border-white/5 rounded-lg px-2 py-1.5 text-[10px] font-bold text-white outline-none">
									<option value="all">ALL</option>
									<option value="level-up">LVL</option>
									<option value="machine">TM</option>
								</select>
							</div>
							<div class="grid grid-cols-1 gap-1">
								{#each filteredMoves as move (move.name)}
									<div class="flex items-center justify-between bg-surface-variant/5 rounded-lg p-2 px-3">
										<span class="text-[10px] font-bold text-white uppercase">{move.name}</span>
										<span class="text-[9px] font-bold text-primary">{move.level ? 'LV.'+move.level : '--'}</span>
									</div>
								{/each}
							</div>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	@keyframes slideUp {
		from { transform: translateY(100%); }
		to { transform: translateY(0); }
	}
	@keyframes loading {
		0% { transform: translateX(-100%); }
		100% { transform: translateX(100%); }
	}
	.custom-scrollbar::-webkit-scrollbar {
		width: 4px;
	}
	.custom-scrollbar::-webkit-scrollbar-track {
		background: transparent;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: rgba(255, 255, 255, 0.1);
		border-radius: 10px;
	}
</style>
