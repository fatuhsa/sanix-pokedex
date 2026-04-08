<script lang="ts">
	import AboutSection from '$lib/AboutSection.svelte';
	import { onMount } from 'svelte';

	let apiStatus = $state('CHECKING...');
	let apiPing = $state(0);

	onMount(() => {
		const start = Date.now();
		fetch('https://pokeapi.co/api/v2/')
			.then((res) => {
				if (res.ok) {
					apiStatus = 'ONLINE';
					apiPing = Date.now() - start;
				} else apiStatus = 'ERROR';
			})
			.catch(() => (apiStatus = 'OFFLINE'));
	});
</script>

<svelte:head>
	<title>System Info | Terminal Core</title>
</svelte:head>

<div class="animate-[fadeIn_0.3s_ease-out]">
	<AboutSection {apiStatus} {apiPing} />
</div>
