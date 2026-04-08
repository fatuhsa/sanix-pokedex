<script lang="ts">
	import '../app.css';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<main class="relative mx-auto min-h-screen max-w-md overflow-x-hidden p-5 pb-32">
	<div
		class="bg-neon/5 pointer-events-none absolute top-[-5%] right-[-10%] h-72 w-72 rounded-full blur-[120px]"
	></div>

	{@render children()}

	<nav class="bg-panel/80 fixed bottom-0 left-0 z-50 w-full border-t border-white/5 backdrop-blur-xl pb-safe">
		<div class="mx-auto flex max-w-md items-center justify-around px-6 py-3">
			<a
				href="/"
				class="group flex flex-col items-center gap-1 transition-all"
			>
				<div
					class="flex h-8 w-16 items-center justify-center rounded-full transition-all {page.url.pathname === '/'
						? 'bg-primary/20 text-primary'
						: 'text-gray-500 group-hover:bg-white/5'}"
				>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
					</svg>
				</div>
				<span class="text-[10px] font-bold tracking-wide {page.url.pathname === '/' ? 'text-white' : 'text-gray-500'}">Dex</span>
			</a>

			<a
				href="/scanner"
				class="group flex flex-col items-center gap-1 transition-all"
			>
				<div
					class="flex h-8 w-16 items-center justify-center rounded-full transition-all {page.url.pathname === '/scanner'
						? 'bg-primary/20 text-primary'
						: 'text-gray-500 group-hover:bg-white/5'}"
				>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
					</svg>
				</div>
				<span class="text-[10px] font-bold tracking-wide {page.url.pathname === '/scanner' ? 'text-white' : 'text-gray-500'}">Scanner</span>
			</a>

			<a
				href="/info"
				class="group flex flex-col items-center gap-1 transition-all"
			>
				<div
					class="flex h-8 w-16 items-center justify-center rounded-full transition-all {page.url.pathname === '/info'
						? 'bg-primary/20 text-primary'
						: 'text-gray-500 group-hover:bg-white/5'}"
				>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				</div>
				<span class="text-[10px] font-bold tracking-wide {page.url.pathname === '/info' ? 'text-white' : 'text-gray-500'}">Info</span>
			</a>
		</div>
	</nav>
</main>

<style>
	@keyframes fadeIn {
		from { opacity: 0; transform: translateY(10px); }
		to { opacity: 1; transform: translateY(0); }
	}
	:global(.custom-scrollbar::-webkit-scrollbar) {
		width: 4px;
		height: 4px;
	}
	:global(.custom-scrollbar::-webkit-scrollbar-track) {
		background: rgba(255, 255, 255, 0.02);
		border-radius: 4px;
	}
	:global(.custom-scrollbar::-webkit-scrollbar-thumb) {
		background: #00f3ff;
		border-radius: 4px;
		box-shadow: 0 0 10px rgba(0, 243, 255, 0.5);
	}
</style>
