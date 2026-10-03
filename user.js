
const currentUser = JSON.parse(
    localStorage.getItem("currentUser")
);

if (!currentUser || currentUser.role !== "user") {
    window.location.href = "index.html";
}
let products = JSON.parse(
    localStorage.getItem("products")
);

if (!products || !Array.isArray(products)) {

    products = [
        {
            id: 1,
            name: "Laptop",
            category: "Electronics",
            price: 55000,
            quantity: 10,
            supplier: "Dell Suppliers"
        },

        {
            id: 2,
            name: "Keyboard",
            category: "Accessories",
            price: 1200,
            quantity: 25,
            supplier: "Tech World"
        },

        {
            id: 3,
            name: "Mouse",
            category: "Accessories",
            price: 700,
            quantity: 30,
            supplier: "Tech World"
        },

        {
            id: 4,
            name: "Monitor",
            category: "Electronics",
            price: 15000,
            quantity: 8,
            supplier: "Display Hub"
        },

        {
            id: 5,
            name: "Headphones",
            category: "Accessories",
            price: 2500,
            quantity: 15,
            supplier: "Audio World"
        },

        {
            id: 6,
            name: "Webcam",
            category: "Electronics",
            price: 3500,
            quantity: 12,
            supplier: "Tech World"
        }
    ];

    localStorage.setItem(
        "products",
        JSON.stringify(products)
    );
}

const cartKey = "cart_" + currentUser.username;

let cart = JSON.parse(
    localStorage.getItem(cartKey)
);


// If cart doesn't exist
if (!cart || !Array.isArray(cart)) {
    cart = [];
}


let orders = JSON.parse(
    localStorage.getItem("orders")
);

if (!orders || !Array.isArray(orders)) {
    orders = [];
}


function saveProducts() {

    localStorage.setItem(
        "products",
        JSON.stringify(products)
    );

}

function saveCart() {

    localStorage.setItem(
        cartKey,
        JSON.stringify(cart)
    );

}

function saveOrders() {

    localStorage.setItem(
        "orders",
        JSON.stringify(orders)
    );

}

function showSection(sectionId) {

    const sections =
        document.querySelectorAll(".section");

    sections.forEach(section => {
        section.classList.add("hidden");
    });


    const selectedSection =
        document.getElementById(sectionId);

    if (selectedSection) {
        selectedSection.classList.remove("hidden");
    }
    if (sectionId === "productsSection") {
        displayProducts();
    }

    if (sectionId === "cartSection") {
        displayCart();
    }

    if (sectionId === "ordersSection") {
        loadOrders();
        displayOrders();
    }


    updateDashboard();
}

function loadOrders() {

    const storedOrders =
        localStorage.getItem("orders");

    if (storedOrders) {

        try {

            orders = JSON.parse(storedOrders);

            if (!Array.isArray(orders)) {
                orders = [];
            }

        } catch (error) {

            console.error(
                "Error reading orders:",
                error
            );

            orders = [];
        }

    } else {

        orders = [];

    }

}

function displayProducts() {

    const container =
        document.getElementById(
            "productsContainer"
        );

    if (!container) return;


    const searchInput =
        document.getElementById(
            "searchProduct"
        );

    const search =
        searchInput
            ? searchInput.value.toLowerCase()
            : "";


    const filteredProducts =
        products.filter(product => {

            return (

                product.name
                    .toLowerCase()
                    .includes(search)

                ||

                product.category
                    .toLowerCase()
                    .includes(search)

            );

        });


    if (filteredProducts.length === 0) {

        container.innerHTML = `
            <div class="welcome-box">
                <h2>No products found</h2>
                <p>Try another product name.</p>
            </div>
        `;

        return;
    }


    container.innerHTML =
        filteredProducts.map(product => {

            let icon = "📦";


            if (
                product.category
                    .toLowerCase()
                    .includes("electronic")
            ) {

                icon = "💻";

            }

            else if (
                product.category
                    .toLowerCase()
                    .includes("access")
            ) {

                icon = "⌨️";

            }


            return `

                <div class="product-card">

                    <div class="product-image">
                        ${icon}
                    </div>

                    <div class="product-details">

                        <h3>
                            ${product.name}
                        </h3>

                        <p class="category">
                            ${product.category}
                        </p>

                        <p class="price">
                            ₹${Number(product.price)
                                .toLocaleString("en-IN")}
                        </p>

                        <p class="stock">
                            Available:
                            ${product.quantity}
                        </p>

                        ${
                            product.quantity > 0

                            ?

                            `
                            <button
                                class="add-cart-btn"
                                onclick="addToCart(${product.id})">

                                🛒 Add to Cart

                            </button>
                            `

                            :

                            `
                            <p class="out-stock">
                                Out of Stock
                            </p>
                            `
                        }

                    </div>

                </div>

            `;

        }).join("");

}

