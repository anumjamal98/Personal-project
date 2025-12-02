// gallery.js - Gallery Page Functionality

const galleryImages = [
    {
        id: 1,
        src: "assets/images/gallery/men-perfume-1.jpg",
        category: "men",
        title: "Men's Signature Collection"
    },
    {
        id: 2,
        src: "assets/images/gallery/men-perfume-2.jpg",
        category: "men",
        title: "Men's Luxury Edition"
    },
    {
        id: 3,
        src: "assets/images/gallery/women-perfume-1.jpg",
        category: "women",
        title: "Women's Floral Elegance"
    },
    {
        id: 4,
        src: "assets/images/gallery/women-perfume-2.jpg",
        category: "women",
        title: "Women's Evening Glam"
    },
    {
        id: 5,
        src: "assets/images/gallery/kids-perfume-1.jpg",
        category: "kids",
        title: "Kids Bubble Fun"
    },
    {
        id: 6,
        src: "assets/images/gallery/kids-perfume-2.jpg",
        category: "kids",
        title: "Kids Fruit Fantasy"
    },
    {
        id: 7,
        src: "assets/images/gallery/packaging-1.jpg",
        category: "packaging",
        title: "Premium Packaging"
    },
    {
        id: 8,
        src: "assets/images/gallery/packaging-2.jpg",
        category: "packaging",
        title: "Gift Box Collection"
    },
    {
        id: 9,
        src: "assets/images/gallery/store-1.jpg",
        category: "store",
        title: "Our Store Interior"
    },
    {
        id: 10,
        src: "assets/images/gallery/making-1.jpg",
        category: "making",
        title: "Perfume Making Process"
    },
    {
        id: 11,
        src: "assets/images/gallery/ingredients-1.jpg",
        category: "ingredients",
        title: "Natural Ingredients"
    },
    {
        id: 12,
        src: "assets/images/gallery/event-1.jpg",
        category: "events",
        title: "Fragrance Launch Event"
    }
];

// Initialize gallery
document.addEventListener('DOMContentLoaded', function() {
    loadGallery();
    setupGalleryFilters();
    updateCartCount();
});

// Load gallery images
function loadGallery(filter = 'all') {
    const galleryContainer = document.getElementById('galleryContainer');
    if (!galleryContainer) return;

    let filteredImages = galleryImages;
    
    if (filter !== 'all') {
        filteredImages = galleryImages.filter(img => img.category === filter);
    }

    if (filteredImages.length === 0) {
        galleryContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-images fa-3x text-muted mb-3"></i>
                <h4>No images found</h4>
                <p>Try selecting a different category</p>
            </div>
        `;
        return;
    }

    galleryContainer.innerHTML = filteredImages.map(image => `
        <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
            <div class="gallery-item">
                <img src="${image.src}" 
                     class="gallery-img" 
                     alt="${image.title}"
                     data-bs-toggle="modal" 
                     data-bs-target="#imageModal"
                     onclick="openModal('${image.src}', '${image.title}')"
                     onerror="this.src='https://via.placeholder.com/400x300/cccccc/333333?text=Essentae+Gallery'">
                <div class="gallery-caption">
                    <p class="small mb-0">${image.title}</p>
                </div>
            </div>
        </div>
    `).join('');
}

// Setup filter buttons
function setupGalleryFilters() {
    const filterButtons = document.querySelectorAll('.gallery-filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter value
            const filter = this.getAttribute('data-filter');
            
            // Load gallery with filter
            loadGallery(filter);
        });
    });
}

// Open image in modal
function openModal(src, title) {
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    
    if (modalImage && modalTitle) {
        modalImage.src = src;
        modalTitle.textContent = title;
    }
}

// Update cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);
    document.querySelectorAll('.cart-count').forEach(element => {
        element.textContent = cartCount;
    });
}

// Add to cart from gallery (if needed)
function addToCartFromGallery(productId) {
    // This function can be expanded if you want to add products directly from gallery
    alert('Product added to cart from gallery!');
}