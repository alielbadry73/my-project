/**
 * Unified Cart System for IG Nation Learning Platform
 * This file provides consistent cart functionality across all pages
 */

// Global cart management
class CartManager {
    constructor() {
        this.cart = this.loadCart();
        this.favorites = this.loadFavorites();
        this.init();
    }

    // Initialize cart system
    init() {
        // Validate and clean cart data
        this.validateCart();
        this.updateCartCount();
        this.updateFavoritesModal();
        this.setupEventListeners();
    }
    
    // Validate and clean cart data
    validateCart() {
        if (!Array.isArray(this.cart)) {
            console.warn('🛒 Cart is not an array, resetting to empty array');
            this.cart = [];
            this.saveCart();
            return;
        }
        
        // Remove any invalid items
        const originalLength = this.cart.length;
        this.cart = this.cart.filter(item => {
            // Check if item is a string (invalid)
            if (typeof item === 'string') {
                console.warn('🛒 Removing string item from cart:', item);
                return false;
            }
            
            if (!item || typeof item !== 'object') {
                console.warn('🛒 Removing invalid cart item (not an object):', item);
                return false;
            }
            
            // Check if item is an array (string converted to array)
            if (Array.isArray(item)) {
                console.warn('🛒 Removing array item from cart:', item);
                return false;
            }
            
            // Ensure required fields exist
            if (!item.id && !item.courseId) {
                console.warn('🛒 Removing cart item without ID:', item);
                return false;
            }
            
            // Ensure title exists
            if (!item.title) {
                console.warn('🛒 Removing cart item without title:', item);
                return false;
            }
            
            // Ensure quantity is valid
            if (item.quantity && (typeof item.quantity !== 'number' || item.quantity <= 0)) {
                console.warn('🛒 Fixing invalid quantity for item:', item);
                item.quantity = 1;
            }
            
            return true;
        });
        
        if (this.cart.length !== originalLength) {
            console.log(`🛒 Cleaned cart: removed ${originalLength - this.cart.length} invalid items`);
            this.saveCart();
        }
    }

    // Load cart from localStorage
    loadCart() {
        try {
            const cartData = localStorage.getItem('cart');
            const cart = cartData ? JSON.parse(cartData) : [];
            console.log('🛒 Loading cart from localStorage:', cart);
            console.log('🛒 Cart length:', cart.length);
            return cart;
        } catch (error) {
            console.error('Error loading cart:', error);
            return [];
        }
    }

    // Load favorites from localStorage
    loadFavorites() {
        try {
            const favoritesData = localStorage.getItem('favorites');
            return favoritesData ? JSON.parse(favoritesData) : [];
        } catch (error) {
            console.error('Error loading favorites:', error);
            return [];
        }
    }

    // Save cart to localStorage
    saveCart() {
        try {
            localStorage.setItem('cart', JSON.stringify(this.cart));
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    }

    // Save favorites to localStorage
    saveFavorites() {
        try {
            localStorage.setItem('favorites', JSON.stringify(this.favorites));
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
            this.showToast('Invalid item: missing ID', 'error');
            return false;
        }
        
        // Check if item already exists in cart
        const existingItem = this.cart.find(cartItem => 
            cartItem.courseId === itemId || cartItem.id === itemId
        );

        if (existingItem) {
            this.showToast('This item is already in your cart!', 'warning');
            return false;
        }

        // Add to cart with proper structure
        const cartItem = {
            id: itemId,
            courseId: itemId,
            type: item.type || 'course',
            title: item.title || 'Unknown Course',
            price: item.price || 0,
            instructor: item.instructor,
            board: item.board,
            image: item.image,
            description: item.description,
            quantity: item.quantity || 1,
            addedAt: new Date().toISOString()
        };

        console.log('✅ Adding cart item:', cartItem);
        
        this.cart.push(cartItem);
        this.saveCart();
        this.updateCartCount();
        this.updateCartModal();
        this.showToast('Item added to cart!', 'success');
        
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

    // Update cart quantity
    updateQuantity(itemId, quantity) {
        const item = this.cart.find(cartItem => 
            cartItem.courseId === itemId || cartItem.id === itemId
        );
        
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(itemId);
            } else {
                item.quantity = quantity;
                this.saveCart();
                this.updateCartCount();
                this.updateCartModal();
            }
        }
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

        console.log('🛒 Cart count updated:', cartCount);
    }

