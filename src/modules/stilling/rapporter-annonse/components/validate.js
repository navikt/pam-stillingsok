export default function validateForm(categories, description) {
    const errors = {};

    if (!categories || categories.length === 0) {
        errors.categoryFieldset = "Du må velge minst én grunn til at annonsen bryter rettningslinjene";
    }

    if (description && description.length > 300) {
        errors.messageField = `Du har brukt ${description.length - 300} tegn for mye`;
    }
    return errors;
}
