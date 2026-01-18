const main = document.getElementById("section");
const form = document.getElementById("form");
const search = document.getElementById("query");

let currentMovies = [];

// ---------- FAVORITES ----------
function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites")) || [];
}

function saveFavorites(favs) {
  localStorage.setItem("favorites", JSON.stringify(favs));
}

function toggleFavorite(movie) {
  let favorites = getFavorites();
  const exists = favorites.find(f => f.imdbID === movie.imdbID);

  if (exists) {
    favorites = favorites.filter(f => f.imdbID !== movie.imdbID);
  } else {
    favorites.push(movie);
  }

  saveFavorites(favorites);
  renderMovies(currentMovies);
}

// ---------- FETCH FROM BACKEND ----------
async function fetchMovies(query = "avengers") {
  try {
    main.innerHTML = "<p>Loading movies...</p>";

    const res = await fetch(`/api/movies?q=${query}`);
    const data = await res.json();

    if (data.Response === "False") {
      main.innerHTML = `<p>${data.Error}</p>`;
      return;
    }

    currentMovies = data.Search;
    renderMovies(currentMovies);
  } catch (err) {
    console.error(err);
    main.innerHTML = "<p>Something went wrong.</p>";
  }
}

// ---------- RENDER ----------
function renderMovies(movies) {
  main.innerHTML = "";
  const favorites = getFavorites();

  movies.forEach(movie => {
    const isFav = favorites.some(f => f.imdbID === movie.imdbID);
    const poster =
      movie.Poster !== "N/A"
        ? movie.Poster
        : "https://via.placeholder.com/300x450?text=No+Image";

    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");

    movieEl.innerHTML = `
      <div class="fav-btn ${isFav ? "active" : ""}">❤</div>
      <img src="${poster}" alt="${movie.Title}">
      <div class="movie-info">
        <h3>${movie.Title}</h3>
        <span>${movie.Year}</span>
      </div>
    `;

    movieEl.querySelector(".fav-btn").addEventListener("click", () => {
      toggleFavorite(movie);
    });

    main.appendChild(movieEl);
  });
}

// ---------- SEARCH ----------
form.addEventListener("submit", e => {
  e.preventDefault();
  const value = search.value.trim();

  if (value) {
    fetchMovies(value);
    search.value = "";
  }
});

// ---------- INITIAL LOAD (POPULAR) ----------
fetchMovies();
