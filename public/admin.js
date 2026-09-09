function login(){
    const pass = document.getElementById('password').value;
    if(pass === 'Musa2530'){
        document.getElementById('orders').innerHTML = '<h2>Welcome Admin!</h2><p>Orders will appear here</p>';
    } else {
        alert('Wrong Password!');
    }
}
