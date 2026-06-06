// --- 1. INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
    actualizarBadge();
    
    // Animaciones de las fotos
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('animate-fade-in'); });
    });
    document.querySelectorAll('.arch-img').forEach(el => observer.observe(el));
    
    // Si estamos en la página del carrito, lo cargamos
    if (document.getElementById('lista-carrito')) cargarCarrito();
});

// --- 2. LÓGICA DE ACCIONES (Agregar, Cambiar, Eliminar) ---

function agregarAlCarrito(nombre, precio, imagen) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let item = carrito.find(p => p.nombre === nombre);
    
    if (item) {
        item.cantidad += 1;
    } else {
        carrito.push({ nombre, precio, imagen, cantidad: 1 });
    }
    
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    actualizarBadge(); 
    alert(nombre + " añadido al pedido!");
}

function cambiarCantidad(nombre, delta) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let index = carrito.findIndex(p => p.nombre === nombre);
    
    if (index !== -1) {
        carrito[index].cantidad += delta;
        if (carrito[index].cantidad <= 0) carrito.splice(index, 1);
    }
    
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    if (document.getElementById('lista-carrito')) cargarCarrito();
    actualizarBadge();
}

function eliminarProducto(nombre) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito = carrito.filter(item => item.nombre !== nombre);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    if (document.getElementById('lista-carrito')) cargarCarrito();
    actualizarBadge();
}

// --- 3. LÓGICA VISUAL (Carrito y Badge) ---

function cargarCarrito() {
    const listaCarrito = document.getElementById('lista-carrito');
    if (!listaCarrito) return;
    
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let html = '';
    let subtotal = 0;

    carrito.forEach((prod) => {
        subtotal += (parseFloat(prod.precio) * prod.cantidad);
        
        html += `
            <div class="cart-item bg-white p-3 rounded mb-3 d-flex align-items-center">
                <img src="${prod.imagen}" width="80" class="rounded">
                <div class="ms-3 flex-grow-1">
                    <h5 class="mb-0">${prod.nombre}</h5>
                    <div class="d-flex align-items-center mt-2">
                        <button class="btn btn-sm btn-outline-dark" onclick="cambiarCantidad('${prod.nombre}', -1)">-</button>
                        <span class="mx-3">${prod.cantidad}</span>
                        <button class="btn btn-sm btn-outline-dark" onclick="cambiarCantidad('${prod.nombre}', 1)">+</button>
                    </div>
                </div>
                <div class="text-end">
                    <span class="fw-bold d-block mb-2">${(parseFloat(prod.precio) * prod.cantidad).toFixed(2)} Bs</span>
                    <button class="btn btn-sm btn-outline-danger" onclick="eliminarProducto('${prod.nombre}')">🗑️</button>
                </div>
            </div>`;
    });

    listaCarrito.innerHTML = html;
    
    // Cálculos de Resumen
    const subtotalEl = document.getElementById('subtotal');
    if(subtotalEl) {
        const servicio = subtotal * 0.10;
        const impuestos = subtotal * 0.05;
        const total = subtotal + servicio + impuestos;
        
        document.getElementById('subtotal').innerText = `${subtotal.toFixed(2)} Bs`;
        document.getElementById('servicio').innerText = `${servicio.toFixed(2)} Bs`;
        document.getElementById('impuestos').innerText = `${impuestos.toFixed(2)} Bs`;
        document.getElementById('total-precio').innerText = `${total.toFixed(2)} Bs`;
    }
}

function actualizarBadge() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const badge = document.getElementById('cart-badge');
    
    if (!badge) return;

    const totalCantidad = carrito.reduce((suma, prod) => suma + prod.cantidad, 0);
    
    if (totalCantidad > 0) {
        badge.innerText = totalCantidad;
        badge.style.display = 'flex';
    } else {
        badge.style.display = 'none';
    }
}

function confirmarPedido() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    if (carrito.length === 0) {
        alert("¡Tu carrito está vacío!");
        return;
    }
    
    // Aquí es donde sucede la redirección al archivo que creaste
    window.location.href = 'confirmar.html'; 
}

