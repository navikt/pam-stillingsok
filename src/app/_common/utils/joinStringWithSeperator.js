const joinStringWithSeparator = (strings, separator = "og", useLowerCase = true) => {
    if (strings.length === 1) {
        return strings[0];
    }
    let result = "";
    for (let i = 0; i < strings.length; i += 1) {
        // Add "separator" before the last string
        if (i === strings.length - 1) {
            result += ` ${separator} `;
        }

        if (!useLowerCase || i === 0) {
            result += strings[i];
        } else {
            result += strings[i].toLowerCase();
        }

        // Separate string with ", ", except the last string
        if (i < strings.length - 2) {
            result += ", ";
        }
    }
    return result;
};

export default joinStringWithSeparator;
