export function getTypeStyle(type: string) {
	const colors: Record<string, string> = {
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
