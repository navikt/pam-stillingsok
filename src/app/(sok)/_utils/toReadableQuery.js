import fixLocationName from "@/app/_common/utils/fixLocationName";
import { PublishedLabelsEnum } from "@/app/(sok)/_components/filters/Published";
import { SearchQueryParams } from "@/app/(sok)/_utils/constants";

/**
 * Takes an URLSearchParams object and returns a readable text.
 * For example: "Utvikling i Oslo og Lillestrøm"
 * @param urlSearchParams URLSearchParams
 * @returns {string}
 */
export default function toReadableQuery(urlSearchParams) {
    const title = [];
    const occupation = [];
    let location = [];

    // Ikke vis fylket hvis bruker har valgt en eller flere tilhørende kommuner
    const counties = urlSearchParams.getAll(SearchQueryParams.COUNTY).filter((county) => {
        const found = urlSearchParams.getAll(SearchQueryParams.MUNICIPAL).find((obj) => obj.startsWith(`${county}.`));
        return !found;
    });

    // Ikke vis yrket på nivå 1 hvis bruker har valgt et relatert yrke på nivå 2
    const occupationFirstLevels = urlSearchParams.getAll(SearchQueryParams.OCCUPATION_LEVEL_1).filter((firstLevel) => {
        const found = urlSearchParams
            .getAll(SearchQueryParams.OCCUPATION_LEVEL_2)
            .find((obj) => obj.startsWith(`${firstLevel}.`));
        return !found;
    });

    if (urlSearchParams.has(SearchQueryParams.Q)) occupation.push(urlSearchParams.get(SearchQueryParams.Q));
    if (urlSearchParams.has(SearchQueryParams.PUBLISHED))
        occupation.push(PublishedLabelsEnum[urlSearchParams.get(SearchQueryParams.PUBLISHED)]);

    // occupation
    if (occupationFirstLevels.length > 0) occupation.push(occupationFirstLevels.join(", "));
    if (urlSearchParams.has(SearchQueryParams.OCCUPATION_LEVEL_2))
        occupation.push(
            urlSearchParams
                .getAll(SearchQueryParams.OCCUPATION_LEVEL_2)
                .map((o) => o.split(".")[1])
                .join(", "),
        );
    if (urlSearchParams.has(SearchQueryParams.SECTOR))
        occupation.push(urlSearchParams.getAll(SearchQueryParams.SECTOR).join(", "));
    if (urlSearchParams.has(SearchQueryParams.EXTENT))
        occupation.push(urlSearchParams.getAll(SearchQueryParams.EXTENT).join(", "));
    if (urlSearchParams.has(SearchQueryParams.ENGAGEMENT_TYPE))
        occupation.push(urlSearchParams.getAll(SearchQueryParams.ENGAGEMENT_TYPE).join(", "));
    if (urlSearchParams.has(SearchQueryParams.REMOTE)) occupation.push("Hjemmekontor");

    // location
    if (counties.length > 0) {
        location = location.concat(counties.map((c) => fixLocationName(c)));
    }
    if (urlSearchParams.has(SearchQueryParams.MUNICIPAL)) {
        location = location.concat(
            urlSearchParams.getAll(SearchQueryParams.MUNICIPAL).map((m) => fixLocationName(m.split(".")[1])),
        );
    }
    if (urlSearchParams.has(SearchQueryParams.COUNTRY)) {
        location = location.concat(urlSearchParams.getAll(SearchQueryParams.COUNTRY).map((c) => fixLocationName(c)));
    }
    if (urlSearchParams.has(SearchQueryParams.INTERNATIONAL)) {
        location.push("Utland");
    }

    if (occupation.length > 0) {
        title.push(occupation.join(", "));
    }

    if (location.length > 0) {
        const last = location.pop();
        if (location.length > 0) {
            title.push([location.join(", "), last].join(" og "));
        } else {
            title.push(last);
        }
    }
    return title.join(" i ");
}
