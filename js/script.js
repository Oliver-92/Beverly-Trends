const btnTop = document.getElementById('btnTop');

// Mostrar botón al hacer scroll
window.onscroll = function () {
    if (document.documentElement.scrollTop > 300) {
        btnTop.classList.remove('d-none'); // Mostrar botón
    } else {
        btnTop.classList.add('d-none'); // Ocultar botón
    }
};

// Función para regresar al inicio
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Scroll suave
    });
};

// Inicializar el carrito desde localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Función para actualizar el contador del carrito
function updateCartCount() {
    let count = 0;
    cart.forEach(product => {
        count += product.quantity;
    });
    document.querySelector(".count").textContent = ' (' + count + ')';
};

// Función para agregar productos al carrito
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

// Función para actualizar el carrito en el DOM
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
                <td>$${product.price.toFixed(2)}</td>
                <td>$${product.total.toFixed(2)}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="removeFromCart(${index})">Eliminar</button>
                </td>
            </tr>
        `;
    });

    cartTotal.textContent = total.toFixed(2);
}

// Función para eliminar un producto del carrito
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
    saveCartToLocalStorage();
}

// Función para guardar el carrito en localStorage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Event listener para los botones "Agregar al carrito"
document.querySelectorAll('.btn[data-product][data-price]').forEach(button => {
    button.addEventListener('click', () => {
        const productName = button.dataset.product;
        const price = parseFloat(button.dataset.price);
        addToCart(productName, price);
        alert('Producto agregado al carrito');
    });
});


// Función para enviar el carrito por correo
function sendCartToEmail() {
    // Verifica si el carrito no está vacío
    if (cart.length === 0) {
        alert("El carrito está vacío. Agrega productos antes de enviarlo.");
        return;
    }

    // Prepara la información del carrito
    let cartDetails = cart.map(product =>
        `Producto: ${product.name}, Cantidad: ${product.quantity}, Precio: $${product.price.toFixed(2)}, Total: $${product.total.toFixed(2)}`
    ).join('\n');

    // Formato del mensaje
    const message = `Detalle del carrito:\n\n${cartDetails}\n\nTotal General: $${cart.reduce((acc, product) => acc + product.total, 0).toFixed(2)}`;

    // Cuerpo del formulario para enviar a Formspree
    const formData = new FormData();
    formData.append("carrito", message);

    // Enviar los datos al endpoint de Formspree
    fetch("https://formspree.io/f/mgvvykpg", {
        method: "POST",
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
        .then(response => {
            if (response.ok) {
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

// Actualizar el carrito en el DOM al cargar la página
updateCart();

