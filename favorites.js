const section = document.getElementById("favorites-section");

// Load favorites
function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites")) || [];
}

function saveFavorites(favs) {
  localStorage.setItem("favorites", JSON.stringify(favs));
}

// Remove favorite
function removeFavorite(imdbID) {
  const updated = getFavorites().filter(movie => movie.imdbID !== imdbID);
  saveFavorites(updated);
  renderFavorites();
}

// Render favorites
function renderFavorites() {
  const favorites = getFavorites();
  section.innerHTML = "";

  if (favorites.length === 0) {
    section.innerHTML = "<p>No favorite movies yet ❤</p>";
    return;
  }

  favorites.forEach(movie => {
    const poster =
      movie.Poster !== "N/A"
        ? movie.Poster
        : "https://via.placeholder.com/300x450?text=No+Image";

    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");

    movieEl.innerHTML = `
      <div class="fav-btn active" title="Remove from favorites">❤</div>
      <img src="${poster}" alt="${movie.Title}">
      <div class="movie-info">
        <h3>${movie.Title}</h3>
        <span>${movie.Year}</span>
      </div>
    `;

    movieEl.querySelector(".fav-btn").addEventListener("click", () => {
      removeFavorite(movie.imdbID);
    });

    section.appendChild(movieEl);
  });
}

// Initial render
renderFavorites();
