function validPassword(password) {
    let regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
    if (password.match(regex)) {
        return true;
    }
    return false;
}

$('form').submit((e) => {
    e.preventDefault();
    // Display loading circle
    let loader = document.querySelector('.loading');
    let message = document.querySelector('.error-message');
    message.classList.remove('sent-message');
    message.style.display = "none";
    message.innerHTML = "";

    // Match Passwords
    const psw = document.querySelector('#password').value;
    const pswconfirm = document.querySelector('#confirm').value;
    if (validPassword(psw)) {
        if (psw === pswconfirm) {
            // SIGNUP function
            loader.style.display = "block";
            fetch('https://mememaker-backend.herokuapp.com/user', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: document.querySelector('#username').value,
                    password: psw
                })
            })
                .then(info => {
                    if (info.ok) {
                        message.classList.add('sent-message');
                    }
                    return info.json();
                })
                .then(data => {
                    loader.style.display = "none";
                    // Display status of signup
                    message.innerHTML = data.message;
                    message.style.display = "block";
                })
                .catch(err => {
                    console.log(err);
                });
        } else {
            message.innerHTML = "Passwords do not match";
            message.style.display = "block";
        }
    } else {
        message.innerHTML = 
            `Password must be between 8 to 15 characters; at least one 
            each of lowercase, uppercase, digit, and special character.`;
        message.style.display = "block";
    }
});