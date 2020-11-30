function validPassword(password) {
    let regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
    if (password.match(regex)) {
        return true;
    }
    return false;
}

$('#pswd-form').submit((e) => {
    e.preventDefault();
    // Display loading circle
    let loader = document.querySelector('#loading2');
    let message = document.querySelector('#message2');
    message.classList.remove('sent-message');
    message.style.display = "none";
    message.innerHTML = "";

    // Match Passwords
    const psw = document.querySelector('#password').value;
    const pswconfirm = document.querySelector('#confirm').value;
    if (validPassword(psw)) {
        if (psw === pswconfirm) {
            // UPDATE Password
            loader.style.display = "block";
            fetch('https://mememaker-backend.herokuapp.com/password/' + psw, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'authorization': 'JWT ' + window.localStorage.getItem('token')
                }
            })
                .then(info => info.json())
                .then(data => {
                    loader.style.display = "none";
                    // Display status of update
                    if (data.token) {
                        window.localStorage.setItem('token', data.token);
                        message.classList.add('sent-message');
                        message.innerHTML = 'Successful Update';
                    } else {
                        message.innerHTML = 'Unsuccessful';
                    }
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

$('#user-form').submit((e) => {
    e.preventDefault();
    // Display loading circle
    let loader = document.querySelector('#loading1');
    let message = document.querySelector('#message1');
    message.classList.remove('sent-message');
    message.style.display = "none";
    message.innerHTML = "";

    const user = document.querySelector('#username').value.trim();
    if (user) {
        // UPDATE Username
        loader.style.display = "block";
        fetch('https://mememaker-backend.herokuapp.com/username/' + user, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': 'JWT ' + window.localStorage.getItem('token')
            }
        })
            .then(info => info.json())
            .then(data => {
                loader.style.display = "none";
                // Display status of update
                if (data.token) {
                    window.localStorage.setItem('token', data.token);
                    window.localStorage.setItem('username', data.username);
                    message.classList.add('sent-message');
                    message.innerHTML = 'Successful Update';
                } else {
                    message.innerHTML = data.message;
                }
                message.style.display = "block";
            })
            .catch(err => {
                console.log(err);
            });
    } else {
        message.innerHTML = "Field cannot be empty.";
        message.style.display = "block";
    }
});

function displayModal() {
    let modal = document.querySelector('#modal')
    modal.style.display = "block";
}
function closeModal() {
    modal.style.display = "none";
}

const deleteModal = document.querySelector('#deleteModal');
deleteModal.addEventListener('click', (e) => {
    displayModal();
});
const exitModal = document.querySelectorAll('.close');
exitModal.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        closeModal();
    })
})

$('#delete').submit((e) => {
    e.preventDefault();

    console.log('delete')

    // Display loading circle
    let loader = document.querySelector('#loading3');
    let message = document.querySelector('#message3');
    message.classList.remove('sent-message');
    message.style.display = "none";
    message.innerHTML = "";

    // DELETE USER
    loader.style.display = "block";
        fetch('https://mememaker-backend.herokuapp.com/user', {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': 'JWT ' + window.localStorage.getItem('token')
            }
        })
            .then(info => info.json())
            .then(data => {
                loader.style.display = "none";
                // Display status of delete
                message.classList.add('sent-message');
                message.innerHTML = data.message;
                localStorage.clear();
                window.location.href = "splash.html";
            })
            .catch(err => {
                console.log(err);
            });
});