const API_KEY = "5eca9a687486a7f124887df8fcb1060e";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const bannedWords = [];

// Global state variables
let currentPage = 1;
let currentGenre = "";
let upcomingCurrentPage = 1;
const MAX_UPCOMING_YEARS = 5;
let isUpcomingMoviesView = false; // Track if we're in upcoming movies view

// Canvas and star animation functions
const canvas = document.getElementById("starCanvas");
const ctx = canvas.getContext("2d");
let stars = [];

function setupCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  createStars();
}

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

// UI helpers
function toggleNavLinks() {
  const navLinks = document.getElementById("navLinks");
  if (navLinks.classList.contains("hidden")) {
    navLinks.classList.remove("hidden");
    navLinks.classList.add("flex");
  } else {
    navLinks.classList.remove("flex");
    navLinks.classList.add("hidden");
  }
}

function showElement(elementId) {
  const element = document.getElementById(elementId);
  if (element) element.classList.remove("hidden");
}

function hideElement(elementId) {
  const element = document.getElementById(elementId);
  if (element) element.classList.add("hidden");
}

function toggleLoadMoreButton(show) {
  const loadMoreBtn = document.getElementById("loadMoreBtn");
  if (loadMoreBtn) {
    loadMoreBtn.style.display = show ? "block" : "none";
    // Ensure the button has the center positioning classes
    loadMoreBtn.className = "px-6 py-2 bg-blue-500 text-white rounded-md text-sm font-bold hover:bg-blue-600 mx-auto block text-center mt-4";
  }
}

function toggleBackButton(show) {
  const backButton = document.getElementById("backButton");
  if (backButton) {
    if (show) {
      backButton.classList.remove("hidden");
    } else {
      backButton.classList.add("hidden");
    }
  }
}

