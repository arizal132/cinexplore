<footer class="py-6 bg-white">
  <div class="container mx-auto px-4">
    <!-- Top footer section with columns - equal width for symmetry -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-4">
      <!-- About column -->
      <div class="text-left">
        <h3 class="font-bold text-xl mb-3 text-blue-700">About CinExplore</h3>
        <p class="mb-3 text-gray-700">Your ultimate destination for exploring cinema from around the world. Discover films, create watchlists, and join our community of film enthusiasts.</p>
      </div>
      
      <!-- Quick Links column - increased padding-left to shift further right -->
      <div class="text-left md:pl-14">
        <h3 class="font-bold text-xl mb-3 text-blue-700">Quick Links</h3>
        <ul>
          <li class="mb-2"><a href="index.php" class="text-gray-800 hover:text-blue-600 transition-colors">Home</a></li>
          <li class="mb-2"><a href="about.php" class="text-gray-800 hover:text-blue-600 transition-colors">About Us</a></li>
          <li class="mb-2"><a href="contact.php" class="text-gray-800 hover:text-blue-600 transition-colors">Contact</a></li>
        </ul>
      </div>
      
      <!-- Categories column -->
      <div class="text-left ">
        <h3 class="font-bold text-xl mb-3 text-blue-700">Categories</h3>
        <div class="grid grid-cols-2 gap-x-4">
          <!-- Column 1 -->
          <div>
            <ul>
              <li class="mb-2"><a href="#" onclick="filterByGenreFooter(28); return false;" class="text-gray-800 hover:text-blue-600 transition-colors">Action</a></li>
              <li class="mb-2"><a href="#" onclick="filterByGenreFooter(12); return false;" class="text-gray-800 hover:text-blue-600 transition-colors">Adventure</a></li>
              <li class="mb-2"><a href="#" onclick="filterByGenreFooter(16); return false;" class="text-gray-800 hover:text-blue-600 transition-colors">Animation</a></li>
              <li class="mb-2"><a href="#" onclick="filterByGenreFooter(35); return false;" class="text-gray-800 hover:text-blue-600 transition-colors">Comedy</a></li>
            </ul>
          </div>
          
          <!-- Column 2 -->
          <div>
            <ul>
              <li class="mb-2"><a href="#" onclick="filterByGenreFooter(27); return false;" class="text-gray-800 hover:text-blue-600 transition-colors">Horror</a></li>
              <li class="mb-2"><a href="#" onclick="filterByGenreFooter(9648); return false;" class="text-gray-800 hover:text-blue-600 transition-colors">Mystery</a></li>
              <li class="mb-2"><a href="#" onclick="filterByGenreFooter(10749); return false;" class="text-gray-800 hover:text-blue-600 transition-colors">Romance</a></li>
              <li class="mb-2"><a href="#" onclick="filterByGenreFooter(878); return false;" class="text-gray-800 hover:text-blue-600 transition-colors">Sci-Fi</a></li>
            </ul>
          </div>
        </div>
      </div>
      
      <!-- Newsletter column -->
      <div class="text-left">
        <h3 class="font-bold text-xl mb-3 text-blue-700">Stay Updated</h3>
        <p class="mb-3 text-gray-700">Subscribe to our newsletter for the latest film news and updates</p>
        <form class="flex">
          <input type="email" placeholder="Your email" class="p-2 w-full border border-gray-300 rounded-l focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-800">
          <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700 transition-colors">Join</button>
        </form>
      </div>
    </div>
    
    <!-- Social media links -->
    <div class="flex justify-center space-x-8 my-6">
      <a href="#" class="text-blue-600 hover:text-blue-800 transition-colors">
        <i class="fab fa-facebook-f text-2xl"></i>
      </a>
      <a href="#" class="text-blue-600 hover:text-blue-800 transition-colors">
        <i class="fab fa-twitter text-2xl"></i>
      </a>
      <a href="#" class="text-blue-600 hover:text-blue-800 transition-colors">
        <i class="fab fa-instagram text-2xl"></i>
      </a>
      <a href="#" class="text-blue-600 hover:text-blue-800 transition-colors">
        <i class="fab fa-youtube text-2xl"></i>
      </a>
    </div>
    
    <!-- Copyright line -->
    <div class="border-t border-gray-200 pt-4 mt-4 text-center">
      <p class="text-gray-800">Copyright &copy; 2025 CinExplore. All rights reserved.</p>
      <div class="mt-2">
        <a href="privacy.php" class="text-sm mx-2 text-gray-800 hover:text-blue-600 transition-colors">Privacy Policy</a>
        <span class="text-gray-400">|</span>
        <a href="terms.php" class="text-sm mx-2 text-gray-800 hover:text-blue-600 transition-colors">Terms of Service</a>
      </div>
    </div>
  </div>

  <script>
  // Store user ID from PHP session in JavaScript
  const currentUserId = <?php echo isset($_SESSION["id"]) ? $_SESSION["id"] : 'null'; ?>;
  
  // Function to filter by genre from footer links
  function filterByGenreFooter(genreId) {
    // Set the select element to the selected genre
    const genreSelect = document.getElementById("genreSelect");
    if (genreSelect) {
      genreSelect.value = genreId;
    }
    
    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: "smooth" });
    
    // Call the existing filter function
    filterByGenre();
  }
  </script>
  <script src="script.js"></script>
  <!-- Add Font Awesome for social icons -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js"></script>
</body>
</html>
