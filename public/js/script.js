let token = localStorage.getItem('token');
function showPage(page) {
  const pages = document.querySelectorAll('.tab-content');
  pages.forEach(p => p.classList.remove('active'));
  document.getElementById(page).classList.add('active');
}

function showLogin() {
  document.getElementById("login-form").style.display = "block";
  document.getElementById("register-form").style.display = "none";
}

function showRegister() {
  document.getElementById("login-form").style.display = "none";
  document.getElementById("register-form").style.display = "block";
}

async function login() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  const response = await fetch('/api/sessions/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();
  if (data.token) {
    localStorage.setItem('token', data.token);
    alert('Login exitoso');
    showPage('products');
  } else {
    alert(data.error);
  }
}

async function register() {
  const first_name = document.getElementById('first_name').value;
  const last_name = document.getElementById('last_name').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;

  const response = await fetch('/api/sessions/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ first_name, last_name, email, password })
  });

  const data = await response.json();
  if (data.token) {
    localStorage.setItem('token', data.token);
    alert('Registro exitoso');
    showPage('products');
  } else {
    alert(data.error);
  }
}

async function getProducts() {
  const response = await fetch('/api/products', {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });

  const products = await response.json();
  let productHTML = '';
  products.forEach(product => {
    productHTML += `
      <div>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p>Precio: $${product.price}</p>
        <button onclick="addToCart('${product._id}')">Agregar al carrito</button>
      </div>
    `;
  });

  document.getElementById('product-list').innerHTML = productHTML;
}

async function addToCart(productId) {
  const response = await fetch('/api/cart/add-to-cart', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ productId, quantity: 1 })
  });

  const data = await response.json();
  alert(data.message || data.error);
}

async function showCart() {
  const response = await fetch('/api/cart', {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });

  const cart = await response.json();
  let cartHTML = '';
  cart.products.forEach(item => {
    cartHTML += `
      <div>
        <p>Producto: ${item.productId.name} | Cantidad: ${item.quantity}</p>
      </div>
    `;
  });

  document.getElementById('cart-items').innerHTML = cartHTML;
}
async function checkout() {
  const response = await fetch('/api/cart/checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  const data = await response.json();
  alert(data.message || data.error);
}

if (token) {
  getProducts();
} else {
  alert('Por favor, inicia sesión');
}
