document.addEventListener("DOMContentLoaded", function onLoad() {
  const P = new Pokedex.Pokedex();
  const root = document.getElementById("root");
  const modal = document.getElementById("myModal");
  const span = document.getElementsByClassName("close")[0];
  const modalContent = document.getElementById("modal-content");
  const pagination = document.getElementById("pagination");

  let offset = 0;
  const limit = 10;

  // Function to fetch and display Pokémon
  function fetchPokemons(offset, limit) {
    const interval = { offset, limit };

    P.getPokemonsList(interval)
      .then(response => {
        return response.results;
      })
      .then(pokemonList => {
        const pokemonPromises = pokemonList.map(pokemon =>
          P.getPokemonByName(pokemon.name)
        );

        return Promise.all(pokemonPromises);
      })
      .then(pokemons => {
        root.innerHTML = "";
        pokemons.forEach(pokemon => {
          const pokemonElement = document.createElement("div");
          pokemonElement.classList.add("pokemon-card");

          const spriteElement = document.createElement("img");
          spriteElement.src = pokemon.sprites.front_default;
          spriteElement.alt = pokemon.name;
          spriteElement.classList.add("pokemon-sprite");

          const nameElement = document.createElement("div");
          nameElement.textContent = pokemon.name;

          pokemonElement.appendChild(spriteElement);
          pokemonElement.appendChild(nameElement);

          pokemonElement.addEventListener("click", () => {
            showModal(pokemon);
          });

          root.appendChild(pokemonElement);
        });

        createPaginationButtons();
      })
      .catch(error => {
        console.error("Error:", error);
      });
  }

  // Initial fetch for Pokémon when page loads
  fetchPokemons(offset, limit);

  span.onclick = () => {
    modal.style.display = "none";
  };

  window.onclick = event => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  function showModal(pokemon) {
    const statColors = {
      hp: "#ff0000",
      attack: "#f08030",
      defense: "#f8d030",
      "special-attack": "#6890f0",
      "special-defense": "#78c850",
      speed: "#f85888"
    };

    modalContent.innerHTML = `
      <div class="pokemon-name">${pokemon.name}</div>
      <img class="pokemon-sprite" src="${pokemon.sprites.front_default}" alt="${
        pokemon.name
      }">
      <div>
        <strong>Base Stats:</strong>
        ${pokemon.stats
          .map(
            stat => `
          <div>
            <span>${stat.stat.name}:</span>
            <div class="stat-bar" style="width: ${
              (stat.base_stat / 200) * 100
            }%; background-color: ${statColors[stat.stat.name]}"></div>
            <span>${stat.base_stat}/200</span>
          </div>
        `
          )
          .join("")}
      </div>
      <div>
        <strong>Abilities:</strong>
        ${pokemon.abilities
          .map(
            ability => `
          <div>${ability.ability.name}${
            ability.is_hidden ? " (hidden)" : ""
          }</div>
        `
          )
          .join("")}
      </div>
      <div>
        ${pokemon.types
          .map(
            type => `
          <span class="pokemon-type">${type.type.name}</span>
        `
          )
          .join("")}
      </div>
    `;
    modal.style.display = "block";
  }

  // Function to create pagination buttons
  function createPaginationButtons() {
    pagination.innerHTML = "";

    const prevButton = document.createElement("button");
    prevButton.innerText = "Previous";
    prevButton.classList.add("pagination-button");
    prevButton.disabled = offset === 0;
    prevButton.addEventListener("click", () => {
      offset = Math.max(0, offset - limit);
      fetchPokemons(offset, limit);
    });

    const nextButton = document.createElement("button");
    nextButton.innerText = "Next";
    nextButton.classList.add("pagination-button");
    nextButton.addEventListener("click", () => {
      offset += limit;
      fetchPokemons(offset, limit);
    });

    pagination.appendChild(prevButton);
    pagination.appendChild(nextButton);
  }
});