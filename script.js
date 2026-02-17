let cart = [];
const LOGIN_KEY = 'bean_and_brew_login_status';
const CART_KEY = 'bean_and_brew_cart';

// Load cart from storage on init
const storedCart = localStorage.getItem(CART_KEY);
if (storedCart) {
    cart = JSON.parse(storedCart);
}

function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function checkLoginStatus() {
    return localStorage.getItem(LOGIN_KEY) === 'true';
}

function toggleLogin() {
    const isLoggedIn = checkLoginStatus();
    if (isLoggedIn) {
        localStorage.setItem(LOGIN_KEY, 'false');
        alert('You have logged out.');
        window.location.reload(); // Refresh to update UI
    } else {
        // Redirect to login page instead of instant login
        window.location.href = 'login.html';
    }
}

function updateLoginButton() {
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        if (checkLoginStatus()) {
            loginBtn.textContent = 'Logout';
            loginBtn.href = "#";
        } else {
            loginBtn.textContent = 'Login';
            loginBtn.href = "login.html"; // Direct link to login page
        }
    }
}

function addToCart(name, price) {
    // Check if item already exists
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }

    saveCart(); // Persist
    updateCartDisplay();
    updateCartIcon();

    // Open cart
    const cartContainer = document.getElementById('cart-container');
    if (cartContainer.style.display === 'none' || cartContainer.style.display === '') {
        cartContainer.style.display = 'block';
    }
}

function removeFromCart(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    } else {
        cart.splice(index, 1);
    }
    saveCart(); // Persist
    updateCartDisplay();
    updateCartIcon();
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total-price');

    if (!cartItems || !cartTotal) return;

    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const li = document.createElement('li');
        li.innerHTML = `
            <div>${item.name} <strong style="color: #d35400;">x${item.quantity}</strong></div>
            <div>
                <span>$${itemTotal.toFixed(2)}</span>
                <span class="cart-item-remove" data-index="${index}">&times;</span>
            </div>
        `;
        cartItems.appendChild(li);
    });

    cartTotal.textContent = total.toFixed(2);

    // Re-attach event listeners for remove buttons
    const removeButtons = document.querySelectorAll('.cart-item-remove');
    removeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            removeFromCart(index);
        });
    });
}

