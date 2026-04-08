<script lang="ts">
	import '../app.css';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { accent } from '$lib/accent.svelte';

	let { children } = $props();
	let isGlobalLoading = $state(true);

	$effect(() => {
		if (typeof document !== 'undefined') {
			document.documentElement.style.setProperty('--color-primary', accent.current);
			if (isGlobalLoading) {
				document.body.style.overflow = 'hidden';
			} else {
				document.body.style.overflow = '';
			}
		}
	});

	onMount(() => {
		const timer = setTimeout(() => {
			isGlobalLoading = false;
		}, 1000);
		return () => clearTimeout(timer);
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if isGlobalLoading}
	<div class="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-space animate-[fadeIn_0.3s_ease-out]">
		<div class="mb-6 flex h-16 w-16 items-center justify-center">
			<div class="h-12 w-12 rounded-full border-[4px] border-primary/20 border-t-primary animate-spin"></div>
		</div>
		<div class="flex flex-col items-center gap-1">
			<p class="text-[11px] font-bold text-primary tracking-widest uppercase opacity-80">Syncing Data</p>
			<p class="text-[9px] font-medium text-outline uppercase tracking-[0.2em]">Material Core 3.0</p>
		</div>
	</div>
{/if}

<main class="relative mx-auto min-h-screen max-w-md overflow-x-hidden p-5 pb-32">
	{@render children()}

	<nav class="bg-panel/95 fixed bottom-0 left-0 z-50 w-full border-t border-white/5 backdrop-blur-xl pb-safe shadow-lg">
		<div class="mx-auto flex max-w-md items-center justify-around px-2 py-3">
			<a
				href="/"
				class="group flex flex-col items-center gap-1.5 transition-all"
			>
				<div
					class="flex h-8 w-16 items-center justify-center rounded-full transition-all {page.url.pathname === '/'
						? 'bg-primary/20 text-primary'
						: 'text-outline hover:bg-white/5'}"
				>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
					</svg>
				</div>
				<span class="text-[11px] font-bold {page.url.pathname === '/' ? 'text-[#e6e1e5]' : 'text-outline'}">Dex</span>
			</a>

			<a
				href="/scanner"
				class="group flex flex-col items-center gap-1.5 transition-all"
			>
				<div
					class="flex h-8 w-16 items-center justify-center rounded-full transition-all {page.url.pathname === '/scanner'
						? 'bg-primary/20 text-primary'
						: 'text-outline hover:bg-white/5'}"
				>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
					</svg>
				</div>
				<span class="text-[11px] font-bold {page.url.pathname === '/scanner' ? 'text-[#e6e1e5]' : 'text-outline'}">Scanner</span>
			</a>

			<a
				href="/collection"
				class="group flex flex-col items-center gap-1.5 transition-all"
			>
				<div
					class="flex h-8 w-16 items-center justify-center rounded-full transition-all {page.url.pathname === '/collection'
						? 'bg-primary/20 text-primary'
						: 'text-outline hover:bg-white/5'}"
				>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
					</svg>
				</div>
				<span class="text-[11px] font-bold {page.url.pathname === '/collection' ? 'text-[#e6e1e5]' : 'text-outline'}">Vault</span>
			</a>

			<a
				href="/info"
				class="group flex flex-col items-center gap-1.5 transition-all"
			>
				<div
					class="flex h-8 w-16 items-center justify-center rounded-full transition-all {page.url.pathname === '/info'
						? 'bg-primary/20 text-primary'
						: 'text-outline hover:bg-white/5'}"
				>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				</div>
				<span class="text-[11px] font-bold {page.url.pathname === '/info' ? 'text-[#e6e1e5]' : 'text-outline'}">Info</span>
			</a>
		</div>
	</nav>
</main>

<style>
	@reference "../app.css";

	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}
	:global(.custom-scrollbar::-webkit-scrollbar) {
		width: 4px;
	}
	:global(.custom-scrollbar::-webkit-scrollbar-track) {
		background: transparent;
	}
	:global(.custom-scrollbar::-webkit-scrollbar-thumb) {
		@apply bg-surface-variant rounded-full;
	}
</style>
