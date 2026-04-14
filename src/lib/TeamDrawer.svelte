<script lang="ts">
	import { teamStore } from './team.svelte';
	import { dndzone } from 'svelte-dnd-action';
	import TeamSlot from './TeamSlot.svelte';
	import { fade, fly } from 'svelte/transition';

	const flipDurationMs = 200;
	let items = $state<any[]>([]);

	// Initial sync and reactive sync when store changes
	$effect(() => {
		if (!teamStore.isDrawerOpen) return;
		items = [...teamStore.members];
	});

	function handleDndConsider(e: CustomEvent<{ items: any[] }>) {
		items = e.detail.items;
	}

	function handleDndFinalize(e: CustomEvent<{ items: any[] }>) {
		items = e.detail.items;
		teamStore.members = items;
	}

	function handleClose(e?: Event) {
		if (e) e.stopPropagation();
		teamStore.isDrawerOpen = false;
	}
</script>

{#if teamStore.isDrawerOpen}
	<!-- Backdrop -->
	<div 
		transition:fade={{ duration: 200 }}
		class="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm md:hidden"
		onclick={handleClose}
		onkeydown={(e) => e.key === 'Escape' && handleClose()}
		role="button"
		tabindex="-1"
		aria-label="Close team drawer"
	></div>

	<!-- Drawer / Bottom Sheet -->
	<div 
		transition:fly={{ y: 500, duration: 400 }}
		class="fixed bottom-0 left-0 right-0 z-[100] bg-panel/95 border-t border-white/10 rounded-t-[32px] p-6 pt-2 shadow-2xl backdrop-blur-2xl max-h-[85vh] overflow-hidden flex flex-col mx-auto max-w-md"
	>
		<!-- Handle Bar -->
		<div 
			class="w-12 h-1.5 bg-white/10 rounded-full mx-auto my-4 shrink-0 cursor-pointer"
			onclick={(e) => handleClose(e)}
			role="button"
			tabindex="-1"
			aria-label="Drag down to close"
		></div>

		<!-- Header -->
		<div class="flex items-center justify-between mb-6 shrink-0">
			<div>
				<h2 class="text-xl font-black text-white tracking-tight leading-none uppercase italic">Combat Party</h2>
				<p class="text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em] mt-1.5 opacity-80">
					{items.length} / 6 Members Ready
				</p>
			</div>
			<button 
				onclick={(e) => handleClose(e)}
				class="relative z-[110] bg-white/5 p-2.5 rounded-full text-gray-400 hover:text-white transition-colors active:scale-90"
				aria-label="Close"
			>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		</div>

		<!-- Team Grid -->
		<div class="flex-1 overflow-y-auto custom-scrollbar pb-10">
			{#if items.length === 0}
				<div class="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/5 rounded-3xl opacity-30">
					<div class="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					</div>
					<p class="text-[10px] font-bold uppercase tracking-widest text-center">Empty Formation</p>
					<p class="text-[9px] font-medium text-center max-w-[160px] mt-2 opacity-60 italic leading-relaxed">
						Scan or browse Pokémon to add them to your tactical team.
					</p>
				</div>
			{:else}
				<div 
					use:dndzone={{ items, flipDurationMs, type: 'team' }}
					onconsider={handleDndConsider}
					onfinalize={handleDndFinalize}
					class="grid grid-cols-2 gap-3"
				>
					{#each items as member (member.id)}
						<div class="outline-none">
							<TeamSlot {member} />
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Mobile Build Button -->
		{#if items.length > 0}
			<div class="mt-4 pt-4 border-t border-white/5 shrink-0">
				<button 
					onclick={() => teamStore.isAnalysisOpen = true}
					class="w-full bg-primary py-4 rounded-2xl text-space font-black uppercase tracking-widest text-sm shadow-[0_4px_20px_rgba(208,188,255,0.3)] active:scale-95 transition-transform flex items-center justify-center gap-3 group"
				>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
					</svg>
					Initialize Battle
				</button>
			</div>
		{/if}
	</div>
{/if}

<style>
	:global(.custom-scrollbar::-webkit-scrollbar) {
		width: 4px;
	}
	:global(.custom-scrollbar::-webkit-scrollbar-track) {
		background: transparent;
	}
	:global(.custom-scrollbar::-webkit-scrollbar-thumb) {
		background: rgba(255, 255, 255, 0.1);
		border-radius: 9999px;
	}
</style>