    // Update cart modal
    updateCartModal() {
        // Reload cart from localStorage to ensure we have the latest data
        this.cart = this.loadCart();
        
        const cartList = document.getElementById('cartList');
        if (!cartList) return;

        if (this.cart.length === 0) {
            cartList.innerHTML = `
                <div class="text-center text-muted py-4">
                    <iconify-icon icon="material-symbols:shopping-cart-outline" class="fs-1 mb-3"></iconify-icon>
                    <p>Your cart is empty. Start adding courses to your cart!</p>
                </div>
            `;
            return;
        }

        cartList.innerHTML = this.cart.map(item => `
            <div class="cart-item d-flex align-items-center mb-3 p-3 border rounded">
                <div class="flex-shrink-0 me-3">
                    <img src="${item.image || 'images/placeholder-course.jpg'}" 
                         alt="${item.title}" 
                         class="rounded" 
                         style="width: 60px; height: 60px; object-fit: cover;">
                </div>
                <div class="flex-grow-1">
                    <h6 class="mb-1">${item.title}</h6>
                    <p class="text-muted mb-1 small">${item.description || ''}</p>
                    <div class="d-flex align-items-center justify-content-between">
                        <span class="text-primary fw-bold">$${item.price || '0.00'}</span>
                        <div class="d-flex align-items-center gap-2">
                            <button class="btn btn-sm btn-outline-secondary" 
                                    onclick="cartManager.updateQuantity('${item.courseId || item.id}', ${(item.quantity || 1) - 1})">
                                -
                            </button>
                            <span class="px-2">${item.quantity || 1}</span>
                            <button class="btn btn-sm btn-outline-secondary" 
                                    onclick="cartManager.updateQuantity('${item.courseId || item.id}', ${(item.quantity || 1) + 1})">
                                +
                            </button>
                        </div>
                    </div>
                </div>
                <div class="flex-shrink-0 ms-3">
                    <button class="btn btn-sm btn-outline-danger" 
                            onclick="cartManager.removeFromCart('${item.courseId || item.id}')">
                        <iconify-icon icon="material-symbols:delete"></iconify-icon>
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Toggle favorite
    toggleFavorite(itemId) {
        const index = this.favorites.indexOf(itemId);
        if (index > -1) {
            this.favorites.splice(index, 1);
            this.showToast('Item removed from favorites', 'info');
        } else {
            this.favorites.push(itemId);
            this.showToast('Item added to favorites!', 'success');
        }
        
        this.saveFavorites();
        this.updateFavoritesModal();
    }

    // Update favorites modal
    updateFavoritesModal() {
        const favoritesList = document.getElementById('favoritesList');
        if (!favoritesList) return;

        if (this.favorites.length === 0) {
            favoritesList.innerHTML = `
                <div class="text-center text-muted py-4">
                    <iconify-icon icon="material-symbols:favorite-outline" class="fs-1 mb-3"></iconify-icon>
                    <p>No favorites yet. Start adding courses to your favorites!</p>
                </div>
            `;
            return;
        }

        // This would need to be implemented based on your course data structure
        favoritesList.innerHTML = `
            <div class="text-center text-muted py-4">
                <iconify-icon icon="material-symbols:favorite" class="fs-1 mb-3"></iconify-icon>
                <p>${this.favorites.length} favorite(s) saved</p>
            </div>
        `;
    }

    // Setup event listeners
    setupEventListeners() {
        // Listen for storage changes (for cross-tab synchronization)
        window.addEventListener('storage', (e) => {
            if (e.key === 'cart') {
                this.cart = this.loadCart();
                this.updateCartCount();
                this.updateCartModal();
            }
            if (e.key === 'favorites') {
                this.favorites = this.loadFavorites();
                this.updateFavoritesModal();
            }
        });
    }

    // Show toast notification
    showToast(message, type = 'info') {
        // Create toast element if it doesn't exist
        let toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toastContainer';
            toastContainer.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
            `;
            document.body.appendChild(toastContainer);
        }

        const toastId = 'toast-' + Date.now();
        const bgClass = {
            'success': 'bg-success',
            'error': 'bg-danger',
            'warning': 'bg-warning',
            'info': 'bg-info'
        }[type] || 'bg-info';

        const icon = {
            'success': 'material-symbols:check-circle',
            'error': 'material-symbols:error',
            'warning': 'material-symbols:warning',
            'info': 'material-symbols:info'
        }[type] || 'material-symbols:info';

        const toast = document.createElement('div');
        toast.id = toastId;
        toast.className = `toast align-items-center text-white ${bgClass} border-0`;
        toast.setAttribute('role', 'alert');
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body d-flex align-items-center">
                    <iconify-icon icon="${icon}" class="me-2"></iconify-icon>
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;

        toastContainer.appendChild(toast);

        // Initialize and show toast
        const bsToast = new bootstrap.Toast(toast, { delay: 3000 });
        bsToast.show();

        // Remove toast element after it's hidden
        toast.addEventListener('hidden.bs.toast', () => {
            toast.remove();
        });
    }

    // Get cart total
    getCartTotal() {
        return this.cart.reduce((total, item) => {
            return total + ((item.price || 0) * (item.quantity || 1));
        }, 0);
    }

    // Get cart count
    getCartCount() {
        return this.cart.reduce((total, item) => total + (item.quantity || 1), 0);
    }
    
    // Reset cart completely (for debugging)
    resetCart() {
        console.log('🛒 Resetting cart completely...');
        this.cart = [];
        this.saveCart();
        this.updateCartCount();
        this.updateCartModal();
        console.log('✅ Cart reset complete');
    }
}

// Initialize cart manager when DOM is loaded
let cartManager;
document.addEventListener('DOMContentLoaded', function() {
    cartManager = new CartManager();
    
    // Make cart manager globally available
    window.cartManager = cartManager;
    
    // Legacy function support for existing code - ONLY if not already defined
    if (!window.addToCart) {
        window.addToCart = function(item) {
            return cartManager.addToCart(item);
        };
    }
    
    if (!window.updateCartCount) {
        window.updateCartCount = function() {
            cartManager.updateCartCount();
        };
    }
    
    if (!window.toggleFavorite) {
        window.toggleFavorite = function(itemId) {
            cartManager.toggleFavorite(itemId);
        };
    }
    
    if (!window.removeFromCart) {
        window.removeFromCart = function(itemId) {
            cartManager.removeFromCart(itemId);
        };
    }
    
    if (!window.clearCart) {
        window.clearCart = function() {
            cartManager.clearCart();
        };
    }
    
    if (!window.resetCart) {
        window.resetCart = function() {
            cartManager.resetCart();
        };
    }
    
    console.log('🛒 Cart system initialized');
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CartManager;
}
