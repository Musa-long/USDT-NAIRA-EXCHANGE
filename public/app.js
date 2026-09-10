document.getElementById('orderForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const order = {
        name: document.getElementById('name').value,
        whatsapp: document.getElementById('whatsapp').value,
        usdt: document.getElementById('usdt').value,
        wallet: document.getElementById('wallet').value
    };

    const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
    });

    const data = await res.json();
    
    if(data.success) {
        document.getElementById('result').innerHTML = `<p style="color:#00ff64">Order submitted! We will contact you on WhatsApp.</p>`;
        document.getElementById('orderForm').reset();
    } else {
        document.getElementById('result').innerHTML = `<p style="color:red">Error: ${data.error}</p>`;
    }
});
