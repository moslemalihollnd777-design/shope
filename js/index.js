// Page-specific logic for index.html
// window.googleTranslateElementInit = function () {
//   new google.translate.TranslateElement(
//     {
//       pageLanguage: "ar",
//       includedLanguages: "en,nl,ar",
//       layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
//       autoDisplay: false,
//     },
//     "google_translate_element",
//   );
// };

// function changeLanguage(langCode) {
//   const select = document.querySelector("select.goog-te-combo");
//   if (select) {
//     select.value = langCode;
//     select.dispatchEvent(new Event("change"));
//   } else {
//     console.log("جاري محاولة الاتصال بمحرك الترجمة...");
//     setTimeout(() => changeLanguage(langCode), 1000);
//   }
// }


      function googleTranslateElementInit() {
        new google.translate.TranslateElement(
          {
            pageLanguage: "ar",
            includedLanguages: "ar,en,nl",
            autoDisplay: false
          },
          "google_translate_element"
        );
      }

      function changeLanguage(lang) {
        const interval = setInterval(() => {
          const select =
            document.querySelector(".goog-te-combo");

          if (select) {
            select.value = lang;
            select.dispatchEvent(
              new Event("change")
            );

            // RTL / LTR
            if (lang === "ar") {
              document.documentElement.dir = "rtl";
              document.documentElement.lang = "ar";
            } else {
              document.documentElement.dir = "ltr";
              document.documentElement.lang = lang;
            }

            clearInterval(interval);
          }
        }, 500);
      }

      // Language switcher
      document.querySelectorAll(".lang-switcher-nav span")
        .forEach(button => {

          button.addEventListener("click", () => {
            const lang =
              button.dataset.lang;

            changeLanguage(lang);
          });

        });

function createSellerLink() {
  return `<a href="seller/seller.html" class="seller-link">لوحة تحكم البائع</a>`;
}

function updateAuthNavLinks(user) {
  const authLinksContainer = document.getElementById("auth-nav-links");
  if (!authLinksContainer) return;

  if (user) {
    db.collection("users")
      .doc(user.uid)
      .get()
      .then((doc) => {
        let sellerLink = "";
        if (doc.exists && doc.data().role === "seller") {
          sellerLink = createSellerLink();
        }

        authLinksContainer.innerHTML = `
          ${sellerLink}
          <a href="#" class="logout-link">تسجيل خروج</a>
        `;
      });
  } else {
    authLinksContainer.innerHTML = `
      <a href="auth/login.html">دخول</a>
      <a href="auth/register.html" class="btn-register-nav">إنشاء حساب</a>
    `;
  }
}

function setProductsMessage(message, className = "center-muted-full") {
  const container = document.getElementById("products-container");
  if (container) {
    container.innerHTML = `<p class="${className}">${message}</p>`;
  }
}

function renderProductCard(doc) {
  const product = doc.data();
  const card = document.createElement("div");
  card.classList.add("product-card");
  card.innerHTML = `
      <img src="${product.imageUrl || "assets/logo.jpg"}" alt="${escapeHTML(product.title)}">
      <div class="product-title">${escapeHTML(product.title)}</div>
      <div class="product-price">€${product.price}</div>
      <button class="buy-btn" data-product-id="${doc.id}" data-product-title="${escapeHTML(
        product.title,
      )}" data-product-price="${product.price}" type="button">
        إضافة للسلة
      </button>
    `;
  return card;
}

function loadProducts(categoryFilter = "all") {
  setProductsMessage("جاري تحميل المنتجات...");

  let productsRef = db.collection("products");

  if (categoryFilter !== "all") {
    productsRef = productsRef.where("category", "==", categoryFilter);
    document.getElementById("section-title").innerText = "قسم: " + categoryFilter;
  } else {
    document.getElementById("section-title").innerText = "كل المنتجات المعروضة";
  }

  productsRef
    .get()
    .then((querySnapshot) => {
      const container = document.getElementById("products-container");
      if (!container) return;

      container.innerHTML = "";
      if (querySnapshot.empty) {
        setProductsMessage("لا توجد منتجات متوفرة حالياً في هذا القسم.", "center-error-full");
        return;
      }

      querySnapshot.forEach((doc) => {
        container.appendChild(renderProductCard(doc));
      });
    })
    .catch((error) => {
      console.error("خطأ في جلب المنتجات:", error);
      setProductsMessage("حدث خطأ أثناء تحميل المنتجات.", "center-error-full");
    });
}

function filterCategory(category) {
  loadProducts(category);
  document.getElementById("products-target").scrollIntoView({ behavior: "smooth" });
}

function logoutUser() {
  auth.signOut().then(() => {
    window.location.reload();
  });
}

function bindProductActions() {
  document.body.addEventListener("click", (event) => {
    const addButton = event.target.closest("button[data-product-id]");
    if (addButton) {
      const productId = addButton.dataset.productId;
      const productTitle = addButton.dataset.productTitle;
      const productPrice = Number(addButton.dataset.productPrice);
      addToCart(productId, productTitle, productPrice);
    }
  });
}

function bindCategoryButtons() {
  const categoryButtons = document.querySelectorAll(".category-filter");
  categoryButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      filterCategory(button.dataset.category);
    });
  });
}

function bindLanguageButtons() {
  const langButtons = document.querySelectorAll(".lang-switcher-nav span");
  langButtons.forEach((button) => {
    button.addEventListener("click", () => changeLanguage(button.dataset.lang));
  });
}

function bindSearchButton() {
  const searchButton = document.querySelector("#search-button");
  if (searchButton) {
    searchButton.addEventListener("click", searchProducts);
  }
}

function bindCartButton() {
  const cartWrapper = document.querySelector(".cart-wrapper");
  if (cartWrapper) {
    cartWrapper.addEventListener("click", openCart);
  }
}

function bindCategoryMenuButton() {
  const categoryButton = document.getElementById("categories-nav-btn");
  if (categoryButton) {
    categoryButton.addEventListener("click", toggleCategoriesMenu);
  }
}

function bindLogoutLink() {
  document.body.addEventListener("click", (event) => {
    const logoutLink = event.target.closest(".logout-link");
    if (logoutLink) {
      event.preventDefault();
      logoutUser();
    }
  });
}

function bindClosePaymentButton() {
  const closePaymentButton = document.getElementById("closePaymentButton");
  if (closePaymentButton) {
    closePaymentButton.addEventListener("click", closePayment);
  }
}

function setupIndexPage() {
  bindCategoryButtons();
  bindLanguageButtons();
  bindSearchButton();
  bindCartButton();
  bindCategoryMenuButton();
  bindLogoutLink();
  bindClosePaymentButton();
  bindProductActions();
  loadProducts();
}

document.addEventListener("DOMContentLoaded", setupIndexPage);

auth.onAuthStateChanged((user) => {
  updateAuthNavLinks(user);
});
