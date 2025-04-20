<?php
include 'header.php';
?>

<div class="pt-28 md:pt-24"></div>
<div class="navbar-spacer"></div>
<div id="about" class="container mx-auto my-10 p-8 bg-white rounded-lg shadow-lg w-full">
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

<!-- Make sure to include script.js before footer -->
<script src="script.js"></script>
<script>
    function toggleNav() {
  const navLinks = document.getElementById('navLinks');
  if (navLinks.classList.contains('hidden')) {
    navLinks.classList.remove('hidden');
    navLinks.classList.add('block');
  } else {
    navLinks.classList.remove('block');
    navLinks.classList.add('hidden');
  }
}
</script>

<?php
include 'footer.php';
?>
