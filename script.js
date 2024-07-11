
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
            document.getElementById('linkOptions').style.display = 'block';
            document.getElementById('getImgurLink').onclick = () => {
                showResult(imgurUrl);
            };
            document.getElementById('getShortLink').onclick = () => {
                shortenUrl(imgurUrl);
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

function showResult(url) {
    document.getElementById('result').innerHTML = `Link: <a href="${url}" target="_blank">${url}</a>`;
    document.getElementById('result').style.display = 'block';
    document.getElementById('copyButton').style.display = 'block';

    document.getElementById('copyButton').onclick = () => {
        navigator.clipboard.writeText(url)
            .then(() => {
                alert('Link copied to clipboard!');
            })
            .catch(err => {
                console.error('Could not copy text: ', err);
            });
    };
}

function shortenUrl(imgurUrl) {
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
            const shortUrl = data.data.tiny_url;
            showResult(shortUrl);
        } else {
            document.getElementById('result').innerText = 'Failed to shorten the URL.';
            document.getElementById('result').style.display = 'block';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('result').innerText = 'Failed to shorten the URL.';
        document.getElementById('result').style.display = 'block';
    });
}

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