function removeButtonContainer() {
  const buttonContainer = document.getElementById("buttonContainer");
  if (buttonContainer) buttonContainer.remove();
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Date utility functions
function getFutureDate() {
  const today = new Date();
  const futureDate = new Date(today);
  futureDate.setFullYear(today.getFullYear() + MAX_UPCOMING_YEARS);
  return futureDate.toISOString().split('T')[0];
}

function getTodayDate() {
  return new Date().toISOString().split('T')[0];
}

function formatDate(dateString) {
  if (!dateString) return "Unknown";
  
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

// Movie data fetching functions
async function fetchMovieData(url) {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return { results: [] };
  }
}

async function loadMovies(page = 1) {
  const data = await fetchMovieData(
    `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`
  );
  displayMovies(data.results);
}

async function searchMovies(query) {
  const data = await fetchMovieData(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(
      query
    )}&page=1`
  );
  return filterBannedWords(data.results);
}

async function fetchMoviesByGenre(genre, page = 1) {
  const data = await fetchMovieData(
    `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=${genre}&page=${page}`
  );
  return filterBannedWords(data.results);
}

async function fetchMovieDetails(movieId) {
  return await fetchMovieData(
    `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US&append_to_response=videos,credits,recommendations`
  );
}

function filterBannedWords(movies) {
  return movies.filter(
    (movie) =>
      !bannedWords.some((word) => movie.title.toLowerCase().includes(word))
  );
}

// Movie display functions
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
    // Skip if movie already exists or contains banned words
    if (
      existingMovies.has(movie.id.toString()) ||
      bannedWords.some((word) => movie.title.toLowerCase().includes(word))
    ) {
      return;
    }

    const filmElement = createMovieElement(movie);
    filmsContainer.appendChild(filmElement);
    existingMovies.add(movie.id.toString());
  });
}

function updateMovieList(movies) {
  const filmsContainer = document.getElementById("filmsContainer");
  filmsContainer.innerHTML = "";

  movies.forEach((movie) => {
    const filmElement = createMovieElement(movie);
    filmsContainer.appendChild(filmElement);
  });
}

function createMovieElement(movie) {
  const filmElement = document.createElement("div");
  filmElement.classList.add(
    "film",
    "border",
    "rounded-lg",
    "shadow",
    "hover:shadow-lg"
  );
  filmElement.setAttribute("data-id", movie.id);
  
  const posterPath = movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : '/placeholder.jpg';
  
  filmElement.innerHTML = `
    <img src="${posterPath}" alt="${movie.title}" class="w-full h-32 object-cover">
    <div class="p-2">
      <h3 class="text-sm font-bold text-black">${movie.title}</h3>
      <button onclick="viewDetails(${movie.id})" class="mt-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600">View Details</button>
      <button class="favorite-button" onclick="addToFavorites(${movie.id}, '${movie.title.replace("'", "\\'")}', '${posterPath}')" class="mt-1 px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600">♥ Favorite</button>
    </div>
  `;
  
  return filmElement;
}

// Upcoming movies functions
function displayUpcomingMovies(movies) {
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
    // Skip if movie already exists or contains banned words
    if (
      existingMovies.has(movie.id.toString()) ||
      bannedWords.some((word) => movie.title.toLowerCase().includes(word))
    ) {
      return;
    }

    const filmElement = createUpcomingMovieElement(movie);
    filmsContainer.appendChild(filmElement);
    existingMovies.add(movie.id.toString());
  });
}

function createUpcomingMovieElement(movie) {
  const filmElement = document.createElement("div");
  filmElement.classList.add(
    "film",
    "border",
    "rounded-lg",
    "shadow",
    "hover:shadow-lg"
  );
  filmElement.setAttribute("data-id", movie.id);
  
  const posterPath = movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : '/placeholder.jpg';
  const releaseDate = formatDate(movie.release_date);
  
  filmElement.innerHTML = `
    <img src="${posterPath}" alt="${movie.title}" class="w-full h-32 object-cover">
    <div class="p-2">
      <h3 class="text-sm font-bold text-black">${movie.title}</h3>
      <p class="text-xs text-gray-600 mb-1">Release: ${releaseDate}</p>
      <button onclick="viewDetails(${movie.id})" class="mt-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600">View Details</button>
      <button class="favorite-button" onclick="addToFavorites(${movie.id}, '${movie.title.replace("'", "\\'")}', '${posterPath}')" class="mt-1 px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600">♥ Favorite</button>
    </div>
  `;
  
  return filmElement;
}

// Modified loadUpcomingMovies function to show only popular upcoming movies
async function loadUpcomingMovies(page = 1) {
  try {
    // Clear current display if first page
    const filmsContainer = document.getElementById("filmsContainer");
    if (page === 1) {
      filmsContainer.innerHTML = "";
      filmsContainer.innerHTML = "<p class='text-center text-white'>Loading upcoming unreleased movies...</p>";
    }
    
    // Get current date in YYYY-MM-DD format for filtering
    const today = getTodayDate();
    
    // Fetch upcoming movies that release after today
    const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}&primary_release_date.gte=${today}`;
    
    const data = await fetchMovieData(url);
    
    // Display movies and update UI
    if (page === 1) {
      filmsContainer.innerHTML = "";
      
      // Create a heading for the upcoming movies section
      const heading = document.createElement("div");
      heading.className = "col-span-full text-center mb-6";
      heading.innerHTML = `<h2 class="text-2xl font-bold text-white"> Popular Upcoming Movies</h2>
                          <p class="text-gray-300">Movies releasing after ${formatDate(today)}</p>`;
      filmsContainer.appendChild(heading);
      
      // Set flag for upcoming movies view
      isUpcomingMoviesView = true;
    }
    
    // Display the movies with release dates
    displayUpcomingMovies(data.results);
    
    // Show load more button and back button
    toggleLoadMoreButton(true);
    toggleBackButton(true);
    
    // Configure back button functionality
    const backButton = document.getElementById("backButton");
    if (backButton) {
      backButton.onclick = function() {
        isUpcomingMoviesView = false;
        loadPopularMovies();
        toggleBackButton(false);
      };
    }
    
    // Remove any existing button container
    removeButtonContainer();
    
  } catch (error) {
    console.error("Error loading upcoming movies:", error);
    document.getElementById("filmsContainer").innerHTML = 
      "<p class='text-center text-white'>Error loading upcoming movies. Please try again later.</p>";
  }
}
// Main app functions
function loadPopularMovies() {
  const filmsContainer = document.getElementById("filmsContainer");
  filmsContainer.innerHTML = "";
  
  removeButtonContainer();
  toggleLoadMoreButton(true);
  toggleBackButton(false);
  
  currentPage = 1;
  currentGenre = "";
  upcomingCurrentPage = 1;
  isUpcomingMoviesView = false;
  
  loadMovies(currentPage);
}

