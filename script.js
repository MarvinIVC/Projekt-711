const dropArea = document.getElementById('dropArea');
const imageInput = document.getElementById('imageInput');

dropArea.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropArea.classList.add('hover');
});

dropArea.addEventListener('dragleave', () => {
    dropArea.classList.remove('hover');
});

dropArea.addEventListener('drop', (event) => {
    event.preventDefault();
    dropArea.classList.remove('hover');

    const files = event.dataTransfer.files;
    if (files.length > 0) {
        imageInput.files = files;
        dropArea.classList.add('active');
        dropArea.innerHTML = `<p>${files[0].name} is ready for upload</p>`;
    }
});

dropArea.addEventListener('click', () => {
    imageInput.click();
});

imageInput.addEventListener('change', () => {
    if (imageInput.files.length > 0) {
        dropArea.classList.add('active');
        dropArea.innerHTML = `<p>${imageInput.files[0].name} is ready for upload</p>`;
    }
});

document.getElementById('uploadButton').addEventListener('click', () => {
    if (imageInput.files.length === 0) {
        alert('Please select an image first.');
        return;
    }

    const imageFile = imageInput.files[0];
    const imgurClientId = 'feaa817d1a27759'; // Replace this with your actual Imgur Client-ID

    const formDataImgur = new FormData();
    formDataImgur.append('image', imageFile);

    // Upload to Imgur
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
            document.getElementById('imgurResult').innerHTML = `Imgur URL: <a href="${imgurUrl}" target="_blank">${imgurUrl}</a>`;
            document.getElementById('copyImgurButton').style.display = 'inline-block';
            document.getElementById('shortenButton').style.display = 'inline-block';

            document.getElementById('copyImgurButton').onclick = () => {
                copyToClipboard(imgurUrl, 'Imgur URL copied to clipboard!');
            };

            document.getElementById('shortenButton').onclick = () => {
                fetch('https://api.tinyurl.com/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer Movmm1FfNvTgAj1CVW0b4QU8666jIPyVdkx6WhwfvhF4Irods5kW0Ym6Ps7O' // Replace with your TinyURL API token
                    },
                    body: JSON.stringify({
                        url: imgurUrl,
                        domain: 'tiny.one' // Specify the domain for the short URL
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.data) {
                        const shortUrl = data.data.tiny_url;
                        document.getElementById('shortUrlResult').innerHTML = `Shortened URL: <a href="${shortUrl}" target="_blank">${shortUrl}</a>`;
                        document.getElementById('copyShortUrlButton').style.display = 'inline-block';

                        document.getElementById('copyShortUrlButton').onclick = () => {
                            copyToClipboard(shortUrl, 'Shortened URL copied to clipboard!');
                        };
                    } else {
                        document.getElementById('shortUrlResult').innerText = 'Failed to shorten the URL.';
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    document.getElementById('shortUrlResult').innerText = 'Failed to shorten the URL.';
                });
            };
        } else {
            document.getElementById('imgurResult').innerText = 'Failed to upload image to Imgur.';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('imgurResult').innerText = 'Failed to upload image to Imgur.';
    });
});

function copyToClipboard(text, successMessage) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
            .then(() => {
                alert(successMessage);
            })
            .catch(err => {
                console.error('Could not copy text: ', err);
            });
    } else {
        // Fallback method for browsers that do not support navigator.clipboard.writeText
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            alert(successMessage);
        } catch (err) {
            console.error('Could not copy text: ', err);
        }
        document.body.removeChild(textArea);
    }
}
