// Cart Management System for IG Nation

class CartManager {
    constructor() {
        this.cart = this.loadCart();
        this.favorites = this.loadFavorites();
        console.log('🛒 CartManager initialized');
        console.log('🛒 Initial cart:', this.cart);
    }

    // Load cart from localStorage
    loadCart() {
        try {
            const savedCart = localStorage.getItem('cart');
            return savedCart ? JSON.parse(savedCart) : [];
        } catch (error) {
            console.error('Error loading cart:', error);
            return [];
        }
    }

    // Save cart to localStorage
    saveCart() {
        try {
            localStorage.setItem('cart', JSON.stringify(this.cart));
            console.log('💾 Cart saved to localStorage');
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    }

    // Load favorites from localStorage
    loadFavorites() {
        try {
            const savedFavorites = localStorage.getItem('favorites');
            return savedFavorites ? JSON.parse(savedFavorites) : [];
        } catch (error) {
            console.error('Error loading favorites:', error);
            return [];
        }
    }

    // Save favorites to localStorage
    saveFavorites() {
        try {
            localStorage.setItem('favorites', JSON.stringify(this.favorites));
            console.log('💾 Favorites saved to localStorage');
        } catch (error) {
            console.error('Error saving favorites:', error);
        }
    }

    // Add item to cart
    addToCart(item) {
        console.log('🛒 Adding to cart - RAW INPUT:', item);
        console.log('🛒 Item type:', typeof item);
        console.log('🛒 Item keys:', item ? Object.keys(item) : 'null');
        
        // Handle string input (course ID)
        if (typeof item === 'string') {
            console.log('🔄 Converting string to course object for:', item);
            
            // Course data mapping
            const courseData = {
                english: {
                    id: 'english',
                    title: 'IGCSE English Language',
                    price: 249.99,
                    instructor: 'Dr. Emily Rodriguez',
                    board: 'Cambridge Board',
                    duration: '8 weeks',
                    image: '/images/courses/english.jpg',
                    description: 'Master English language skills with comprehensive coverage of reading, writing, speaking, and listening for IGCSE success.'
                },
                mathematics: {
                    id: 'mathematics',
                    title: 'IGCSE Mathematics (Extended)',
                    price: 299.99,
                    instructor: 'Dr. Sarah Mitchell',
                    board: 'Cambridge Board',
                    duration: '10 weeks',
                    image: '/images/courses/mathematics.jpg',
                    description: 'Master advanced mathematical concepts with comprehensive coverage of IGCSE Extended Mathematics curriculum.'
                },
                physics: {
                    id: 'physics',
                    title: 'IGCSE Physics (Extended)',
                    price: 299.99,
                    instructor: 'Prof. Michael Chen',
                    board: 'Edexcel Board',
                    duration: '10 weeks',
                    image: '/images/courses/physics.jpg',
                    description: 'Master fundamental physics concepts with comprehensive coverage of IGCSE Extended Physics curriculum including mechanics, waves, and electricity.'
                },
                chemistry: {
                    id: 'chemistry',
                    title: 'IGCSE Chemistry (Extended)',
                    price: 299.99,
                    instructor: 'Dr. James Anderson',
                    board: 'Cambridge Board',
                    duration: '10 weeks',
                    image: '/images/courses/chemistry.jpg',
                    description: 'Master chemistry concepts with comprehensive coverage of IGCSE Extended Chemistry curriculum including organic, inorganic, and physical chemistry.'
                }
            };
            
            if (courseData[item]) {
                item = courseData[item];
                console.log('✅ Converted to course object:', item);
            } else {
                console.error('❌ Course not found:', item);
                this.showToast('Course not found. Please try again.', 'error');
                return false;
            }
        }
        
        // Validate item is an object
        if (!item || typeof item !== 'object') {
            console.error('❌ Invalid item format:', item);
            this.showToast('Invalid item format. Please try again.', 'error');
            return false;
        }
        
        // Ensure item has required fields
        const itemId = item.id || item.courseId;
        if (!itemId) {
            console.error('❌ Item missing ID:', item);
            this.showToast('Invalid item format. Missing required information', 'error');
            return false;
        }
        
        // Check if item already in cart
        const existingItem = this.cart.find(cartItem => 
            (cartItem.id === itemId || cartItem.courseId === itemId)
        );
        
        if (existingItem) {
            console.log('⚠️ Item already in cart:', item.title);
            this.showToast('Course already in cart!', 'warning');
            return false;
        }
        
        // Add to cart with proper format
        const cartItem = {
            id: itemId,
            courseId: itemId,
            title: item.title,
            price: parseFloat(item.price) || 0,
            quantity: 1,
            type: 'course',
            instructor: item.instructor || 'IG Nation',
            duration: item.duration || '10 weeks',
            image: item.image || '/default-course.jpg',
            description: item.description || ''
        };
        
        console.log('✅ Adding cart item:', cartItem);
        
        this.cart.push(cartItem);
        this.saveCart();
        this.updateCartCount();
        this.updateCartModal();
        this.showToast(`${item.title} added to cart!`, 'success');
        
        console.log('✅ Cart updated:', this.cart);
        return true;
    }

    // Remove item from cart
    removeFromCart(itemId) {
        this.cart = this.cart.filter(item => 
            item.courseId !== itemId && item.id !== itemId
        );
        this.saveCart();
        this.updateCartCount();
        this.updateCartModal();
        this.showToast('Item removed from cart', 'info');
    }

    // Update quantity
    updateQuantity(itemId, newQuantity) {
        if (newQuantity < 1) return;
        
        const item = this.cart.find(item => (item.id === itemId || item.courseId === itemId));
        if (item) {
            item.quantity = newQuantity;
            this.saveCart();
            this.updateCartCount();
            this.updateCartModal();
        }
    }

    // Get cart total
    getCartTotal() {
        return this.cart.reduce((total, item) => total + ((item.price || 0) * (item.quantity || 1)), 0);
    }

    // Clear cart
    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateCartCount();
        this.updateCartModal();
    }

