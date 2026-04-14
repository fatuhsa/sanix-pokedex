<script lang="ts">
	import { teamStore } from './team.svelte';
	import { calculateTeamCoverage } from './type-chart';
	import { getTypeStyle } from './styles.svelte';
	import { fade, scale } from 'svelte/transition';

	const teamTypes = $derived(teamStore.members.map(m => m.pokemon.types.map(t => t.type.name)));
	const coverage = $derived(calculateTeamCoverage(teamTypes));
	
	const weaknesses = $derived(Object.entries(coverage)
		.filter(([_, score]) => score > 1)
		.sort((a, b) => b[1] - a[1]));

	const resistances = $derived(Object.entries(coverage)
		.filter(([_, score]) => score < 1)
		.sort((a, b) => a[1] - b[1]));

	function getScoreLabel(score: number) {
		if (score >= 4) return 'CRITICAL';
		if (score >= 2) return 'WEAK';
		if (score <= -2) return 'IMMUNE';
		return 'RESIST';
	}
</script>

{#if teamStore.isAnalysisOpen}
	<div 
		transition:fade={{ duration: 200 }}
		class="fixed inset-0 z-[110] bg-space/95 backdrop-blur-xl flex flex-col p-6 overflow-y-auto custom-scrollbar"
	>
		<!-- Header -->
		<div class="flex items-center justify-between mb-8 shrink-0">
			<div>
				<h2 class="text-2xl font-black text-white tracking-tighter uppercase italic">Tactical Report</h2>
				<p class="text-[10px] font-bold text-primary tracking-[0.3em] mt-1 opacity-80">DEFENSIVE COVERAGE</p>
			</div>
			<button 
				onclick={() => teamStore.isAnalysisOpen = false}
				class="bg-white/5 p-3 rounded-full text-gray-400 hover:text-white transition-all active:scale-90"
			>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		</div>

		{#if teamStore.members.length === 0}
			<div class="flex-1 flex flex-col items-center justify-center opacity-30 text-center">
				<p class="text-xs uppercase font-black tracking-widest">No Tactical Data</p>
				<p class="text-[10px] mt-2 max-w-[200px]">Add Pokémon to your combat party to generate a defensive analysis.</p>
			</div>
		{:else}
			<div class="space-y-8 pb-20">
				<!-- Threat Profile -->
				<section>
					<h3 class="text-[10px] font-black text-red-400 tracking-widest uppercase mb-4 flex items-center gap-2">
						<span class="h-1 w-4 bg-red-400/30 rounded-full"></span>
						Primary Threats
					</h3>
					<div class="grid grid-cols-2 gap-3">
						{#each weaknesses as [type, score] (type)}
							<div 
								in:scale={{ duration: 300, start: 0.95 }}
								class="bg-white/5 rounded-2xl p-3 border border-white/5 flex items-center justify-between group"
							>
								<div class="flex items-center gap-3">
									<div 
										class="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
										style={getTypeStyle(type)}
									>
										<span class="text-[10px] font-black text-space uppercase">{type[0]}</span>
									</div>
									<div>
										<p class="text-[10px] font-black text-white uppercase tracking-tighter">{type}</p>
										<p class="text-[7px] font-bold text-red-400 uppercase opacity-80">{getScoreLabel(score)}</p>
									</div>
								</div>
								<div class="text-right">
									<span class="text-lg font-black text-white/20 italic">x{score}</span>
								</div>
							</div>
						{/each}
					</div>
				</section>

				<!-- Fortifications -->
				<section>
					<h3 class="text-[10px] font-black text-green-400 tracking-widest uppercase mb-4 flex items-center gap-2">
						<span class="h-1 w-4 bg-green-400/30 rounded-full"></span>
						Team Resistances
					</h3>
					<div class="grid grid-cols-2 gap-3">
						{#each resistances as [type, score] (type)}
							<div 
								in:scale={{ duration: 300, start: 0.95 }}
								class="bg-white/5 rounded-2xl p-3 border border-white/5 flex items-center justify-between group"
							>
								<div class="flex items-center gap-3">
									<div 
										class="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
										style={getTypeStyle(type)}
									>
										<span class="text-[10px] font-black text-space uppercase">{type[0]}</span>
									</div>
									<div>
										<p class="text-[10px] font-black text-white uppercase tracking-tighter">{type}</p>
										<p class="text-[7px] font-bold text-green-400 uppercase opacity-80">{getScoreLabel(score)}</p>
									</div>
								</div>
								<div class="text-right">
									<span class="text-lg font-black text-white/20 italic">-{Math.abs(score)}</span>
								</div>
							</div>
						{/each}
					</div>
				</section>

				<!-- Tactical Advice -->
				<div class="bg-primary/10 rounded-2xl p-5 border border-primary/20">
					<div class="flex items-start gap-4">
						<div class="bg-primary p-2 rounded-xl text-space">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
								<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
							</svg>
						</div>
						<div>
							<h4 class="text-xs font-black text-white uppercase italic tracking-wide">Tactical Insight</h4>
							<p class="text-[10px] text-primary/80 mt-1 leading-relaxed">
								{#if weaknesses.length > 3}
									Your team has significant defensive gaps. Consider adding a **Steel** or **Normal** type Pokémon to absorb diverse threats.
								{:else if weaknesses.length === 0}
									Impressive defensive synergy! Your party is well-balanced against external threats.
								{:else}
									Strategic balance achieved. Ensure your lead Pokémon can handle your primary threats.
								{/if}
							</p>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
{/if}

<style>
	.custom-scrollbar::-webkit-scrollbar {
		width: 4px;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: rgba(255, 255, 255, 0.1);
		border-radius: 9999px;
	}
</style>
