let currentRate = 0;

document.addEventListener('DOMContentLoaded', () => {
  // Get rate from backend
  fetch('/rate')
    .then(res => res.json())
    .then(data => {
      currentRate = data.rate;
      document.getElementById('rate').innerText = currentRate.toLocaleString();
      document.getElementById('rateError').innerText = '';
    })
    .catch(err => {
      document.getElementById('rateError').innerText = 'Live rate is currently unavailable.';
    });

  // Calculate USDT as user types Naira
  document.getElementById('nairaAmount').addEventListener('input', (e) => {
    const naira = parseFloat(e.target.value);
    if(naira && currentRate > 0){
      const usdt = naira / currentRate;
      document.getElementById('usdtPreview').innerText = usdt.toFixed(4) + ' USDT';
    } else {
      document.getElementById('usdtPreview').innerText = '0.000 USDT';
    }
  });

  // Buy button
  document.getElementById('buyBtn').addEventListener('click', () => {
    const nairaAmount = parseFloat(document.getElementById('nairaAmount').value);
    const wallet = document.getElementById('wallet').value;

    if(!nairaAmount || nairaAmount < 1000){
      alert('Please enter a valid Naira amount. Minimum ₦1000');
      return;
    }
    if(!wallet){
      alert('Please enter your USDT wallet address');
      return;
    }

    const usdtAmount = nairaAmount / currentRate;

    const orderData = {
      name: 'Customer', // We removed name field to match Replit design
      whatsapp: '',
      amount: usdtAmount.toFixed(4),
      nairaAmount: nairaAmount,
      wallet: wallet,
      rate: currentRate,
      totalNaira: nairaAmount
    };
    localStorage.setItem('orderData', JSON.stringify(orderData));
    window.location.href = '/bank-details.html';
  });
});
