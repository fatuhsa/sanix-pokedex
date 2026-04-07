<script>
    let { name = '', url = '', onclick } = $props();

    let id = $derived(url.split('/').filter(Boolean).pop());
    let imageUrl = $derived(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`);
</script>

<div {onclick} class="relative group cursor-pointer active:scale-95 transition-transform duration-200">
    <div class="absolute -inset-0.5 bg-neon opacity-0 group-hover:opacity-40 rounded-xl blur transition duration-300"></div>

    <div class="relative flex flex-col items-center p-4 bg-panel/70 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden h-full">
        <span class="absolute top-2 right-3 text-white/20 font-orbitron text-xs font-bold">
            #{id.padStart(3, '0')}
        </span>

        <div class="w-20 h-20 mt-4 mb-2 relative z-10 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
            <img src={imageUrl} alt={name} class="w-full h-full object-contain drop-shadow-2xl" loading="lazy" />
        </div>

        <h3 class="capitalize font-orbitron font-semibold text-sm tracking-widest text-gray-200 mt-auto">
            {name}
        </h3>
    </div>
</div>
