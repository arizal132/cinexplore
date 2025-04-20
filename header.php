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
    <!-- Fixed navbar with z-index to stay on top -->
    <nav class="navbar bg-white text-white p-4 fixed top-0 z-50 w-full">
      <div class="container mx-auto flex flex-col md:flex-row items-center md:justify-between justify-start">
        <div class="flex items-center self-start md:self-auto mb-2 md:mb-0">
          <img src="/images/logo.png" alt="" width="70" height="auto" class="mr-2" />
          <img src="/images/name.png" alt="" width="140" height="auto" />
        </div>

        <button
          id="navToggle"
          class="md:hidden bg-black p-2 rounded focus:outline-none"
          onclick="toggleNav()"
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
              href="/index.php"
              class="block md:inline text-black hover:underline px-4 py-2"
              >Home</a
            >
          </li>
          <li>
            <a
              href="/about.php"
              class="block md:inline text-black hover:underline px-4 py-2"
              >About</a
            >
          </li>
          <li>
            <a
              href="/contact.php"
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

    <!-- Add the JavaScript for navbar toggle functionality -->
    <script>

    </script>
