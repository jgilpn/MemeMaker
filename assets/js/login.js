document.querySelector('#login').addEventListener('click', (e) => {
    // Display loading circle
    let loader = document.querySelector('.loading');
    let message = document.querySelector('.error-message')
    message.style.display = "none";
    loader.style.display = "block";

    // LOGIN function
    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: document.querySelector('#username').value,
            password: document.querySelector('#password').value
        })
    })
        .then(info => info.json())
        .then(data => {
            loader.style.display = "none";
            if (data.token) {
                // Login Success --> Home page
                localStorage.setItem('token', data.token);
                window.location.href = 'index.html';
            } else {
                // Display invalid message
                message.innerHTML = "Invalid username or password";
                message.style.display = "block";
            }
        })
        .catch(err => console.log(err));
});