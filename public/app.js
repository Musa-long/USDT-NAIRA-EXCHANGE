// Fetch and display rate when page loads
document.addEventListener('DOMContentLoaded', () => {
  fetch('/rate')
    .then(res => res.json())
    .then(data => {
      document.getElementById('rate').innerText = data.rate;
    })
    .catch(err => {
      document.getElementById('rate').innerText = "Error";
      console.log(err);
    });
});

// Submit order
document.querySelector('.submit-btn')?.addEventListener('click', (e) => {
  e.preventDefault();
  alert('Order submitted! We will contact you on WhatsApp.');
});
