document.addEventListener("DOMContentLoaded", function() {
  const menuIcon = document.querySelector('.menu-icon');
  const dropdownContent = document.querySelector('.dropdown-content');

  menuIcon.addEventListener("click", () => {
    dropdownContent.classList.toggle("show");
  });

  document.querySelectorAll(".pagination-link").forEach(link => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const type = event.target.dataset.type;
      fetchList(type);
    });
  });

  function fetchList(type) {
    const root = document.getElementById("root");
    const P = new Pokedex.Pokedex();
    
    root.innerHTML = "";
    P[type].list()
      .then(response => response.results)
      .then(list => {
        list.forEach(item => {
          const itemElement = document.createElement("div");
          itemElement.textContent = item.name;
          root.appendChild(itemElement);
        });
      })
      .catch(error => console.error("Error:", error));
  }
});