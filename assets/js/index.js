if (window.localStorage.getItem('token')) {
    fetch('https://mememaker-backend.herokuapp.com/api/v1/user', {
        headers: {
            'authorization': 'JWT ' + window.localStorage.getItem('token')
        }
    })
        .then(info => info.json())
        .then(data => {
            if (data.username) {
                // Display username
                if (document.querySelector('#username')) {
                    document.querySelector('#username').innerHTML = data.username;
                    window.localStorage.setItem('uid', data.uid);
                    window.localStorage.setItem('username', data.username);
                }
            } else {
                // No token --> Back to SPLASH page
                window.location.href = 'splash.html';
            }
        })
        .catch(err => console.log(err));
} else {
    window.location.href = 'splash.html';
}

