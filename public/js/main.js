
// Sample products data with categories
// const products = [
//     {
//         id: 1,
//         name: "Premium Headphones",
//         price: 2999.99,
//         category: "electronics",
//         image: "https://images.pexels.com/photos/3587478/pexels-photo-3587478.jpeg?auto=compress&cs=tinysrgb&w=600",
//         description: "High-quality wireless headphones with noise cancellation"
//     },
//     {
//         id: 2,
//         name: "Smart Watch",
//         price: 4999.99,
//         category: "electronics",
//         image: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=600",
//         description: "Feature-rich smartwatch with health tracking"
//     },
//     {
//         id: 3,
//         name: "Designer T-Shirt",
//         price: 999.99,
//         category: "fashion",
//         image: "https://images.pexels.com/photos/428340/pexels-photo-428340.jpeg?auto=compress&cs=tinysrgb&w=600",
//         description: "Comfortable cotton t-shirt with modern design"
//     },
//     {
//         id: 4,
//         name: "Smart Home Hub",
//         price: 5999.99,
//         category: "home",
//         image: "https://images.pexels.com/photos/1034808/pexels-photo-1034808.jpeg?auto=compress&cs=tinysrgb&w=600",
//         description: "Control your home with voice commands"
//     },
//     {
//         id: 5,
//         name: "Fitness Tracker",
//         price: 1999.99,
//         category: "electronics",
//         image: "https://images.pexels.com/photos/437038/pexels-photo-437038.jpeg?auto=compress&cs=tinysrgb&w=600",
//         description: "Track your fitness goals with precision"
//     }
// ];

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Simple toast notification
function showMiniToast(message, productName = '') {
    const existing = document.querySelector('.mini-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'mini-toast';
    
    // If product name is provided, show it in the message
    const displayMessage = productName 
        ? `<i class="fas fa-shopping-cart"></i><span><span class="product-name">${productName}</span> ${message}</span>`
        : `<i class="fas fa-check"></i><span>${message}</span>`;
    
    toast.innerHTML = displayMessage;
    document.body.appendChild(toast);

    // Force reflow for animation
    void toast.offsetWidth;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// Function to add item to cart
async function addToCart(productId) {
    try {
        const response = await fetch(`/api/products/${productId}`);
        const product = await response.json();
        
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingProduct = cart.find(item => item._id === productId);
        
        if (existingProduct) {
            existingProduct.quantity += 1;
            showMiniToast('quantity updated', product.name);
        } else {
            cart.push({
                _id: product._id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
            showMiniToast('added to cart', product.name);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    } catch (error) {
        console.error('Error adding to cart:', error);
    }
}

// Function to update cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Update all cart count elements
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
}

// Call updateCartCount on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
});

// Function to attach add to cart listeners
function attachAddToCartListeners() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const productId = button.getAttribute('data-id');
            addToCart(productId);
        });
    });
}

// Initialize cart
function initCart() {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartCount();
}

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.querySelectorAll('.cart-count');
const checkoutBtn = document.getElementById('checkoutBtn');
const filterBtns = document.querySelectorAll('.filter-btn');

// Function to show/hide loading spinner
function toggleLoading(show) {
    const loadingSpinner = document.getElementById('productsLoading');
    const productsGrid = document.getElementById('productsGrid');
    
    if (loadingSpinner && productsGrid) {
        loadingSpinner.classList.toggle('active', show);
        productsGrid.classList.toggle('loading', show);
    }
}

