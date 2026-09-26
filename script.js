document.addEventListener("DOMContentLoaded", function () {

  // =========================
  // SEARCH + CATEGORY FILTER
  // =========================

  const searchInput = document.querySelector(".search-box input");
  const searchButton = document.querySelector(".search-box button");
  const categoryCards = document.querySelectorAll(".category-card");

  let selectedCategory = "trending";

  function filterProducts() {
    const productCards = document.querySelectorAll(".product-card");
    const searchText = searchInput
      ? searchInput.value.toLowerCase().trim()
      : "";

    productCards.forEach(function (product) {
      const productText = product.textContent.toLowerCase();

      const matchesSearch = productText.includes(searchText);

      let matchesCategory = true;

      if (selectedCategory === "home") {
        matchesCategory = productText.includes("kitchen");
      } else if (selectedCategory === "gadgets") {
        matchesCategory = productText.includes("gadget");
      } else if (selectedCategory === "wood") {
        matchesCategory = productText.includes("wood");
      }

      product.style.display =
        matchesSearch && matchesCategory ? "" : "none";
    });
  }

  if (searchButton) {
    searchButton.addEventListener("click", filterProducts);
  }

  if (searchInput) {
    searchInput.addEventListener("input", filterProducts);

    searchInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        filterProducts();
      }
    });
  }

  categoryCards.forEach(function (category) {
    category.addEventListener("click", function () {
      selectedCategory = category.dataset.category || "trending";
      filterProducts();
    });
  });


  // =========================
  // LOGIN
  // =========================

  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const emailInput = loginForm.querySelector('input[type="email"]');
      const passwordInput = loginForm.querySelector('input[type="password"]');

      if (!emailInput || !passwordInput) return;

      const email = emailInput.value.trim();
      const password = passwordInput.value;

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


  // =========================
  // SIGNUP
  // =========================

  const signupForm = document.getElementById("signupForm");

  if (signupForm) {
    signupForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const nameInput = signupForm.querySelector('input[type="text"]');
      const emailInput = signupForm.querySelector('input[type="email"]');
      const passwordInputs = signupForm.querySelectorAll(
        'input[type="password"]'
      );

      if (
        !nameInput ||
        !emailInput ||
        passwordInputs.length < 2
      ) {
        alert("Signup form fields are missing.");
        return;
      }

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const password = passwordInputs[0].value;
      const confirmPassword = passwordInputs[1].value;

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


  // =========================
  // SAVE / UNSAVE PRODUCT
  // =========================

  const saveProductBtn = document.getElementById("saveProductBtn");

  if (saveProductBtn) {
    const savedProduct = localStorage.getItem("savedProduct");

    if (savedProduct) {
      saveProductBtn.textContent = "✓ Saved";
    } else {
      saveProductBtn.textContent = "♡ Save Product";
    }

    saveProductBtn.addEventListener("click", function () {
      const existingProduct = localStorage.getItem("savedProduct");

      if (existingProduct) {
        localStorage.removeItem("savedProduct");
        saveProductBtn.textContent = "♡ Save Product";
        saveProductBtn.disabled = false;
      } else {
        const product = {
          name: "Wireless Smart Watch",
          price: "$29.99",
          profit: "$15 - $25",
          image:
            document.querySelector(".product-image img")?.src || ""
        };

        localStorage.setItem(
          "savedProduct",
          JSON.stringify(product)
        );

        saveProductBtn.textContent = "✓ Saved";
        saveProductBtn.disabled = false;
      }
    });
  }


  // =========================
  // SHOW SAVED PRODUCT
  // =========================

  const savedProductsList = document.getElementById("savedProductsList");

  if (savedProductsList) {
    const savedProductData = localStorage.getItem("savedProduct");

    if (savedProductData) {
      try {
        const savedProduct = JSON.parse(savedProductData);

        savedProductsList.innerHTML = `
          <div class="saved-product-card">
            <img
              src="${savedProduct.image || ""}"
              alt="${savedProduct.name || "Saved Product"}"
            >

            <div class="saved-product-info">
              <h2>${savedProduct.name || ""}</h2>
              <p>${savedProduct.profit || ""}</p>
              <div class="saved-product-price">
                ${savedProduct.price || ""}
              </div>
            </div>
          </div>
        `;
      } catch (error) {
        savedProductsList.innerHTML = "<p>No saved products yet.</p>";
      }
    } else {
      savedProductsList.innerHTML = "<p>No saved products yet.</p>";
    }
  }


  // =========================
  // ADD TO CART
  // =========================

  const addToCartBtn = document.getElementById("addToCartBtn");

  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", function () {
      const product = {
        name: "Wireless Smart Watch",
        price: "$29.99",
        image:
          document.querySelector(".product-image img")?.src || ""
      };

      localStorage.setItem("cartProduct", JSON.stringify(product));

      alert("Product added to cart!");
    });
  }

});
