const params = new URLSearchParams(location.search);
const code = params.get('ticket');

async function loadTicket() {
  const res = await fetch('/api/tickets/' + code);
  if (res.ok) {
    const t = await res.json();
    document.getElementById('ticketData').textContent = JSON.stringify(t, null, 2);
  } else {
    document.getElementById('ticketData').textContent = 'Ticket no encontrado.';
  }
}

loadTicket();
