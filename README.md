# Sanix Pokedex 🌀

A modern, high-performance Pokémon Encyclopedia built with a sleek Material Design 3 interface. This application provides real-time data from the official PokeAPI with a focus on speed, aesthetics, and a seamless user experience.

![Status](https://img.shields.io/badge/Status-Development-orange)
![Version](https://img.shields.io/badge/Version-0.0.1-blue)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

- **Material Design 3 UI**: Sleek glassmorphism design using Tailwind 4 and M3 palettes.
- **Fast Search & Filtering**: Efficiently query the Pokédex by name, type, and region.
- **Detailed Info**: Comprehensive stats, types, and evolution data for every Pokémon.
- **Scanner Mode**: Interactive interface for scanning Pokémon data.
- **The Vault**: Persistent collection storage for your favorites and shiny Pokémon.

---

## 🛠️ Tech Stack

- **Framework**: [Svelte 5](https://svelte.dev/) (utilizing the new Runes engine)
- **Meta-framework**: [SvelteKit](https://kit.svelte.dev/)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 7](https://vitejs.dev/)
- **API Wrapper**: [Pokenode-TS](https://github.com/Gabb-0/pokenode-ts)
- **Package Manager**: [pnpm](https://pnpm.io/)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (Latest LTS recommended)
- [pnpm](https://pnpm.io/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/fatuhsa/sanix-pokedex.git
   cd sanix-pokedex
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Start the development server:**
   ```bash
   pnpm dev
   ```

4. **Build for production:**
   ```bash
   pnpm build
   ```

---

## 📂 Project Structure

- `src/lib/`: Core components and utilities.
  - `pokeapi.ts`: API integration logic.
  - `AboutSection.svelte`: System information and credits.
  - `Filters.svelte`: Search and filtering components.
  - `PokemonDetailModal.svelte`: Modal for displaying detailed Pokémon data.
- `src/routes/`: App pages and routing.
  - `/`: Main Pokédex view.
  - `/scanner`: Pokémon scanner interface.
  - `/collection`: The Vault - your favorite and shiny Pokémon collections.

---

## 📚 Sources & Attributions

- **Data Source**: [PokeAPI](https://pokeapi.co/) - The RESTful Pokémon API.
- **Icons**: [Heroicons](https://heroicons.com/) & Custom SVG.
- **Typography**: Plus Jakarta Sans.

---

## 👥 Credits

- **Main Developer**: [fatuhsa](https://github.com/fatuhsa)
- **AI Assistant**: Gemini CLI (Google AI)

---

## 📄 License

This project is licensed under the **MIT License**.

### Disclaimer
Pokémon character names are trademarks of Nintendo. This project is a non-commercial fan-made tool and is not affiliated with or endorsed by Nintendo, Game Freak, or The Pokémon Company.
