async function add(id) {
  const token = localStorage.getItem('token');

  const res = await fetch('/api/cart', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({
      productId: id,
      quantity: 1
    })
  });

  if (res.ok) {
    alert('Producto agregado al carrito');
  } else {
    const error = await res.json();
    alert('Error: ' + error.error);
  }
}
