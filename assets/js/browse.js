const collection = document.querySelector('#collection');

function formatTags(tags) {
    formattedTags = "";
    for (let i=0; i<tags.length; i++) {
        formattedTags += `#${tags[i]} `;
    }
    return formattedTags;
}

let memeIDs = [];
let users;

const getMemes = (query) => {
    if (query) {
        query = query;
    } else {
        query = ''
    }
    let promiseCount = 0;
    let memeCount = 0;
    return fetch('https://mememaker-backend.herokuapp.com/api/v1/memes' + query, {
        headers: {
            'authorization': 'JWT ' + window.localStorage.getItem('token')
        }
    })
    .then(info => info.json())
    .then(data => {

        for (let i=0; i<data.length; i++) {
            const meme = data[i];

            // Format Upload Date
            let datetime = new Date(meme.lastUpdate);
            let options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
            let dateformat = new Intl.DateTimeFormat('en-US', options);

            // Format hashtags
            let tags = formatTags(meme.tags.split(','));

            let uploaderID = meme.uploaderID;
            let uploader;
            for (let j=0; j<users.length; j++) {
                if (users[j].id === uploaderID) {
                    uploader = users[j].username;
                }
            }

            memeIDs.push(meme.id);
            
            collection.innerHTML += `
                <div class="col-md-4">
                    <div class="post-entry">
                        <a class="d-block mb-4">
                            <img id="meme${meme.id}" src="" alt="Image" class="img-thumbnail" style="display:none">
                        </a>
                        <div class="post-text">
                            <span class="post-meta">${dateformat.format(datetime)} &bullet; By <a class="text-dark">${uploader}</a></span>
                            <p>${tags}</p>
                        </div>
                    </div>
                </div>
            `
        }
        const promises = [];
        for (let i=0; i<memeIDs.length; i++) {
            promises.push(fetch('https://mememaker-backend.herokuapp.com/api/v1/meme/' + memeIDs[i], {
                headers: {
                    'authorization': 'JWT ' + window.localStorage.getItem('token')
                }
            }));
        }
        return Promise.all(promises);
    })
    // Retrieve its body as ReadableStream
    .then(response => {
        const reader = response[promiseCount++].body.getReader();
        return new ReadableStream({
            start(controller) {
                return pump();
                function pump() {
                    return reader.read().then(({ done, value }) => {
                        // When no more data needs to be consumed, close the stream
                        if (done) {
                            controller.close();
                            return;
                        }
                        // Enqueue the next data chunk into our target stream
                        controller.enqueue(value);
                        return pump();
                    });
                }
            }  
        })
    })
    .then(stream => new Response(stream))
    .then(response => response.blob())
    .then(blob => URL.createObjectURL(blob))
    .then(url => {
        let img = document.querySelector(`#meme${memeIDs[memeCount++]}`);
        img.src = url;
        img.style.display = "block";
    })
    .catch(err => console.error(err))
    .catch(err => console.log(err))
}

fetch('https://mememaker-backend.herokuapp.com/api/v1/users', {
    headers: {
        'authorization': 'JWT ' + window.localStorage.getItem('token')
    }
})
    .then(info => info.json())
    .then(data => {
        users = data;

        return getMemes(window.localStorage.getItem('query'))
    })

// SEARCH CONTROLLERS

let tagQuery = document.querySelector('#query');
let tagContainer = document.querySelector('#tag-container');
let userQuery = document.querySelector('#query-user');
let userContainer = document.querySelector('#user-container');
let errorMessage = document.querySelector('#error-message');
window.localStorage.setItem('query', userQuery.value);

// SEARCH BY TAG
tagQuery.addEventListener('keyup', (e) => {
    if ((e.key === 'Enter' || e.keyCode === 13) && tagQuery.value.trim().length > 0) {
        errorMessage.innerHTML = '';
        window.localStorage.setItem('query', tagQuery.value);
        let text = document.createTextNode(tagQuery.value);
        let p = document.createElement('p');
        tagContainer.innerHTML = "";
        userContainer.innerHTML = "";
        tagContainer.appendChild(p);
        p.appendChild(text);
        p.classList.add('tag');
        p.classList.add('border-pill');

        collection.innerHTML = '';
        getMemes(`/tag/${tagQuery.value}`);
        
        tagQuery.value = '';

        let deleteTags = document.querySelectorAll('.tag');
        
        for(let i = 0; i < deleteTags.length; i++) {
            deleteTags[i].addEventListener('click', () => {
                tagContainer.removeChild(deleteTags[i]);
                window.localStorage.removeItem('query');
                window.location.reload();
            });
        }
    }
});

// SEARCH BY USER
userQuery.addEventListener('keyup', (e) => {
    if ((e.key === 'Enter' || e.keyCode === 13) && userQuery.value.trim().length > 0) {
        if (userQuery.value.split(' ').length > 1) {
            errorMessage.innerHTML = 'No Spaces Allowed';
            return;
        }
        errorMessage.innerHTML = '';
        window.localStorage.setItem('query', userQuery.value);
        let text = document.createTextNode(userQuery.value);
        let p = document.createElement('p');
        userContainer.innerHTML = "";
        tagContainer.innerHTML = "";
        userContainer.appendChild(p);
        p.appendChild(text);
        p.classList.add('tag');
        p.classList.add('border-pill');

        collection.innerHTML = '';

        fetch('https://mememaker-backend.herokuapp.com/api/v1/users', {
            headers: {
                'authorization': 'JWT ' + window.localStorage.getItem('token')
            }
        })
            .then(info => info.json())
            .then(data => {
                for (let i=0; i<data.length; i++) {
                    if (userQuery.value == data[i].username) {
                        return getMemes(`/user/${data[i].id}`);
                    }
                }
                errorMessage.innerHTML = `${userQuery.value} has not uploaded any memes`;
                userQuery.value = '';
                return
            })
            .catch(err => console.log(err));
        
        let deleteTags = document.querySelectorAll('.tag');
        
        for(let i = 0; i < deleteTags.length; i++) {
            deleteTags[i].addEventListener('click', () => {
                userContainer.removeChild(deleteTags[i]);
                window.localStorage.removeItem('query');
                window.location.reload();
            });
        }
    }
});