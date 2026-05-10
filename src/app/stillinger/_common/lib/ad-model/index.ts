export type { AdDTO, Contact, Employer, Location } from "./schemas/ad.dto";
export type { LegacyAd } from "./schemas/legacy.schemas";

// For typer, bruk hos konsumenter:
// import { AdDTO } from ".../ad-model";
// type Ad = z.infer<typeof AdDTO>;

export { type ParseError, summarizeZodIssues, type ZodIssueLite } from "./core/error-types";
// ----- Core result & errors -----
export { type Err, err, type Ok, ok, type Result } from "./core/result";
// ----- Elastic helpers (ES-hit -> AdDTO Result) -----
export {
    type ElasticDocHit, // nyttig i typed kall andre steder
    elasticHitToAdDTOResult,
} from "./elastic/elastic.helpers";
// ----- Tekstverktøy for annonsetekst (epost-linkify + sanitize) -----
export { sanitizeAdText } from "./transform/ad-text";
// ----- Transform (legacy -> AdDTO) -----
export { transformAdDataLegacy } from "./transform/transform";
