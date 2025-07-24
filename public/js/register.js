document.getElementById('registerForm').addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target;
  const res = await fetch('/api/sessions/register', {
    method: 'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({
      firstName: form.firstName.value,
      lastName: form.lastName.value,
      email: form.email.value,
      password: form.password.value
    })
  });
  const data = await res.json();

  if (res.ok) {
    alert('Usuario registrado');
    location.href = '/login.html';
  } else {
    alert(data.error || 'Error al registrar');
  }
});