    // Update cart count display
    updateCartCount() {
        // Reload cart from localStorage to ensure we have the latest data
        this.cart = this.loadCart();
        
        const cartCount = this.cart.reduce((total, item) => total + (item.quantity || 1), 0);
        
        console.log('🛒 Updating cart count:');
        console.log('  - Cart items:', this.cart);
        console.log('  - Cart length:', this.cart.length);
        console.log('  - Calculated count:', cartCount);
        
        // Update all cart count elements
        const cartBadges = document.querySelectorAll('#cartCount, .cart-count, [data-cart-count]');
        console.log('  - Found cart badges:', cartBadges.length);
        
        cartBadges.forEach((badge, index) => {
            console.log(`  - Updating badge ${index}:`, badge.id || badge.className);
            badge.textContent = cartCount;
            // Badge should always be visible, even when count is 0
            badge.style.display = '';
        });

        // Also update modal cart count
        const cartModalCount = document.getElementById('cartModalCount');
        if (cartModalCount) {
            cartModalCount.textContent = cartCount;
            console.log('  - Updated modal cart count:', cartCount);
        }

        console.log('🛒 Cart count updated:', cartCount);
    }

    // Update cart modal
    updateCartModal() {
        // Reload cart from localStorage to ensure we have the latest data
        this.cart = this.loadCart();
        
        const cartList = document.getElementById('cartList');
        const cartModalCount = document.getElementById('cartModalCount');
        
        console.log('🛒 Updating cart modal:');
        console.log('  - Cart items:', this.cart);
        console.log('  - Cart length:', this.cart.length);
        
        // Update modal count first
        if (cartModalCount) {
            const cartCount = this.cart.reduce((total, item) => total + (item.quantity || 1), 0);
            cartModalCount.textContent = cartCount;
            console.log('  - Modal count updated to:', cartCount);
        }
        
        if (!cartList) {
            console.log('  - Cart list element not found');
            return;
        }

        if (this.cart.length === 0) {
            console.log('  - Cart is empty, showing empty message');
            cartList.innerHTML = `
                <div class="text-center py-5">
                    <iconify-icon icon="material-symbols:shopping-cart-outline" style="font-size: 4rem; color: #cbd5e1; margin-bottom: 1rem;"></iconify-icon>
                    <h5 style="color: #64748b; margin-bottom: 1rem;">Your cart is empty</h5>
                    <p style="color: #94a3b8; margin-bottom: 2rem;">Discover our amazing courses and start learning today!</p>
                    <a href="courses.html" class="btn btn-primary" style="padding: 12px 30px; border-radius: 25px; font-weight: 600;">
                        Browse Courses
                    </a>
                </div>
            `;
            return;
        }

        console.log('  - Rendering cart items...');
        cartList.innerHTML = this.cart.map(item => `
            <div class="cart-item d-flex align-items-center mb-3 p-3 border rounded">
                <div class="flex-shrink-0 me-3">
                    <img src="${item.image || 'https://via.placeholder.com/60x60'}" 
                         alt="${item.title}" 
                         class="rounded" 
                         style="width: 60px; height: 60px; object-fit: cover;">
                </div>
                <div class="flex-grow-1">
                    <h6 class="mb-1">${item.title}</h6>
                    <p class="text-muted mb-1 small">${item.description || ''}</p>
                    <div class="d-flex align-items-center justify-content-between">
                        <span class="text-primary fw-bold">$${(item.price || '0.00')}</span>
                        <div class="d-flex align-items-center gap-2">
                            <button class="btn btn-sm btn-outline-secondary" onclick="window.cart.updateQuantity('${item.id || item.courseId}', ${Math.max(1, (item.quantity || 1) - 1)})">-</button>
                            <span class="mx-2">${item.quantity || 1}</span>
                            <button class="btn btn-sm btn-outline-secondary" onclick="window.cart.updateQuantity('${item.id || item.courseId}', ${(item.quantity || 1) + 1})">+</button>
                            <button class="btn btn-sm btn-danger" onclick="window.cart.removeFromCart('${item.id || item.courseId}')">
                                <iconify-icon icon="material-symbols:delete"></iconify-icon>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        // Update total
        const total = this.cart.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
        const totalElement = document.getElementById('cartTotal');
        if (totalElement) {
            totalElement.textContent = `$${total.toFixed(2)}`;
        }

        console.log('  - Cart modal updated with', this.cart.length, 'items, total:', total);
    }

    // Toast notification function
    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) return;
        
        const toastId = 'toast-' + Date.now();
        
        let icon = 'material-symbols:info';
        let title = 'Notification';
        let bgClass = 'bg-primary';
        
        if (type === 'warning') {
            icon = 'material-symbols:warning';
            title = 'Warning!';
            bgClass = 'bg-warning';
        } else if (type === 'success') {
            icon = 'material-symbols:check-circle';
            title = 'Success!';
            bgClass = 'bg-success';
        } else if (type === 'error') {
            icon = 'material-symbols:error';
            title = 'Error!';
            bgClass = 'bg-danger';
        }
        
        const toastHTML = `
            <div class="toast" id="${toastId}" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header ${bgClass} text-white">
                    <iconify-icon icon="${icon}" class="me-2"></iconify-icon>
                    <strong class="me-auto">${title}</strong>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">
                    ${message}
                </div>
            </div>
        `;
        
        toastContainer.insertAdjacentHTML('beforeend', toastHTML);
        
        const toastElement = document.getElementById(toastId);
        if (toastElement && window.bootstrap) {
            const toast = new bootstrap.Toast(toastElement, {
                autohide: true,
                delay: 3000
            });
            toast.show();
            
            toastElement.addEventListener('hidden.bs.toast', function() {
                toastElement.remove();
            });
        }
    }
}

// Initialize cart system
window.cart = null;

document.addEventListener('DOMContentLoaded', function() {
    console.log('🛒 Initializing cart system...');
    
    // Initialize cart manager
    if (typeof CartManager !== 'undefined') {
        window.cart = new CartManager();
        console.log('✅ Cart system initialized');
    } else {
        console.error('❌ CartManager not found');
    }
});

// Global cart functions for backward compatibility
function addToCart(item) {
    if (window.cart && window.cart.addToCart) {
        return window.cart.addToCart(item);
    }
    console.error('Cart system not available');
    return false;
}

function updateCartCount() {
    if (window.cart && window.cart.updateCartCount) {
        window.cart.updateCartCount();
    }
}

function updateCartModal() {
    if (window.cart && window.cart.updateCartModal) {
        window.cart.updateCartModal();
    }
}
