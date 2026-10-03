const currentUser =
    JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser || currentUser.role !== "admin") {

    window.location.href = "index.html";

}

let products =
    JSON.parse(localStorage.getItem("products")) || [

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
        }

    ];


let suppliers =
    JSON.parse(localStorage.getItem("suppliers")) || [

        {
            id: 1,
            name: "Dell Suppliers",
            contact: "9876543210"
        },

        {
            id: 2,
            name: "Tech World",
            contact: "9876501234"
        },

        {
            id: 3,
            name: "Display Hub",
            contact: "9123456780"
        }

    ];

let orders =
    JSON.parse(
        localStorage.getItem("orders")
    ) || [];

function saveData() {

    localStorage.setItem(
        "products",
        JSON.stringify(products)
    );


    localStorage.setItem(
        "suppliers",
        JSON.stringify(suppliers)
    );


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


    document
        .getElementById(sectionId)
        .classList.remove("hidden");


    if (sectionId === "dashboardSection") {

        updateDashboard();

    }


    if (sectionId === "productsSection") {

        displayProducts();

    }


    if (sectionId === "suppliersSection") {

        displaySuppliers();

    }


    if (sectionId === "ordersSection") {

        displayOrders();

    }

}


function updateDashboard() {

    document.getElementById(
        "totalProducts"
    ).textContent =
        products.length;


    const lowStock =
        products.filter(
            product =>
                product.quantity < 10
        ).length;


    document.getElementById(
        "lowStock"
    ).textContent =
        lowStock;


    document.getElementById(
        "totalSuppliers"
    ).textContent =
        suppliers.length;


    document.getElementById(
        "totalOrders"
    ).textContent =
        orders.length;

}

function openProductForm() {

    document.getElementById(
        "productModal"
    ).classList.remove("hidden");


    document.getElementById(
        "modalTitle"
    ).textContent =
        "Add Product";


    document.getElementById(
        "productId"
    ).value = "";


    document.getElementById(
        "productName"
    ).value = "";


    document.getElementById(
        "productCategory"
    ).value = "";


    document.getElementById(
        "productPrice"
    ).value = "";


    document.getElementById(
        "productQuantity"
    ).value = "";


    document.getElementById(
        "productSupplier"
    ).value = "";

}

function closeProductForm() {

    document.getElementById(
        "productModal"
    ).classList.add("hidden");

}


function saveProduct(event) {

    event.preventDefault();


    const id =
        document.getElementById(
            "productId"
        ).value;


    const name =
        document.getElementById(
            "productName"
        ).value.trim();


    const category =
        document.getElementById(
            "productCategory"
        ).value.trim();


    const price =
        Number(
            document.getElementById(
                "productPrice"
            ).value
        );


    const quantity =
        Number(
            document.getElementById(
                "productQuantity"
            ).value
        );


    const supplier =
        document.getElementById(
            "productSupplier"
        ).value.trim();


    if (id) {

        const product =
            products.find(
                p =>
                    p.id === Number(id)
            );


        if (product) {

            product.name =
                name;

            product.category =
                category;

            product.price =
                price;

            product.quantity =
                quantity;

            product.supplier =
                supplier;

        }

    }

    else {

        products.push({

            id: Date.now(),

            name: name,

            category: category,

            price: price,

            quantity: quantity,

            supplier: supplier

        });

    }


    saveData();

    closeProductForm();

    displayProducts();

    updateDashboard();

    alert(
        id
            ? "Product updated successfully!"
            : "Product added successfully!"
    );

}