// Function to fetch and render products
async function fetchAndRenderProducts(category = 'all', searchTerm = '') {
    try {
        // Show loading state
        toggleLoading(true);
        
        let url = '/api/products';
        
        // Add query parameters for filtering
        const params = new URLSearchParams();
        if (category && category !== 'all') {
            params.append('category', category);
        }
        if (searchTerm) {
            params.append('search', searchTerm);
        }

        // Append query parameters if they exist
        if (params.toString()) {
            url += `?${params.toString()}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const products = await response.json();
        
        const productContainer = document.getElementById('productsGrid');
        if (!productContainer) {
            console.error('Products grid container not found!');
            return;
        }

        // Clear existing products
        productContainer.innerHTML = '';

        if (products.length === 0) {
            productContainer.innerHTML = '<p class="no-products">No products found</p>';
            return;
        }

        // Pre-load images
        await Promise.all(products.map(product => {
            return new Promise((resolve) => {
                const img = new Image();
                const imageUrl = product.image.startsWith('http') ? product.image : 
                               product.image.startsWith('/') ? product.image : 
                               `/images/${product.image}`;
                img.src = imageUrl;
                img.onload = resolve;
                img.onerror = resolve;
            });
        }));

        // Render products
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.setAttribute('data-product-id', product._id);
            
            const imageUrl = product.image.startsWith('http') ? product.image : 
                           product.image.startsWith('/') ? product.image : 
                           `/images/${product.image}`;

            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${imageUrl}" alt="${product.name}" loading="lazy" onerror="this.src='../images/placeholder.jpg'">
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-category">${product.category}</p>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price-stock">
                        <span class="price">₹${product.price.toFixed(2)}</span>
                        <span class="stock-status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}">
                            ${product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                    </div>
                    <button class="add-to-cart-btn" data-id="${product._id}">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                </div>
            `;

            // Add click event for product details
            productCard.addEventListener('click', (e) => {
                if (!e.target.closest('.add-to-cart-btn')) {
                    viewProductDetails(product._id);
                }
            });

            productContainer.appendChild(productCard);
        });

        // Update filter buttons active state
        updateFilterButtonsState(category);

        // Re-attach cart event listeners
        attachAddToCartListeners();

    } catch (error) {
        console.error('Error fetching products:', error);
        const productContainer = document.getElementById('productsGrid');
        if (productContainer) {
            productContainer.innerHTML = '<p class="error-message">Error loading products. Please try again later.</p>';
        }
    } finally {
        // Hide loading state
        toggleLoading(false);
    }
}

// Function to update filter buttons active state
function updateFilterButtonsState(activeCategory) {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        const btnCategory = btn.getAttribute('data-category');
        btn.classList.toggle('active', btnCategory === activeCategory);
    });
}

// Function to view product details
async function viewProductDetails(productId) {
    try {
        const response = await fetch(`/api/products/${productId}`);
        const product = await response.json();

        // Create modal
        const modal = document.createElement('div');
        modal.className = 'product-details-modal';
        
        const imageUrl = product.image.startsWith('http') ? product.image : 
                        product.image.startsWith('/') ? product.image : 
                        `/images/${product.image}`;

        modal.innerHTML = `
            <div class="modal-content">
                <button class="close-modal">&times;</button>
                <div class="product-modal-image">
                    <img src="${imageUrl}" alt="${product.name}" onerror="this.src='../images/placeholder.jpg'">
                </div>
                <div class="product-modal-details">
                    <h2>${product.name}</h2>
                    <p class="product-modal-category">${product.category}</p>
                    <p class="product-modal-description">${product.description}</p>
                    <p class="product-modal-price">₹${product.price.toFixed(2)}</p>
                    <span class="product-modal-stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}">
                        ${product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                    <button class="modal-add-to-cart" onclick="addToCart('${product._id}')">
                        <i class="fas fa-shopping-cart"></i>
                        Add to Cart
                    </button>
                </div>
            </div>
        `;

        // Add modal to body
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';

        // Close modal functionality
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.addEventListener('click', () => {
            modal.remove();
            document.body.style.overflow = '';
        });

        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
                document.body.style.overflow = '';
            }
        });

        // Close on escape key
        document.addEventListener('keydown', function closeOnEscape(e) {
            if (e.key === 'Escape') {
                modal.remove();
                document.body.style.overflow = '';
                document.removeEventListener('keydown', closeOnEscape);
            }
        });

    } catch (error) {
        console.error('Error fetching product details:', error);
    }
}

// Function to filter products
function filterProducts() {
    const categoryFilter = document.getElementById('category-filter');
    const searchInput = document.getElementById('search-input');
    
    if (!categoryFilter || !searchInput) return;

    const selectedCategory = categoryFilter.value;
    const searchTerm = searchInput.value.toLowerCase();

    // Fetch and render products with selected category and search term
    fetchAndRenderProducts(selectedCategory, searchTerm);
}

// Attach event listeners for filtering
function attachFilterListeners() {
    const categoryFilter = document.getElementById('category-filter');
    const searchInput = document.getElementById('search-input');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    // Category dropdown listener
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterProducts);
    }
    
    // Search input listener
    if (searchInput) {
        searchInput.addEventListener('input', filterProducts);
    }

    // Filter buttons listener
    if (filterBtns) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.getAttribute('data-category');
                fetchAndRenderProducts(category);
            });
        });
    }
}

