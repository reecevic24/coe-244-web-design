
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

    cartIcon.addEventListener('click', () => {
        if (cartContainer.style.display === 'none' || cartContainer.style.display === '') {
            cartContainer.style.display = 'block';
        } else {
            cartContainer.style.display = 'none';
        }
    });

    closeCart.addEventListener('click', () => {
        cartContainer.style.display = 'none';
    });
});
