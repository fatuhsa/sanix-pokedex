<script>
    import PokemonCard from '$lib/PokemonCard.svelte';
    import { onMount } from 'svelte';

    // --- Core State ---
    let allPokemons = $state([]); 
    let searchQuery = $state('');
    let loading = $state(true);
    let offset = $state(0);
    const limit = 20;

    let activeTab = $state('DEX'); 

    // --- System Info State ---
    let apiStatus = $state('CHECKING...');
    let apiPing = $state(0);

    // --- Detail Panel State ---
    let selectedPokemon = $state(null);
    let detailData = $state(null);
    let speciesData = $state(null);
    let evolutionChain = $state([]);
    let detailLoading = $state(false);

    // --- MAP / Satellite State ---
    let regions = $state([]);
    let selectedRegion = $state(null);
    let regionLocations = $state([]);
    let mapLoading = $state(false);

    // --- Helper Functions ---
    function formatStatName(name) {
        const names = { 'hp': 'HP', 'attack': 'ATK', 'defense': 'DEF', 'special-attack': 'SP.A', 'special-defense': 'SP.D', 'speed': 'SPD' };
        return names[name] || name.toUpperCase();
    }

    // Pemetaan Warna Elemen (Neon Style)
    function getTypeStyle(type) {
        const colors = {
            normal: 'text-gray-400 border-gray-400/50 bg-gray-400/10',
            fire: 'text-orange-400 border-orange-400/50 bg-orange-400/10 shadow-[0_0_10px_rgba(251,146,60,0.2)]',
            water: 'text-blue-400 border-blue-400/50 bg-blue-400/10 shadow-[0_0_10px_rgba(96,165,250,0.2)]',
            grass: 'text-green-400 border-green-400/50 bg-green-400/10 shadow-[0_0_10px_rgba(74,222,128,0.2)]',
            electric: 'text-yellow-400 border-yellow-400/50 bg-yellow-400/10 shadow-[0_0_10px_rgba(250,204,21,0.2)]',
            ice: 'text-cyan-300 border-cyan-300/50 bg-cyan-300/10',
            fighting: 'text-red-500 border-red-500/50 bg-red-500/10',
            poison: 'text-purple-400 border-purple-400/50 bg-purple-400/10',
            ground: 'text-yellow-600 border-yellow-600/50 bg-yellow-600/10',
            flying: 'text-indigo-300 border-indigo-300/50 bg-indigo-300/10',
            psychic: 'text-pink-400 border-pink-400/50 bg-pink-400/10',
            bug: 'text-lime-400 border-lime-400/50 bg-lime-400/10',
            rock: 'text-yellow-700 border-yellow-700/50 bg-yellow-700/10',
            ghost: 'text-indigo-400 border-indigo-400/50 bg-indigo-400/10',
            dragon: 'text-violet-500 border-violet-500/50 bg-violet-500/10',
            dark: 'text-gray-600 border-gray-600/50 bg-gray-600/10',
            steel: 'text-slate-400 border-slate-400/50 bg-slate-400/10',
            fairy: 'text-pink-300 border-pink-300/50 bg-pink-300/10'
        };
        return colors[type] || 'text-gray-300 border-white/10 bg-white/5';
    }

    async function openDetail(pokemon) {
        selectedPokemon = pokemon;
        detailData = null; speciesData = null; evolutionChain = [];
        detailLoading = true;

        try {
            const res = await fetch(pokemon.url); detailData = await res.json();
            const speciesRes = await fetch(detailData.species.url); speciesData = await speciesRes.json();
            const evoRes = await fetch(speciesData.evolution_chain.url); const evoData = await evoRes.json();
            
            let chain = []; let currentEvo = evoData.chain;
            while(currentEvo) {
                chain.push(currentEvo.species.name);
                currentEvo = currentEvo.evolves_to[0];
            }
            evolutionChain = chain;
        } catch (error) { console.error(error); } finally { detailLoading = false; }
    }

    function closeDetail() { selectedPokemon = null; }

    // --- MAP Scan Functions ---
    async function fetchRegions() {
        try {
            const res = await fetch('https://pokeapi.co/api/v2/region/');
            const data = await res.json();
            regions = data.results;
        } catch (error) { console.error("Gagal memuat region:", error); }
    }

    async function scanRegion(region) {
        selectedRegion = region;
        mapLoading = true;
        regionLocations = [];
        try {
            const res = await fetch(region.url);
            const data = await res.json();
            regionLocations = data.locations;
        } catch (error) { console.error("Gagal scan area:", error); } finally {
            mapLoading = false;
        }
    }

    // --- Core Logic ---
    async function fetchAllPokemons() {
        loading = true;
        try {
            const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1302');
            const data = await res.json();
            allPokemons = data.results;
        } catch (error) { console.error(error); } finally { loading = false; }
    }

    let filteredPokemons = $derived(allPokemons.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())));
    let displayedPokemons = $derived(filteredPokemons.slice(offset, offset + limit));

    $effect(() => { if (searchQuery !== null) offset = 0; });

    $effect(() => {
        if (activeTab === 'ABOUT' && apiStatus === 'CHECKING...') {
            const start = Date.now();
            fetch('https://pokeapi.co/api/v2/').then(res => {
                if (res.ok) { apiStatus = 'ONLINE'; apiPing = Date.now() - start; } else apiStatus = 'ERROR';
            }).catch(() => apiStatus = 'OFFLINE');
        }
    });

    function nextPage() { if (offset + limit < filteredPokemons.length) { offset += limit; window.scrollTo({ top: 0, behavior: 'smooth' }); } }
    function prevPage() { if (offset >= limit) { offset -= limit; window.scrollTo({ top: 0, behavior: 'smooth' }); } }

    onMount(() => {
        fetchAllPokemons();
        fetchRegions(); 
    });