function addToCart(productId) {

    const product =
        products.find(
            product =>
                Number(product.id) === Number(productId)
        );


    if (!product) {

        alert("Product not found!");

        return;
    }


    if (product.quantity <= 0) {

        alert("Product is out of stock!");

        return;
    }


    const existingItem =
        cart.find(
            item =>
                Number(item.productId) ===
                Number(productId)
        );


    if (existingItem) {

        if (
            existingItem.quantity >=
            product.quantity
        ) {

            alert(
                "You cannot add more than available stock!"
            );

            return;
        }


        existingItem.quantity++;

    }

    else {

        cart.push({

            productId: product.id,

            quantity: 1

        });

    }


    saveCart();

    updateCartCount();

    updateDashboard();

    alert(
        product.name +
        " added to cart!"
    );

}

function displayCart() {

    const container =
        document.getElementById(
            "cartContainer"
        );

    if (!container) return;


    if (cart.length === 0) {

        container.innerHTML = `

            <div class="welcome-box">

                <h2>Your cart is empty 🛒</h2>

                <p>
                    Browse products and add items
                    to your cart.
                </p>

                <button
                    class="shop-btn"
                    onclick="showSection('productsSection')">

                    Start Shopping

                </button>

            </div>

        `;

        return;
    }


    let total = 0;

    let html = "";


    cart.forEach(item => {

        const product =
            products.find(
                product =>
                    Number(product.id) ===
                    Number(item.productId)
            );
        if (!product) {
            return;
        }


        const itemTotal =
            Number(product.price) *
            Number(item.quantity);


        total += itemTotal;


        html += `

            <div class="cart-item">

                <div class="cart-info">

                    <h3>
                        ${product.name}
                    </h3>

                    <p>
                        ₹${Number(product.price)
                            .toLocaleString("en-IN")}
                        each
                    </p>

                </div>


                <div class="quantity-controls">

                    <button
                        onclick="decreaseQuantity(${product.id})">

                        −

                    </button>


                    <strong>
                        ${item.quantity}
                    </strong>


                    <button
                        onclick="increaseQuantity(${product.id})">

                        +

                    </button>


                    <button
                        class="remove-btn"
                        onclick="removeFromCart(${product.id})">

                        ✕

                    </button>

                </div>


                <strong>

                    ₹${itemTotal
                        .toLocaleString("en-IN")}

                </strong>

            </div>

        `;

    });


    html += `

        <div class="cart-total">

            <h2>
                Total:
                ₹${total.toLocaleString("en-IN")}
            </h2>

            <button
                class="checkout-btn"
                onclick="placeOrder()">

                Place Order

            </button>

        </div>

    `;


    container.innerHTML = html;

}

function increaseQuantity(productId) {

    const product =
        products.find(
            p =>
                Number(p.id) ===
                Number(productId)
        );


    const item =
        cart.find(
            i =>
                Number(i.productId) ===
                Number(productId)
        );


    if (!product || !item) {
        return;
    }


    if (
        item.quantity >=
        product.quantity
    ) {

        alert(
            "Maximum available stock reached!"
        );

        return;
    }


    item.quantity++;


    saveCart();

    displayCart();

    updateDashboard();

}

