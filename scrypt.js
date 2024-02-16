async function validateBadge(imagePath) {
    try {
        if (!imagePath) {
            throw new Error("Image path is not provided");
        }

        const image = await Jimp.read(imagePath);
        console.log(image.bitmap.width);
        console.log(image.bitmap.height);

        if (image.bitmap.width !== 512 || image.bitmap.height !== 512) {
            return false;
        }
        return true;
    } catch (error) {
        console.error("Error reading the image:", error);
        return false;
    }
}

let img = "images/20240203_231035.png";
validateBadge(img).then((isValid) => {
    if (isValid) {
        console.log("The badge is valid");
    } else {
        console.log("The badge is not valid");
    }
});

function loadImageFromInput(input) {
    const badgeImage = document.getElementById('badgeImage');

    if (input.files && input.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
            badgeImage.src = e.target.result;
        };

        reader.readAsDataURL(input.files[0]);
    }
}
