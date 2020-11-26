$(document).ready(function() {
    const fonts = [
        "Comic Sans MS", "Stencil", "Courier", "Century", "Helvetica"
    ];
    const fontSelector = document.querySelector("#font-family");
    for (let i=0; i<fonts.length; i++) {
        let option = document.createElement("option")
        option.innerHTML = fonts[i];
        fontSelector.appendChild(option);
    }

    const canvas = document.querySelector("#canvas");
    let context = canvas.getContext("2d");
    context.textAlign = "center";
    let img = new Image;
    img.onload = () => {
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
        wrapText(context, text, canvas.width*0.5, y, canvas.width, fontSize*1.05);
    }

    $("#input-files").on("change", function() {
        imageToCanvas(this);
    });

    $("#enter-text").on("click", function() {
        redrawImage();
        setTimeout(displayText, 100);
    });

});