# Sanix Pokedex 🌀

A modern, high-performance Pokémon Encyclopedia built with a sleek **Material Design 3** interface. This application provides real-time data from the official **PokeAPI** with a focus on speed, aesthetics, and a seamless user experience using the latest web technologies.

![Status](https://img.shields.io/badge/Status-Development-orange)
![Version](https://img.shields.io/badge/Version-0.1.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

- **Material Design 3 UI**: Modern, glassmorphism design using Tailwind CSS 4.0 and M3 color palettes.
- **Fast Search & Filtering**: Efficiently query the Pokédex by name, type, and various special forms.
- **Detailed Pokémon Profiles**: Comprehensive stats, types, and evolution lines for every Pokémon.
- **Discovery Scanner**: Interactive interface for scanning and finding random Pokémon with shiny chances.
- **My Collection**: Persistent local storage for your favorite and shiny Pokémon collections.
- **Responsive & Accessible**: Optimized for various screen sizes with focus on web accessibility standards.

---

## 🛠️ Tech Stack

- **Framework**: [Svelte 5](https://svelte.dev/) (Powered by the **Runes** engine)
- **Meta-framework**: [SvelteKit 2](https://kit.svelte.dev/)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Zero-Error Type Safety)
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

- `src/lib/`: Core components and shared logic.
  - `pokeapi.ts`: Centralized API integration and caching layer.
  - `types.ts`: Comprehensive TypeScript interfaces for Pokémon data.
  - `Filters.svelte`: Advanced search and filtering UI.
  - `PokemonDetailModal.svelte`: Rich detail view for Pokémon data.
- `src/routes/`: App pages and routing system.
  - `/`: Main Pokédex explorer.
  - `/scanner`: Pokémon discovery scanner.
  - `/collection`: Personal collection of favorites and shinies.

---

## 📚 Sources & Attributions

- **Data Source**: [PokeAPI](https://pokeapi.co/) - The RESTful Pokémon API.
- **Icons**: [Heroicons](https://heroicons.com/) & Custom SVG.
- **Typography**: Plus Jakarta Sans.

---

## 👥 Credits

- **Main Developer**: [fatuhsa](https://github.com/fatuhsa)
- **AI Engineering Assistant**: Gemini CLI (Google AI)

---

## 📄 License

This project is licensed under the **MIT License**.

### Disclaimer
Pokémon character names are trademarks of Nintendo. This project is a non-commercial fan-made tool and is not affiliated with or endorsed by Nintendo, Game Freak, or The Pokémon Company.
