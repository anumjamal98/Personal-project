// main.js - Home Page JavaScript

// Update cart count on page load
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);
    document.querySelectorAll('.cart-count').forEach(element => {
        element.textContent = cartCount;
    });
}

// Load featured products
function loadFeaturedProducts() {
    fetch('assets/data/products.json')
        .then(response => response.json())
        .then(products => {
            const featuredContainer = document.getElementById('featuredProducts');
            if (!featuredContainer) return;
            
            // Get first 6 products as featured
            const featured = products.slice(0, 6);
            
            featuredContainer.innerHTML = featured.map(product => `
                <div class="col-md-4 col-sm-6 mb-4">
                    <div class="product-card">
                        <div class="product-img">
                            <img src="${product.image}" alt="${product.name}" 
                                 onerror="this.src='https://via.placeholder.com/400x300/cccccc/333333?text=Essentae'">
                        </div>
                        <div class="product-info">
                            <span class="product-category">${product.category}</span>
                            <h3 class="product-title">${product.name}</h3>
                            <p class="product-price">Rs.${product.price}</p>
                            <button class="btn btn-add-cart" onclick="addToCart(${product.id})">
                                <i class="fas fa-cart-plus"></i> Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        })
        .catch(error => {
            console.error('Error loading featured products:', error);
        });
}

// Add to cart function
function addToCart(productId) {
    fetch('assets/data/products.json')
        .then(response => response.json())
        .then(products => {
            const product = products.find(p => p.id === productId);
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
        });
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="alert alert-success alert-dismissible fade show" role="alert">
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

// Newsletter form submission
document.addEventListener('DOMContentLoaded', function() {
    // Update cart count
    updateCartCount();
    
    // Load featured products
    loadFeaturedProducts();
    
    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            if (email) {
                // Here you would typically send to a server
                showNotification('Thank you for subscribing!');
                this.reset();
            }
        });
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});