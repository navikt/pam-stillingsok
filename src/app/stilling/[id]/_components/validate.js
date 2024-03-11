export default function validateForm(categories, description) {
    const errors = {};

    if (!categories || categories.length === 0) {
        errors.categoryFieldset = "Du må velge minst én kategori hvor annonsen bryter retningslinjene";
    }

    if (description && description.length > 300) {
        errors.messageField = `${
            description.replace(/\r\n/g, "\n").length - 300
        } antall tegn for mye i utdypende informasjon`;
    }
    return errors;
}
