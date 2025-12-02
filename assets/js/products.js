// products.js - Products Page Functionality

let allProducts = [];
let currentFilter = 'all';
let currentSort = 'default';
let currentSearch = '';

// DOM Elements
const productsContainer = document.getElementById('productsContainer');
const productCount = document.getElementById('productCount');
const noProductsMessage = document.getElementById('noProductsMessage');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.querySelector('.sort-select');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    setupEventListeners();
    updateCartCount();
});

// Load products from JSON
function loadProducts() {
    fetch('assets/data/products.json')
        .then(response => response.json())
        .then(products => {
            allProducts = products;
            displayProducts(allProducts);
        })
        .catch(error => {
            console.error('Error loading products:', error);
            productsContainer.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
                    <h4>Failed to load products</h4>
                    <p>Please check your internet connection</p>
                    <button class="btn btn-primary mt-3" onclick="loadProducts()">Retry</button>
                </div>
            `;
        });
}

// Display products
function displayProducts(products) {
    if (!products.length) {
        productsContainer.innerHTML = '';
        noProductsMessage.classList.remove('d-none');
        productCount.textContent = '0 products found';
        return;
    }

    noProductsMessage.classList.add('d-none');
    productCount.textContent = `${products.length} products found`;

    // Sort products
    const sortedProducts = sortProducts([...products]);

    // Generate HTML
    productsContainer.innerHTML = sortedProducts.map(product => `
        <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
            <div class="product-card">
                <div class="product-img">
                    <img src="${product.image}" alt="${product.name}" 
                         onerror="this.src='https://via.placeholder.com/400x300/cccccc/333333?text=Essentae'">
                    <div class="product-badge">${product.category}</div>
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-description">${product.description || 'Premium fragrance'}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <p class="product-price mb-0">Rs.${product.price}</p>
                        <button class="btn btn-add-cart" onclick="addToCart(${product.id})">
                            <i class="fas fa-cart-plus"></i> Add
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Sort products
function sortProducts(products) {
    switch(currentSort) {
        case 'price-low':
            return products.sort((a, b) => a.price - b.price);
        case 'price-high':
            return products.sort((a, b) => b.price - a.price);
        case 'name':
            return products.sort((a, b) => a.name.localeCompare(b.name));
        default:
            return products;
    }
}

// Filter products
function filterProducts() {
    let filtered = [...allProducts];

    // Apply category filter
    if (currentFilter !== 'all') {
        filtered = filtered.filter(product => product.category === currentFilter);
    }

    // Apply search filter
    if (currentSearch) {
        const searchTerm = currentSearch.toLowerCase();
        filtered = filtered.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            (product.description && product.description.toLowerCase().includes(searchTerm)) ||
            product.category.toLowerCase().includes(searchTerm)
        );
    }

    displayProducts(filtered);
}

// Setup event listeners
function setupEventListeners() {
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            document.querySelectorAll('.filter-btn').forEach(btn => 
                btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update filter and display
            currentFilter = this.dataset.filter;
            filterProducts();
        });
    });

    // Search input
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            currentSearch = this.value.trim();
            filterProducts();
        });
    }

    // Sort select
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            currentSort = this.value;
            filterProducts();
        });
    }
}

// Add to cart function (shared with main.js)
function addToCart(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        product.quantity = 1;
        cart.push(product);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Show notification
    showNotification(`${product.name} added to cart!`);
}

// Update cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);
    document.querySelectorAll('.cart-count').forEach(element => {
        element.textContent = cartCount;
    });
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="alert alert-success alert-dismissible fade show position-fixed top-0 end-0 m-3" role="alert" style="z-index: 9999;">
            <i class="fas fa-check-circle me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}