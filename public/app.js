document.getElementById('orderForm').addEventListener('submit', async function(e){
    e.preventDefault();
    document.getElementById('result').innerText = 'Order sent! We will contact you on WhatsApp.';
    document.getElementById('orderForm').reset();
});
