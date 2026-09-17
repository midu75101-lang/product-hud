// Search
const searchInput = document.querySelector(".search-box input");
const searchButton = document.querySelector(".search-box button");
const productCards = document.querySelectorAll(".product-card");

if (searchInput && searchButton) {
  searchButton.addEventListener("click", function () {
    const searchText = searchInput.value.toLowerCase().trim();

    productCards.forEach(function (card) {
      const productName = card.querySelector("h3").textContent.toLowerCase();

      if (productName.includes(searchText)) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
}
// Login
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = loginForm.querySelector('input[type="email"]').value.trim();
    const password = loginForm.querySelector('input[type="password"]').value;

    const savedEmail = localStorage.getItem("userEmail");
    const savedPassword = localStorage.getItem("userPassword");

    if (email === savedEmail && password === savedPassword) {
      alert("Login successful!");
      window.location.href = "index.html";
    } else {
      alert("Invalid email or password!");
    }
  });
}
// Signup
const signupForm = document.getElementById("signupForm");

if (signupForm) {
  signupForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = signupForm.querySelector('input[type="text"]').value;
    const email = signupForm.querySelector('input[type="email"]').value;
    const password = signupForm.querySelector('input[type="password"]').value;
    const confirmPassword = signupForm.querySelectorAll('input[type="password"]')[1].value;

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    localStorage.setItem("userName", name);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userPassword", password);

    alert("Account created successfully!");

    window.location.href = "login.html";
  });
}
// Save Product
 const saveProductBtn = document.getElementById("saveProductBtn");

if (saveProductBtn) {
const savedProduct = localStorage.getItem("savedProduct");

if (savedProduct) {
    saveProductBtn.textContent = "✓ Saved";
}
    saveProductBtn.addEventListener("click", function () {

        const savedProduct = localStorage.getItem("savedProduct");

        if (savedProduct) {

            localStorage.removeItem("savedProduct");

            saveProductBtn.textContent = "♡ Save Product";
            saveProductBtn.disabled = false;

        } else {

            const product = {
                name: "Wireless Smart Watch",
                price: "$29.99",
                profit: "$15 - $25",
                image: document.querySelector(".product-image img")?.src || ""
            };

            localStorage.setItem("savedProduct", JSON.stringify(product));

            saveProductBtn.textContent = "✓ Saved";
            saveProductBtn.disabled = false;
        }

    });

}
// Show Saved Product

const savedProductsList = document.getElementById("savedProductsList");

if (savedProductsList) {

  const savedProduct = JSON.parse(localStorage.getItem("savedProduct"));

  if (savedProduct) {

    savedProductsList.innerHTML = `
      <div class="saved-product-card">

        <img src="${savedProduct.image}" alt="${savedProduct.name}">

        <div class="saved-product-info">
          <h2>${savedProduct.name}</h2>
          <p>${savedProduct.profit}</p>
          <div class="saved-product-price">${savedProduct.price}</div>
        </div>

      </div>
    `;

  } else {

    savedProductsList.innerHTML = `
      <p>No saved products yet.</p>
    `;
  }
}

const addToCartBtn = document.getElementById("addToCartBtn");
if (addToCartBtn) {
  addToCartBtn.addEventListener("click", function () {

    const product = {
      name: "Wireless Smart Watch",
      price: "$29.99",
      image: document.querySelector(".product-image img")?.src || ""
    };

    localStorage.setItem("cartProduct", JSON.stringify(product));

    alert("Product added to cart!");
  });
 } 
// Category Filter
const categoryCards = document.querySelectorAll(".category-card");

categoryCards.forEach(function (category) {
  category.addEventListener("click", function () {
    const selectedCategory = category.dataset.category;
    const productCards = document.querySelectorAll(".product-card");

    productCards.forEach(function (product) {
      const productText = product.textContent.toLowerCase();

      if (
        selectedCategory === "trending" ||
        (selectedCategory === "home" && productText.includes("kitchen")) ||
        (selectedCategory === "gadgets" && productText.includes("gadget")) ||
        (selectedCategory === "wood" && productText.includes("wood"))
      ) {
        product.style.display = "block";
      } else {
        product.style.display = "none";
      }
    });
  });
});
// View All Products
const viewAllBtn = document.getElementById("viewAllBtn");

if (viewAllBtn) {
  viewAllBtn.addEventListener("click", function () {
    const productCards = document.querySelectorAll(".product-card");

    productCards.forEach(function (product) {
      product.style.display = "block";
    });
  });
}