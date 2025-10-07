import { z } from "zod";
import { ok, err, type Result } from "../core/result";
import { AdDTOSchema } from "../schemas/ad.dto";
import { LegacyAd, LegacyProperties } from "../schemas/legacy.schemas";
import { summarizeZodIssues, type ParseError } from "../core/error-types";
import { sanitizeAdText } from "@/app/stillinger/_common/lib/ad-model/transform/ad-text";
import {
    cleanString,
    toEmail,
    toInt,
    toIsoDate,
    toPercent,
    toPercentRange,
    toStringArray,
    toUrl,
} from "@/app/stillinger/_common/lib/ad-model/transform/coercers";
import { parseStrictBoolean } from "@/app/stillinger/_common/lib/ad-model/transform/normalizers";
import { dateOnlyToUtcDateTime, splitDateOrLabel } from "@/app/stillinger/_common/lib/ad-model/utils/date-split";

const orNull = <T>(v: T | null | undefined): T | null => (v == null ? null : v);
const arrayOrNull = (v: string[] | null | undefined): string[] | null => (v && v.length ? v : null);

function getEmployer(properties: z.infer<typeof LegacyProperties> | undefined, src: LegacyAd) {
    if (!src) return null;
    const name = orNull(properties?.employer ?? src.businessName ?? src.employer?.name);
    const orgnr = orNull(src.employer?.orgnr);
    const sector = orNull(properties?.sector);

    const homepage = orNull(toUrl(properties?.employerhomepage));
    const linkedinPage = orNull(toUrl(properties?.linkedinpage));
    const twitterAddress = orNull(toUrl(properties?.twitteraddress));
    const facebookPage = orNull(toUrl(properties?.facebookpage));
    const descriptionHtml = orNull(sanitizeAdText(properties?.employerdescription));

    return {
        name,
        orgnr,
        sector,
        homepage,
        linkedinPage,
        twitterAddress,
        facebookPage,
        descriptionHtml,
    };
}

/**
 * Transformerer legacy annonseformat til AdDTO
 * @param raw
 */
export function transformAdDataLegacy(raw: unknown): Result<z.infer<typeof AdDTOSchema>, ParseError> {
    const legacyP = LegacyAd.safeParse(raw);
    if (!legacyP.success) {
        const { summary, lite } = summarizeZodIssues(legacyP.error.issues);
        return err({ kind: "SchemaMismatch", summary, issues: lite });
    }
    const src = legacyP.data;
    const properties = src.properties;

    const due = splitDateOrLabel(properties?.applicationdue);
    const applicationDueDate = due.date ? dateOnlyToUtcDateTime(due.date) : null;
    const applicationDueLabel = due.label;

    const start = splitDateOrLabel(properties?.starttime);
    const startDate = start.date ? dateOnlyToUtcDateTime(start.date) : null;
    const startDateLabel = start.label;

    const jobPercentage = toPercent(properties?.jobpercentage);
    const jobPercentageRange = toPercentRange(properties?.jobpercentagerange);
    const out = {
        id: String(src.id),
        status: orNull(src.status),
        title: orNull(src.title),
        source: orNull(src.source),
        reference: orNull(src.reference),
        medium: orNull(src.medium),
        published: toIsoDate(src.published),
        updated: toIsoDate(src.updated),
        expires: toIsoDate(src.expires),
        application: {
            applicationDueDate,
            applicationDueLabel,
            hasSuperraskSoknad: orNull(parseStrictBoolean(properties?.hasInterestform)),
            applicationEmail: orNull(toEmail(properties?.applicationemail)),
            applicationUrl: orNull(toUrl(properties?.applicationurl)),
        },
        adTextFormat: orNull(properties?.adtextFormat),
        engagementType: orNull(properties?.engagementtype),
        jobArrangement: orNull(properties?.jobarrangement),
        jobTitle: orNull(properties?.jobtitle),
        positionCount: orNull(toInt(properties?.positioncount)),
        startDate,
        startDateLabel,
        remoteOptions: orNull(cleanString(properties?.remote)),

        extent: arrayOrNull(toStringArray(properties?.extent)),
        workDays: arrayOrNull(toStringArray(properties?.workday)),
        workHours: arrayOrNull(toStringArray(properties?.workhours)),
        jobPercentage: orNull(jobPercentage ?? jobPercentageRange),
        workLanguages: arrayOrNull(toStringArray(properties?.workLanguage)),

        adTextHtml: orNull(sanitizeAdText(properties?.adtext)),
        sourceUrl: orNull(toUrl(properties?.sourceurl)),

        employer: getEmployer(properties, src),
        contactList: src.contactList
            ? src.contactList?.map((c) => ({
                  name: orNull(cleanString(c.name)),
                  email: orNull(toEmail(c.email)),
                  phone: orNull(cleanString(c.phone)),
                  role: orNull(cleanString(c.role)),
                  title: orNull(cleanString(c.title)),
              }))
            : null,
        locationList: src.locationList
            ? src.locationList?.map((l) => ({
                  address: orNull(cleanString(l.address)),
                  postalCode: orNull(cleanString(l.postalCode)),
                  county: orNull(cleanString(l.county)),
                  municipal: orNull(cleanString(l.municipal)),
                  city: orNull(cleanString(l.city)),
                  country: orNull(cleanString(l.country)),
              }))
            : null,
        // Vector for similar jobs
        compositeAdVector: src?.compositeAdVector,
        isZodError: false,
    };

    const dtoP = AdDTOSchema.safeParse(out);
    if (!dtoP.success) {
        const { summary, lite } = summarizeZodIssues(dtoP.error.issues);
        return err({ kind: "SchemaMismatch", summary, issues: lite });
    }
    return ok(dtoP.data);
}