function decreaseQuantity(productId) {

    const item =
        cart.find(
            i =>
                Number(i.productId) ===
                Number(productId)
        );


    if (!item) {
        return;
    }


    item.quantity--;


    if (item.quantity <= 0) {

        cart =
            cart.filter(
                i =>
                    Number(i.productId) !==
                    Number(productId)
            );

    }


    saveCart();

    displayCart();

    updateCartCount();

    updateDashboard();

}

function removeFromCart(productId) {

    cart =
        cart.filter(
            item =>
                Number(item.productId) !==
                Number(productId)
        );


    saveCart();

    displayCart();

    updateCartCount();

    updateDashboard();

}
// PLACE ORDER
// ==========================================

function placeOrder() {

    console.log("Place Order clicked");

    console.log("Current cart:", cart);
    if (!cart || cart.length === 0) {

        alert(
            "Your cart is empty!"
        );

        return;
    }
    products =
        JSON.parse(
            localStorage.getItem("products")
        ) || products;
    loadOrders();

    for (const cartItem of cart) {

        const product =
            products.find(
                p =>
                    Number(p.id) ===
                    Number(cartItem.productId)
            );


        if (!product) {

            alert(
                "One of the products is no longer available."
            );

            return;
        }


        if (
            Number(cartItem.quantity) >
            Number(product.quantity)
        ) {

            alert(
                product.name +
                " does not have enough stock."
            );

            displayCart();

            return;
        }

    }

    let total = 0;
    const orderItems =
        cart.map(cartItem => {

            const product =
                products.find(
                    p =>
                        Number(p.id) ===
                        Number(cartItem.productId)
                );


            const quantity =
                Number(cartItem.quantity);


            const price =
                Number(product.price);
            const itemTotal =
                price * quantity;
            total += itemTotal;
            product.quantity -= quantity;


            return {

                productId: product.id,
                name: product.name,
                category: product.category,
                price: price,
                quantity: quantity,
                total: itemTotal
            };

        });

    const newOrder = {
        id:
            "ORD-" +
            Date.now(),
        username:
            currentUser.username,
        customerName:
            currentUser.name,
        email:
            currentUser.email,
        items:
            orderItems,
        total:
            total,
        status:
            "Pending",

        date:
            new Date().toLocaleString(
                "en-IN"
            )

    };


    console.log(
        "New order:",
        newOrder
    );
    orders.push(newOrder);

    localStorage.setItem(
        "orders",
        JSON.stringify(orders)
    );


    localStorage.setItem(
        "products",
        JSON.stringify(products)
    );

    cart = [];


    localStorage.setItem(
        cartKey,
        JSON.stringify(cart)
    );

    alert(
        "Order placed successfully! 🎉\n\n" +
        "Order ID: " +
        newOrder.id
    );

    updateCartCount();

    updateDashboard();

    displayCart();

    showSection(
        "ordersSection"
    );

}

