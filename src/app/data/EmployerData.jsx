import LocationData from "./LocationData";
export default class EmployerData {
    #name = "";
    #locations = "";
    #homepage = "";
    #linkedinPage = "";
    #twitterAddress = "";
    #facebookPage = "";
    #description = "";

    constructor(name, locations, homepage, linkedinpage, twitteraddress, facebookpage, description) {
        this.#name = name;
        this.#locations = locations;
        this.#homepage = homepage;
        this.#linkedinPage = linkedinpage;
        this.#twitterAddress = twitteraddress;
        this.#facebookPage = facebookpage;
        this.#description = description;
    }

    static fromQuery(adData) {
        let name = null;
        if (adData && adData.properties && adData.properties.employer) {
            name = adData.properties.employer;
        } else if (adData && adData.businessName) {
            name = adData.businessName;
        } else if (adData && adData.employer) {
            name = adData.employer.name;
        }

        let locations = [];
        if (adData.employer && adData.employer.locationList) {
            locations = adData.employer.locationList.map(LocationData.fromQuery());
        }

        return new EmployerData(
            name,
            locations,
            adData.properties.employerhomepage,
            adData.properties.linkedinpage,
            adData.properties.twitteraddress,
            adData.properties.facebookpage,
            adData.properties.employerdescription,
        );
    }

    getEmployerLocation() {
        let locationNames = this.#locations.map((loc) => {
            return loc.getEmployerLocation();
        });
        return locationNames.join(", ");
    }
}
