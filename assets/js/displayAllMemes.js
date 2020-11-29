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

fetch('https://mememaker-backend.herokuapp.com/users', {
    headers: {
        'authorization': 'JWT ' + window.localStorage.getItem('token')
    }
})
    .then(info => info.json())
    .then(data => {
        users = data;

        return fetch('https://mememaker-backend.herokuapp.com/memes', {
            headers: {
                'authorization': 'JWT ' + window.localStorage.getItem('token')
            }
        })
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
                        <a href="#" class="d-block mb-4">
                            <img id="meme${meme.id}" src="" alt="Image" class="img-thumbnail" style="display:none">
                        </a>
                        <div class="post-text">
                            <span class="post-meta">${dateformat.format(datetime)} &bullet; By <a href="#">${uploader}</a></span>
                            <p>${tags}</p>
                            <div class="d-flex">
                                <p class="mr-4"><a href="#" class="readmore">Add to Favorites</a></p>
                                <p><a href="#" class="readmore">Download</a></p>
                            </div>
                        </div>
                    </div>
                </div>
            `
        }

    })
    .catch(err => console.log(err))
    .catch(err => console.log(err));


setTimeout(() => {
    for (let i=0; i<memeIDs.length; i++) {
        fetch('https://mememaker-backend.herokuapp.com/meme/' + memeIDs[i], {
            headers: {
                'authorization': 'JWT ' + window.localStorage.getItem('token')
            }
        })
            // Retrieve its body as ReadableStream
            .then(response => {
                const reader = response.body.getReader();
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
                let img = document.querySelector(`#meme${memeIDs[i]}`);
                img.src = url;
                img.style.display = "block";
            })
            .catch(err => console.error(err));
    }
}, 1000);
