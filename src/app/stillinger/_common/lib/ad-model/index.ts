export type { LegacyAd } from "./schemas/legacy.schemas";
export type { Location, Employer, Contact, AdDTO } from "./schemas/ad.dto";

// For typer, bruk hos konsumenter:
// import { AdDTO } from ".../ad-model";
// type Ad = z.infer<typeof AdDTO>;

// ----- Core result & errors -----
export { ok, err, type Ok, type Err, type Result } from "./core/result";
export { summarizeZodIssues, type ParseError, type ZodIssueLite } from "./core/error-types";

// ----- Transform (legacy -> AdDTO) -----
export { transformAdDataLegacy } from "./transform/transform";

// ----- Elastic helpers (ES-hit -> AdDTO Result) -----
export {
    elasticHitToAdDTOResult,
    type ElasticDocHit, // nyttig i typed kall andre steder
} from "./elastic/elastic.helpers";

// ----- Tekstverktøy for annonsetekst (epost-linkify + sanitize) -----
export { sanitizeAdText } from "./transform/ad-text";
