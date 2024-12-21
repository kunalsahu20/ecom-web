// Cart functionality
let cart = [];

// Function to initialize cart
function initCart() {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartDisplay();
}

// Function to update cart display
function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartTotal = document.getElementById('cartTotal');
    const shippingCost = document.getElementById('shippingCost');
    
    // Update cart count
    const cartCountElements = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
        cartSubtotal.textContent = '₹0.00';
        cartTotal.textContent = '₹0.00';
        shippingCost.textContent = '₹0.00';
        return;
    }
    
    let subtotal = 0;
    cartItems.innerHTML = '';
    
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        
        const imageUrl = item.image.startsWith('http') ? item.image : 
                        item.image.startsWith('/') ? item.image : 
                        `/images/${item.image}`;
        
        itemElement.innerHTML = `
            <div class="cart-item-image">
                <img src="${imageUrl}" alt="${item.name}" onerror="this.src='../images/placeholder.jpg'">
            </div>
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p class="cart-item-price">₹${item.price.toFixed(2)}</p>
            </div>
            <div class="cart-item-quantity">
                <button onclick="updateQuantity('${item._id}', ${item.quantity - 1})" ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity('${item._id}', ${item.quantity + 1})">+</button>
            </div>
            <div class="cart-item-total">
                <p>₹${(item.price * item.quantity).toFixed(2)}</p>
            </div>
            <button class="remove-item" onclick="removeFromCart('${item._id}')">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        cartItems.appendChild(itemElement);
    });
    
    const shipping = subtotal > 0 ? 50 : 0; // Fixed shipping cost
    const total = subtotal + shipping;
    
    cartSubtotal.textContent = `₹${subtotal.toFixed(2)}`;
    shippingCost.textContent = `₹${shipping.toFixed(2)}`;
    cartTotal.textContent = `₹${total.toFixed(2)}`;
}

// Function to update quantity
function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) return;
    
    const item = cart.find(item => item._id === productId);
    if (item) {
        item.quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
    }
}

// Function to remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item._id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initCart);
