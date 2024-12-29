const btnTop = document.getElementById('btnTop');

// Show button when scrolling 
window.onscroll = function () {
    if (document.documentElement.scrollTop > 300) {
        btnTop.classList.remove('d-none'); // Show button
    } else {
        btnTop.classList.add('d-none'); // Hide button
    }
};

// Function to scroll to top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Scroll suave
    });
};

// Initialize cart from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to update cart count
function updateCartCount() {
    let count = 0;
    cart.forEach(product => {
        count += product.quantity;
    });
    document.querySelector(".count").textContent = ' (' + count + ')';
};

// Function to add a product to the cart
function addToCart(productName, price) {
    const existingProduct = cart.find(product => product.name === productName);
    if (existingProduct) {
        existingProduct.quantity++;
        existingProduct.total = existingProduct.quantity * existingProduct.price;
    } else {
        cart.push({ name: productName, price, quantity: 1, total: price });
    }

    updateCart();
    saveCartToLocalStorage();
}

// Function to update the cart
function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    cartItems.innerHTML = '';
    let total = 0;

    updateCartCount()

    cart.forEach((product, index) => {
        total += product.total;
        cartItems.innerHTML += `
            <tr>
                <td>${product.name}</td>
                <td>${product.quantity}</td>
                <td>$${product.price}</td>
                <td>$${product.total}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="removeFromCart(${index})">Eliminar</button>
                </td>
            </tr>
        `;
    });

    cartTotal.textContent = total;
}

// Function to remove a product from the cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
    saveCartToLocalStorage();
}

// Function to save the cart to localStorage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Event listener to add products to the cart
document.querySelectorAll('.btn[data-product][data-price]').forEach(button => {
    button.addEventListener('click', () => {
        const productName = button.dataset.product;
        const price = parseFloat(button.dataset.price);
        addToCart(productName, price);
        alert('Producto agregado al carrito');
    });
});


// Function to send the cart to Formspree
function sendCartToEmail() {
    if (cart.length === 0) {
        alert("El carrito está vacío. Agrega productos antes de enviarlo.");
        return;
    }

    // Format the cart details
    let cartDetails = cart.map(product =>
        `Producto: ${product.name}, Cantidad: ${product.quantity}, Precio: $${product.price.toFixed(2)}, Total: $${product.total.toFixed(2)}`
    ).join('\n');

    // Format the message
    const message = `Detalle del carrito:\n\n${cartDetails}\n\nTotal General: $${cart.reduce((acc, product) => acc + product.total, 0).toFixed(2)}`;

    // Create a FormData object
    const formData = new FormData();
    formData.append("carrito", message);

    // Send the cart to Formspree
    fetch("https://formspree.io/f/mgvvykpg", {
        method: "POST",
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
        .then(response => {
            if (response.ok) {
                cart = []; // Clear the cart
                updateCart(); // Update the cart in the DOM
                alert("Carrito enviado exitosamente.");
            } else {
                alert("Ocurrió un error al enviar el carrito.");
            }
        })
        .catch(error => {
            console.error("Error al enviar el carrito:", error);
            alert("Ocurrió un error al enviar el carrito.");
        });
}

// Update cart in DOM on page load
updateCart();