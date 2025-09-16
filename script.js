// Milk products data
        const milkProducts = [
            { id: 1, name: "Buffalo Milk", description: "Fresh buffalo milk - Half Liter", price: 55, image: "images/buffalo-milk.jpg", emoji: "🥛" },
            { id: 2, name: "Cow Milk", description: "Pure cow milk - Half Liter", price: 60, image: "images/cow-milk.jpg", emoji: "🥛" },
            { id: 3, name: "Fresh Curd", description: "Homemade fresh curd - 100gm", price: 15, image: "images/curd.jpg", emoji: "🥄" },
            { id: 4, name: "Pure Ghee", description: "Traditional pure ghee - 250gm", price: 250, image: "images/ghee.jpg", emoji: "🧈" },
            { id: 5, name: "Fresh Paneer", description: "Soft fresh paneer - 100gm", price: 80, image: "images/paneer.jpg", emoji: "🧀" }
        ];

        let cart = [];

        // Display products
        function displayProducts() {
            const grid = document.getElementById('productsGrid');
            grid.innerHTML = '';

            milkProducts.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.innerHTML = `
                    <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                    <span style="font-size: 4rem; display: none;">${product.emoji}</span>
                    <h3>${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">₹${product.price}</div>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
                `;
                grid.appendChild(productCard);
            });
        }

        // Add to cart
        function addToCart(productId) {
            const product = milkProducts.find(p => p.id === productId);
            const existingItem = cart.find(item => item.id === productId);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ ...product, quantity: 1 });
            }

            updateCartDisplay();
        }

        // Update cart display
        function updateCartDisplay() {
            const cartItems = document.getElementById('cartItems');
            const cartTotal = document.getElementById('cartTotal');
            const bottomCartCount = document.getElementById('bottom-cart-count');
            const bottomCartTotal = document.getElementById('bottom-cart-total');
            const bottomCart = document.getElementById('cart-bottom');

            if (cart.length === 0) {
                cartItems.innerHTML = '<p style="color: rgba(255, 255, 255, 0.7);">Your cart is empty</p>';
                cartTotal.textContent = 'Total: ₹0.00';
                bottomCartCount.textContent = '0 items';
                bottomCartTotal.textContent = '₹0';
                bottomCart.classList.remove('show');
                return;
            }

            cartItems.innerHTML = '';
            let total = 0;
            let totalItems = 0;

            cart.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'cart-item';
                itemDiv.innerHTML = `${item.emoji} ${item.name} x${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}`;
                cartItems.appendChild(itemDiv);
                total += item.price * item.quantity;
                totalItems += item.quantity;
            });

            cartTotal.textContent = `Total: ₹${total.toFixed(2)}`;
            bottomCartCount.textContent = `${totalItems} item${totalItems > 1 ? 's' : ''}`;
            bottomCartTotal.textContent = `₹${total.toFixed(2)}`;
            bottomCart.classList.add('show');
        }

        // User authentication state
        let isLoggedIn = false;
        let currentUser = null;
        let registeredUsers = JSON.parse(localStorage.getItem('farm2fridge_users') || '[]');

        // Checkout function
        function checkout() {
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }

            // Check if user is logged in
            if (!isLoggedIn) {
                document.getElementById('loginModal').classList.add('show');
                return;
            }

            // Set minimum date to today
            const today = new Date().toISOString().split('T')[0];
            document.querySelector('input[type="date"]').setAttribute('min', today);
            
            // Show checkout modal
            document.getElementById('checkoutModal').classList.add('show');
        }

        // Modal functions
        function closeModal(modalId) {
            document.getElementById(modalId).classList.remove('show');
        }

        function selectSlot(element) {
            document.querySelectorAll('.slot-btn').forEach(btn => btn.classList.remove('active'));
            element.classList.add('active');
        }

        function selectSubscription(element, type) {
            document.querySelectorAll('.subscription-btn').forEach(btn => btn.classList.remove('active'));
            element.classList.add('active');
        }

        function handleCheckout(event) {
            event.preventDefault();
            
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const selectedSlot = document.querySelector('.slot-btn.active').textContent;
            const selectedSubscription = document.querySelector('.subscription-btn.active').textContent;
            const paymentMethod = event.target.querySelector('select').value;
            const address = event.target.querySelector('textarea').value;
            const deliveryDate = event.target.querySelector('input[type="date"]').value;
            
            // Store order details for confirmation
            const orderDetails = {
                items: [...cart],
                total: total,
                slot: selectedSlot,
                subscription: selectedSubscription,
                payment: paymentMethod,
                address: address,
                date: deliveryDate
            };
            
            // Close checkout modal
            closeModal('checkoutModal');
            
            // Show order confirmation modal
            showOrderConfirmation(orderDetails);
        }

        function showNotification(message) {
            const notification = document.getElementById('notification');
            notification.textContent = message;
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 4000);
        }

        // Authentication functions
        function showLoginModal() {
            if (isLoggedIn) {
                showUserProfile();
            } else {
                document.getElementById('loginModal').classList.add('show');
                showLoginForm();
            }
        }

        function showUserProfile() {
            if (isLoggedIn && currentUser) {
                alert(`Welcome ${currentUser.name}!\n\nEmail: ${currentUser.email}\nPhone: ${currentUser.phone}\n\nClick OK to logout.`);
                logout();
            }
        }

        function logout() {
            isLoggedIn = false;
            currentUser = null;
            updateNavigation();
            showNotification('Logged out successfully!');
        }

        function updateNavigation() {
            const loginBtn = document.getElementById('loginNavBtn');
            const userBtn = document.getElementById('userNavBtn');
            
            if (isLoggedIn && currentUser) {
                loginBtn.style.display = 'none';
                userBtn.style.display = 'block';
                userBtn.textContent = `Welcome, ${currentUser.name}`;
            } else {
                loginBtn.style.display = 'block';
                userBtn.style.display = 'none';
            }
        }

        function showLoginForm() {
            document.getElementById('authTitle').textContent = 'Login to Continue';
            document.getElementById('loginForm').style.display = 'block';
            document.getElementById('signupForm').style.display = 'none';
            // Clear errors
            document.getElementById('loginError').style.display = 'none';
            document.getElementById('signupError').style.display = 'none';
        }

        function showSignupForm() {
            document.getElementById('authTitle').textContent = 'Create Account';
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('signupForm').style.display = 'block';
            // Clear errors
            document.getElementById('loginError').style.display = 'none';
            document.getElementById('signupError').style.display = 'none';
        }

        function handleLogin(event) {
            event.preventDefault();
            const email = event.target.querySelector('input[type="text"]').value;
            const password = event.target.querySelector('input[type="password"]').value;
            const errorDiv = document.getElementById('loginError');
            
            // Find user in registered users
            const user = registeredUsers.find(u => 
                (u.email === email || u.phone === email) && u.password === password
            );
            
            if (user) {
                isLoggedIn = true;
                currentUser = user;
                updateNavigation();
                closeModal('loginModal');
                showNotification(`Login successful! Welcome back, ${user.name}!`);
                errorDiv.style.display = 'none';
                
                // Clear form
                event.target.reset();
                
                // Now proceed to checkout
                setTimeout(() => {
                    checkout();
                }, 1000);
            } else {
                errorDiv.textContent = 'Invalid email/phone or password. Please try again.';
                errorDiv.style.display = 'block';
            }
        }

        function handleSignup(event) {
            event.preventDefault();
            const name = event.target.querySelector('input[type="text"]').value;
            const email = event.target.querySelector('input[type="email"]').value;
            const phone = event.target.querySelector('input[type="tel"]').value;
            const password = event.target.querySelectorAll('input[type="password"]')[0].value;
            const confirmPassword = event.target.querySelectorAll('input[type="password"]')[1].value;
            const errorDiv = document.getElementById('signupError');
            
            // Clear previous errors
            errorDiv.style.display = 'none';
            
            if (password !== confirmPassword) {
                errorDiv.textContent = 'Passwords do not match!';
                errorDiv.style.display = 'block';
                return;
            }
            
            // Check if user already exists
            const existingUser = registeredUsers.find(u => u.email === email || u.phone === phone);
            if (existingUser) {
                errorDiv.textContent = 'User with this email or phone already exists!';
                errorDiv.style.display = 'block';
                return;
            }
            
            // Create new user
            const newUser = { name, email, phone, password };
            registeredUsers.push(newUser);
            
            // Save to localStorage
            localStorage.setItem('farm2fridge_users', JSON.stringify(registeredUsers));
            
            // Log in the user
            isLoggedIn = true;
            currentUser = newUser;
            updateNavigation();
            closeModal('loginModal');
            showNotification(`Account created successfully! Welcome to Farm2Fridge, ${name}!`);
            
            // Clear form
            event.target.reset();
            
            // Now proceed to checkout
            setTimeout(() => {
                checkout();
            }, 1000);
        }

        // Payment method handler
        function handlePaymentChange(paymentMethod) {
            const upiSection = document.getElementById('upiSection');
            if (paymentMethod === 'upi') {
                upiSection.style.display = 'block';
            } else {
                upiSection.style.display = 'none';
            }
        }

        // Page navigation
        function showHomePage() {
            document.getElementById('homePage').classList.add('active');
            document.getElementById('productsPage').classList.remove('active');
            document.getElementById('cartPage').classList.remove('active');
            
            // Update nav
            document.querySelectorAll('.nav-menu a').forEach(a => a.classList.remove('active'));
            document.querySelector('a[href="#home"]').classList.add('active');
        }

        function showProductsPage() {
            document.getElementById('homePage').classList.remove('active');
            document.getElementById('productsPage').classList.add('active');
            document.getElementById('cartPage').classList.remove('active');
            
            // Update nav
            document.querySelectorAll('.nav-menu a').forEach(a => a.classList.remove('active'));
            document.querySelector('a[href="#products"]').classList.add('active');
            
            // Display products
            displayProducts();
        }

        function showCartPage() {
            document.getElementById('homePage').classList.remove('active');
            document.getElementById('productsPage').classList.remove('active');
            document.getElementById('cartPage').classList.add('active');
            
            // Update nav
            document.querySelectorAll('.nav-menu a').forEach(a => a.classList.remove('active'));
            document.querySelector('a[href="#cart"]').classList.add('active');
        }

        function showAboutSection() {
            // Scroll to about section on home page
            showHomePage();
            setTimeout(() => {
                document.getElementById('about').scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
            
            // Update nav
            document.querySelectorAll('.nav-menu a').forEach(a => a.classList.remove('active'));
            document.querySelector('a[href="#about"]').classList.add('active');
        }

        function showContactSection() {
            // Scroll to contact section on home page
            showHomePage();
            setTimeout(() => {
                document.getElementById('contact').scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
            
            // Update nav
            document.querySelectorAll('.nav-menu a').forEach(a => a.classList.remove('active'));
            document.querySelector('a[href="#contact"]').classList.add('active');
        }

        // Store current order for confirmation
        let currentOrder = null;

        function showOrderConfirmation(orderDetails) {
            currentOrder = orderDetails;
            const content = document.getElementById('orderConfirmationContent');
            
            let itemsList = '';
            orderDetails.items.forEach(item => {
                itemsList += `<div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span>${item.emoji} ${item.name} x${item.quantity}</span>
                    <span>₹${(item.price * item.quantity).toFixed(2)}</span>
                </div>`;
            });
            
            const paymentStatus = orderDetails.payment === 'upi' ? 
                '<div style="color: #ff9800; font-weight: bold; margin-top: 1rem;">⚠️ Please complete UPI payment before confirming</div>' : 
                '<div style="color: #4CAF50; font-weight: bold; margin-top: 1rem;">✅ Cash on Delivery selected</div>';
            
            content.innerHTML = `
                <div style="background: rgba(255, 255, 255, 0.1); padding: 1.5rem; border-radius: 10px; margin-bottom: 1rem;">
                    <h4 style="color: #2E7D32; margin-bottom: 1rem;">Order Summary</h4>
                    ${itemsList}
                    <hr style="border: 1px solid rgba(76, 175, 80, 0.3); margin: 1rem 0;">
                    <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 1.1rem;">
                        <span>Total:</span>
                        <span style="color: #4CAF50;">₹${orderDetails.total.toFixed(2)}</span>
                    </div>
                </div>
                
                <div style="background: rgba(255, 255, 255, 0.1); padding: 1.5rem; border-radius: 10px;">
                    <h4 style="color: #2E7D32; margin-bottom: 1rem;">Delivery Details</h4>
                    <p><strong>Address:</strong> ${orderDetails.address}</p>
                    <p><strong>Date:</strong> ${orderDetails.date}</p>
                    <p><strong>Time Slot:</strong> ${orderDetails.slot}</p>
                    <p><strong>Subscription:</strong> ${orderDetails.subscription}</p>
                    <p><strong>Payment Method:</strong> ${orderDetails.payment === 'upi' ? 'UPI Payment' : 'Cash on Delivery'}</p>
                    ${paymentStatus}
                </div>
            `;
            
            document.getElementById('orderConfirmationModal').classList.add('show');
        }

        async function confirmOrder() {
            if (!currentOrder) return;

            // Check if UPI payment is selected but not completed
            if (currentOrder.payment === 'upi') {
                const paymentConfirmed = confirm('Have you completed the UPI payment?\n\nClick OK if payment is done, or Cancel to go back and complete payment.');
                if (!paymentConfirmed) {
                    return; // Don't proceed with order
                }
            }

            // Close confirmation modal
            closeModal('orderConfirmationModal');

            // Generate order ID
            const orderId = 'F2F' + Date.now().toString().slice(-6);

            // Send order confirmation email to backend
            try {
                const response = await fetch('http://localhost:3001/api/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        orderDetails: currentOrder,
                        userEmail: currentUser.email
                    })
                });
                if (!response.ok) {
                    throw new Error('Failed to send order confirmation email');
                }
            } catch (error) {
                console.error(error);
                showNotification('Order confirmed but failed to send confirmation email.');
            }

            // Show success notification
            const paymentText = currentOrder.payment === 'upi' ? 'UPI Payment Confirmed' : 'Cash on Delivery';
            showNotification(`Order confirmed successfully! 🎉\nOrder ID: ${orderId}\nTotal: ₹${currentOrder.total.toFixed(2)}\nPayment: ${paymentText}\nDelivery: ${currentOrder.slot} on ${currentOrder.date}`);

            // Clear cart and reset
            cart = [];
            updateCartDisplay();
            currentOrder = null;
        }

        function cancelOrder() {
            closeModal('orderConfirmationModal');
            currentOrder = null;
            showNotification('Order cancelled. You can modify your order and try again.');
        }

        function handleContactForm(event) {
            event.preventDefault();
            const name = event.target.querySelector('input[type="text"]').value;
            const subject = event.target.querySelector('select').value;
            
            showNotification(`Thank you ${name}! Your message has been sent successfully. We'll get back to you within 24 hours.`);
            event.target.reset();
        }

        // Function to change background image
        function changeBackgroundImage(imageUrl) {
            const backgroundContainer = document.getElementById('backgroundContainer');
            backgroundContainer.style.backgroundImage = `url('${imageUrl}')`;
        }

        // Function to change logo
        function changeLogo(logoUrl) {
            const logoContent = document.getElementById('logoContent');
            if (logoUrl) {
                logoContent.innerHTML = `<img src="${logoUrl}" alt="Farm2Fridge Logo">`;
            } else {
                logoContent.innerHTML = '🌱'; // Default emoji logo
            }
        }

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
            });
        });

        // Toggle mobile menu
        function toggleMenu() {
            const navMenu = document.getElementById('navMenu');
            navMenu.classList.toggle('show');
        }
