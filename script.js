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
async function addReview(event) {
  event.preventDefault();
  const token = localStorage.getItem('token');

  if (!token) {
    alert('Please log in to submit a review.');
    window.location.href = 'login.html';
    return;
  }

  const title = document.getElementById('book-title').value;
  const rating = document.getElementById('rating').value;
  const text = document.getElementById('review-text').value;

  try {
    const response = await fetch('http://localhost:3000/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify({ bookTitle: title, rating, reviewText: text }),
    });

    if (response.ok) {
      alert('Review submitted!');
      window.location.href = 'index.html';
    } else {
      const error = await response.text();
      document.getElementById('review-error').textContent = error;
    }
  } catch (err) {
    console.error('Error submitting review:', err);
  }
}

// Function to delete a review
function deleteReview(index) {
  reviews.splice(index, 1);
  localStorage.setItem('reviews', JSON.stringify(reviews));
  displayReviews();
}

// Function to handle sign-up
document.getElementById('signup-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('signup-username').value;
  const password = document.getElementById('signup-password').value;

  try {
    const response = await fetch('http://localhost:3000/signup', {
      method: 'POST', // Ensure this is POST
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      alert('User created! Please log in.');
    } else {
      const error = await response.text();
      document.getElementById('signup-error').textContent = error;
    }
  } catch (err) {
    console.error('Error signing up:', err);
    document.getElementById('signup-error').textContent = 'Failed to connect to the server.';
  }
});

// Function to handle login
document.getElementById('login-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  try {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.token); // Save the token
      localStorage.setItem('userId', data.userId); // Save the user ID
      alert('Logged in!');
      window.location.href = 'index.html';
    } else {
      const error = await response.text();
      document.getElementById('login-error').textContent = error;
    }
  } catch (err) {
    console.error('Error logging in:', err);
  }
});

// Function to check if the user is logged in
function checkLogin() {
  const token = localStorage.getItem('token');
  const accountTab = document.getElementById('account-tab');

  if (token) {
    accountTab.textContent = 'Log Out';
    accountTab.href = '#';
    accountTab.onclick = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      window.location.href = 'index.html';
    };
  } else {
    accountTab.textContent = 'Account';
    accountTab.href = 'login.html';
  }
}

// Load reviews and check login status when the page loads
window.onload = () => {
  if (localStorage.getItem('reviews')) {
    reviews = JSON.parse(localStorage.getItem('reviews'));
  }

  if (window.location.pathname.endsWith('index.html')) {
    displayReviews();
    checkLogin();
  } else if (window.location.pathname.endsWith('review.html')) {
    document.getElementById('review-form').addEventListener('submit', addReview);
    setupStarRating(); // Initialize star rating functionality
  }
};