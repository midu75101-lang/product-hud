document.addEventListener("DOMContentLoaded", function () {

  // ==========================================
  // SUPABASE CLIENT
  // ==========================================

  const supabaseClient =
    typeof supabase !== "undefined" ? supabase : null;


  // ==========================================
  // HELPER FUNCTIONS
  // ==========================================

  function getProductData(element) {
    const card = element?.closest(".product-card") || element;

    const name =
      card?.querySelector("h3")?.textContent?.trim() ||
      document.querySelector(".product-image h1")?.textContent?.trim() ||
      document.querySelector("h1")?.textContent?.trim() ||
      "Wireless Smart Watch";

    const price =
      card?.querySelector(".price")?.textContent?.trim() ||
      card?.querySelector(".product-price")?.textContent?.trim() ||
      document.querySelector(".product-price")?.textContent?.trim() ||
      "$29.99";

    const image =
      card?.querySelector("img")?.src ||
      document.querySelector(".product-image img")?.src ||
      "";

    const profit =
      card?.querySelector(".profit")?.textContent?.trim() ||
      document.querySelector(".profit")?.textContent?.trim() ||
      "$15 - $25";

    return { name, price, image, profit };
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[char];
    });
  }


  // ==========================================
  // SEARCH + CATEGORY FILTER
  // ==========================================

  const searchInput = document.querySelector(".search-box input");
  const searchButton = document.querySelector(".search-box button");
  const categoryCards = document.querySelectorAll(".category-card");

  let selectedCategory = "";

  function filterProducts() {
    const productCards = document.querySelectorAll(".product-card");

    const searchText = searchInput
      ? searchInput.value.toLowerCase().trim()
      : "";

    productCards.forEach(function (card) {
      const productText = card.textContent.toLowerCase();

      const matchesSearch = productText.includes(searchText);

      let matchesCategory = true;

      if (selectedCategory === "home") {
        matchesCategory = productText.includes("kitchen");
      } else if (selectedCategory === "gadgets") {
        matchesCategory = productText.includes("gadget");
      } else if (selectedCategory === "wood") {
        matchesCategory = productText.includes("wood");
      }

      card.style.display =
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
      selectedCategory = category.dataset.category || "";
      filterProducts();
    });
  });


  // ==========================================
  // SUPABASE SIGNUP
  // ==========================================

  const signupForm = document.getElementById("signupForm");

  if (signupForm) {
    signupForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      if (!supabaseClient) {
        alert("Supabase connection not found. Check supabase.js.");
        return;
      }

      const nameInput = signupForm.querySelector('input[type="text"]');
      const emailInput = signupForm.querySelector('input[type="email"]');
      const passwordInputs = signupForm.querySelectorAll(
        'input[type="password"]'
      );

      if (!nameInput || !emailInput || passwordInputs.length < 2) {
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

      try {
        const { data, error } = await supabaseClient.auth.signUp({
          email: email,
          password: password,
          options: {
            data: {
              name: name
            }
          }
        });

        if (error) {
          alert(error.message);
          return;
        }

        if (data.user && !data.session) {
          alert("Account created! Please check your email to verify your account.");
          window.location.href = "login.html";
          return;
        }

        alert("Account created successfully!");
        window.location.href = "index.html";

      } catch (error) {
        alert("Signup failed. Please try again.");
        console.error(error);
      }
    });
  }


  // ==========================================
  // SUPABASE LOGIN
  // ==========================================

  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      if (!supabaseClient) {
        alert("Supabase connection not found. Check supabase.js.");
        return;
      }

      const emailInput = loginForm.querySelector('input[type="email"]');
      const passwordInput = loginForm.querySelector('input[type="password"]');

      if (!emailInput || !passwordInput) {
        alert("Login form fields are missing.");
        return;
      }

      const email = emailInput.value.trim();
      const password = passwordInput.value;

      try {
        const { data, error } =
          await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
          });

        if (error) {
          alert(error.message);
          return;
        }

        if (data.user) {
          localStorage.setItem(
            "userName",
            data.user.user_metadata?.name || ""
          );

          alert("Login successful!");
          window.location.href = "index.html";
        }

      } catch (error) {
        alert("Login failed. Please try again.");
        console.error(error);
      }
    });
  }


  // ==========================================
  // LOGOUT
  // ==========================================

  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", async function () {
      if (!supabaseClient) {
        alert("Supabase connection not found.");
        return;
      }

      try {
        const { error } = await supabaseClient.auth.signOut();

        if (error) {
          alert(error.message);
          return;
        }

        localStorage.removeItem("userName");
        alert("Logged out successfully!");
        window.location.href = "index.html";

      } catch (error) {
        alert("Logout failed.");
        console.error(error);
      }
    });
  }


  // ==========================================
  // SAVE / UNSAVE PRODUCT
  // ==========================================

  const saveProductBtn = document.getElementById("saveProductBtn");

  if (saveProductBtn) {
    const savedProduct = localStorage.getItem("savedProduct");

    saveProductBtn.textContent = savedProduct
      ? "✓ Saved"
      : "♡ Save Product";

    saveProductBtn.addEventListener("click", function () {
      const existingProduct = localStorage.getItem("savedProduct");

      if (existingProduct) {
        localStorage.removeItem("savedProduct");
        saveProductBtn.textContent = "♡ Save Product";
      } else {
        const product = getProductData(saveProductBtn);

        localStorage.setItem(
          "savedProduct",
          JSON.stringify(product)
        );

        saveProductBtn.textContent = "✓ Saved";
      }

      saveProductBtn.disabled = false;
    });
  }


  // ==========================================
  // SHOW SAVED PRODUCT
  // ==========================================

  const savedProductsList = document.getElementById("savedProductsList");

  if (savedProductsList) {
    const savedProductData = localStorage.getItem("savedProduct");

    if (savedProductData) {
      try {
        const savedProduct = JSON.parse(savedProductData);

        savedProductsList.innerHTML = `
          <div class="saved-product-card">
            <img
              src="${escapeHTML(savedProduct.image || "")}"
              alt="${escapeHTML(savedProduct.name || "Saved Product")}"
            >

            <div class="saved-product-info">
              <h2>${escapeHTML(savedProduct.name || "")}</h2>
              <p>${escapeHTML(savedProduct.profit || "")}</p>

              <div class="saved-product-price">
                ${escapeHTML(savedProduct.price || "")}
              </div>

              <button id="removeSavedProductBtn" type="button">
                Remove Saved Product
              </button>
            </div>
          </div>
        `;

        const removeBtn = document.getElementById("removeSavedProductBtn");

        if (removeBtn) {
          removeBtn.addEventListener("click", function () {
            localStorage.removeItem("savedProduct");
            savedProductsList.innerHTML = "<p>No saved products yet.</p>";
          });
        }

      } catch (error) {
        savedProductsList.innerHTML = "<p>No saved products yet.</p>";
      }
    } else {
      savedProductsList.innerHTML = "<p>No saved products yet.</p>";
    }
  }


  // ==========================================
  // ADD TO CART - MULTIPLE PRODUCTS
  // ==========================================

  const addToCartBtn = document.getElementById("addToCartBtn");

  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", function () {
      const product = getProductData(addToCartBtn);

      let cartItems = [];

      try {
        cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      } catch (error) {
        cartItems = [];
      }

      const existingItem = cartItems.find(function (item) {
        return item.name === product.name;
      });

      if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
      } else {
        product.quantity = 1;
        cartItems.push(product);
      }

      localStorage.setItem("cartItems", JSON.stringify(cartItems));

      // Keep the old cartProduct key for compatibility.
      localStorage.setItem("cartProduct", JSON.stringify(product));

      alert("Product added to cart!");
    });
  }

});
