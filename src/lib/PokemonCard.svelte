<script lang="ts">
	interface Props {
		name: string;
		url: string;
		onclick: () => void;
		onprefetch?: () => void;
		isFavorite?: boolean;
		onToggleFavorite?: (e: MouseEvent) => void;
	}

	let { name, url, onclick, onprefetch, isFavorite = false, onToggleFavorite }: Props = $props();

	let id = $derived(url.split('/').filter(Boolean).pop() || '0');
	let imageUrl = $derived(
		`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
	);

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			onclick();
		}
	}
</script>

<div
	{onclick}
	onmouseenter={onprefetch}
	onkeydown={handleKeyDown}
	role="button"
	tabindex="0"
	class="group relative cursor-pointer transition-all duration-300 active:scale-[0.98]"
>
	<div
		class="bg-panel relative flex h-full flex-col items-center overflow-hidden rounded-[24px] border border-white/5 p-5 shadow-sm transition-all group-hover:bg-surface-variant/40 group-hover:shadow-md"
	>
		<!-- ID Badge - Subtle Style -->
		<span class="absolute top-4 right-5 text-[10px] font-bold text-white/20 tracking-tighter">
			#{id.padStart(3, '0')}
		</span>

		<!-- Favorite Button - Clean Style -->
		<div class="absolute top-3.5 left-4 flex items-center">
			<button
				onclick={onToggleFavorite}
				class="transition-colors p-1.5 rounded-full hover:bg-white/5 {isFavorite ? 'text-primary' : 'text-gray-600'}"
				aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-4.5 w-4.5"
					fill={isFavorite ? 'currentColor' : 'none'}
					viewBox="0 0 24 24"
					stroke="currentColor"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
					/></svg
				>
			</button>
		</div>

		<!-- Pokemon Image - Soft Animation -->
		<div
			class="relative z-10 mt-6 mb-4 h-24 w-24 transition-transform duration-500 ease-out group-hover:scale-110"
		>
			<img
				src={imageUrl}
				alt={name}
				class="h-full w-full object-contain filter drop-shadow-lg"
				loading="lazy"
			/>
		</div>

		<!-- Name - Modern Typography -->
		<h3
			class="mt-auto text-[15px] font-bold tracking-tight text-white capitalize group-hover:text-primary"
		>
			{name}
		</h3>
	</div>
</div>
