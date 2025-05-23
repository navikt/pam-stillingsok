import getWorkLocation from "@/app/stillinger/_common/utils/getWorkLocation";
import formatISOString from "@/app/stillinger/_common/utils/date";
import { StillingDetaljer } from "@/app/stillinger/_common/lib/stillingSchema";

export function getStillingTitle(title: string | undefined): string {
    if (title) {
        return title;
    }
    return "Ledig stilling";
}

export function getSuperraskTitle(source: StillingDetaljer): string {
    if (source && source.title) {
        return `Superrask søknad - ${source.title}`;
    }
    return "Superrask søknad";
}

export function getStillingDescription(source: StillingDetaljer | undefined): string {
    if (source) {
        const descriptionFragments = [];
        const employer = source.employer?.name;
        const location = getWorkLocation(source.location, source.locationList);

        const commaSeparatedFragments = [];
        if (source.jobTitle && source.title !== source.jobTitle) {
            commaSeparatedFragments.push(source.jobTitle);
        }
        if (employer) {
            commaSeparatedFragments.push(employer);
        }
        if (location) {
            commaSeparatedFragments.push(location);
        }

        if (commaSeparatedFragments.length > 0) {
            descriptionFragments.push(commaSeparatedFragments.join(", "));
        }

        if (source.applicationDue) {
            const applicationDue = formatISOString(source.applicationDue, "DD.MM.YYYY");
            descriptionFragments.push(`Søknadsfrist: ${applicationDue}`);
        }

        return `${descriptionFragments.join(". ")}.`;
    }

    return "Her kan du se hele stillingen, sende søknad eller finne andre ledige stillinger.";
}
