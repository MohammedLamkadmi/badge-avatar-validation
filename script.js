function validateBadge(imagePath) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = imagePath;

        img.onload = function () {
            if (img.width !== 512 || img.height !== 512) {
                resolve(false);
                return;
            }

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, img.width, img.height);

            try {
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;

                const centerX = canvas.width / 2;
                const centerY = canvas.height / 2;
                const radius = canvas.width / 2;

                for (let row = 0; row < canvas.height; row++) {
                    for (let column = 0; column < canvas.width; column++) {
                        const distanceToCenter = Math.sqrt(
                            Math.pow(centerX - column, 2) + Math.pow(centerY - row, 2)
                        );
                        if (distanceToCenter > radius && data[(row * canvas.width + column) * 4 + 3] !== 0) {
                            resolve(false);
                            return;
                        }
                    }
                }

                if (!hasHappyColors(data)) {
                    resolve(false);
                    return;
                }

                resolve(true);
            } catch (error) {
                console.error("Error accessing pixel data:", error);
                resolve(false);
            }
        };

        img.onerror = function (error) {
            console.error("Error loading the image:", error);
            reject(error);
        };
    });
}

function hasHappyColors(data) {
    for (let i = 0; i < data.length; i += 4) {
        const [red, green, blue] = data.slice(i, i + 3);

        if (red > 200 && green > 100 && blue < 50) {
            return true;
        }
    }
    return false;
}

function loadImageFromInput(input) {
    const badgeImage = document.getElementById('badgeImage');
    const statusMessage = document.getElementById('statusMessage');

    if (input.files && input.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
            validateBadge(e.target.result)
                .then((isValid) => {
                    if (!isValid) {
                        showMessage("The badge is not valid", false);
                    } else {
                        showMessage("The badge is valid", true);
                    }
                })
                .catch((error) => {
                    console.error("Error validating the image:", error);
                    showMessage("Error validating the image", false);
                });

            badgeImage.src = e.target.result;
        };

        reader.readAsDataURL(input.files[0]);
    }
}

function handleImageConversion(file, imageElement) {
    if (!isImagePNG(file) && confirm("Do you want to convert the image to PNG?")) {
        showMessage("Converting the image to PNG...", true);

        convertImageToPNG(imageElement)
            .then((convertedPath) => {
                showMessage("Image successfully converted to PNG", true);
                imageElement.src = convertedPath;
            })
            .catch((error) => {
                console.error("Error converting the image to PNG:", error);
                showMessage("Error converting the image to PNG", false);
            });
    }
}

// Function to convert the image to PNG using html2canvas
function convertImageToPNG(imageElement) {
    return new Promise((resolve, reject) => {
        html2canvas(imageElement, { useCORS: true })
            .then((canvas) => {
                const convertedImagePath = canvas.toDataURL("image/png");
                resolve(convertedImagePath);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

function isImagePNG(file) {
    return file.type === 'image/png';
}

function showMessage(message, isValid) {
    const statusMessage = document.getElementById('statusMessage');
    statusMessage.textContent = message;
    statusMessage.style.color = isValid ? 'green' : 'red';
}