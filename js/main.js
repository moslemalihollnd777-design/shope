// ========================================================
// ALI HOLLAND - MAIN.JS
// ========================================================

// ===============================
// 1. السلة الحقيقية
// ===============================

let cart = JSON.parse(localStorage.getItem('ali_holland_cart')) || [];

// حفظ السلة
function saveCart() {

    localStorage.setItem(
        'ali_holland_cart',
        JSON.stringify(cart)
    );

}

// تحديث واجهة السلة
function updateCartUI() {

    const cartCount = document.getElementById('cart-count');

    const totalItems = cart.reduce((sum, item) => {
        return sum + item.quantity;
    }, 0);

    if (cartCount) {
        cartCount.innerText = totalItems;
    }

    updateTotalPrice();

}

// حساب السعر الكامل
function updateTotalPrice() {

    const finalPriceDisplay = document.getElementById('final-price-display');

    const total = cart.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
    }, 0);

    if (finalPriceDisplay) {
        finalPriceDisplay.innerText = total.toFixed(2) + "€";
    }

}

// إضافة منتج
function addToCart(productId, productTitle, productPrice, productImage = "assets/logo.jpg") {

    const existingProduct = cart.find(item => item.id === productId);

    if (existingProduct) {

        existingProduct.quantity += 1;

    } else {

        cart.push({
            id: productId,
            title: productTitle,
            price: Number(productPrice),
            image: productImage,
            quantity: 1
        });

    }

    saveCart();

    updateCartUI();

    alert(`تمت إضافة "${productTitle}" إلى السلة 🛒`);

}

// حذف منتج
function removeFromCart(productId) {

    cart = cart.filter(item => item.id !== productId);

    saveCart();

    renderCartItems();

    updateCartUI();

}

// فتح السلة
function openCart() {

    if (cart.length === 0) {

        alert("السلة فارغة حالياً");

        return;
    }

    renderCartItems();

    const paymentModal = document.getElementById('paymentModal');

    if (paymentModal) {

        paymentModal.style.display = 'flex';

    }

}

// إغلاق السلة
function closePayment() {

    const paymentModal = document.getElementById('paymentModal');

    if (paymentModal) {

        paymentModal.style.display = 'none';

    }

}

// عرض منتجات السلة
function renderCartItems() {

    let cartContainer = document.getElementById('cart-items');

    if (!cartContainer) return;

    cartContainer.innerHTML = "";

    cart.forEach(item => {

        const cartItem = document.createElement('div');

        cartItem.classList.add('cart-item');

        cartItem.innerHTML = `

            <div class="cart-item-box">

                <img src="${item.image}" class="cart-item-image">

                <div class="cart-item-info">

                    <h4>${escapeHTML(item.title)}</h4>

                    <p>${item.price}€ × ${item.quantity}</p>

                </div>

                <button onclick="removeFromCart('${item.id}')">

                    حذف

                </button>

            </div>

        `;

        cartContainer.appendChild(cartItem);

    });

}

// ===============================
// 2. البحث الحقيقي من Firebase
// ===============================

function searchProducts() {

    const searchInput = document.getElementById('search-input');

    if (!searchInput) return;

    const query = searchInput.value.toLowerCase().trim();

    if (query === "") {

        alert("اكتب اسم المنتج");

        return;

    }

    const container = document.getElementById('products-container');

    container.innerHTML = `
        <p style="text-align:center;">
            جاري البحث...
        </p>
    `;

    db.collection('products')
    .get()
    .then((snapshot) => {

        container.innerHTML = "";

        let found = false;

        snapshot.forEach((doc) => {

            const product = doc.data();

            const title = product.title || "";
            const category = product.category || "";

            if (
                title.toLowerCase().includes(query) ||
                category.toLowerCase().includes(query)
            ) {

                found = true;

                const productCard = document.createElement('div');

                productCard.classList.add('product-card');

                productCard.innerHTML = `

                    <img src="${product.imageUrl || 'assets/logo.jpg'}">

                    <h3>${escapeHTML(title)}</h3>

                    <p>€${product.price}</p>

                    <button onclick="addToCart(
                        '${doc.id}',
                        '${escapeQuotes(title)}',
                        ${product.price},
                        '${product.imageUrl || 'assets/logo.jpg'}'
                    )">

                        إضافة للسلة

                    </button>

                `;

                container.appendChild(productCard);

            }

        });

        if (!found) {

            container.innerHTML = `
                <p style="text-align:center;">
                    لا توجد نتائج
                </p>
            `;

        }

    })
    .catch((error) => {

        console.error(error);

        alert("حدث خطأ أثناء البحث");

    });

}

// ===============================
// 3. حماية ضد XSS
// ===============================

function escapeHTML(text) {

    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}

function escapeQuotes(text) {

    return text.replace(/'/g, "\\'");

}

// ===============================
// 4. القائمة المنسدلة
// ===============================

function toggleCategoriesMenu() {

    const dropdown = document.getElementById("text-categories-dropdown");

    if (dropdown) {

        dropdown.classList.toggle("show-dropdown");

    }

}

window.addEventListener('click', (event) => {

    if (!event.target.matches('#categories-nav-btn')) {

        const dropdown = document.getElementById("text-categories-dropdown");

        if (
            dropdown &&
            dropdown.classList.contains('show-dropdown')
        ) {

            dropdown.classList.remove('show-dropdown');

        }

    }

});

// ===============================
// 5. تشغيل أولي
// ===============================

document.addEventListener('DOMContentLoaded', () => {

    updateCartUI();

    const searchInput = document.getElementById('search-input');

    if (searchInput) {

        searchInput.addEventListener('keypress', (e) => {

            if (e.key === 'Enter') {

                searchProducts();

            }

        });

    }

});
