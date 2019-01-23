import capitalizeLocation from './capitalizeLocation';

export default function getWorkLocation(stilling, hidePostAddress = false) {
    let workLocation = null;

    if (stilling && stilling.properties && stilling.properties.location) {
        workLocation = stilling.properties.location;
    } else if (stilling && stilling.location) {
        const { location } = stilling;

        if (location.city && hidePostAddress) {
            workLocation = capitalizeLocation(location.city);
        } else if (location.postalCode) {
            workLocation = location.address ? `${location.address}, ` : '';
            workLocation += `${location.postalCode} ${capitalizeLocation(location.city)}`;
        } else if (location.municipal) {
            workLocation = `${capitalizeLocation(location.municipal)}`;
        } else if (location.country) {
            workLocation = `${capitalizeLocation(location.country)}`;
        }
    }
    return workLocation;
}
