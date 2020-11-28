if (window.localStorage.getItem('token')) {
    fetch('http://localhost:3000/login', {
        headers: {
            'authorization': 'JWT ' + window.localStorage.getItem('token')
        }
    })
        .then(info => info.json())
        .then(data => {
            if (data.username) {
                // Display username
                document.querySelector('#username').innerHTML = data.username;
            } else {
                // No token --> Back to SPLASH page
                window.location.href = 'splash.html';
            }
        })
        .catch(err => console.log(err));
} else {
    window.location.href = 'splash.html';
}

