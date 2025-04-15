const API_KEY = "5eca9a687486a7f124887df8fcb1060e";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const bannedWords = [];

let currentPage = 1;
let currentGenre = "";

// Canvas stars background
const canvas = document.getElementById("starCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = [];

function createStars() {
  stars = [];
  for (let i = 0; i < 200; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 1,
      opacity: Math.random(),
    });
  }
}

function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stars.forEach((star) => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
    ctx.fill();
  });
}

function animateStars() {
  stars.forEach((star) => {
    star.y += 0.5;
    if (star.y > canvas.height) {
      star.y = 0;
      star.x = Math.random() * canvas.width;
    }
  });
  drawStars();
  requestAnimationFrame(animateStars);
}

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  createStars();
});

// Movie display functions
async function loadMovies(page = 1) {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`
    );
    const data = await response.json();
    displayMovies(data.results);
  } catch (error) {
    console.error("Error fetching popular movies:", error);
  }
}

function displayMovies(movies) {
  const filmsContainer = document.getElementById("filmsContainer");
  if (!filmsContainer) {
    console.error("Error: Element #filmsContainer not found.");
    return;
  }

  const existingMovies = new Set(
    [...filmsContainer.querySelectorAll(".film")].map((film) =>
      film.getAttribute("data-id")
    )
  );

  movies.forEach((movie) => {
    const titleLower = movie.title.toLowerCase();

    // Skip if movie already exists or contains banned words
    if (
      existingMovies.has(movie.id.toString()) ||
      bannedWords.some((word) => titleLower.includes(word))
    ) {
      return;
    }

    // Create new movie element
    const filmElement = document.createElement("div");
    filmElement.classList.add(
      "film",
      "border",
      "rounded-lg",
      "shadow",
      "hover:shadow-lg"
    );
    filmElement.setAttribute("data-id", movie.id); // Store ID to prevent duplicates
    filmElement.innerHTML = `
  <img src="${IMAGE_BASE_URL}${movie.poster_path}" alt="${movie.title}" class="w-full h-32 object-cover">
  <div class="p-2">
      <h3 class="text-sm font-bold text-black">${movie.title}</h3>
      <button onclick="viewDetails(${movie.id})" class="mt-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600">View Details</button>
      <button class="favorite-button" onclick="addToFavorites(${movie.id}, '${movie.title.replace("'", "\\'")}', '${IMAGE_BASE_URL}${movie.poster_path}')" class="mt-1 px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600">♥ Favorite</button>
  </div>
`;

    filmsContainer.appendChild(filmElement);
    existingMovies.add(movie.id.toString());
  });
}

// Update movie list (used by search and initial loading)
function updateMovieList(movies) {
  const filmsContainer = document.getElementById("filmsContainer");
  filmsContainer.innerHTML = "";

  movies.forEach((movie) => {
    const filmElement = document.createElement("div");
    filmElement.classList.add(
      "film",
      "border",
      "rounded-lg",
      "shadow",
      "hover:shadow-lg"
    );
    filmElement.innerHTML = `
  <img src="${IMAGE_BASE_URL}${movie.poster_path}" alt="${movie.title}" class="w-full h-32 object-cover">
  <div class="p-2">
      <h3 class="text-sm font-bold text-black">${movie.title}</h3>
      <button onclick="viewDetails(${movie.id})" class="mt-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600">View Details</button>
      <button class="favorite-button" onclick="addToFavorites(${movie.id}, '${movie.title.replace("'", "\\'")}', '${IMAGE_BASE_URL}${movie.poster_path}')" class="mt-1 px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600">♥ Favorite</button>
  </div>
`;
    filmsContainer.appendChild(filmElement);
  });
}

// Load popular movies (initial and after back button)
function loadPopularMovies() {
  const filmsContainer = document.getElementById("filmsContainer");
  const buttonContainer = document.getElementById("buttonContainer");
  const loadMoreBtn = document.getElementById("loadMoreBtn");

  filmsContainer.innerHTML = "";

  // Remove button container if it exists
  if (buttonContainer) {
    buttonContainer.remove();
  }

  // Show load more button
  if (loadMoreBtn) {
    loadMoreBtn.style.display = "block";
    loadMoreBtn.className =
      "px-6 py-2 bg-blue-500 text-white rounded-md text-sm font-bold hover:bg-blue-600 mx-auto block text-center mt-4";
  }

  // Make sure the back button in navbar is hidden
  const backButton = document.getElementById("backButton");
  if (backButton) {
    backButton.classList.add("hidden");
  }

  // Fetch popular movies
  fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`)
    .then((response) => response.json())
    .then((data) => {
      displayMovies(data.results);
    })
    .catch((error) => console.error("Error fetching popular movies:", error));
}

