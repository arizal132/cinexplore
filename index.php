<?php
include 'header.php';
?>

<!-- Add extra spacing here to push content down -->
<div class="pt-28 md:pt-24"></div>


       <div class="navbar-spacer"></div>

    <!-- Header section -->
    <header id="home" class="text-white text-center py-10">
      <h1 class="text-4xl font-bold">Welcome to CinExplore</h1>
      <p class="mt-2 text-lg">Discover the magic of movies</p>
    </header>
    
    <div class="search-bar text-center my-5">
      <input
        type="text"
        placeholder="Search for films..."
        id="searchInput"
        class="p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        onclick="searchFilm()"
        class="ml-2 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
      >
        Search
      </button>
    </div>

    <div class="genre-filter text-center my-5">
      <select
        id="genreSelect"
        class="p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black"
      >
        <option value="">All Genres</option>
        <option value="28">Action</option>
        <option value="12">Adventure</option>
        <option value="16">Animation</option>
        <option value="35">Comedy</option>
        <option value="80">Crime</option>
        <option value="99">Documentary</option>
        <option value="18">Drama</option>
        <option value="10751">Family</option>
        <option value="14">Fantasy</option>
        <option value="36">History</option>
        <option value="27">Horror</option>
        <option value="10402">Music</option>
        <option value="9648">Mystery</option>
        <option value="10749">Romance</option>
        <option value="878">Science Fiction</option>
        <option value="10770">TV Movie</option>
        <option value="53">Thriller</option>
        <option value="10752">War</option>
        <option value="37">Western</option>
      </select>
      <button
        onclick="filterByGenre()"
        class="hover ml-2 px-4 py-2 bg-blue-500 text-white rounded-full"
      >
        Filter
      </button>
    </div>
    <!-- After the genre filter section, add this button -->
<div class="text-center my-5">
  <button
    onclick="loadUpcomingMovies()"
    class="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600"
  >
    Upcoming Movies
  </button>
</div>
    <div
      id="detailContainer"
      class="hidden min-h-screen flex justify-center items-center bg-black"
    ></div>

    <section
      class="films grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6 gap-4 p-2"
      id="filmsContainer"
    ></section>

    <div class="text-center my-4">
      <button
        id="loadMoreBtn"
        class="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
      >
        Load More
      </button>
    </div>

    <script>

    </script>

<?php
include 'footer.php';
?>