</script>

<svelte:head>
    <title>Pokédex | Terminal Core</title>
</svelte:head>

<main class="min-h-screen p-5 pb-32 max-w-md mx-auto relative overflow-x-hidden">
    <div class="absolute top-[-5%] right-[-10%] w-72 h-72 bg-neon/5 rounded-full blur-[120px] pointer-events-none"></div>

    {#if activeTab === 'DEX'}
        <header class="mb-8 animate-[fadeIn_0.3s_ease-out]">
            <div class="flex justify-between items-center mb-6">
                <div>
                    <h1 class="text-3xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon to-blue-500 tracking-wider">POKÉDEX</h1>
                    <p class="text-[10px] text-gray-400 font-orbitron uppercase tracking-widest mt-1">Matches: {filteredPokemons.length} // Page {Math.floor(offset / limit) + 1}</p>
                </div>
                <div class="w-2 h-2 rounded-full bg-neon shadow-[0_0_10px_#00F3FF]"></div>
            </div>
            <div class="relative group">
                <div class="absolute -inset-0.5 bg-gradient-to-r from-neon to-blue-600 rounded-lg blur opacity-20 group-focus-within:opacity-50 transition duration-500"></div>
                <div class="relative flex items-center bg-panel/80 backdrop-blur-xl border border-white/10 rounded-lg px-4 py-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <input type="text" bind:value={searchQuery} placeholder="Global scan..." class="bg-transparent border-none outline-none w-full text-white placeholder-gray-600 font-orbitron text-sm tracking-widest" />
                </div>
            </div>
        </header>

        <div class="animate-[fadeIn_0.4s_ease-out]">
            {#if loading}
                <div class="grid grid-cols-2 gap-4">
                    {#each Array(6) as _}
                        <div class="h-44 bg-panel/40 border border-white/5 rounded-xl animate-pulse flex flex-col items-center justify-center p-4">
                            <div class="w-16 h-16 bg-white/5 rounded-full mb-4"></div>
                            <div class="w-20 h-3 bg-white/10 rounded-full mt-2"></div>
                        </div>
                    {/each}
                </div>
            {:else}
                {#if displayedPokemons.length > 0}
                    <div class="grid grid-cols-2 gap-4">
                        {#each displayedPokemons as pokemon (pokemon.name)}
                            <PokemonCard name={pokemon.name} url={pokemon.url} onclick={() => openDetail(pokemon)} />
                        {/each}
                    </div>
                {:else}
                    <div class="text-center py-20 border border-dashed border-white/10 rounded-xl"><p class="font-orbitron text-gray-500 text-xs">NO_MATCHING_DATA</p></div>
                {/if}

                {#if filteredPokemons.length > limit}
                    <div class="flex justify-between items-center mt-10 gap-4">
                        <button onclick={prevPage} disabled={offset === 0} class="flex-1 py-3 bg-panel/50 border border-white/10 rounded-lg font-orbitron text-[10px] tracking-widest transition-all active:scale-95 disabled:opacity-30 hover:bg-white/5">PREV_PAGE</button>
                        <button onclick={nextPage} disabled={offset + limit >= filteredPokemons.length} class="flex-1 py-3 bg-neon/10 border border-neon/30 rounded-lg font-orbitron text-[10px] tracking-widest text-neon shadow-[0_0_15px_rgba(0,243,255,0.1)] transition-all active:scale-95 disabled:opacity-30 hover:bg-neon/20">NEXT_PAGE</button>
                    </div>
                {/if}
            {/if}
        </div>

    {:else if activeTab === 'MAP'}
        <div class="animate-[fadeIn_0.3s_ease-out] pt-4">
            <div class="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                <h2 class="font-orbitron text-2xl text-transparent bg-clip-text bg-gradient-to-r from-neon to-blue-500 tracking-widest">SATELLITE_LINK</h2>
                <div class="relative w-6 h-6"><div class="absolute inset-0 border border-neon/30 rounded-full animate-ping"></div><div class="absolute inset-1 border border-neon/50 rounded-full"></div></div>
            </div>

            {#if !selectedRegion}
                <p class="font-orbitron text-xs text-gray-500 mb-4 tracking-widest">SELECT_SECTOR_TO_SCAN:</p>
                <div class="grid grid-cols-2 gap-3">
                    {#each regions as region}
                        <button onclick={() => scanRegion(region)} class="bg-panel/60 border border-white/5 hover:border-neon/50 rounded-lg p-4 text-left transition-all active:scale-95 group relative overflow-hidden">
                            <div class="absolute inset-0 bg-gradient-to-r from-neon/0 via-neon/10 to-neon/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                            <h3 class="font-orbitron text-white capitalize text-sm relative z-10">{region.name}</h3>
                            <p class="font-orbitron text-[9px] text-gray-500 mt-1 relative z-10">SYS_ID: {(region.url.split('/').filter(Boolean).pop()).padStart(2, '0')}</p>
                        </button>
                    {/each}
                </div>
            {:else}
                <button onclick={() => selectedRegion = null} class="flex items-center gap-2 text-gray-500 hover:text-neon transition-colors mb-4 font-orbitron text-[10px] tracking-widest"><span>&lt;&lt; BACK_TO_GLOBAL</span></button>
                
                <div class="bg-panel/50 border border-neon/30 rounded-lg p-4 mb-4 relative overflow-hidden shadow-[0_0_15px_rgba(0,243,255,0.05)]">
                    <div class="absolute top-0 left-0 w-full h-0.5 bg-neon/80 animate-pulse"></div>
                    <h3 class="font-orbitron text-neon text-lg capitalize tracking-wider">SECTOR: {selectedRegion.name}</h3>
                    <p class="font-orbitron text-[10px] text-gray-400 mt-1">Uplink established. Visualizing area data...</p>
                </div>

                {#if mapLoading}
                    <div class="space-y-2">
                        {#each Array(5) as _}
                            <div class="h-10 bg-space/50 border border-white/5 rounded-md animate-pulse"></div>
                        {/each}
                    </div>
                {:else}
                    <div class="space-y-2 max-h-[50vh] overflow-y-auto custom-scrollbar pr-2 pb-10">
                        {#each regionLocations as loc}
                            <div class="bg-space/50 border border-white/5 rounded-md p-3 flex justify-between items-center hover:border-white/20 transition-colors">
                                <span class="font-inter text-xs text-gray-300 capitalize">{loc.name.replace(/-/g, ' ')}</span>
                                <div class="w-1.5 h-1.5 bg-green-400 rounded-full shadow-[0_0_8px_#4ade80] animate-pulse"></div>
                            </div>
                        {/each}
                    </div>
                {/if}
            {/if}
        </div>

    {:else if activeTab === 'ABOUT'}
        <div class="animate-[fadeIn_0.3s_ease-out] pt-4">
            <h2 class="font-orbitron text-2xl text-transparent bg-clip-text bg-gradient-to-r from-neon to-blue-500 tracking-widest mb-6 border-b border-white/10 pb-4">SYSTEM_INFO</h2>
            <div class="mb-8">
                <h3 class="font-orbitron text-xs text-gray-500 mb-3 tracking-widest">CORE_TECHNOLOGY</h3>
                <div class="grid grid-cols-2 gap-3">
                    <div class="bg-panel/60 border border-white/5 rounded-lg p-3"><p class="text-white font-orbitron font-bold text-sm">Svelte 5</p><p class="text-[10px] text-gray-400 mt-1">Runes Reactive State</p></div>
                    <div class="bg-panel/60 border border-white/5 rounded-lg p-3"><p class="text-white font-orbitron font-bold text-sm">Tailwind v4</p><p class="text-[10px] text-gray-400 mt-1">Utility-first CSS</p></div>
                    <div class="bg-panel/60 border border-white/5 rounded-lg p-3"><p class="text-white font-orbitron font-bold text-sm">Vite</p><p class="text-[10px] text-gray-400 mt-1">Next-gen Bundler</p></div>
                    <div class="bg-panel/60 border border-white/5 rounded-lg p-3"><p class="text-white font-orbitron font-bold text-sm">PokeAPI</p><p class="text-[10px] text-gray-400 mt-1">RESTful Data Source</p></div>
                </div>
            </div>
            <div>
                <h3 class="font-orbitron text-xs text-gray-500 mb-3 tracking-widest">NETWORK_METRICS</h3>
                <div class="bg-panel/60 border border-white/5 rounded-lg p-4 font-inter text-xs space-y-4">
                    <div class="flex justify-between items-center border-b border-white/5 pb-3">
                        <span class="text-gray-400">Server Status</span>
                        <div class="flex items-center gap-2">
                            {#if apiStatus === 'ONLINE'}
                                <div class="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_#4ade80]"></div><span class="text-green-400 font-orbitron tracking-widest">{apiStatus} ({apiPing}ms)</span>
                            {:else}
                                <div class="w-2 h-2 rounded-full bg-neon animate-pulse"></div><span class="text-neon font-orbitron tracking-widest">{apiStatus}</span>
                            {/if}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    {/if}

    {#if selectedPokemon}
        <div class="fixed inset-0 bg-space/80 backdrop-blur-md z-[60] animate-[fadeIn_0.2s_ease-out]" onclick={closeDetail}></div>

        <div class="fixed bottom-0 left-0 w-full bg-panel/95 backdrop-blur-2xl border-t border-neon/50 rounded-t-[30px] z-[70] p-6 pt-2 pb-10 max-h-[90vh] overflow-y-auto transform transition-transform animate-[slideUp_0.3s_ease-out] shadow-[0_-10px_40px_rgba(0,243,255,0.15)]">
            <div class="w-12 h-1.5 bg-gray-600 rounded-full mx-auto my-3"></div>
            <div class="relative">
                <button onclick={closeDetail} class="absolute top-0 right-0 p-2 text-gray-500 hover:text-neon transition-colors z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                {#if detailLoading}
                    <div class="flex flex-col items-center justify-center py-10 w-full">
                        <div class="w-32 h-32 bg-white/5 rounded-full animate-pulse mb-6"></div>
                        <div class="w-24 h-4 bg-white/10 rounded mt-2 mb-2 animate-pulse"></div>
                        <div class="w-48 h-8 bg-white/10 rounded mb-4 animate-pulse"></div>
                        <div class="w-full h-20 bg-white/5 rounded-lg mt-4 animate-pulse"></div>
                    </div>
                {:else if detailData && speciesData}
                    <div class="flex flex-col items-center mt-2">
                        <div class="relative w-32 h-32 mb-2">
                            <div class="absolute inset-0 bg-neon/10 rounded-full blur-xl animate-pulse pointer-events-none"></div>
                            <img src={detailData.sprites.other['official-artwork'].front_default} alt={detailData.name} class="relative z-10 w-full h-full object-contain drop-shadow-2xl" />
                        </div>
                        <p class="font-orbitron text-neon text-[10px] font-bold tracking-widest mb-1">
                            SYS_ID: {String(detailData.id).padStart(3, '0')}
                        </p>
                        <h2 class="font-orbitron text-2xl text-white font-bold capitalize mb-3 tracking-wider">
                            {detailData.name}
                        </h2>
                        
                        <div class="flex gap-2 mb-4">
                            {#each detailData.types as type}
                                <span class={`px-3 py-1 border rounded-md font-orbitron text-[9px] uppercase tracking-widest ${getTypeStyle(type.type.name)}`}>
                                    {type.type.name}
                                </span>
                            {/each}
                        </div>
                    </div>

                    <div class="bg-space/80 border border-white/5 rounded-lg p-3 mb-6 relative">
                        <div class="absolute top-0 left-0 w-2 h-full bg-neon/50 rounded-l-lg"></div>
                        <p class="font-inter text-xs text-gray-400 italic leading-relaxed pl-2">
                            "{speciesData.flavor_text_entries.find(e => e.language.name === 'en')?.flavor_text.replace(/[\n\f\r]/g, ' ') || 'Data log missing.'}"
                        </p>
                    </div>

                    <div class="mb-6">
                        <h3 class="font-orbitron text-[10px] text-gray-500 tracking-widest border-b border-white/10 pb-2 mb-3">COMBAT_ATTRIBUTES</h3>
                        <div class="space-y-2.5">
                            {#each detailData.stats as stat}
                                <div class="flex items-center text-[10px] font-orbitron">
                                    <span class="w-12 text-gray-400">{formatStatName(stat.stat.name)}</span>
                                    <span class="w-8 text-white text-right mr-3 font-bold">{stat.base_stat}</span>
                                    <div class="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden relative">
                                        <div class="absolute top-0 left-0 h-full bg-neon shadow-[0_0_8px_#00F3FF] transition-all duration-1000" style="width: {Math.min((stat.base_stat / 150) * 100, 100)}%"></div>
                                    </div>
                                </div>
                            {/each}
                        </div>
                    </div>

                    {#if evolutionChain.length > 0}
                        <div class="mb-2">
                            <h3 class="font-orbitron text-[10px] text-gray-500 tracking-widest border-b border-white/10 pb-2 mb-3">EVOLUTION_PATH</h3>
                            <div class="flex flex-wrap items-center gap-2 mt-2 font-orbitron text-[10px] capitalize">
                                {#each evolutionChain as evo, index}
                                    <span class="px-2 py-1 rounded {evo === detailData.name ? 'bg-neon/20 text-neon border border-neon/50' : 'text-gray-400'}">
                                        {evo}
                                    </span>
                                    {#if index < evolutionChain.length - 1}<span class="text-gray-600">>></span>{/if}
                                {/each}
                            </div>
                        </div>
                    {/if}
                {/if}
            </div>
        </div>
    {/if}

    <nav class="fixed bottom-0 left-0 w-full bg-space/80 backdrop-blur-xl border-t border-white/5 z-50">
        <div class="max-w-md mx-auto flex justify-between items-center px-8 py-4">
            <button onclick={() => activeTab = 'DEX'} class="flex flex-col items-center gap-1 {activeTab === 'DEX' ? 'text-neon' : 'text-gray-500'}">
                <div class="w-6 h-1 rounded-full {activeTab === 'DEX' ? 'bg-neon shadow-[0_0_8px_#00F3FF]' : 'bg-gray-600'}"></div>
                <span class="text-[10px] font-orbitron tracking-wider">DEX</span>
            </button>
            <button onclick={() => activeTab = 'MAP'} class="flex flex-col items-center gap-1 {activeTab === 'MAP' ? 'text-neon' : 'text-gray-500'}">
                <div class="w-6 h-1 rounded-full {activeTab === 'MAP' ? 'bg-neon shadow-[0_0_8px_#00F3FF]' : 'bg-gray-600'}"></div>
                <span class="text-[10px] font-orbitron tracking-wider">MAP</span>
            </button>
            <button onclick={() => activeTab = 'ABOUT'} class="flex flex-col items-center gap-1 {activeTab === 'ABOUT' ? 'text-neon' : 'text-gray-500'}">
                <div class="w-6 h-1 rounded-full {activeTab === 'ABOUT' ? 'bg-neon shadow-[0_0_8px_#00F3FF]' : 'bg-gray-600'}"></div>
                <span class="text-[10px] font-orbitron tracking-wider">ABOUT</span>
            </button>
        </div>
    </nav>
</main>

<style>
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); border-radius: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #00F3FF; border-radius: 4px; box-shadow: 0 0 10px rgba(0, 243, 255, 0.5); }
</style>