async function loadMoreMovies() {
  // Handle different types of movie listings
  if (isUpcomingMoviesView) {
    upcomingCurrentPage++;
    await loadUpcomingMovies(upcomingCurrentPage);
  } else {
    currentPage++;
    try {
      let url;
      if (currentGenre) {
        url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=${currentGenre}&page=${currentPage}`;
      } else {
        url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${currentPage}`;
      }

      const data = await fetchMovieData(url);
      const filteredMovies = filterBannedWords(data.results);
      displayMovies(filteredMovies);
    } catch (error) {
      console.error("Error loading more movies:", error);
    }
  }
}

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

  showElement("filmsContainer");
  hideElement("detailContainer");
  toggleLoadMoreButton(false);
  removeButtonContainer();
  toggleBackButton(true);
  
  // Reset the flag
  isUpcomingMoviesView = false;

  const movies = await searchMovies(query);
  
  if (movies.length === 0) {
    alert("No movies found or they contain restricted words.");
  }

  updateMovieList(movies);
}

async function filterByGenre() {
  const genre = document.getElementById("genreSelect").value;
  const filmsContainer = document.getElementById("filmsContainer");
  
  removeButtonContainer();
  currentPage = 1;
  currentGenre = genre;
  
  // Reset the flag
  isUpcomingMoviesView = false;

  filmsContainer.innerHTML = "";
  hideElement("detailContainer");
  toggleLoadMoreButton(true);
  toggleBackButton(true);

  // If no genre selected (All Genres), show popular movies
  if (!genre) {
    await loadMovies(currentPage);
    return;
  }

  const movies = await fetchMoviesByGenre(genre, currentPage);

  if (movies.length === 0) {
    filmsContainer.innerHTML = `<p class="text-white text-center">No movies found for this genre.</p>`;
    return;
  }

  displayMovies(movies);
}

