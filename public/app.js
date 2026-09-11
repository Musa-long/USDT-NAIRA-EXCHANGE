// Fetch and display rate when page loads
document.addEventListener('DOMContentLoaded', () => {
  fetch('/rate')
    .then(res => res.json())
    .then(data => {
      document.getElementById('rate').innerText = data.rate;
    })
    .catch(err => {
      document.getElementById('rate').innerText = "Error";
    });
});

// Buy Now -> Go to bank details page
document.getElementById('orderForm').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const name = document.getElementById('name').value;
  const whatsapp = document.getElementById('whatsapp').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const wallet = document.getElementById('wallet').value;
  const rate = parseFloat(document.getElementById('rate').innerText);

  if(isNaN(amount) || amount <= 0){
    alert('Please enter a valid USDT amount');
    return;
  }

  const totalNaira = amount * rate;

  // Save data and go to bank page
  const orderData = { name, whatsapp, amount, wallet, rate, totalNaira };
  localStorage.setItem('orderData', JSON.stringify(orderData));
  window.location.href = '/bank-details.html';
});
