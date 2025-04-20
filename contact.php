<?php
include 'header.php';
?>


<div class="pt-28 md:pt-24"></div>
<div class="navbar-spacer"></div>

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
        
          href="https://facebook.com"
          target="_blank"
          class="fab fa-facebook-f bg-gray-300 p-2 rounded-full"
        ></a>
        
          href="https://twitter.com"
          target="_blank"
          class="fab fa-twitter bg-gray-300 p-2 rounded-full"
        ></a>
        
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
