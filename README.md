# badge-avatar-validation

This web application validates and displays badge avatars, ensuring they meet specific criteria: a size of 512x512, non-transparent pixels within a circle, and happy colors.

## Usage

1. Open `index.html` in a web browser.
2. Click the "Choose File" button to select an image.
3. The application validates the badge avatar based on specified criteria.
4. If valid, the badge is displayed with a success message.
5. If not valid, an error message is shown.

## Additional Features

- **Automatic PNG Conversion:** The app prompts to convert non-PNG images using the `html2canvas` library.

## File Structure

- `index.html`: HTML file with the web page structure.
- `script.js`: JavaScript file with image validation and conversion logic.
- `README.md`: Documentation with details about the application.
- `/images`: Directory to store badge avatar images.

## Dependencies

- [html2canvas](https://html2canvas.hertzen.com/): Library for image to PNG conversion.

## How to Contribute

If you would like to contribute to the development of this project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make changes and commit them.
4. Push the changes to your fork.
5. Submit a pull request.