// Function to delete product
async function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) {
        return;
    }

    try {
        const response = await fetch(`/api/products/${productId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete product');
        }

        // Remove the product row from the table
        const productRow = document.querySelector(`div[data-product-id="${productId}"]`);
        if (productRow) {
            productRow.remove();
        }

    } catch (error) {
        console.error('Error deleting product:', error);
    }
}

// Function to attach delete product listeners
function attachDeleteProductListeners() {
    const deleteProductButtons = document.querySelectorAll('.delete-product-btn');
    
    deleteProductButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const productId = button.getAttribute('data-id');
            deleteProduct(productId);
        });
    });
}

// Initialize page-specific functionality
function initPage() {
    // Fetch and render products on products page
    if (window.location.pathname.includes('/pages/products.html')) {
        // Check if there's a category in URL
        const urlParams = new URLSearchParams(window.location.search);
        const categoryFromURL = urlParams.get('category') || 'all';

        fetchAndRenderProducts(categoryFromURL).then(() => {
            attachFilterListeners();
        });
    }

    // Other existing initialization code...
    initCart();
    attachAddToCartListeners();
}

// Call initialization when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initPage);

// Update cart display
function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartTotal = document.getElementById('cartTotal');
    const shippingCost = document.getElementById('shippingCost');
    
    // Update cart count
    updateCartCount();
    
    // If we're not on the cart page, return after updating count
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
        if (cartSubtotal) cartSubtotal.textContent = '₹0.00';
        if (cartTotal) cartTotal.textContent = '₹0.00';
        if (shippingCost) shippingCost.textContent = '₹0.00';
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
    
    if (cartSubtotal) cartSubtotal.textContent = `₹${subtotal.toFixed(2)}`;
    if (shippingCost) shippingCost.textContent = `₹${shipping.toFixed(2)}`;
    if (cartTotal) cartTotal.textContent = `₹${total.toFixed(2)}`;
}

// Update cart summary
function updateCartSummary(subtotal) {
    const shipping = subtotal > 499 ? 0 : 50;
    const total = subtotal + shipping;
    
    document.getElementById('cartSubtotal').textContent = `₹${subtotal.toFixed(2)}`;
    document.getElementById('shippingCost').textContent = `₹${shipping.toFixed(2)}`;
    document.getElementById('cartTotal').textContent = `₹${total.toFixed(2)}`;
}

// Update quantity
function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item._id === productId);
    if (item) {
        item.quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
    }
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item._id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
}

// Razorpay Integration
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            return;
        }

        // Disable the checkout button to prevent double clicks
        checkoutBtn.disabled = true;
        checkoutBtn.textContent = 'Processing...';
        
        try {
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const shipping = total > 499 ? 0 : 50;
            const finalAmount = (total + shipping) * 100; // Convert to paise
            
            const options = {
                key: 'YOUR_RAZORPAY_KEY',
                amount: finalAmount,
                currency: 'INR',
                name: 'HAPPIE',
                description: 'Purchase from HAPPIE Store',
                image: 'https://your-logo-url.com/logo.png',
                handler: function(response) {
                    // Payment successful
                    cart = [];
                    localStorage.setItem('cart', JSON.stringify(cart));
                    updateCart();
                    
                    // Reset button state
                    checkoutBtn.disabled = false;
                    checkoutBtn.textContent = 'Proceed to Pay';
                },
                modal: {
                    ondismiss: function() {
                        // Reset button state when modal is closed
                        checkoutBtn.disabled = false;
                        checkoutBtn.textContent = 'Proceed to Pay';
                    }
                },
                prefill: {
                    name: '',
                    email: '',
                    contact: ''
                },
                theme: {
                    color: '#6366f1'
                }
            };
            
            const rzp = new Razorpay(options);
            
            rzp.on('payment.failed', function(response) {
                checkoutBtn.disabled = false;
                checkoutBtn.textContent = 'Proceed to Pay';
            });
            
            rzp.open();
        } catch (error) {
            console.error('Razorpay initialization failed:', error);
            checkoutBtn.disabled = false;
            checkoutBtn.textContent = 'Proceed to Pay';
        }
    });
}

// Mobile Menu Functionality
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileNavClose = document.querySelector('.mobile-nav-close');
const mobileNav = document.querySelector('.mobile-nav');
const body = document.body;

if (mobileMenuBtn && mobileNav) {
    // Open mobile menu
    mobileMenuBtn.addEventListener('click', () => {
        mobileNav.classList.add('active');
        body.style.overflow = 'hidden';
    });

    // Close mobile menu
    if (mobileNavClose) {
        mobileNavClose.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            body.style.overflow = '';
        });
    }

    // Close mobile menu when clicking on a link
    const mobileNavLinks = mobileNav.querySelectorAll('a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            body.style.overflow = '';
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (mobileNav.classList.contains('active') && 
            !mobileNav.contains(e.target) && 
            !mobileMenuBtn.contains(e.target)) {
            mobileNav.classList.remove('active');
            body.style.overflow = '';
        }
    });
}

// Update navbar on scroll
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop;
});
