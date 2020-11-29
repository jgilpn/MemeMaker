$(document).ready(function() {

    $(document).ready(function() {
        $(window).keydown(function(event){
            if(event.keyCode == 13) {
                event.preventDefault();
                return false;
            }
        });
    });

    const FONTS = [
        "Comic Sans MS", "Stencil", "Lucida Console", "Century", "Impact",
        "Georgia", "Arial Black", "Roboto", "Poppins"
    ];
    const fontSelector = document.querySelector("#font-family");
    for (let i=0; i<FONTS.length; i++) {
        let option = document.createElement("option")
        option.innerHTML = FONTS[i];
        fontSelector.appendChild(option);
    }

    const canvas = document.querySelector("#canvas");
    let context = canvas.getContext("2d");
    let img = new Image;
    img.crossOrigin = 'anonymous';
    img.onload = () => {
        let scale = canvas.width / img.width;
        canvas.height = img.height * scale;
        context.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
    }
    let imgSRC = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6s3P7SL6RBFEs5vDueWQcsrnrBczR17jNng&usqp=CAU";
    img.src = imgSRC;

    let imageToCanvas = (input) => {
        if (input.files) {
            let reader = new FileReader();
            reader.onload = function(event) {
                context.clearRect(0, 0, canvas.width, canvas.height);
                img.src = imgSRC = event.target.result;
            };
            reader.readAsDataURL(input.files[0]);
        }
    };

    function redrawImage() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
        img.src = imgSRC;
    }

    function wrapText(context, text, x, y, maxWidth, lineHeight) {
        var words = text.split(' ');
        var line = '';

        for(var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + ' ';
            var metrics = context.measureText(testLine);
            var testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                context.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
            }
            else {
                line = testLine;
            }
        }
        context.fillText(line, x, y);
    }

    let displayText = () => {
        let text = document.querySelector("#input-text").value;
        let fontFamily = document.querySelector("#font-family").value;
        let fontSize = parseInt(document.querySelector("#font-size").value);
        let textColor = document.querySelector("#text-color").value;
        let vAlign = document.querySelector("#v-align").value;
        let y = 0;

        switch (vAlign) {
            case "Center":
                y = canvas.height*0.5 + fontSize*0.3;
                break;
            case "Bottom":
                y = canvas.height - 5;
                break;
            default:
                y =  fontSize*0.9;
        }
        context.font = `${fontSize}px ${fontFamily}`;
        context.fillStyle = textColor;
        context.textAlign = "center";
        wrapText(context, text, canvas.width*0.5, y, canvas.width, fontSize*1.05);
    }

    $("#input-files").on("change", function() {
        imageToCanvas(this);
    });

    $("#enter-text").on("click", function() {
        redrawImage();
        setTimeout(displayText, 100);
    });

    const tags = document.querySelector('#tags');
    const tagContainer = document.querySelector('.tag-container');
    let tagsArray = [];

    tags.addEventListener('keyup', (e) => {
        if ((e.key === 'Enter' || e.keyCode === 13) && tags.value.length > 0) {
            if (!tagsArray.includes(tags.value)) {
                tagsArray.push(tags.value);
                let text = document.createTextNode(tags.value);
                let p = document.createElement('p');
                tagContainer.appendChild(p);
                p.appendChild(text);
                p.classList.add('tag');
            }
            
            tags.value = '';
            
            let deleteTags = document.querySelectorAll('.tag');
            
            for(let i = 0; i < deleteTags.length; i++) {
                deleteTags[i].addEventListener('click', () => {
                    tagContainer.removeChild(deleteTags[i]);
                });
            }
        }
    });

    function getFilename() {
        let file = document.querySelector('#input-files').value;
        let filename = 'meme.png';
        if (file) {
            filename = file.split('\\')[2];
            filename = filename.replace(/\.[a-zA-Z]+$/i,".png");
        }
        return `${Date.now()}-mememaker-${filename}`
    }

    // POST/upload add attribute 'token'
    $('form').submit((e) => {
        e.preventDefault();

        // Display loading circle
        let loader = document.querySelector('.loading');
        let message = document.querySelector('.error-message')
        message.classList.remove('sent-message');
        message.style.display = "none";
        message.innerHTML = "";
        loader.style.display = "block";

        fetch('http://localhost:3000/memes', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': 'JWT ' + window.localStorage.getItem('token')
            },
            body: JSON.stringify({
                tags: tagsArray.toString(),
                filename: getFilename(),
                image: canvas.toDataURL()
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
                // Display status of upload
                message.innerHTML = data.message;
                message.style.display = "block";
            })
            .catch(err => console.log(err));
    });
});