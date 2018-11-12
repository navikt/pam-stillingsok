export function moveFacetToBottom(array, itemKey) {
    const clone = array.concat();

    clone.forEach((item, i) => {
        if (item.key === itemKey) {
            // Flytter elementet til bunn av listen
            clone.push(clone.splice(i, 1)[0]);
        }
    });

    return clone;
}
