// ===== PRODUCTS DATA =====
const products = [
    { id: 1, name: 'Fresh Tomatoes', price: 150, originalPrice: 200, category: 'vegetables', farmer: 'John Mwangi', rating: 4.8, discount: '25%', image: 'images/fresh tomatoes.jpg' },
    { id: 2, name: 'Carrots Bundle', price: 120, originalPrice: 150, category: 'vegetables', farmer: 'Sarah Kipchoge', rating: 4.6, discount: '20%', image: 'images/carrot bundles.jpg' },
    { id: 3, name: 'Lettuce (Fresh)', price: 100, originalPrice: 130, category: 'vegetables', farmer: 'Grace Ochieng', rating: 4.7, discount: '23%', image: 'images/lettuce.jpg' },
    { id: 4, name: 'Onions (2kg)', price: 80, originalPrice: 120, category: 'vegetables', farmer: 'Peter Kimani', rating: 4.5, discount: '33%', image: 'images/onions.jpg' },
    { id: 5, name: 'Potatoes (5kg)', price: 200, originalPrice: 280, category: 'vegetables', farmer: 'David Kipkemboi', rating: 4.9, discount: '29%', image: 'images/potatoes.jpg' },
    { id: 6, name: 'Sweet Corn', price: 180, originalPrice: 240, category: 'vegetables', farmer: 'Mary Wanjiru', rating: 4.7, discount: '25%', image: 'images/sweet corn.jpg' },
    { id: 7, name: 'Cabbage (2)', price: 90, originalPrice: 130, category: 'vegetables', farmer: 'James Kiplagat', rating: 4.6, discount: '31%', image: 'images/cabbage.jpg' },
    { id: 8, name: 'Bell Peppers (6)', price: 200, originalPrice: 280, category: 'vegetables', farmer: 'Lucy Muthoni', rating: 4.8, discount: '29%', image: 'images/bell pepper.jpg' },
    { id: 9, name: 'Bananas (1kg)', price: 250, originalPrice: 320, category: 'fruits', farmer: 'Charles Kipchoge', rating: 4.9, discount: '22%', image: 'images/bananas.jpg' },
    { id: 10, name: 'Oranges (2kg)', price: 300, originalPrice: 400, category: 'fruits', farmer: 'Rose Kipchoge', rating: 4.7, discount: '25%', image: 'images/oranges.jpg' },
    { id: 11, name: 'Watermelon', price: 350, originalPrice: 450, category: 'fruits', farmer: 'Samuel Kiplagat', rating: 4.8, discount: '22%', image: 'images/watermelon.jpg' },
    { id: 12, name: 'Mangoes (3kg)', price: 280, originalPrice: 380, category: 'fruits', farmer: 'Patricia Kipchoge', rating: 4.9, discount: '26%', image: 'images/mangoes.jpg' }
];

// ===== DELIVERY CHARGES =====
const deliveryCharges = {
    'Nairobi': 300, 'Kiambu': 400, 'Nakuru': 600, 'Kisumu': 800,
    'Mombasa': 900, 'Kericho': 700, 'Eldoret': 750, 'Machakos': 500,
    'Nyeri': 550, 'Thika': 350, 'Naivasha': 550, 'Meru': 850,
    'Kakamega': 900, 'Other': 1000
};

// ===== CART CLASS =====
class Cart {
    constructor() {
        this.items = this.loadFromStorage();
    }

    loadFromStorage() {
        const stored = localStorage.getItem('cart');
        return stored ? JSON.parse(stored) : [];
    }

    saveToStorage() {
        localStorage.setItem('cart', JSON.stringify(this.items));
        this.updateBadge();
    }

    addItem(product, quantity = 1) {
        const existing = this.items.find(item => item.id === product.id);
        if (existing) {
            existing.quantity += quantity;
        } else {
            this.items.push({ ...product, quantity });
        }
        this.saveToStorage();
        this.showNotification(`${product.name} added to cart!`);
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveToStorage();
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(1, quantity);
            this.saveToStorage();
        }
    }

    getTotal() {
        return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    getItemCount() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    updateBadge() {
        const badge = document.getElementById('cartBadge');
        if (badge) {
            badge.textContent = this.getItemCount();
        }
    }

    clear() {
        this.items = [];
        this.saveToStorage();
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'alert alert-success';
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.top = '100px';
        notification.style.right = '20px';
        notification.style.zIndex = '1000';
        notification.style.maxWidth = '300px';
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2000);
    }
}

// ===== INITIALIZE CART =====
const cart = new Cart();

// ===== PAGE INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    cart.updateBadge();
    loadFeaturedProducts();
    loadFlashSaleProducts();
});

// ===== LOAD FEATURED PRODUCTS =====
function loadFeaturedProducts() {
    const container = document.getElementById('featuredProducts');
    if (!container) return;

    const featured = products.slice(0, 8);
    container.innerHTML = featured.map(product => createProductCard(product)).join('');
}

