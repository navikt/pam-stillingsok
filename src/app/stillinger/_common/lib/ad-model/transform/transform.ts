import { z } from "zod";
import { ok, err, type Result } from "../core/result";
import { AdDTO } from "../schemas/ad.dto";
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

function getEmployer(properties: z.infer<typeof LegacyProperties> | undefined, src: LegacyAd) {
    if (!src) return undefined;
    const name = properties?.employer ?? src.businessName ?? src.employer?.name ?? undefined;
    const orgnr = src.employer?.orgnr ?? undefined;
    const homepage = toUrl(properties?.employerhomepage);
    const linkedinPage = toUrl(properties?.linkedinpage);
    const twitterAddress = toUrl(properties?.twitteraddress);
    const facebookPage = toUrl(properties?.facebookpage);
    const descriptionHtml = sanitizeAdText(properties?.employerdescription);

    return {
        name,
        orgnr,
        sector: properties?.sector,
        homepage,
        linkedinPage,
        twitterAddress,
        facebookPage,
        descriptionHtml,
    };
}

/* --- hoved-funksjon: aldri throw, returnerer Result --- */
export function transformAdDataLegacy(raw: unknown): Result<z.infer<typeof AdDTO>, ParseError> {
    // 1) parse legacy rådata
    const legacyP = LegacyAd.safeParse(raw);
    if (!legacyP.success) {
        const { summary, lite } = summarizeZodIssues(legacyP.error.issues);
        return err({ kind: "SchemaMismatch", summary, issues: lite });
    }
    const src = legacyP.data;
    const properties = src.properties;

    // --- Application due ---
    const due = splitDateOrLabel(properties?.applicationdue);
    const applicationDueDate = due.date ? dateOnlyToUtcDateTime(due.date) : undefined;
    const applicationDueLabel = due.label;

    // --- Start date ---
    const start = splitDateOrLabel(properties?.starttime);
    const startDate = start.date ? dateOnlyToUtcDateTime(start.date) : undefined;
    const startDateLabel = start.label;

    const jobPercentage = toPercent(properties?.jobpercentage);
    const jobPercentageRange = toPercentRange(properties?.jobpercentagerange);
    const out = {
        id: src.id != null ? String(src.id) : crypto.randomUUID(),
        status: src.status,
        title: src.title,
        source: src.source,
        reference: src.reference,
        medium: src.medium,
        published: toIsoDate(src.published),
        updated: toIsoDate(src.updated),
        expires: toIsoDate(src.expires),
        application: {
            applicationDueDate, // IsoDateString | undefined
            applicationDueLabel, // string | undefined
            hasSuperraskSoknad: parseStrictBoolean(properties?.hasInterestform),
            applicationEmail: toEmail(properties?.applicationemail),
            applicationUrl: toUrl(properties?.applicationurl),
        },
        adTextFormat: properties?.adtextFormat,
        engagementType: properties?.engagementtype,
        jobArrangement: properties?.jobarrangement,
        jobTitle: properties?.jobtitle,
        positionCount: toInt(properties?.positioncount),
        startDate,
        startDateLabel,
        remoteOptions: cleanString(properties?.remote),
        extent: toStringArray(properties?.extent),
        workDays: toStringArray(properties?.workday),
        workHours: toStringArray(properties?.workhours),
        jobPercentage: jobPercentage ?? jobPercentageRange,
        workLanguages: properties?.workLanguage,
        adTextHtml: sanitizeAdText(properties?.adtext),
        sourceUrl: toUrl(properties?.sourceurl),
        employer: getEmployer(properties, src),
        contactList: src.contactList?.map((c) => ({
            name: cleanString(c.name),
            email: toEmail(c.email),
            phone: cleanString(c.phone),
            role: cleanString(c.role),
            title: cleanString(c.title),
        })),
        locationList: src.locationList?.map((l) => ({
            address: cleanString(l.address),
            postalCode: cleanString(l.postalCode),
            county: cleanString(l.county),
            municipal: cleanString(l.municipal),
            city: cleanString(l.city),
            country: cleanString(l.country),
        })),
        isZodError: false,
    };

    // 3) valider mål-DTO TRYGT
    const dtoP = AdDTO.safeParse(out);
    if (!dtoP.success) {
        const { summary, lite } = summarizeZodIssues(dtoP.error.issues);
        return err({ kind: "SchemaMismatch", summary, issues: lite });
    }
    return ok(dtoP.data);
}
