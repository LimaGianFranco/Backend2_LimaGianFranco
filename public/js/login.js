document.getElementById('loginForm').addEventListener('submit', async e => {
  e.preventDefault();
  const email = e.target.email.value;
  const password = e.target.password.value;

  const res = await fetch('/api/sessions/login', {
    method: 'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();

  if (res.ok) location.href = '/products.html';
  else alert(data.error || 'Credenciales inválidas');
});
