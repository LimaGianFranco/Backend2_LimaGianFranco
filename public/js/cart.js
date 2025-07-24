async function loadCart() {
  const res = await fetch('/api/carts/1');
  const cart = await res.json();
  const container = document.getElementById('cartItems');
  container.innerHTML = '';

  cart.products.forEach(item => {
    const div = document.createElement('div');
    div.textContent = `${item.product.title} - Cantidad: ${item.quantity}`;
    container.appendChild(div);
  });
}

document.getElementById('checkout').addEventListener('click', async () => {
  const res = await fetch('/api/carts/1/purchase', { method: 'POST' });
  const ticket = await res.json();
  window.location.href = `ticket.html?ticket=${ticket.code}`;
});

loadCart();
