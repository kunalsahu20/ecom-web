// Admin Panel JavaScript

// Product Management with Backend API
let products = [];

// Predefined category list
const validCategories = [
    'Electronics',
    'Fashion',
    'Home'
];

// Populate category dropdown
function populateCategoryDropdown() {
    const categorySelect = document.getElementById('productCategory');
    if (!categorySelect) return;

    // Clear existing options first, keeping only the default "Select Category" option
    categorySelect.innerHTML = '<option value="">Select Category</option>';

    // Add each category only once
    validCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.toLowerCase();
        option.textContent = category;
        categorySelect.appendChild(option);
    });
}

// Fetch Products
async function fetchProducts() {
    try {
        const response = await fetch('/api/products');
        products = await response.json();
        renderProducts();
        updateStats();
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// DOM Elements
const adminLoginForm = document.getElementById('adminLoginForm');
const productForm = document.getElementById('productForm');
const productModal = document.getElementById('productModal');
const addProductBtn = document.getElementById('addProductBtn');
const modalClose = document.querySelector('.modal-close');
const productTableBody = document.getElementById('productTableBody');
const categoryFilter = document.getElementById('categoryFilter');
const searchProduct = document.getElementById('searchProduct');
const logoutBtn = document.getElementById('logoutBtn');

// Event Listeners
if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', handleLogin);
}

if (addProductBtn) {
    addProductBtn.addEventListener('click', openAddProductModal);
}

if (modalClose) {
    modalClose.addEventListener('click', closeModal);
}

if (productForm) {
    productForm.addEventListener('submit', handleProductSubmit);
}

if (categoryFilter) {
    categoryFilter.addEventListener('change', filterProducts);
}

if (searchProduct) {
    searchProduct.addEventListener('input', filterProducts);
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
}

// Login Handler
function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Mock authentication - Replace with actual authentication
    if (username === 'admin' && password === 'admin123') {
        localStorage.setItem('adminLoggedIn', 'true');
        window.location.href = 'dashboard.html';
    } else {
        alert('Invalid credentials');
    }
}

// Check Authentication
function checkAuth() {
    if (!localStorage.getItem('adminLoggedIn') && !window.location.href.includes('login.html')) {
        window.location.href = 'login.html';
    }
}

// Logout Handler
function handleLogout() {
    localStorage.removeItem('adminLoggedIn');
    window.location.href = 'login.html';
}

// Modal Functions
function openAddProductModal() {
    productModal.style.display = 'flex';
    productForm.reset();
    document.getElementById('modalTitle').textContent = 'Add New Product';
    productForm.dataset.mode = 'add';
}

function openEditProductModal(product) {
    productModal.style.display = 'flex';
    document.getElementById('modalTitle').textContent = 'Edit Product';
    productForm.dataset.mode = 'edit';
    productForm.dataset.productId = product._id;

    // Fill form with product data
    document.getElementById('productName').value = product.name;
    document.getElementById('productCategory').value = product.category.toLowerCase();
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productDescription').value = product.description;
    document.getElementById('productImage').value = product.image;
    document.getElementById('productStock').value = product.stock;
}

function closeModal() {
    productModal.style.display = 'none';
    productForm.reset();
}

// Product Form Handler
async function handleProductSubmit(e) {
    e.preventDefault();
    const formData = new FormData(productForm);
    const productData = {
        name: formData.get('name'),
        category: capitalizeWords(formData.get('category')),
        price: parseFloat(formData.get('price')),
        description: formData.get('description'),
        image: formData.get('image'),
        stock: parseInt(formData.get('stock'))
    };

    try {
        let response;
        if (productForm.dataset.mode === 'edit') {
            const productId = productForm.dataset.productId;
            response = await fetch(`/api/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productData)
            });
        } else {
            response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productData)
            });
        }

        if (!response.ok) {
            throw new Error('Failed to save product');
        }

        closeModal();
        fetchProducts();
    } catch (error) {
        console.error('Error saving product:', error);
        alert('Failed to save product. Please try again.');
    }
}

// Delete Product
async function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
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

            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Failed to delete product. Please try again.');
        }
    }
}

// Product Rendering
function renderProducts(filteredProducts = products) {
    if (!productTableBody) return;

    productTableBody.innerHTML = '';
    filteredProducts.forEach(product => {
        const row = document.createElement('tr');
        row.setAttribute('data-product-id', product._id);
        
        const imgCell = document.createElement('td');
        const img = document.createElement('img');
        img.src = product.image || '../images/placeholder.jpg';
        img.alt = product.name;
        img.onerror = () => img.src = '../images/placeholder.jpg';
        imgCell.appendChild(img);

        const nameCell = document.createElement('td');
        nameCell.textContent = product.name;

        const categoryCell = document.createElement('td');
        categoryCell.textContent = product.category;

        const priceCell = document.createElement('td');
        priceCell.textContent = `₹${product.price.toFixed(2)}`;

        const stockCell = document.createElement('td');
        stockCell.textContent = product.stock;

        const actionsCell = document.createElement('td');
        actionsCell.className = 'table-actions';

        const editButton = document.createElement('button');
        editButton.className = 'admin-btn primary';
        editButton.innerHTML = '<i class="fas fa-edit"></i>';
        editButton.addEventListener('click', () => openEditProductModal(product));

        const deleteButton = document.createElement('button');
        deleteButton.className = 'admin-btn danger';
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        deleteButton.addEventListener('click', () => deleteProduct(product._id));

        actionsCell.appendChild(editButton);
        actionsCell.appendChild(deleteButton);

        row.appendChild(imgCell);
        row.appendChild(nameCell);
        row.appendChild(categoryCell);
        row.appendChild(priceCell);
        row.appendChild(stockCell);
        row.appendChild(actionsCell);

        productTableBody.appendChild(row);
    });
}

// Product Filtering
function filterProducts() {
    const category = categoryFilter.value.toLowerCase();
    const searchTerm = searchProduct.value.toLowerCase();

    const filteredProducts = products.filter(product => {
        const matchCategory = category === 'all' || product.category.toLowerCase() === category;
        const matchSearch = product.name.toLowerCase().includes(searchTerm) ||
                          product.description.toLowerCase().includes(searchTerm);
        return matchCategory && matchSearch;
    });

    renderProducts(filteredProducts);
}

// Update Statistics
function updateStats() {
    const totalProductsElement = document.getElementById('totalProducts');
    const totalCategoriesElement = document.getElementById('totalCategories');

    if (totalProductsElement) {
        totalProductsElement.textContent = products.length;
    }

    if (totalCategoriesElement) {
        const uniqueCategories = [...new Set(products.map(p => p.category))];
        totalCategoriesElement.textContent = uniqueCategories.length;
    }
}

// Function to capitalize first letter of each word
function capitalizeWords(str) {
    return str.replace(/\b\w/g, letter => letter.toUpperCase());
}

// Initialize Admin Dashboard
function initDashboard() {
    // Check authentication
    checkAuth();

    // Initialize components
    populateCategoryDropdown();

    // Fetch initial data
    fetchProducts();

    // Set admin username if available
    const adminUsername = document.getElementById('adminUsername');
    if (adminUsername) {
        adminUsername.textContent = localStorage.getItem('adminUsername') || 'Admin';
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initDashboard);
