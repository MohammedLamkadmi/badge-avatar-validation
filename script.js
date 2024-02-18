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

                let hasHappyColors = false;

                for (let row = 0; row < canvas.height; row++) {
                    for (let column = 0; column < canvas.width; column++) {
                        const distanceToCenter = Math.sqrt(
                            Math.pow(centerX - column, 2) + Math.pow(centerY - row, 2)
                        );
                        if (distanceToCenter > radius && data[(row * canvas.width + column) * 4 + 3] !== 0) {
                            resolve(false);
                            return;
                        }

                        const red = data[(row * canvas.width + column) * 4];
                        const green = data[(row * canvas.width + column) * 4 + 1];
                        const blue = data[(row * canvas.width + column) * 4 + 2];

                        if (red > 200 && green > 100 && blue < 50) {
                            hasHappyColors = true;
                        }
                    }
                }

                if (!hasHappyColors) {
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

function loadImageFromInput(input) {
    const badgeImage = document.getElementById('badgeImage');

    if (input.files && input.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
            validateBadge(e.target.result)
                .then((isValid) => {
                    if (!isValid) {
                        alert("The badge is not valid");
                    } else {
                        alert("The badge is valid");
                    }
                })
                .catch((error) => {
                    console.error("Error validating the image:", error);
                    alert("Error validating the image");
                });

            badgeImage.src = e.target.result;
        };

        reader.readAsDataURL(input.files[0]);
    }
}

function convertImageShape(imagePath, newWidth, newHeight, newShape) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = imagePath;

        img.onload = function () {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = newWidth;
            canvas.height = newHeight;

            if (newShape === 'circle') {
                ctx.beginPath();
                ctx.arc(newWidth / 2, newHeight / 2, Math.min(newWidth, newHeight) / 2, 0, 2 * Math.PI);
                ctx.clip();
            }

            ctx.drawImage(img, 0, 0, newWidth, newHeight);

            const convertedImagePath = canvas.toDataURL("image/png");

            resolve(convertedImagePath);
        };

        img.onerror = function (error) {
            console.error("Error loading the image for conversion:", error);
            alert("Error loading the image for conversion");
            reject(error);
        };
    });
}
