const getEmployer = require("./getEmployer");
const getWorkLocation = require("./getWorkLocation");
const date = require("./date");

const DEFAULT_TITLE = "Ledige stillinger - arbeidsplassen.no";
const DEFAULT_DESCRIPTION =
    "Søk etter ledige stillinger. Heltid- og deltidsjobber i offentlig og privat sektor i Oslo, Bergen, Trondheim, Stavanger, Tromsø og alle kommuner i Norge.";
const DEFAULT_DESCRIPTION_STILLING = "Her kan du se hele stillingen, sende søknad eller finne andre ledige stillinger.";

exports.getDefaultTitle = function () {
    return DEFAULT_TITLE;
};

exports.getDefaultDescription = function () {
    return DEFAULT_DESCRIPTION;
};

exports.getStillingTitle = function (source) {
    if (source && source.title) {
        return `${source.title} - arbeidsplassen.no`;
    }
    return DEFAULT_TITLE;
};

/**
 * Lager meta description content.
 * F.eks:
 *   "Brukerstyrt personlig assistent, Firmaet AS, Drammen.
 *    Søknadsfrist: Snarest. Her kan du se hele stillingen, sende
 *    søknad eller finne andre ledige stillinger."
 * @param source
 * @returns {string}
 */
exports.getStillingDescription = function (source) {
    if (source && source.properties) {
        const descriptionFragments = [];
        const employer = getEmployer(source);
        const location = getWorkLocation(source.properties.location, source.locationList);

        const commaSeparatedFragments = [];
        if (source.properties.jobtitle && source.title !== source.properties.jobtitle) {
            commaSeparatedFragments.push(source.properties.jobtitle);
        }
        if (employer) {
            commaSeparatedFragments.push(employer);
        }
        if (source.properties.location) {
            commaSeparatedFragments.push(location);
        }

        if (commaSeparatedFragments.length > 0) {
            descriptionFragments.push(commaSeparatedFragments.join(", "));
        }

        if (source.properties.applicationdue) {
            const applicationDue = date.formatISOString(source.properties.applicationdue, "DD.MM.YYYY");
            descriptionFragments.push(`Søknadsfrist: ${applicationDue}`);
        }

        return `${descriptionFragments.join(". ")}. ${DEFAULT_DESCRIPTION_STILLING}`;
    }

    return DEFAULT_DESCRIPTION_STILLING;
};
