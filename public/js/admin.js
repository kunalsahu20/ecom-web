// Admin page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize delete buttons
    initializeDeleteButtons();
    
    // Initialize product counters
    updateProductCounters();
});

// Function to initialize delete buttons
function initializeDeleteButtons() {
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            const productId = e.target.closest('tr').dataset.productId;
            if (await confirmDelete()) {
                deleteProduct(productId);
            }
        });
    });
}

// Function to confirm deletion
function confirmDelete() {
    return new Promise((resolve) => {
        const confirmed = window.confirm('Are you sure you want to delete this product?');
        resolve(confirmed);
    });
}

// Function to delete product
async function deleteProduct(productId) {
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

        // Remove the product row
        const productRow = document.querySelector(`tr[data-product-id="${productId}"]`);
        if (productRow) {
            productRow.remove();
            showNotification('Product deleted successfully', 'success');
            updateProductCounters();
        }

    } catch (error) {
        console.error('Error deleting product:', error);
        showNotification('Error deleting product', 'error');
    }
}

// Function to update product counters
function updateProductCounters() {
    // Update total products count
    const totalProducts = document.querySelectorAll('tr[data-product-id]').length;
    const totalProductsElement = document.querySelector('.total-products');
    if (totalProductsElement) {
        totalProductsElement.textContent = totalProducts;
    }

    // Update categories count
    const categories = new Set();
    document.querySelectorAll('tr[data-product-id] td:nth-child(3)').forEach(td => {
        categories.add(td.textContent.trim());
    });
    const totalCategoriesElement = document.querySelector('.total-categories');
    if (totalCategoriesElement) {
        totalCategoriesElement.textContent = categories.size;
    }
}

// Function to show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());

    // Add new notification
    document.body.appendChild(notification);

    // Add show class after a small delay for animation
    setTimeout(() => notification.classList.add('show'), 10);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Function to search products
function searchProducts(query) {
    const rows = document.querySelectorAll('tr[data-product-id]');
    const searchTerm = query.toLowerCase();

    rows.forEach(row => {
        const name = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
        const category = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
        
        if (name.includes(searchTerm) || category.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Function to filter by category
function filterByCategory(category) {
    const rows = document.querySelectorAll('tr[data-product-id]');
    
    rows.forEach(row => {
        const rowCategory = row.querySelector('td:nth-child(3)').textContent;
        if (category === 'All Categories' || rowCategory === category) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Initialize search and filter functionality
const searchInput = document.querySelector('.search-products');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        searchProducts(e.target.value);
    });
}

const categoryFilter = document.querySelector('.category-filter');
if (categoryFilter) {
    categoryFilter.addEventListener('change', (e) => {
        filterByCategory(e.target.value);
    });
}
