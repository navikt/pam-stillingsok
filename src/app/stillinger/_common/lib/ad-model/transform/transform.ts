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

function getEmployer(p: z.infer<typeof LegacyProperties> | undefined, src: LegacyAd) {
    if (!src) return undefined;
    const name = p?.employer ?? src.businessName ?? src.employer?.name ?? undefined;
    const orgnr = src.employer?.orgnr ?? undefined;
    const homepage = toUrl(p?.employerhomepage);
    const linkedinPage = toUrl(p?.linkedinpage);
    const twitterAddress = toUrl(p?.twitteraddress);
    const facebookPage = toUrl(p?.facebookpage);
    const descriptionHtml = sanitizeAdText(p?.employerdescription);

    return {
        name,
        orgnr,
        sector: p?.sector,
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
        applicationDue: properties?.applicationdue,

        hasSuperraskSoknad: parseStrictBoolean(properties?.hasInterestform),

        adTextFormat: properties?.adtextFormat,
        engagementType: properties?.engagementtype,
        jobArrangement: properties?.jobarrangement,

        jobTitle: properties?.jobtitle,
        positionCount: toInt(properties?.positioncount),
        startTime: properties?.starttime,

        remote: cleanString(properties?.remote),

        extent: toStringArray(properties?.extent),
        workdays: toStringArray(properties?.workday),
        workHours: toStringArray(properties?.workhours),

        jobPercentage: toPercent(properties?.jobpercentage),
        jobPercentageRange: toPercentRange(properties?.jobpercentagerange),

        workLanguages: properties?.workLanguage,

        adTextHtml: sanitizeAdText(properties?.adtext),
        applicationEmail: toEmail(properties?.applicationemail),
        applicationUrl: toUrl(properties?.applicationurl),
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

        location: properties?.location,
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
