export default function validateForm(categories, description) {
    const errors = {};

    if (!categories || categories.length === 0) {
        errors.categoryFieldError = "Du må velge minst én grunn til at annonsen bryter rettningslinjene";
    }

    if (description && description.length > 300) {
        errors.messageFieldError = "Du har brukt for mange tegn";
    }
    return errors;
}
