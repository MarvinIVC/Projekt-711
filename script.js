document.addEventListener('DOMContentLoaded', () => {


    function changeBackground(imageUrl) {
        document.body.style.backgroundImage = `url('${imageUrl}')`;
    }


    const backgroundRadios = document.querySelectorAll('#backgroundSelection input[type="radio"]');
    backgroundRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            const selectedBackground = document.querySelector('input[name="background"]:checked').value;
            switch (selectedBackground) {
                case '1':
                    changeBackground('https://files.123freevectors.com/wp-content/original/131396-light-color-polygonal-abstract-background-vector-illustration.jpg');
                    break;
                case '2':
                    changeBackground('https://th.bing.com/th/id/R.435ebd9442f6ca449b44699a2a9a6acd?rik=fYMPzB%2ffp1EczA&riu=http%3a%2f%2fgetwallpapers.com%2fwallpaper%2ffull%2f1%2fa%2f8%2f136021.jpg&ehk=MAPonR9qka0eiZRvyC%2b08vGWIdpkEibRMFYdtK6xt8c%3d&risl=&pid=ImgRaw&r=0');
                    break;
                case '3':
                    changeBackground('https://www.teahub.io/photos/full/44-440307_light-colors-geometric-pattern-abstract-wallpaper-abstract-wallpaper.jpg');
                    break;
                case '4':
                    changeBackground('https://img.freepik.com/free-photo/soft-vintage-gradient-blur-background-with-pastel-colored-well-use-as-studio-room-product-presentation-banner_1258-71429.jpg');
                    break;
                case '5':
                    changeBackground('https://static.vecteezy.com/system/resources/thumbnails/008/058/793/small_2x/abstract-blur-with-bokeh-light-for-background-usage-vector.jpg');
                    break;
                case '6':
                    changeBackground('https://getwallpapers.com/wallpaper/full/e/c/e/455056.jpg');
                    break;
                default:
                    break;
            }
        });
    });


    document.getElementById('uploadButton').addEventListener('click', () => {
        const imageInput = document.getElementById('imageInput');
        if (imageInput.files.length === 0) {
            alert('Please select an image first.');
            return;
        }

        const imageFile = imageInput.files[0];
        const imgurClientId = 'feaa817d1a27759'; 

        const formDataImgur = new FormData();
        formDataImgur.append('image', imageFile);

        fetch('https://api.imgur.com/3/upload', {
            method: 'POST',
            headers: {
                'Authorization': `Client-ID ${imgurClientId}`
            },
            body: formDataImgur
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const imgurUrl = data.data.link;
                document.getElementById('linkOptions').style.display = 'flex'; 
                document.getElementById('getLink').onclick = () => {
                    shortenUrlTiny(imgurUrl); // Default to tinyurl
                    shortenUrlIsGd(imgurUrl); // Also shorten with is.gd
                };
                document.getElementById('generateQRCodeButton').onclick = () => {
                    generateQRCode(imgurUrl);
                };
            } else {
                document.getElementById('result').innerText = 'Failed to upload image to Imgur.';
                document.getElementById('result').style.display = 'block';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('result').innerText = 'Failed to upload image to Imgur.';
            document.getElementById('result').style.display = 'block';
        });
    });


    function showResult(url1, url2) {
        const qrCodeElement = document.getElementById('qrCode');
        qrCodeElement.innerHTML = ''; 
        qrCodeElement.style.display = 'none';

        const resultElement = document.getElementById('result');
        resultElement.innerHTML = `
            <div>
                TinyURL: <a href="${url1}" target="_blank">${url1}</a>
                <button class="copyButton" id="copyTinyButton">Copy TinyURL</button>
            </div>
            <div>
                is.gd: <a href="${url2}" target="_blank">${url2}</a>
                <button class="copyButton" id="copyIsGdButton">Copy is.gd</button>
            </div>
        `;
        resultElement.style.display = 'block';

        // Copy buttons functionality
        document.getElementById('copyTinyButton').onclick = () => {
            copyToClipboard(url1);
        };
        document.getElementById('copyIsGdButton').onclick = () => {
            copyToClipboard(url2);
        };
    }


    function shortenUrlTiny(imgurUrl) {
        fetch(`https://api.tinyurl.com/create?url=${encodeURIComponent(imgurUrl)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer Movmm1FfNvTgAj1CVW0b4QU8666jIPyVdkx6WhwfvhF4Irods5kW0Ym6Ps7O' 
            },
            body: JSON.stringify({
                url: imgurUrl
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.data) {
                const shortUrlTiny = data.data.tiny_url;
                return shortUrlTiny;
            } else {
                throw new Error('Failed to shorten the URL with TinyURL.');
            }
        })
        .then(shortUrlTiny => {
            fetch(`https://is.gd/create.php?format=json&url=${encodeURIComponent(imgurUrl)}`)
            .then(response => response.json())
            .then(data => {
                if (data.shorturl) {
                    const shortUrlIsGd = data.shorturl;
                    showResult(shortUrlTiny, shortUrlIsGd);
                } else {
                    throw new Error('Failed to shorten the URL with is.gd.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                document.getElementById('result').innerText = 'Failed to shorten the URL with is.gd.';
                document.getElementById('result').style.display = 'block';
            });
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('result').innerText = 'Failed to shorten the URL with TinyURL.';
            document.getElementById('result').style.display = 'block';
        });
    }


    function generateQRCode(url) {
        const qrCodeElement = document.getElementById('qrCode');
        qrCodeElement.innerHTML = ''; // Clear previous QR code if any

        const qrImg = document.createElement('img');
        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(url)}`;
        qrImg.alt = 'QR Code';

        qrCodeElement.appendChild(qrImg);
        qrCodeElement.style.display = 'block';

        // Hide the result and copy buttons
        document.getElementById('result').style.display = 'none';
        document.getElementById('copyTinyButton').style.display = 'none';
        document.getElementById('copyIsGdButton').style.display = 'none';
    }


    function copyToClipboard(text) {
        navigator.clipboard.writeText(text)
            .then(() => {
                alert('Link copied to clipboard!');
            })
            .catch(err => {
                console.error('Could not copy text: ', err);
            });
    }


});


document.getElementById('dropArea').addEventListener('click', () => {
    document.getElementById('imageInput').click();
});


document.getElementById('imageInput').addEventListener('change', (event) => {
    const files = event.target.files;
    if (files.length > 0) {
        document.getElementById('dropArea').classList.add('active');
        document.getElementById('dropArea').innerText = `File selected: ${files[0].name}`;
    }
});


document.getElementById('dropArea').addEventListener('dragover', (event) => {
    event.preventDefault();
    document.getElementById('dropArea').classList.add('hover');
});

document.getElementById('dropArea').addEventListener('dragleave', () => {
    document.getElementById('dropArea').classList.remove('hover');
});

document.getElementById('dropArea').addEventListener('drop', (event) => {
    event.preventDefault();
    document.getElementById('dropArea').classList.remove('hover');

    const files = event.dataTransfer.files;
    if (files.length > 0) {
        document.getElementById('imageInput').files = files;
        document.getElementById('dropArea').classList.add('active');
        document.getElementById('dropArea').innerText = `File selected: ${files[0].name}`;
    }
});