// ===== LOAD FLASH SALE PRODUCTS =====
function loadFlashSaleProducts() {
    const container = document.getElementById('flashSaleProducts');
    if (!container) return;

    const flashSale = products.slice(4, 12);
    container.innerHTML = flashSale.map(product => createProductCard(product)).join('');
}

// ===== CREATE PRODUCT CARD =====
function getProductImagePath(imagePath) {
    // Use correct relative path depending on whether the page is inside /pages/
    return window.location.pathname.includes('/pages/') ? `../${imagePath}` : imagePath;
}

function createProductCard(product) {
    return `
        <div class="product-card">
            <div class="product-image">
                <img src="${getProductImagePath(product.image)}" alt="${product.name}">
                <span class="product-badge">${product.discount} OFF</span>
            </div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-rating">★★★★★ ${product.rating}</div>
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                    <span class="product-price">KES ${product.price}</span>
                    <span class="product-original-price">KES ${product.originalPrice}</span>
                </div>
                <div class="product-farmer">by ${product.farmer}</div>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})" title="Add ${product.name} to cart">
                    <i class="fas fa-shopping-cart"></i> Add
                </button>
            </div>
        </div>
    `;
}

// ===== ADD TO CART =====
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.addItem(product, 1);
    }
}

// ===== FILTER BY CATEGORY =====
function filterByCategory(category) {
    const container = document.getElementById('featuredProducts');
    if (!container) return;

    const filtered = category === 'all' ? products : products.filter(p => p.category === category);
    container.innerHTML = filtered.map(product => createProductCard(product)).join('');

    // Update active category
    document.querySelectorAll('.category-item').forEach(item => {
        item.classList.remove('active');
    });
    event.target.closest('.category-item').classList.add('active');
}

// ===== SEARCH PRODUCTS =====
function searchProducts() {
    const input = document.getElementById('searchInput');
    const query = input ? input.value.trim() : '';
    
    if (!query) {
        alert('Please enter a product name to search');
        return;
    }

    // Check if on products page
    const container = document.getElementById('productsContainer');
    if (container) {
        // On products page - filter directly
        const filtered = products.filter(p => 
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.farmer.toLowerCase().includes(query.toLowerCase())
        );

        if (filtered.length === 0) {
            container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 3rem;"><i class="fas fa-search" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem; display: block;"></i><p style="font-size: 1.2rem; color: var(--light-text);"><strong>Product not found</strong></p><p style="color: #999; margin-top: 0.5rem;">Try searching with different keywords</p><a href="products.html" style="color: var(--primary-green); font-weight: 600; text-decoration: none; margin-top: 1rem; display: inline-block;">View all products</a></div>';
        } else {
            container.innerHTML = filtered.map(product => createProductCard(product)).join('');
        }
    } else {
        // On home page - redirect to products with search
        window.location.href = 'pages/products.html?search=' + encodeURIComponent(query);
    }
}