// Load more movies when scrolling
async function loadMoreMovies() {
  currentPage++;

  try {
    let url = "";

    if (currentGenre) {
      url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=${currentGenre}&page=${currentPage}`;
    } else {
      url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${currentPage}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    const filteredMovies = data.results.filter(
      (movie) =>
        !bannedWords.some((word) => movie.title.toLowerCase().includes(word))
    );

    displayMovies(filteredMovies);
  } catch (error) {
    console.error("Error loading more movies:", error);
  }
}

// Search for movies
async function searchFilm() {
  const query = document.getElementById("searchInput").value.trim();
  if (!query) {
    alert("Please enter a keyword to search.");
    return;
  }

  // Check for banned words
  if (bannedWords.some((word) => query.toLowerCase().includes(word))) {
    alert("The search contains restricted words.");
    return;
  }

  // Show films container and hide details
  document.getElementById("filmsContainer").classList.remove("hidden");
  document.getElementById("detailContainer").classList.add("hidden");
  document.getElementById("loadMoreBtn").style.display = "none";
  
  // Remove button container if exists
  const buttonContainer = document.getElementById("buttonContainer");
  if (buttonContainer) {
    buttonContainer.remove();
  }
  
  // Show back button in navbar
  const backButton = document.getElementById("backButton");
  if (backButton) {
    backButton.classList.remove("hidden");
  }

  try {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(
        query
      )}&page=1`
    );
    const data = await response.json();

    // Filter results containing banned words
    const filteredMovies = data.results.filter(
      (movie) =>
        !bannedWords.some((word) => movie.title.toLowerCase().includes(word))
    );

    if (filteredMovies.length === 0) {
      alert("No movies found or they contain restricted words.");
    }

    updateMovieList(filteredMovies);
  } catch (error) {
    console.error("Error searching for movies:", error);
  }
}

// Filter movies by genre
async function filterByGenre() {
  const genre = document.getElementById("genreSelect").value;
  const filmsContainer = document.getElementById("filmsContainer");
  const loadMoreBtn = document.getElementById("loadMoreBtn");
  
  // Remove button container if exists
  const buttonContainer = document.getElementById("buttonContainer");
  if (buttonContainer) {
    buttonContainer.remove();
  }

  currentPage = 1; // Reset page to first
  currentGenre = genre; // Store active genre

  if (!filmsContainer) {
    console.error("Error: Element #filmsContainer not found.");
    return;
  }

  // Clear film list and hide details
  filmsContainer.innerHTML = "";
  document.getElementById("detailContainer").classList.add("hidden");

  // Show load more button
  loadMoreBtn.style.display = "block";
  
  // Show back button in navbar when filtering
  const backButton = document.getElementById("backButton");
  if (backButton) {
    backButton.classList.remove("hidden");
  }

  // If no genre selected (All Genres), show popular movies
  if (!genre) {
    await loadMovies(currentPage);
    return;
  }

  try {
    const response = await fetch(
      `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=${genre}&page=${currentPage}`
    );
    const data = await response.json();

    const filteredMovies = data.results.filter(
      (movie) =>
        !bannedWords.some((word) => movie.title.toLowerCase().includes(word))
    );

    if (filteredMovies.length === 0) {
      filmsContainer.innerHTML = `<p class="text-white text-center">No movies found for this genre.</p>`;
      return;
    }

    displayMovies(filteredMovies);
  } catch (error) {
    console.error("Error filtering movies by genre:", error);
  }
}