function displayProducts() {

    const table =
        document.getElementById(
            "productsTable"
        );


    if (products.length === 0) {

        table.innerHTML = `

            <tr>

                <td colspan="7">

                    No products available.

                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML =
        products.map(product => `

            <tr>

                <td>
                    ${product.id}
                </td>

                <td>
                    <strong>
                        ${product.name}
                    </strong>
                </td>

                <td>
                    ${product.category}
                </td>

                <td>
                    ₹${product.price.toLocaleString("en-IN")}
                </td>

                <td>
                    ${product.quantity}
                </td>

                <td>
                    ${product.supplier}
                </td>

                <td>

                    <button
                        class="edit-btn"
                        onclick="editProduct(${product.id})">

                        Edit

                    </button>


                    <button
                        class="delete-btn"
                        onclick="deleteProduct(${product.id})">

                        Delete

                    </button>

                </td>

            </tr>

        `).join("");

}

function editProduct(id) {

    const product =
        products.find(
            p => p.id === id
        );


    if (!product) return;


    document.getElementById(
        "productModal"
    ).classList.remove("hidden");


    document.getElementById(
        "modalTitle"
    ).textContent =
        "Edit Product";


    document.getElementById(
        "productId"
    ).value =
        product.id;


    document.getElementById(
        "productName"
    ).value =
        product.name;


    document.getElementById(
        "productCategory"
    ).value =
        product.category;


    document.getElementById(
        "productPrice"
    ).value =
        product.price;


    document.getElementById(
        "productQuantity"
    ).value =
        product.quantity;


    document.getElementById(
        "productSupplier"
    ).value =
        product.supplier;

}


function deleteProduct(id) {

    const product =
        products.find(
            p => p.id === id
        );


    if (!product) return;


    const confirmation =
        confirm(
            "Delete " +
            product.name +
            "?"
        );


    if (!confirmation) {

        return;

    }


    products =
        products.filter(
            p => p.id !== id
        );


    saveData();

    displayProducts();

    updateDashboard();

}

function addSupplier() {

    const name =
        prompt(
            "Enter supplier name:"
        );


    if (!name) return;


    const contact =
        prompt(
            "Enter supplier contact number:"
        );


    if (!contact) return;


    suppliers.push({

        id: Date.now(),

        name: name,

        contact: contact

    });


    saveData();

    displaySuppliers();

    updateDashboard();


    alert(
        "Supplier added successfully!"
    );

}

function displaySuppliers() {

    const container =
        document.getElementById(
            "suppliersContainer"
        );


    if (suppliers.length === 0) {

        container.innerHTML =
            "<p>No suppliers found.</p>";

        return;

    }


    container.innerHTML =
        suppliers.map(supplier => `

            <div class="supplier-card">

                <h3>
                    🚚 ${supplier.name}
                </h3>

                <p>
                    📞 ${supplier.contact}
                </p>

                <button
                    class="delete-btn"
                    onclick="deleteSupplier(${supplier.id})">

                    Delete

                </button>

            </div>

        `).join("");
        }

function deleteSupplier(id) {

    const confirmation =
        confirm(
            "Delete this supplier?"
        );


    if (!confirmation) return;


    suppliers =
        suppliers.filter(
            supplier =>
                supplier.id !== id
        );


    saveData();

    displaySuppliers();

    updateDashboard();

}


function displayOrders() {

    const container =
        document.getElementById(
            "ordersContainer"
        );


    if (orders.length === 0) {

        container.innerHTML = `

            <div class="dashboard-box">

                <h3>
                    No customer orders yet.
                </h3>

            </div>

        `;

        return;

    }


    container.innerHTML =
        orders
            .slice()
            .reverse()
            .map(order => `

                <div class="order-card">

                    <div class="order-header">

                        <div>

                            <h3>
                                ${order.id}
                            </h3>

                            <p>
                                Customer:
                                ${order.customerName}
                            </p>

                            <p>
                                Username:
                                ${order.username}
                            </p>

                            <p>
                                Date:
                                ${order.date}
                            </p>

                        </div>


                        <span class="status">

                            ${order.status}

                        </span>

                    </div>


                    <div>

                        ${order.items.map(item => `

                            <div class="order-item">

                                ${item.name}

                                ×

                                ${item.quantity}

                                &nbsp; -

                                ₹${item.total.toLocaleString("en-IN")}

                            </div>

                        `).join("")}

                    </div>


                    <h3 style="margin-top:15px;">

                        Total:
                        ₹${order.total.toLocaleString("en-IN")}

                    </h3>


                    ${
                        order.status === "Pending"

                        ?

                        `
                        <button
                            class="complete-btn"
                            onclick="completeOrder('${order.id}')">

                            Mark as Completed

                        </button>
                        `

                        :

                        ""
                    }

                </div>

            `).join("");

}

function completeOrder(orderId) {

    const order =
        orders.find(
            o =>
                o.id === orderId
        );


    if (!order) return;


    order.status =
        "Completed";


    saveData();

    displayOrders();

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

        document.getElementById(
            "welcomeAdmin"
        ).textContent =
            "Welcome, " +
            currentUser.name;

        document.getElementById(
            "adminName"
        ).textContent =
            currentUser.username;
        updateDashboard();
        displayProducts();
        displaySuppliers();
        displayOrders();
    }
);