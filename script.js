// Array to store reviews (simulating a database for now)
let reviews = [];

// Function to display reviews on the main page
function displayReviews() {
  const reviewsContainer = document.getElementById('reviews-container');
  reviewsContainer.innerHTML = '';

  reviews.forEach((review, index) => {
    const reviewElement = document.createElement('div');
    reviewElement.classList.add('review');
    reviewElement.innerHTML = `
      <h3>${review.title}</h3>
      <p class="rating">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</p>
      <p>${review.text}</p>
      <button onclick="deleteReview(${index})">Delete</button>
    `;
    reviewsContainer.appendChild(reviewElement);
  });
}

// Function to handle star rating selection
function setupStarRating() {
  const stars = document.querySelectorAll('.star-rating span');
  const ratingInput = document.getElementById('rating');

  stars.forEach((star) => {
    star.addEventListener('click', () => {
      const value = star.getAttribute('data-value');
      ratingInput.value = value;

      // Highlight selected stars
      stars.forEach((s, i) => {
        if (i < value) {
          s.classList.add('active');
        } else {
          s.classList.remove('active');
        }
      });
    });
  });
}

// Function to add a new review
function addReview(event) {
  event.preventDefault();

  const title = document.getElementById('book-title').value;
  const rating = document.getElementById('rating').value;
  const text = document.getElementById('review-text').value;

  const review = {
    title,
    rating,
    text,
  };

  reviews.push(review);
  localStorage.setItem('reviews', JSON.stringify(reviews));
  window.location.href = 'index.html';
}

// Function to delete a review
function deleteReview(index) {
  reviews.splice(index, 1);
  localStorage.setItem('reviews', JSON.stringify(reviews));
  displayReviews();
}

// Load reviews from localStorage on page load
window.onload = () => {
  if (localStorage.getItem('reviews')) {
    reviews = JSON.parse(localStorage.getItem('reviews'));
  }

  if (window.location.pathname.endsWith('index.html')) {
    displayReviews();
  } else if (window.location.pathname.endsWith('review.html')) {
    document.getElementById('review-form').addEventListener('submit', addReview);
    setupStarRating(); // Initialize star rating functionality
  }
};