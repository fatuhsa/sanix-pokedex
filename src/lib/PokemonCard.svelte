<script lang="ts">
	import { onMount } from 'svelte';
	import type { Pokemon as PokemonDetail } from 'pokenode-ts';
	import { pokeApi } from './pokeapi';
	import { getTypeStyle } from './styles.svelte';

	interface Props {
		name: string;
		isFavorite: boolean;
		onToggleFavorite: (e: MouseEvent) => void;
		onprefetch: () => void;
		onclick: () => void;
	}

	let { name, isFavorite, onToggleFavorite, onprefetch, onclick }: Props = $props();

	let pokemonData = $state<PokemonDetail | null>(null);
	let loading = $state(true);

	onMount(async () => {
		try {
			pokemonData = await pokeApi.getPokemon(name);
		} catch (error) {
			console.error(error);
		} finally {
			loading = false;
		}
	});
</script>

<div
	role="button"
	tabindex="0"
	onclick={onclick}
	onkeydown={(e) => e.key === 'Enter' && onclick()}
	onmouseenter={onprefetch}
	class="bg-panel m3-shadow-1 group relative flex flex-col items-center overflow-hidden rounded-[28px] p-4 transition-all hover:m3-shadow-2 active:scale-95 cursor-pointer"
>
	{#if loading}
		<div class="mb-3 h-24 w-24 animate-pulse rounded-full bg-surface-variant/30"></div>
		<div class="h-4 w-20 animate-pulse rounded-full bg-surface-variant/20"></div>
	{:else if pokemonData}
		<div class="relative mb-3 flex h-24 w-24 items-center justify-center">
			<div class="absolute inset-0 scale-75 rounded-full bg-primary/5 group-hover:scale-100 transition-transform"></div>
			<img
				src={pokemonData.sprites.other?.['official-artwork'].front_default}
				alt={name}
				class="relative z-10 h-full w-full object-contain drop-shadow-md transition-transform duration-500 group-hover:scale-110"
			/>
		</div>

		<div class="text-center">
			<p class="text-[10px] font-bold tracking-widest text-outline uppercase mb-0.5">
				#{String(pokemonData.id).padStart(3, '0')}
			</p>
			<h3 class="text-sm font-bold capitalize text-[#e6e1e5]">
				{name.replace(/-/g, ' ')}
			</h3>
		</div>

		<div class="mt-3 flex gap-1">
			{#each pokemonData.types as type (type.type.name)}
				<span class="px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full border {getTypeStyle(type.type.name)}">
					{type.type.name}
				</span>
			{/each}
		</div>

		<button
			onclick={onToggleFavorite}
			aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
			class="absolute top-3 right-3 p-2 rounded-full transition-colors {isFavorite ? 'text-primary' : 'text-outline hover:bg-white/5'}"
		>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill={isFavorite ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
			</svg>
		</button>
	{/if}
</div>