// View movie details
async function viewDetails(movieId) {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US&append_to_response=videos,credits,recommendations`
    );
    const data = await response.json();

    const genres = data.genres.map((genre) => genre.name).join(", ");
    const cast = data.credits.cast
      .slice(0, 5)
      .map((member) => member.name)
      .join(", ");
    const trailer = data.videos.results.find(
      (video) => video.type === "Trailer"
    );

    document.getElementById("filmsContainer").classList.add("hidden");
    document.getElementById("loadMoreBtn").style.display = "none";
    const detailContainer = document.getElementById("detailContainer");
    detailContainer.classList.remove("hidden");

    detailContainer.innerHTML = `
  <div class="p-8 bg-black rounded shadow-lg max-w-4xl text-center">
      <div class="mb-8">
          <img src='${IMAGE_BASE_URL}${data.poster_path}' alt='${
      data.title
    }' class='mx-auto w-64 rounded shadow'>
      </div>
      <h1 class='text-4xl font-bold text-white mb-4'>${data.title}</h1>
      <p class='text-white text-lg mb-4'>${data.overview}</p>
      <p class='text-sm text-white mb-2'><strong>Release Date:</strong> ${
        data.release_date
      }</p>
      <p class='text-sm text-white mb-2'><strong>Duration:</strong> ${
        data.runtime
      } minutes</p>
      <p class='text-sm text-white mb-2'><strong>Genres:</strong> ${genres}</p>
      <p class='text-sm text-white mb-4'><strong>Rating:</strong> ${
        data.vote_average
      } / 10</p>
      <p class='text-sm text-white mb-4'><strong>Cast:</strong> ${cast}</p>
      ${
        trailer
          ? `
          <div class="mb-6">
              <iframe class='w-full aspect-video rounded-lg' src='https://www.youtube.com/embed/${trailer.key}' frameborder='0' allowfullscreen></iframe>
          </div>
      `
          : '<p class="text-gray-500">No trailer available for this movie.</p>'
      }
      <button onclick="backToGrid()" class='px-6 py-2 bg-gray-500 text-white rounded-md text-sm font-bold hover:bg-gray-600'>
          Back
      </button>
  </div>