// ===== LOAD ALL PRODUCTS PAGE =====
function loadAllProducts() {
    const container = document.getElementById('productsContainer');
    if (!container) return;

    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search') || '';
    
    let filtered = products;
    if (searchQuery) {
        filtered = products.filter(p => 
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.farmer.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    if (filtered.length === 0 && searchQuery) {
        container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 3rem;"><i class="fas fa-search" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem; display: block;"></i><p style="font-size: 1.2rem; color: var(--light-text);"><strong>Product not found</strong></p><p style="color: #999; margin-top: 0.5rem;">No results for "' + searchQuery + '"</p><a href="products.html" style="color: var(--primary-green); font-weight: 600; text-decoration: none; margin-top: 1rem; display: inline-block;">View all products</a></div>';
    } else {
        container.innerHTML = filtered.map(product => createProductCard(product)).join('');
    }
}

// ===== LOAD CART PAGE =====
function loadCart() {
    const container = document.getElementById('cartItems');
    const summary = document.getElementById('cartSummary');

    if (!container) return;

    if (cart.items.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem;">Your cart is empty. <a href="products.html" style="color: var(--primary-green); font-weight: 600;">Continue shopping</a></p>';
        if (summary) summary.innerHTML = '';
        return;
    }

    container.innerHTML = `
        <table class="cart-table">
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                ${cart.items.map(item => `
                    <tr>
                        <td>${item.name}</td>
                        <td>KES ${item.price}</td>
                        <td>
                            <input type="number" class="quantity-input" value="${item.quantity}" 
                                   onchange="updateQuantity(${item.id}, this.value)" title="Update quantity">
                        </td>
                        <td>KES ${item.price * item.quantity}</td>
                        <td>
                            <button class="remove-btn" onclick="removeFromCart(${item.id})" title="Remove ${item.name} from cart">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    if (summary) {
        const subtotal = cart.getTotal();
        const deliveryLocation = document.getElementById('deliveryLocation')?.value || 'Nairobi';
        const deliveryCharge = deliveryCharges[deliveryLocation] || 0;
        const total = subtotal + deliveryCharge;

        summary.innerHTML = `
            <div class="cart-summary">
                <div class="summary-item">
                    <span>Subtotal:</span>
                    <span>KES ${subtotal}</span>
                </div>
                <div class="summary-item">
                    <span>Delivery:</span>
                    <span>KES ${deliveryCharge}</span>
                </div>
                <div class="summary-item total">
                    <span>Total:</span>
                    <span>KES ${total}</span>
                </div>
                <a href="checkout.html" class="btn-shop-now" style="display: block; text-align: center; margin-top: 1rem;" title="Proceed to checkout">
                    Proceed to Checkout
                </a>
            </div>
        `;
    }
}

// ===== UPDATE QUANTITY =====
function updateQuantity(productId, quantity) {
    cart.updateQuantity(productId, parseInt(quantity));
    loadCart();
}

// ===== REMOVE FROM CART =====
function removeFromCart(productId) {
    cart.removeItem(productId);
    loadCart();
}

// ===== CHECKOUT =====
function processCheckout() {
    const form = document.getElementById('checkoutForm');
    if (!form) return;

    const inputs = form.querySelectorAll('input, select, textarea');
    const name = inputs[0].value;
    const email = inputs[1].value;
    const phone = inputs[2].value;
    const location = inputs[3].value;
    const payment = inputs[4].value;
    const address = inputs[5].value;

    if (!name || !email || !phone || !location || !address) {
        alert('Please fill in all required fields');
        return;
    }

    const subtotal = cart.getTotal();
    const deliveryCharge = deliveryCharges[location] || 0;
    const total = subtotal + deliveryCharge;

    const order = {
        orderNumber: 'ORD-' + Date.now(),
        items: cart.items,
        location,
        address,
        subtotal,
        deliveryCharge,
        total,
        date: new Date().toLocaleDateString()
    };

    localStorage.setItem('lastOrder', JSON.stringify(order));
    cart.clear();
    window.location.href = 'order-confirmation.html';
}

// ===== LOAD ORDER CONFIRMATION =====
function loadOrderConfirmation() {
    const order = JSON.parse(localStorage.getItem('lastOrder'));
    if (!order) {
        window.location.href = 'products.html';
        return;
    }

    const container = document.getElementById('orderDetails');
    if (container) {
        container.innerHTML = `
            <div style="text-align: center;">
                <i class="fas fa-check-circle" style="font-size: 80px; color: var(--primary-green); margin-bottom: 1rem;"></i>
                <h2>Order Confirmed!</h2>
                <p style="font-size: 1.2rem; margin: 1rem 0;"><strong>${order.orderNumber}</strong></p>
                <div style="background: #f5f5f5; padding: 2rem; border-radius: 4px; margin: 2rem 0; text-align: left;">
                    <h3>Order Summary</h3>
                    <p><strong>Location:</strong> ${order.location}</p>
                    <p><strong>Address:</strong> ${order.address}</p>
                    <p><strong>Subtotal:</strong> KES ${order.subtotal}</p>
                    <p><strong>Delivery:</strong> KES ${order.deliveryCharge}</p>
                    <p style="font-size: 1.2rem; color: var(--primary-green);"><strong>Total:</strong> KES ${order.total}</p>
                </div>
                <a href="../index.html" class="btn-shop-now" title="Back to home">Back to Home</a>
            </div>
        `;
    }
}

// ===== HANDLE LOGIN =====
function handleLogin(event) {
    event.preventDefault();
    const email = event.target.querySelector('input[type="email"]').value;
    if (!email) {
        alert('Please enter your email');
        return;
    }
    localStorage.setItem('user', JSON.stringify({ email, loggedIn: true }));
    alert('Login successful!');
    window.location.href = '../index.html';
}

// ===== HANDLE REGISTER =====
function handleRegister(event) {
    event.preventDefault();
    const inputs = event.target.querySelectorAll('input, textarea');
    const name = inputs[1].value;
    const email = inputs[2].value;
    const phone = inputs[3].value;
    
    const roleRadios = event.target.querySelectorAll('input[name="role"]');
    const role = Array.from(roleRadios).find(r => r.checked)?.value || 'buyer';

    if (!name || !email || !phone) {
        alert('Please fill in all required fields');
        return;
    }

    localStorage.setItem('user', JSON.stringify({ name, email, phone, role, loggedIn: true }));
    alert(`Welcome ${name}!`);
    window.location.href = '../index.html';
}

// ===== INITIALIZE PAGE =====
window.addEventListener('load', function() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    
    if (page === 'products.html') {
        loadAllProducts();
    } else if (page === 'cart.html') {
        loadCart();
    } else if (page === 'order-confirmation.html') {
        loadOrderConfirmation();
    }
});
