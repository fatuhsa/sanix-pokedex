<script lang="ts">
	import type { EvolutionStep } from '$lib/types';
	import { fade } from 'svelte/transition';
	import EvolutionGraph from './EvolutionGraph.svelte';

	interface Props {
		node: EvolutionStep;
		currentPokemonName: string;
		navigateToEvo: (name: string) => void;
		isRoot?: boolean;
	}

	let { node, currentPokemonName, navigateToEvo, isRoot = true }: Props = $props();

	const spriteUrl = (id: number) => 
		`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
</script>

<div class="flex items-center {isRoot ? 'w-full justify-start md:justify-center py-6 px-4 overflow-x-auto custom-scrollbar gap-0' : 'gap-0'}">
	<!-- Connection Arrow (Incoming) -->
	{#if !isRoot}
		<div class="flex flex-col items-center min-w-[40px] px-1 shrink-0">
			{#if node.requirements}
				<div class="px-1.5 py-0.5 rounded-full bg-surface-variant/30 border border-white/5 mb-1 shadow-sm">
					<span class="text-[6px] font-black text-primary uppercase whitespace-nowrap tracking-tighter">
						{node.requirements}
					</span>
				</div>
			{/if}
			<div class="flex items-center w-full justify-center">
				<div class="h-[1px] w-full bg-gradient-to-r from-transparent via-primary/40 to-primary/60"></div>
				<div class="text-primary/60 text-[8px] ml-[-3px] select-none">▶</div>
			</div>
		</div>
	{/if}

	<!-- Pokémon Node -->
	<div class="flex flex-col items-center shrink-0">
		<button
			onclick={() => navigateToEvo(node.name)}
			class="relative flex flex-col items-center p-2 rounded-2xl transition-all duration-300 w-20 h-20 justify-center group overflow-hidden
			{node.name === currentPokemonName 
				? 'bg-primary/10 border-2 border-primary/40 shadow-[0_0_20px_rgba(208,188,255,0.2)]' 
				: 'bg-surface-variant/20 hover:bg-surface-variant/40 border border-white/5'}"
			style="box-sizing: border-box;"
		>
			{#if node.name === currentPokemonName}
				<div class="absolute inset-0 bg-primary/5 animate-pulse"></div>
			{/if}
			<img 
				src={spriteUrl(node.id)} 
				alt={node.name}
				class="relative z-10 h-10 w-10 object-contain drop-shadow-md group-hover:scale-110 transition-transform mb-1"
				loading="lazy"
			/>
			<span class="relative z-10 text-[8px] font-black uppercase tracking-tighter text-center leading-tight px-1
				{node.name === currentPokemonName ? 'text-primary' : 'text-gray-400 group-hover:text-white'}">
				{node.name.replace(/-/g, ' ')}
			</span>
		</button>
	</div>

	<!-- Children (Evolutions) -->
	{#if node.evolves_to.length > 0}
		<div class="flex flex-col justify-center gap-6 ml-0">
			{#each node.evolves_to as child (child.name)}
				<EvolutionGraph 
					node={child} 
					{currentPokemonName} 
					{navigateToEvo} 
					isRoot={false} 
				/>
			{/each}
		</div>
	{/if}
</div>

<style>
	.custom-scrollbar::-webkit-scrollbar {
		height: 4px;
	}
	.custom-scrollbar::-webkit-scrollbar-track {
		background: rgba(255, 255, 255, 0.05);
		border-radius: 10px;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: rgba(208, 188, 255, 0.2);
		border-radius: 10px;
	}
</style>
