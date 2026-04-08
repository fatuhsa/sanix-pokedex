<script lang="ts">
	interface Props {
		apiStatus: string;
		apiPing: number;
	}

	let { apiStatus, apiPing }: Props = $props();
</script>

<div class="animate-[fadeIn_0.3s_ease-out] pt-0">
	<!-- Standardized Top Bar -->
	<div class="mb-6 flex items-center justify-between border-b border-white/5 pb-4">
		<div>
			<h1 class="text-2xl font-bold tracking-tight text-white">
				System Info
			</h1>
			<div class="flex items-center gap-2">
				<p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">
					Architecture & Data
				</p>
				<span class="text-[9px] px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-400 font-bold">
					v0.0.1
				</span>
			</div>
		</div>
		<div class="flex items-center gap-2 px-2.5 py-1 rounded-full border border-white/10 {apiStatus === 'ONLINE' ? 'bg-primary/5 border-primary/20' : apiStatus === 'CHECKING...' ? 'bg-yellow-500/5 border-yellow-500/20' : 'bg-red-500/5 border-red-500/20'}">
			<div class="relative flex h-1.5 w-1.5">
				{#if apiStatus === 'ONLINE'}
					<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
					<span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
				{:else if apiStatus === 'CHECKING...'}
					<span class="animate-pulse absolute inline-flex h-full w-full rounded-full bg-yellow-500 opacity-75"></span>
					<span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-yellow-500"></span>
				{:else}
					<span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
				{/if}
			</div>
			<span class="text-[9px] font-bold uppercase tracking-[0.15em] {apiStatus === 'ONLINE' ? 'text-primary' : apiStatus === 'CHECKING...' ? 'text-yellow-500' : 'text-red-500'}">
				{apiStatus}
			</span>
		</div>
	</div>
	
	<div class="mb-8">
		<h3 class="text-[10px] font-bold text-gray-500 mb-3 tracking-widest uppercase">API Latency</h3>
		<div class="bg-panel rounded-2xl border border-white/5 p-4 flex items-center justify-between shadow-sm">
			<span class="text-xs font-bold text-white uppercase tracking-wider">PokeAPI Connection</span>
			{#if apiStatus === 'ONLINE'}
				<span class="text-xs font-bold text-primary">{apiPing}ms</span>
			{/if}
		</div>
	</div>

	<div class="mb-8">
		<h3 class="text-[10px] font-bold text-gray-500 mb-3 tracking-widest uppercase">Overview</h3>
		<div class="bg-panel rounded-2xl border border-white/5 p-4 shadow-sm">
			<p class="text-xs text-gray-300 leading-relaxed font-medium">
				A modern, high-performance Pokémon Encyclopedia built with the latest web technologies. 
				Features a minimal terminal-inspired interface with real-time data from PokeAPI.
			</p>
		</div>
	</div>

	<div class="mb-8">
		<h3 class="text-[10px] font-bold text-gray-500 mb-3 tracking-widest uppercase">Tech Stack</h3>
		<div class="grid grid-cols-2 gap-3">
			<div class="bg-panel rounded-2xl border border-white/5 p-4 shadow-sm">
				<p class="text-sm font-bold text-white">Svelte 5</p>
				<p class="mt-1 text-[9px] text-gray-500 font-bold uppercase tracking-tight">
					Runes Engine
				</p>
			</div>
			<div class="bg-panel rounded-2xl border border-white/5 p-4 shadow-sm">
				<p class="text-sm font-bold text-white">SvelteKit</p>
				<p class="mt-1 text-[9px] text-gray-500 font-bold uppercase tracking-tight">App Framework</p>
			</div>
			<div class="bg-panel rounded-2xl border border-white/5 p-4 shadow-sm">
				<p class="text-sm font-bold text-white">Tailwind 4</p>
				<p class="mt-1 text-[9px] text-gray-500 font-bold uppercase tracking-tight">Modern Styling</p>
			</div>
			<div class="bg-panel rounded-2xl border border-white/5 p-4 shadow-sm">
				<p class="text-sm font-bold text-white">TypeScript</p>
				<p class="mt-1 text-[9px] text-gray-500 font-bold uppercase tracking-tight">Strict Typing</p>
			</div>
			<div class="bg-panel rounded-2xl border border-white/5 p-4 shadow-sm">
				<p class="text-sm font-bold text-white">Vite 7</p>
				<p class="mt-1 text-[9px] text-gray-500 font-bold uppercase tracking-tight">Build System</p>
			</div>
			<div class="bg-panel rounded-2xl border border-white/5 p-4 shadow-sm">
				<p class="text-sm font-bold text-white">Pokenode-TS</p>
				<p class="mt-1 text-[9px] text-gray-500 font-bold uppercase tracking-tight">API Wrapper</p>
			</div>
		</div>
	</div>

	<div class="mb-8">
		<h3 class="text-[10px] font-bold text-gray-500 mb-3 tracking-widest uppercase">Key Features</h3>
		<div class="grid grid-cols-2 gap-3">
			<div class="bg-panel rounded-2xl border border-white/5 p-4 shadow-sm">
				<p class="text-[11px] font-bold text-white uppercase tracking-tight mb-1">Modern UI</p>
				<p class="text-[10px] text-gray-500 font-medium">Glassmorphism design with Tailwind 4</p>
			</div>
			<div class="bg-panel rounded-2xl border border-white/5 p-4 shadow-sm">
				<p class="text-[11px] font-bold text-white uppercase tracking-tight mb-1">Fast Search</p>
				<p class="text-[10px] text-gray-500 font-medium">Efficient Pokédex querying and filtering</p>
			</div>
			<div class="bg-panel rounded-2xl border border-white/5 p-4 shadow-sm">
				<p class="text-[11px] font-bold text-white uppercase tracking-tight mb-1">Responsive</p>
				<p class="text-[10px] text-gray-500 font-medium">Optimized for mobile and desktop</p>
			</div>
			<div class="bg-panel rounded-2xl border border-white/5 p-4 shadow-sm">
				<p class="text-[11px] font-bold text-white uppercase tracking-tight mb-1">Real-time Data</p>
				<p class="text-[10px] text-gray-500 font-medium">Direct connection to official PokeAPI</p>
			</div>
		</div>
	</div>

	<div class="mb-8">
		<h3 class="text-[10px] font-bold text-gray-500 mb-3 tracking-widest uppercase">Development</h3>
		<div class="bg-panel space-y-4 rounded-2xl border border-white/5 p-5 text-xs shadow-sm">
			<div class="flex items-center justify-between border-b border-white/5 pb-3">
				<span class="text-gray-500 font-bold uppercase text-[9px]">Main Developer</span>
				<span class="text-white font-bold">fatuhsa</span>
			</div>
			<div class="flex items-center justify-between border-b border-white/5 pb-3">
				<span class="text-gray-500 font-bold uppercase text-[9px]">AI Assistant</span>
				<span class="text-primary font-bold italic">Gemini CLI</span>
			</div>
			<div class="flex items-center justify-between">
				<span class="text-gray-500 font-bold uppercase text-[9px]">Repository</span>
				<a
					href="https://github.com/fatuhsa/sanix-pokedex"
					target="_blank"
					class="text-primary font-bold hover:underline">GitHub</a
				>
			</div>
		</div>
	</div>

	<div>
		<h3 class="text-[10px] font-bold text-gray-500 mb-3 tracking-widest uppercase">
			Legal & Attribution
		</h3>
		<div class="bg-panel space-y-4 rounded-2xl border border-white/5 p-5 text-xs shadow-sm">
			<div class="flex items-center justify-between border-b border-white/5 pb-3">
				<span class="text-gray-500 font-bold uppercase text-[9px]">Data Source</span>
				<a
					href="https://pokeapi.co/"
					target="_blank"
					class="text-primary font-bold hover:underline">PokeAPI.co</a
				>
			</div>
			<div class="flex items-center justify-between border-b border-white/5 pb-3">
				<span class="text-gray-500 font-bold uppercase text-[9px]">License</span>
				<span class="text-white font-bold">MIT Open Source</span>
			</div>
			<div class="flex flex-col gap-2">
				<span class="text-gray-500 font-bold uppercase text-[9px]">Disclaimer</span>
				<p class="text-[10px] text-gray-400 leading-relaxed font-medium italic">
					Pokémon character names are trademarks of Nintendo. This project is a non-commercial fan-made tool.
				</p>
			</div>
		</div>
	</div>
</div>
