export const ACCENT_COLORS = [
	'#d0bcff', // M3 Lavender (Primary)
	'#a1d0ff', // M3 Blue Sky
	'#b2f5a5', // M3 Mint Green
	'#ffb2be', // M3 Rose
	'#ffde9e', // M3 Sunset Gold
	'#80e8ff', // M3 Cyan
	'#ffffff'  // Neutral White
];

class AccentState {
	current = $state(ACCENT_COLORS[0]);

	constructor() {
		if (typeof window !== 'undefined') {
			const saved = localStorage.getItem('poke_accent_color');
			if (saved && ACCENT_COLORS.includes(saved)) {
				this.current = saved;
			}
		}
	}

	cycle() {
		const currentIndex = ACCENT_COLORS.indexOf(this.current);
		const nextIndex = (currentIndex + 1) % ACCENT_COLORS.length;
		this.current = ACCENT_COLORS[nextIndex];
		localStorage.setItem('poke_accent_color', this.current);
	}
}

export const accent = new AccentState();
