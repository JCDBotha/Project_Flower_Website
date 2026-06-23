document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();

    // --- LOGIN LISTENERS ---
    const loginBtn = document.getElementById('loginBtn');
    const closeLogin = document.getElementById('closeLogin');
    const loginModal = document.getElementById('loginModal');

    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            loginModal.style.display = "block";
        });
    }

    if (closeLogin) {
        closeLogin.addEventListener('click', () => {
            loginModal.style.display = "none";
        });
    }

    // Simulate stock on the shop page.
    if (document.querySelector('.product-card')) {
        simulateStock();
    }

    // Load the basket on the basket page.
    if (document.getElementById('mandjie-items-houer')) {
        loadBasket();
    }

    // Connect the payment button.
    const payBtn = document.getElementById('betaal-btn');
    if (payBtn) {
        payBtn.addEventListener('click', fakePayment);
    }
});

// --- LOGIN AND LOGOUT LOGIC ---

function handleLogin() {
    const userInput = document.getElementById("username").value;
    const passInput = document.getElementById("password").value;

    const loginModal = document.getElementById('loginModal');
    const loggedOutUI = document.getElementById('loggedOutUI');
    const loggedInUI = document.getElementById('loggedInUI');
    const welcomeSpan = document.getElementById("userWelcome");

    // Accept any input as long as it is not empty.
    if (userInput.trim() !== "" && passInput.trim() !== "") {
        loginModal.style.display = "none";

        // Switch the UI elements.
        if (loggedOutUI) loggedOutUI.style.display = "none";
        if (loggedInUI) loggedInUI.style.display = "block";

        // Show the name entered by the user.
        if (welcomeSpan) {
            welcomeSpan.innerText = "Welcome, " + userInput + "!";
        }

        showToast(`Successfully logged in as ${userInput}`);

        // Clear the fields for next time.
        document.getElementById("username").value = "";
        document.getElementById("password").value = "";
    } else {
        alert("Please enter any username and password to test.");
    }
}

function handleLogout() {
    const loggedOutUI = document.getElementById('loggedOutUI');
    const loggedInUI = document.getElementById('loggedInUI');

    // Switch back to the original state.
    if (loggedOutUI) loggedOutUI.style.display = "block";
    if (loggedInUI) loggedInUI.style.display = "none";

    showToast("You are now logged out.");
}

// --- STOCK SIMULATION ---
function simulateStock() {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
        const badge = card.querySelector('.stock-badge');
        const button = card.querySelector('.buy-btn');
        const chance = Math.floor(Math.random() * 10) + 1;

        if (chance <= 2) {
            badge.innerText = "Out of Stock";
            badge.className = "stock-badge stock-out";
            button.disabled = true;
            button.classList.add('disabled-btn');
        } else if (chance <= 5) {
            badge.innerText = "Low Stock";
            badge.className = "stock-badge stock-low";
            button.disabled = false;
            button.classList.remove('disabled-btn');
        } else {
            badge.innerText = "In Stock";
            badge.className = "stock-badge stock-in";
            button.disabled = false;
            button.classList.remove('disabled-btn');
        }
    });
}

// --- BASKET LOGIC ---
function addToCart(name, price) {
    const cards = document.querySelectorAll('.product-card');
    let canAdd = true;
    let imageSource = "";

    cards.forEach(card => {
        const h3 = card.querySelector('h3');
        if (h3 && h3.innerText.trim() === name) {
            const badge = card.querySelector('.stock-badge');
            if (badge && badge.classList.contains('stock-out')) canAdd = false;
            const img = card.querySelector('img');
            if (img) imageSource = img.getAttribute('src');
        }
    });

    if (!canAdd) {
        showToast(`${name} is currently out of stock!`);
        return;
    }

    const basket = JSON.parse(localStorage.getItem('blomme_mandjie')) || [];
    basket.push({ naam: name, prys: parseFloat(price), beeld: imageSource, hoeveelheid: 1 });
    localStorage.setItem('blomme_mandjie', JSON.stringify(basket));

    updateCartBadge();
    showToast(`${name} has been added!`);
}

function updateCartBadge() {
    const basket = JSON.parse(localStorage.getItem('blomme_mandjie')) || [];
    const badge = document.getElementById('cart-count');
    if (badge) {
        badge.innerText = basket.length;
        badge.style.display = basket.length > 0 ? 'inline-block' : 'none';
    }
}

// --- BASKET PAGE FUNCTIONS ---
function loadBasket() {
    const itemsContainer = document.getElementById('mandjie-items-houer');
    const basket = JSON.parse(localStorage.getItem('blomme_mandjie')) || [];
    if (!itemsContainer) return;

    if (basket.length === 0) {
        itemsContainer.innerHTML = "<p style='padding:20px;'>Your basket is empty.</p>";
        updateSummary();
        return;
    }

    itemsContainer.innerHTML = "";
    basket.forEach((item, index) => {
        itemsContainer.innerHTML += `
            <div class="cart-item">
                <img src="${item.beeld}" alt="${item.naam}">
                <div class="item-info">
                    <h4>${item.naam}</h4>
                    <p>R ${item.prys.toFixed(2)}</p>
                </div>
                <div class="item-actions">
                    <div class="quantity-control">
                        <button onclick="changeQuantity(${index}, -1)">-</button>
                        <span>${item.hoeveelheid}</span>
                        <button onclick="changeQuantity(${index}, 1)">+</button>
                    </div>
                    <button class="remove-btn" onclick="removeItem(${index})"><i class="far fa-trash-alt"></i></button>
                </div>
            </div>`;
    });
    updateSummary();
}

function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    if (toast && toastMessage) {
        toastMessage.innerText = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

function removeItem(index) {
    const basket = JSON.parse(localStorage.getItem('blomme_mandjie')) || [];
    basket.splice(index, 1);
    localStorage.setItem('blomme_mandjie', JSON.stringify(basket));
    loadBasket();
    updateCartBadge();
}

function changeQuantity(index, amount) {
    const basket = JSON.parse(localStorage.getItem('blomme_mandjie')) || [];
    basket[index].hoeveelheid += amount;
    if (basket[index].hoeveelheid < 1) return removeItem(index);
    localStorage.setItem('blomme_mandjie', JSON.stringify(basket));
    loadBasket();
}

function updateSummary() {
    const basket = JSON.parse(localStorage.getItem('blomme_mandjie')) || [];
    let subtotal = 0;
    basket.forEach(item => subtotal += (item.prys * item.hoeveelheid));

    let discount = 0;
    if (subtotal > 1000) discount = subtotal * 0.10;

    const subtotalElement = document.getElementById('subtotaal-prys');
    if (subtotalElement) subtotalElement.innerText = `R ${subtotal.toFixed(2)}`;

    const discountElement = document.getElementById('afslag-bedrag');
    if (discountElement) {
        discountElement.innerText = `R ${discount.toFixed(2)}`;
        discountElement.style.color = discount > 0 ? "#ff6b6b" : "inherit";
    }

    const totalElement = document.getElementById('totaal-prys');
    if (totalElement) totalElement.innerText = `R ${(subtotal - discount).toFixed(2)}`;
}

function fakePayment() {
    const basket = JSON.parse(localStorage.getItem('blomme_mandjie')) || [];

    if (basket.length === 0) {
        showToast("Your basket is already empty!");
        return;
    }

    showToast("Payment successful! Thank you for your support.");
    localStorage.removeItem('blomme_mandjie');
    updateCartBadge();

    if (document.getElementById('mandjie-items-houer')) {
        loadBasket();
    }

    setTimeout(() => {
        window.location.href = "Contact_Us.html";
    }, 2000);
}
