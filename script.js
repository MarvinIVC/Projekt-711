document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('uploadButton').addEventListener('click', () => {
        const imageInput = document.getElementById('imageInput');
        if (imageInput.files.length === 0) {
            alert('Please select an image first.');
            return;
        }

        const imageFile = imageInput.files[0];
        const imgurClientId = 'feaa817d1a27759'; // Replace with your Imgur Client ID

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
                document.getElementById('linkOptions').style.display = 'flex'; // Display link options
                document.getElementById('getLink').onclick = () => {
                    showResult(imgurUrl);
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

    function showResult(url) {
      const qrCodeElement = document.getElementById('qrCode');
      qrCodeElement.innerHTML = ''; // Clear previous QR code if any
      qrCodeElement.style.display = 'none'; // Hide QR code element

      const resultElement = document.getElementById('result');
      resultElement.innerHTML = `Link: <a href="${url}" target="_blank">${url}</a>`;
      resultElement.style.display = 'block';

      const copyButton = document.getElementById('copyButton');
      copyButton.style.display = 'block';
      copyButton.onclick = () => {
          navigator.clipboard.writeText(url)
              .then(() => {
                  alert('Link copied to clipboard!');
              })
              .catch(err => {
                  console.error('Could not copy text: ', err);
              });
      };
    }


    function generateQRCode(url) {
      const qrCodeElement = document.getElementById('qrCode');
      qrCodeElement.innerHTML = ''; // Clear previous QR code if any

      const qrImg = document.createElement('img');
      qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(url)}`;
      qrImg.alt = 'QR Code';

      qrCodeElement.appendChild(qrImg);
      qrCodeElement.style.display = 'block';

      // Hide the result and copy button
      document.getElementById('result').style.display = 'none';
      document.getElementById('copyButton').style.display = 'none';
    }


    // Additional event listeners and setup can go here if needed
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