`;

    // Scroll to top for better viewing
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (error) {
    console.error("Error fetching movie details:", error);
  }
}

// Back to movie grid
function backToGrid() {
  document.getElementById("filmsContainer").classList.remove("hidden");
  document.getElementById("detailContainer").classList.add("hidden");

  const loadMoreBtn = document.getElementById("loadMoreBtn");
  const buttonContainer = document.getElementById("buttonContainer");

  // Make sure "Load More" button only appears on main page, not favorites
  if (!buttonContainer) {
    loadMoreBtn.style.display = "block";
  } else {
    loadMoreBtn.style.display = "none";
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ------------------------------
// Modified favorites functions to use PHP API
// ------------------------------

// Add movie to favorites via API
async function addToFavorites(movieId, title, poster) {
  try {
    const response = await fetch('favorites_api.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        movie_id: movieId,
        title: title,
        poster_path: poster
      }),
      credentials: 'same-origin'
    });

    const data = await response.json();
    
    if (data.error) {
      console.error('Error adding favorite:', data.error);
      alert('Failed to add movie to favorites. Please try again.');
    } else {
      alert(`${title} has been added to your favorites!`);
    }
  } catch (error) {
    console.error('Error adding favorite:', error);
    alert('Failed to add movie to favorites. Please try again.');
  }
}

// Remove from favorites via API
async function removeFromFavorites(movieId) {
  try {
    const response = await fetch('favorites_api.php', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        movie_id: movieId
      }),
      credentials: 'same-origin'
    });

    const data = await response.json();
    
    if (data.error) {
      console.error('Error removing favorite:', data.error);
      alert('Failed to remove movie from favorites. Please try again.');
    } else {
      showFavorites(); // Refresh favorites list
    }
  } catch (error) {
    console.error('Error removing favorite:', error);
    alert('Failed to remove movie from favorites. Please try again.');
  }
}

// Display favorites from database
async function showFavorites() {
  try {
    const response = await fetch('favorites_api.php', {
      method: 'GET',
      credentials: 'same-origin'
    });

    const favorites = await response.json();
    
    const filmsContainer = document.getElementById("filmsContainer");
    const loadMoreBtn = document.getElementById("loadMoreBtn");
    
    // Remove any existing button container
    const oldButtonContainer = document.getElementById("buttonContainer");
    if (oldButtonContainer) {
      oldButtonContainer.remove();
    }
    
    // Create a new button container
    const buttonContainer = document.createElement("div");
    buttonContainer.id = "buttonContainer";
    buttonContainer.className = "flex justify-center mt-4";
    filmsContainer.parentNode.insertBefore(buttonContainer, filmsContainer);

    filmsContainer.innerHTML = "";
    buttonContainer.innerHTML = "";

    // Add back button for favorites list (always visible)
    const backButton = document.createElement("button");
    backButton.textContent = "Back to Movies";
    backButton.className =
      "favorite-back-button px-6 py-2 bg-gray-500 text-white rounded-md text-sm font-bold hover:bg-gray-600";
    backButton.onclick = function () {
      buttonContainer.remove(); // Remove the button container
      loadPopularMovies();
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    buttonContainer.appendChild(backButton);

    // Make the navbar back button visible
    const navBackButton = document.getElementById("backButton");
    if (navBackButton) {
      navBackButton.classList.remove("hidden");
      navBackButton.onclick = function() {
        if (buttonContainer) {
          buttonContainer.remove();
        }
        loadPopularMovies();
        navBackButton.classList.add("hidden");
      };
    }

    if (loadMoreBtn) {
      loadMoreBtn.style.display = "none";
    }

    if (favorites.error) {
      filmsContainer.innerHTML = `<p class="text-white text-center">Error loading favorites: ${favorites.error}</p>`;
      return;
    }

    if (favorites.length === 0) {
      filmsContainer.innerHTML = `<p class="text-white text-center">You haven't added any favorites yet.</p>`;
      return;
    }

    favorites.forEach((movie) => {
      const filmElement = document.createElement("div");
      filmElement.classList.add(
        "film",
        "border",
        "rounded-lg",
        "shadow",
        "hover:shadow-lg"
      );
      filmElement.innerHTML = `
    <img src="${movie.poster}" alt="${movie.title}" class="w-full h-40 object-cover">
    <div class="p-3">
        <h3 class="text-base font-bold text-black">${movie.title}</h3>
        <button onclick="viewDetails(${movie.movie_id})" class="mt-2 px-6 py-2 bg-blue-500 text-white rounded-md text-sm font-bold hover:bg-blue-600">View Details</button>
        <button class="favorite-button" onclick="removeFromFavorites(${movie.movie_id})" class="mt-2 px-6 py-2 bg-red-500 text-white rounded-md text-sm font-bold hover:bg-red-600">Remove</button>
    </div>
  `;
      filmsContainer.appendChild(filmElement);
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    alert('Failed to load favorites. Please try again.');
  }
}

// Event listeners
document.addEventListener("DOMContentLoaded", function () {
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual"; // Disable browser's automatic scroll
  }

  // Smooth scroll to top
  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, 100);

  loadPopularMovies();
  
  // Set up back button in navbar
  const backButton = document.getElementById("backButton");
  if (backButton) {
    backButton.onclick = function() {
      const buttonContainer = document.getElementById("buttonContainer");
      if (buttonContainer) {
        buttonContainer.remove();
      }
      loadPopularMovies();
      backButton.classList.add("hidden");
    };
  }
});

window.onload = () => {
  createStars();
  animateStars();
  loadPopularMovies();
  document
    .getElementById("loadMoreBtn")
    .addEventListener("click", loadMoreMovies);

  // Navigation toggle
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      if (navLinks.classList.contains("hidden")) {
        navLinks.classList.remove("hidden");
        navLinks.classList.add("flex");
      } else {
        navLinks.classList.remove("flex");
        navLinks.classList.add("hidden");
      }
    });
  }

  // Search on enter key
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        searchFilm();
      }
    });
  }

  // Prevent context menu and view source
  document.addEventListener("contextmenu", (e) => e.preventDefault());
  document.addEventListener("keydown", function (e) {
    if (e.ctrlKey && e.key.toLowerCase() === "u") {
      e.preventDefault();
    }
  });
};