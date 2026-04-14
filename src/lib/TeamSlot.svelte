<script lang="ts">
	import type { TeamMember } from './team.svelte';
	import { getTypeStyle } from './styles.svelte';
	import { teamStore } from './team.svelte';

	interface Props {
		member: TeamMember;
	}

	let { member }: Props = $props();
</script>

<div class="relative flex flex-col items-center justify-center p-3 bg-surface-variant/20 rounded-2xl border border-white/5 min-h-[140px] group transition-all hover:bg-surface-variant/30">
	<!-- Remove Button -->
	<button 
		onclick={() => teamStore.removeMember(member.id)}
		class="absolute top-1 right-1 h-7 w-7 flex items-center justify-center rounded-full bg-red-500/20 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity active:scale-90"
		aria-label="Remove from team"
	>
		<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
		</svg>
	</button>

	<!-- Sprite -->
	<img 
		src={member.pokemon.sprites.other?.['official-artwork'].front_default} 
		alt={member.pokemon.name}
		class="h-16 w-16 object-contain drop-shadow-md mb-2"
	/>

	<!-- Name -->
	<span class="text-[10px] font-black uppercase tracking-tighter text-white text-center mb-2 line-clamp-1">
		{member.pokemon.name.replace(/-/g, ' ')}
	</span>

	<!-- Types -->
	<div class="flex gap-1">
		{#each member.pokemon.types as { type } (type.name)}
			<div 
				class="px-1.5 py-0.5 rounded-md text-[7px] font-bold uppercase text-space"
				style={getTypeStyle(type.name)}
			>
				{type.name}
			</div>
		{/each}
	</div>
</div>
