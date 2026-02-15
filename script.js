
let cart = [];

function addToCart(name, price) {
    // Check if item already exists
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }

    updateCartDisplay();
    updateCartIcon();
}

function removeFromCart(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    } else {
        cart.splice(index, 1);
    }
    updateCartDisplay();
    updateCartIcon();
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total-price');

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
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = totalItems;
}

document.addEventListener('DOMContentLoaded', () => {
    // Attach event listeners to Add to Cart buttons
    const buttons = document.querySelectorAll('.add-to-cart-btn');
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const name = button.dataset.name;
            const price = parseFloat(button.dataset.price);
            addToCart(name, price);

            // Show cart briefly or just update icon? 
            // Let's open the cart if it's the first item, or just rely on icon interaction
            const cartContainer = document.getElementById('cart-container');
            if (cartContainer.style.display === 'none' || cartContainer.style.display === '') {
                cartContainer.style.display = 'block';
            }
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
    const paymentStatus = document.getElementById('payment-status');

    cartIcon.addEventListener('click', () => {
        if (cartContainer.style.display === 'none' || cartContainer.style.display === '') {
            cartContainer.style.display = 'block';
            updateCheckoutButton();
        } else {
            cartContainer.style.display = 'none';
        }
    });

    closeCart.addEventListener('click', () => {
        cartContainer.style.display = 'none';
    });

    function updateCheckoutButton() {
        if (cart.length > 0) {
            checkoutBtn.style.display = 'block';
        } else {
            checkoutBtn.style.display = 'none';
        }
    }

    // Modal Logic
    checkoutBtn.addEventListener('click', () => {
        modal.style.display = 'block';
        const total = document.getElementById('cart-total-price').textContent;
        document.getElementById('checkout-total-display').textContent = `Total: $${total}`;
        paymentStatus.textContent = '';
        mpesaInput.value = '';
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    confirmPaymentBtn.addEventListener('click', () => {
        const phone = mpesaInput.value;
        if (phone.trim() === '') {
            paymentStatus.textContent = 'Please enter a valid phone number.';
            paymentStatus.style.color = 'red';
            return;
        }

        // Simulate Payment Processing
        paymentStatus.textContent = 'Processing payment... sent STK push to ' + phone;
        paymentStatus.style.color = 'orange';
        confirmPaymentBtn.disabled = true;
        confirmPaymentBtn.textContent = 'Processing...';

        setTimeout(() => {
            paymentStatus.textContent = 'Payment Successful! Confirmed.';
            paymentStatus.style.color = 'green';
            confirmPaymentBtn.textContent = 'Paid';
            
            setTimeout(() => {
                cart = [];
                updateCartDisplay();
                updateCartIcon();
                cartContainer.style.display = 'none';
                modal.style.display = 'none';
                confirmPaymentBtn.disabled = false;
                confirmPaymentBtn.textContent = 'Pay Now';
                alert('Thank you for your purchase!');
            }, 2000);
        }, 2000);
    });

    // Hook into updateCartDisplay to show/hide checkout button dynamically when items are added/removed
    const originalUpdateCartDisplay = updateCartDisplay; 
    updateCartDisplay = function() {
        originalUpdateCartDisplay();
        updateCheckoutButton();
    };
});
