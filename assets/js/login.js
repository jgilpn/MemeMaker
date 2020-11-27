document.querySelector('#login').addEventListener('click', (e) => {
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
            localStorage.setItem('token', data.token);
            window.location.href = 'index.html';
        })
        .catch(err => console.log(err));
})