function displayOrders() {

    const container =
        document.getElementById(
            "ordersContainer"
        );

    if (!container) return;
    loadOrders();

    const myOrders =
        orders.filter(order => {

            return (
                String(order.username)
                .toLowerCase()
                ===
                String(currentUser.username)
                    .toLowerCase()
            );

        });


    console.log(
        "My Orders:",
        myOrders
    );

    if (myOrders.length === 0) {

        container.innerHTML = `

            <div class="welcome-box">

                <h2>
                    No orders yet 📦
                </h2>

                <p>
                    Your placed orders will
                    appear here.
                </p>

                <button
                    class="shop-btn"
                    onclick="showSection('productsSection')">

                    Start Shopping

                </button>

            </div>

        `;

        return;
    }

    container.innerHTML =
        myOrders
            .slice()
            .reverse()
            .map(order => {

                const items =
                    Array.isArray(order.items)
                        ? order.items
                        : [];


                return `

                    <div class="order-card">

                        <div class="order-header">

                            <div>

                                <h3>
                                    🧾
                                    ${order.id}
                                </h3>

                                <p>
                                    📅
                                    ${order.date}
                                </p>

                            </div>


                            <span class="order-status">

                                ${order.status}

                            </span>

                        </div>


                        <div class="order-items">

                            ${items.map(item => `

                                <div
                                    class="order-product">

                                    <strong>
                                        ${item.name}
                                    </strong>

                                    <br>

                                    Quantity:
                                    ${item.quantity}

                                    ×

                                    ₹${Number(item.price)
                                        .toLocaleString("en-IN")}

                                    <br>

                                    Subtotal:
                                    ₹${Number(item.total)
                                        .toLocaleString("en-IN")}

                                </div>

                            `).join("")}

                        </div>


                        <div
                            style="
                            margin-top:15px;
                            padding-top:15px;
                            border-top:1px solid #e2e8f0;
                            "
                        >

                            <h3>

                                Order Total:
                                ₹${Number(order.total)
                                    .toLocaleString("en-IN")}

                            </h3>

                        </div>

                    </div>

                `;

            })
            .join("");

}

function updateCartCount() {

    const count =
        cart.reduce(
            (sum, item) =>
                sum +
                Number(item.quantity),
            0
        );


    const cartCount =
        document.getElementById(
            "cartCount"
        );


    const dashboardCart =
        document.getElementById(
            "dashboardCart"
        );


    if (cartCount) {

        cartCount.textContent =
            count;

    }


    if (dashboardCart) {

        dashboardCart.textContent =
            count;

    }

}

function updateDashboard() {

    const totalProducts =
        document.getElementById(
            "totalProducts"
        );


    const dashboardCart =
        document.getElementById(
            "dashboardCart"
        );


    const totalOrders =
        document.getElementById(
            "totalOrders"
        );


    const cartValue =
        document.getElementById(
            "cartValue"
        );
    const availableProducts =
        products.filter(
            product =>
                Number(product.quantity) > 0
        ).length;


    if (totalProducts) {

        totalProducts.textContent =
            availableProducts;

    }
    const cartItemCount =
        cart.reduce(
            (sum, item) =>
                sum +
                Number(item.quantity),
            0
        );


    if (dashboardCart) {

        dashboardCart.textContent =
            cartItemCount;

    }
    loadOrders();


    const myOrders =
        orders.filter(
            order =>
                String(order.username)
                    .toLowerCase()
                ===
                String(currentUser.username)
                    .toLowerCase()
        );


    if (totalOrders) {

        totalOrders.textContent =
            myOrders.length;

    }

    const value =
        cart.reduce(
            (sum, item) => {

                const product =
                    products.find(
                        p =>
                            Number(p.id) ===
                            Number(item.productId)
                    );


                if (!product) {

                    return sum;

                }
                return (
                    sum +
                    Number(product.price) *
                    Number(item.quantity)
                );

            },

            0
        );


    if (cartValue) {

        cartValue.textContent =
            "₹" +
            value.toLocaleString("en-IN");

    }


    updateCartCount();

}

function logout() {

    localStorage.removeItem(
        "currentUser"
    );


    window.location.href =
        "index.html";

}

document.addEventListener(
    "DOMContentLoaded",
    function () {
        const welcomeUser =
            document.getElementById(
                "welcomeUser"
            );

     if (welcomeUser) {

            welcomeUser.textContent =
                "Welcome, " +
                currentUser.name;

        }
        const usernameDisplay =
            document.getElementById(
                "usernameDisplay"
            );


        if (usernameDisplay) {

            usernameDisplay.textContent =
                currentUser.username;

        }

        products =
            JSON.parse(
                localStorage.getItem("products")
            ) || products;


        loadOrders();

        cart =
            JSON.parse(
                localStorage.getItem(cartKey)
            ) || [];

        updateDashboard();

        displayProducts();

        updateCartCount();

    }
);