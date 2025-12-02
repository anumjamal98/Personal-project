// checkout.js - Checkout Page Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Load cart items
    loadCartItems();
    
    // Update cart count
    updateCartCount();
    
    // Setup event listeners
    setupEventListeners();
    
    // Calculate totals
    calculateTotals();
});

// Load cart items from localStorage
function loadCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const emptyCartMessage = document.getElementById('emptyCartMessage');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '';
        emptyCartMessage.classList.remove('d-none');
        return;
    }
    
    emptyCartMessage.classList.add('d-none');
    
    cartItemsContainer.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <div class="row align-items-center">
                <div class="col-3 col-md-2">
                    <img src="${item.image}" 
                         class="cart-item-img" 
                         alt="${item.name}"
                         onerror="this.src='https://via.placeholder.com/100x100/cccccc/333333?text=Essentae'">
                </div>
                <div class="col-5 col-md-6">
                    <h6 class="mb-1">${item.name}</h6>
                    <p class="small text-muted mb-1">${item.category}</p>
                    <p class="mb-0 fw-bold">Rs ${item.price}</p>
                </div>
                <div class="col-4 col-md-4">
                    <div class="d-flex align-items-center justify-content-end">
                        <div class="quantity-control me-3">
                            <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">
                                <i class="fas fa-minus"></i>
                            </button>
                            <input type="text" class="quantity-input" value="${item.quantity || 1}" 
                                   readonly>
                            <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        <div class="fw-bold me-3">
                            Rs ${(item.price * (item.quantity || 1)).toLocaleString()}
                        </div>
                        <div class="remove-item" onclick="removeItem(${index})">
                            <i class="fas fa-trash"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Update item quantity
function updateQuantity(index, change) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart[index]) {
        cart[index].quantity = (cart[index].quantity || 1) + change;
        
        // Remove item if quantity is 0 or less
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCartItems();
        updateCartCount();
        calculateTotals();
    }
}

// Remove item from cart
function removeItem(index) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart[index]) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCartItems();
        updateCartCount();
        calculateTotals();
    }
}

// Calculate order totals
function calculateTotals() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Calculate subtotal
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.price * (item.quantity || 1);
    });
    
    // Calculate shipping (free for orders above 2000)
    const shipping = subtotal > 2000 ? 0 : 200;
    
    // Calculate tax (13%)
    const tax = subtotal * 0.13;
    
    // Calculate total
    const total = subtotal + shipping + tax;
    
    // Update display
    document.getElementById('subtotal').textContent = `Rs ${subtotal.toLocaleString()}`;
    document.getElementById('shipping').textContent = `Rs ${shipping.toLocaleString()}`;
    document.getElementById('tax').textContent = `Rs ${tax.toLocaleString()}`;
    document.getElementById('total').textContent = `Rs ${total.toLocaleString()}`;
}

// Update cart count in navbar
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);
    document.querySelectorAll('.cart-count').forEach(element => {
        element.textContent = cartCount;
    });
}

// Setup event listeners
function setupEventListeners() {
    // Payment method selection
    document.querySelectorAll('.payment-method').forEach(method => {
        method.addEventListener('click', function() {
            // Remove selected class from all methods
            document.querySelectorAll('.payment-method').forEach(m => {
                m.classList.remove('selected');
            });
            
            // Add selected class to clicked method
            this.classList.add('selected');
            
            // Check the radio button
            const radioId = this.getAttribute('data-method');
            document.getElementById(radioId).checked = true;
        });
    });
    
    // Place order button
    document.getElementById('placeOrderBtn').addEventListener('click', placeOrder);
}

// Place order function
function placeOrder() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        alert('Your cart is empty. Please add items to your cart before placing an order.');
        return;
    }
    
    // Get delivery information
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('deliveryEmail').value.trim();
    const phone = document.getElementById('deliveryPhone').value.trim();
    const address = document.getElementById('deliveryAddress').value.trim();
    const city = document.getElementById('deliveryCity').value.trim();
    
    // Basic validation
    if (!fullName || !email || !phone || !address || !city) {
        alert('Please fill in all delivery information fields.');
        return;
    }
    
    // Get selected payment method
    const selectedPayment = document.querySelector('input[name="paymentMethod"]:checked');
    if (!selectedPayment) {
        alert('Please select a payment method.');
        return;
    }
    
    // Calculate totals
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.price * (item.quantity || 1);
    });
    const shipping = subtotal > 2000 ? 0 : 200;
    const tax = subtotal * 0.13;
    const total = subtotal + shipping + tax;
    
    // Create order object
    const order = {
        orderId: 'ORD' + Date.now(),
        date: new Date().toISOString(),
        customer: { fullName, email, phone, address, city },
        items: cart,
        paymentMethod: selectedPayment.id,
        subtotal: subtotal,
        shipping: shipping,
        tax: tax,
        total: total,
        status: 'pending'
    };
    
    // Save order to localStorage (in real app, send to server)
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Clear cart
    localStorage.removeItem('cart');
    
    // Show success message
    alert(`Order placed successfully!\n\nOrder ID: ${order.orderId}\nTotal: Rs ${total.toLocaleString()}\n\nThank you for shopping with Essentae!`);
    
    // Redirect to home page
    window.location.href = 'index.html';
}