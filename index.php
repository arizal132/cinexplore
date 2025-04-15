<?php
// Initialize the session
session_start();

// Check if user is not logged in, redirect to login page
if(!isset($_SESSION["loggedin"]) || $_SESSION["loggedin"] !== true){
    header("location: login.php");
    exit;
}
?>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CinExplore</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="style.css">
  </head>

  <body class="flex flex-col min-h-screen">
    <canvas id="starCanvas"></canvas>
    <nav class="navbar bg-white text-white p-4">
      <div class="container mx-auto flex items-center justify-between">
        <div class="flex items-center">
          <img src="/images/logo.png" alt="" width="70" height="auto" class="mr-2" />
          <img src="/images/name.png" alt="" width="140" height="auto" />
        </div>

        <button
          id="navToggle"
          class="md:hidden bg-black p-2 rounded focus:outline-none"
        >
          <svg
            class="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>

        <ul
          id="navLinks"
          class="hidden md:flex flex-col md:flex-row md:space-x-4 absolute md:static top-16 left-0 w-full md:w-auto bg-white md:bg-transparent md:flex md:items-center"
        >
          <li>
            <a
              href="#home"
              class="block md:inline text-black hover:underline px-4 py-2"
              >Home</a
            >
          </li>
          <li>
            <a
              href="#about"
              class="block md:inline text-black hover:underline px-4 py-2"
              >About</a
            >
          </li>
          <li>
            <a
              href="#contact"
              class="block md:inline text-black hover:underline px-4 py-2"
              >Contact</a
            >
          </li>
          <li>
            <button
              onclick="showFavorites()"
              class="block md:inline text-white bg-red-500 px-4 py-2 rounded"
            >
              Favorites
            </button>
          </li>
          <li>
            <button
              id="backButton"
              class="hidden px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Back
            </button>
          </li>
          <li>
            <span class="block md:inline text-black px-4 py-2">Welcome, <?php echo htmlspecialchars($_SESSION["username"]); ?>!</span>
          </li>
          <li>
            <a href="logout.php" class="block md:inline text-white bg-gray-700 px-4 py-2 rounded">Logout</a>
          </li>
        </ul>
      </div>
    </nav>

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

    <div
      id="about"
      class="container mx-auto my-10 p-8 bg-white rounded-lg shadow-lg w-full"
    >
      <h1 class="text-3xl font-semibold text-gray-700 mt-6 text-center">
        About Us
      </h1>
      <p class="mt-4 text-center">Explore the platform's goals and vision.</p>

      <h2 class="text-2xl font-semibold text-gray-700 mt-6 text-center">
        Our Vision
      </h2>
      <p class="mt-2 text-center">
        CinExplore is the place to find synopses, reviews, and details about
        your favorite movies. Our mission is to help movie enthusiasts explore
        the vast world of cinema with ease and excitement.
      </p>

      <h2 class="text-2xl font-semibold text-gray-700 mt-6 text-center">
        Features
      </h2>
      <ul class="list-disc text-center mx-auto w-3/4 mt-4">
        <li>Find synopses of various film genres</li>
        <li>Rating and review information</li>
        <li>Save your favorite movies to your account</li>
      </ul>

      <h2 class="text-2xl font-semibold text-gray-700 mt-6 text-center">
        Our Team Members
      </h2>
      <div
        class="team grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6"
      >
        <div
          class="team-member p-6 bg-gray-100 rounded-lg shadow-md text-center"
        >
          <h3 class="text-lg font-semibold">John Doe</h3>
          <p>Team Leader, Developer</p>
        </div>
        <div
          class="team-member p-6 bg-gray-100 rounded-lg shadow-md text-center"
        >
          <h3 class="text-lg font-semibold">Jane Smith</h3>
          <p>Designer</p>
        </div>
        <div
          class="team-member p-6 bg-gray-100 rounded-lg shadow-md text-center"
        >
          <h3 class="text-lg font-semibold">Sarah Lee</h3>
          <p>Marketing</p>
        </div>
      </div>
    </div>

    <section
      id="contact"
      class="contact-section container mx-auto my-10 p-8 bg-white rounded-lg shadow-lg w-full text-black"
    >
      <h2 class="text-3xl font-semibold text-center">Contact Us</h2>
      <div class="contact-container flex flex-wrap justify-between gap-6 mt-6">
        <form
          class="contact-form w-full md:w-1/2"
          action="https://formspree.io/f/xaneyqwz"
          method="POST"
        >
          <label for="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Your Name"
            class="w-full p-2 border border-black rounded"
            required
          />
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Your Email"
            class="w-full p-2 border border-black rounded"
            required
          />
          <label for="subject">Subject</label>
          <input
            type="text"
            id="subject"
            name="subject"
            placeholder="Subject (Optional)"
            class="w-full p-2 border border-black rounded"
          />
          <label for="message">Message</label>
          <textarea
            id="message"
            name="message"
            rows="5"
            placeholder="Your Message"
            class="w-full p-2 border border-black rounded"
            required
          ></textarea>
          <button
            type="submit"
            class="block w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Send Message
          </button>
        </form>

        <div
          class="contact-info w-full md:w-1/3 bg-black text-white p-6 rounded"
        >
          <h3 class="text-yellow-600 text-center">
            Alternative Contact Information
          </h3>
          <p><strong>Support Email:</strong> support@cinexplore.com</p>
          <p><strong>Telephone:</strong> 123-456-7890</p>
          <div class="social-icons flex justify-center gap-4 mt-4">
            <a
              href="https://facebook.com"
              target="_blank"
              class="fab fa-facebook-f bg-gray-300 p-2 rounded-full"
            ></a>
            <a
              href="https://twitter.com"
              target="_blank"
              class="fab fa-twitter bg-gray-300 p-2 rounded-full"
            ></a>
            <a
              href="https://instagram.com"
              target="_blank"
              class="fab fa-instagram bg-gray-300 p-2 rounded-full"
            ></a>
          </div>
          <p class="text-center italic mt-4">
            "Movies have the power to inspire, connect, and transport us into
            worlds beyond our imagination. They stir emotions, spark creativity,
            and bring stories to life in the most captivating ways. Through
            cinema, we laugh, cry, dream, and experience adventures that stay
            with us forever. Let's celebrate the magic of storytelling together
            and keep the wonder of film alive for generations to come!"
          </p>
        </div>
      </div>
    </section>

    <footer class="text-black text-center py-4 bg-white">
      <p>Copyright &copy; 2025 CinExplore. All rights reserved.</p>
    </footer>

    <script>
    // Store user ID from PHP session in JavaScript
    const currentUserId = <?php echo $_SESSION["id"]; ?>;
    </script>
    <script src="script.js"></script>
  </body>
</html>