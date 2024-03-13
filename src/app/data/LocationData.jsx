import fixLocationName from "@/app/_common/utils/fixLocationName";

export default class LocationData {
    #address = "";
    #city = "";
    #postalCode = "";
    #municipal = "";
    #country = "";

    constructor(address, city, postalCode, municipal, country) {
        this.#address = address;
        this.#city = city;
        this.#postalCode = postalCode;

        this.#municipal = municipal;
        this.#country = country;
    }

    static fromQuery(locationData) {
        return new LocationData(
            locationData.address,
            locationData.city,
            locationData.postalCode,
            locationData.municipal,
            locationData.country,
        );
    }

    getEmployerLocation() {
        let employerLocation = "";
        if (this.#postalCode) {
            let address = this.#address ? `${this.#address}, ` : "";
            address += `${this.#postalCode} ${fixLocationName(this.#city)}`;
            employerLocation = address;
        } else if (this.#municipal) {
            employerLocation = `${fixLocationName(this.#municipal)}`;
        } else if (this.#country) {
            employerLocation = `${fixLocationName(this.#country)}`;
        }
        return employerLocation;
    }
}