async function viewDetails(movieId) {
  try {
    const data = await fetchMovieDetails(movieId);

    const genres = data.genres.map((genre) => genre.name).join(", ");
    const cast = data.credits?.cast
      ?.slice(0, 5)
      .map((member) => member.name)
      .join(", ") || "Information not available";
      
    const trailer = data.videos?.results?.find(
      (video) => video.type === "Trailer"
    );

    hideElement("filmsContainer");
    toggleLoadMoreButton(false);
    
    const detailContainer = document.getElementById("detailContainer");
    showElement("detailContainer");

    detailContainer.innerHTML = `
      <div class="p-8 bg-black rounded shadow-lg max-w-4xl text-center">
        <div class="mb-8">
          <img src='${IMAGE_BASE_URL}${data.poster_path}' alt='${data.title}' class='mx-auto w-64 rounded shadow'>
        </div>
        <h1 class='text-4xl font-bold text-white mb-4'>${data.title}</h1>
        <p class='text-white text-lg mb-4'>${data.overview}</p>
        <p class='text-sm text-white mb-2'><strong>Release Date:</strong> ${data.release_date}</p>
        <p class='text-sm text-white mb-2'><strong>Duration:</strong> ${data.runtime} minutes</p>
        <p class='text-sm text-white mb-2'><strong>Genres:</strong> ${genres}</p>
        <p class='text-sm text-white mb-4'><strong>Rating:</strong> ${data.vote_average} / 10</p>
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

    scrollToTop();
  } catch (error) {
    console.error("Error fetching movie details:", error);
  }
}

function backToGrid() {
  showElement("filmsContainer");
  hideElement("detailContainer");

  const loadMoreBtn = document.getElementById("loadMoreBtn");
  const buttonContainer = document.getElementById("buttonContainer");

  if (!buttonContainer) {
    loadMoreBtn.style.display = "block";
  } else {
    loadMoreBtn.style.display = "none";
  }

  scrollToTop();
}

// Favorites functions
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

async function showFavorites() {
  try {
    const response = await fetch('favorites_api.php', {
      method: 'GET',
      credentials: 'same-origin'
    });

    const favorites = await response.json();
    
    const filmsContainer = document.getElementById("filmsContainer");
    
    removeButtonContainer();
    
    // Create a new button container
    const buttonContainer = document.createElement("div");
    buttonContainer.id = "buttonContainer";
    buttonContainer.className = "flex justify-center mt-4";
    filmsContainer.parentNode.insertBefore(buttonContainer, filmsContainer);

    filmsContainer.innerHTML = "";
    buttonContainer.innerHTML = "";

    // Add back button for favorites list
    const backButton = document.createElement("button");
    backButton.textContent = "Back to Movies";
    backButton.className =
      "favorite-back-button px-6 py-2 bg-gray-500 text-white rounded-md text-sm font-bold hover:bg-gray-600";
    backButton.onclick = function () {
      buttonContainer.remove();
      loadPopularMovies();
      toggleBackButton(false);
      scrollToTop();
    };

    buttonContainer.appendChild(backButton);

    // Make the navbar back button visible
    toggleBackButton(true);
    const navBackButton = document.getElementById("backButton");
    if (navBackButton) {
      navBackButton.onclick = function() {
        buttonContainer.remove();
        loadPopularMovies();
        toggleBackButton(false);
      };
    }

    toggleLoadMoreButton(false);

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

    scrollToTop();
  } catch (error) {
    console.error('Error fetching favorites:', error);
    alert('Failed to load favorites. Please try again.');
  }
}

// Event listeners
document.addEventListener("DOMContentLoaded", function () {
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  setTimeout(() => {
    scrollToTop();
  }, 100);

  loadPopularMovies();
  
  // Set up back button in navbar
  const backButton = document.getElementById("backButton");
  if (backButton) {
    toggleBackButton(false);
    
    backButton.onclick = function() {
      removeButtonContainer();
      loadPopularMovies();
      toggleBackButton(false);
    };
  }
  
  // Make sure the load more button is properly centered from start
  const loadMoreBtn = document.getElementById("loadMoreBtn");
  if (loadMoreBtn) {
    loadMoreBtn.className = "px-6 py-2 bg-blue-500 text-white rounded-md text-sm font-bold hover:bg-blue-600 mx-auto block text-center mt-4";
  }
});

window.onload = function() {
  setupCanvas();
  animateStars();
  
  // Add event listeners
  const loadMoreBtn = document.getElementById("loadMoreBtn");
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", loadMoreMovies);
    // Ensure consistent styling for centering
    loadMoreBtn.className = "px-6 py-2 bg-blue-500 text-white rounded-md text-sm font-bold hover:bg-blue-600 mx-auto block text-center mt-4";
  }

  const navToggle = document.getElementById("navToggle");
  if (navToggle) {
    navToggle.addEventListener("click", toggleNavLinks);
  }

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

// Handle window resize
window.addEventListener("resize", setupCanvas);