function updateCartIcon() {
    const badge = document.getElementById('cart-count-badge');
    if (badge) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        badge.textContent = totalItems;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateLoginButton();
    updateCartIcon(); // Update icon on load
    updateCartDisplay(); // Update display on load (if cart open or needed)

    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            if (checkLoginStatus()) {
                e.preventDefault();
                toggleLogin();
            }
            // else let it navigate to login.html
        });
    }

    // Attach event listeners to Add to Cart buttons
    const buttons = document.querySelectorAll('.add-to-cart-btn');
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const name = button.dataset.name;
            const price = parseFloat(button.dataset.price);
            addToCart(name, price);
        });
    });

    // Cart Icon Toggle
    const cartIcon = document.getElementById('cart-icon');
    const cartContainer = document.getElementById('cart-container');
    const closeCart = document.getElementById('close-cart');
    const checkoutBtn = document.getElementById('checkout-btn');
    const modal = document.getElementById('checkout-modal');
    const closeModal = document.querySelector('.close-modal');
    const confirmPaymentBtn = document.getElementById('confirm-payment');
    const mpesaInput = document.getElementById('mpesa-number');
    const locationInput = document.getElementById('delivery-location');
    const paymentStatus = document.getElementById('payment-status');
    const payNowRadio = document.getElementById('pay-now');
    const payCodRadio = document.getElementById('pay-cod');
    const mpesaSection = document.getElementById('mpesa-section');

    if (cartIcon) {
        cartIcon.addEventListener('click', () => {
            if (cartContainer.style.display === 'none' || cartContainer.style.display === '') {
                cartContainer.style.display = 'block';
                updateCheckoutButton();
            } else {
                cartContainer.style.display = 'none';
            }
        });
    }

    if (closeCart) {
        closeCart.addEventListener('click', () => {
            cartContainer.style.display = 'none';
        });
    }

    function updateCheckoutButton() {
        if (checkoutBtn) {
            if (cart.length > 0) {
                checkoutBtn.style.display = 'block';
            } else {
                checkoutBtn.style.display = 'none';
            }
        }
    }

    function openCheckoutModal() {
        if (!modal) return;
        modal.style.display = 'block';
        const total = document.getElementById('cart-total-price').textContent;
        document.getElementById('checkout-total-display').textContent = `Total: $${total}`;
        paymentStatus.textContent = '';
        mpesaInput.value = '';
        locationInput.value = '';
        // Reset to default payment state
        payNowRadio.checked = true;
        mpesaSection.style.display = 'block';
        confirmPaymentBtn.textContent = 'Pay with Mpesa';
    }

    // Modal Logic
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            // Check login logic
            if (!checkLoginStatus()) {
                // If not logged in, redirect to login page with action param
                window.location.href = 'login.html?action=checkout';
                return;
            }
            openCheckoutModal();
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    // Handle Payment Method Toggle
    function handlePaymentMethodChange() {
        if (payNowRadio.checked) {
            mpesaSection.style.display = 'block';
            confirmPaymentBtn.textContent = 'Pay with Mpesa';
        } else {
            mpesaSection.style.display = 'none';
            confirmPaymentBtn.textContent = 'Place Order';
        }
    }

    if (payNowRadio && payCodRadio) {
        payNowRadio.addEventListener('change', handlePaymentMethodChange);
        payCodRadio.addEventListener('change', handlePaymentMethodChange);
    }

    if (confirmPaymentBtn) {
        confirmPaymentBtn.addEventListener('click', () => {
            const location = locationInput.value;
            if (location.trim() === '') {
                paymentStatus.textContent = 'Please enter a delivery location.';
                paymentStatus.style.color = 'red';
                return;
            }

            if (payNowRadio.checked) {
                // M-Pesa Flow
                const phone = mpesaInput.value;
                if (phone.trim() === '') {
                    paymentStatus.textContent = 'Please enter a valid phone number.';
                    paymentStatus.style.color = 'red';
                    return;
                }

                paymentStatus.textContent = 'Processing payment... sent STK push to ' + phone;
                paymentStatus.style.color = 'orange';
                confirmPaymentBtn.disabled = true;
                confirmPaymentBtn.textContent = 'Processing...';

                setTimeout(() => {
                    paymentStatus.textContent = 'Payment Successful! Confirmed.';
                    paymentStatus.style.color = 'green';
                    confirmPaymentBtn.textContent = 'Paid';
                    finalizeOrder();
                }, 2000);

            } else {
                // COD Flow
                paymentStatus.textContent = 'Placing order...';
                paymentStatus.style.color = 'orange';
                confirmPaymentBtn.disabled = true;

                setTimeout(() => {
                    paymentStatus.textContent = 'Order Placed! Please pay on delivery.';
                    paymentStatus.style.color = 'green';
                    confirmPaymentBtn.textContent = 'Placed';
                    finalizeOrder();
                }, 1500);
            }
        });
    }

    function finalizeOrder() {
        setTimeout(() => {
            cart = [];
            saveCart(); // Clear persisting cart
            updateCartDisplay();
            updateCartIcon();
            cartContainer.style.display = 'none';
            modal.style.display = 'none';
            confirmPaymentBtn.disabled = false;
            // Reset text logic in the click handler or modal open, so no need to hardcode here to 'Pay Now'
            alert('Thank you for your purchase! Your order will be delivered to ' + locationInput.value);
        }, 2000);
    }

    // Hook into updateCartDisplay to show/hide checkout button dynamically when items are added/removed
    const originalUpdateCartDisplay = updateCartDisplay;
    updateCartDisplay = function () {
        originalUpdateCartDisplay();
        updateCheckoutButton();
    };


    // --- Login Page Logic ---
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const showLoginBtn = document.getElementById('show-login');
    const showSignupBtn = document.getElementById('show-signup');
    const forgotPasswordLink = document.getElementById('forgot-password-link');

    if (loginForm && signupForm) {
        // Toggle Forms
        showLoginBtn.addEventListener('click', () => {
            loginForm.style.display = 'block';
            signupForm.style.display = 'none';
            showLoginBtn.classList.add('active');
            showSignupBtn.classList.remove('active');
        });

        showSignupBtn.addEventListener('click', () => {
            loginForm.style.display = 'none';
            signupForm.style.display = 'block';
            showSignupBtn.classList.add('active');
            showLoginBtn.classList.remove('active');
        });

        const urlParams = new URLSearchParams(window.location.search);
        const action = urlParams.get('action');

        // Handle Login Submit
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Simulate API call
            const username = document.getElementById('login-username').value;
            if (username) {
                localStorage.setItem(LOGIN_KEY, 'true');
                alert(`Welcome back, ${username}!`);
                if (action === 'checkout') {
                    window.location.href = 'shop.html?action=checkout';
                } else {
                    window.location.href = 'shop.html';
                }
            }
        });

        // Handle Signup Submit
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('signup-username').value;
            if (username) {
                localStorage.setItem(LOGIN_KEY, 'true');
                alert(`Account created successfully! Welcome, ${username}.`);
                if (action === 'checkout') {
                    window.location.href = 'shop.html?action=checkout';
                } else {
                    window.location.href = 'shop.html';
                }
            }
        });

        // Handle Forgot Password
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            const email = prompt("Please enter your email address to reset your password:");
            if (email) {
                alert(`Password reset link sent to ${email}`);
            }
        });
    }

    // Check for auto-checkout on Shop Page load
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('action') === 'checkout') {
        if (checkLoginStatus()) {
            // Clear the param so it doesn't reopen on refresh
            window.history.replaceState({}, document.title, window.location.pathname);
            // Open modal
            if (modal) {
                openCheckoutModal();
            }
        }
    }
});
