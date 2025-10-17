import getWorkLocation from "@/app/stillinger/_common/utils/getWorkLocation";
import { type AdDTO } from "@/app/stillinger/_common/lib/ad-model";
import getDeadlineMessage from "@/app/stillinger/_common/utils/getDeadlineMessage";

export function getStillingTitle(title: string | null): string {
    if (title) {
        return title;
    }
    return "Ledig stilling";
}

export function getSuperraskTitle(source: AdDTO): string {
    if (source && source.title) {
        return `Superrask søknad - ${source.title}`;
    }
    return "Superrask søknad";
}

export function getStillingDescription(source: AdDTO | undefined): string {
    if (source) {
        const descriptionFragments = [];
        const employer = source.employer.name;
        const location = getWorkLocation(source.locationList);
        const deadlineMessage = getDeadlineMessage({
            dueDateIso: source.application.applicationDueDate,
            dueLabel: source.application.applicationDueLabel,
            now: new Date(),
        });

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

        if (deadlineMessage) {
            descriptionFragments.push(`Søknadsfrist: ${deadlineMessage}`);
        }

        return `${descriptionFragments.join(". ")}.`;
    }

    return "Her kan du se hele stillingen, sende søknad eller finne andre ledige stillinger.";
}
