import "server-only";

export type MetadataDimension = "age" | "experience" | "audience";

/**
 * Maskinnavnene til taxonomy-vokabularene en artikkel kan være tagget med. Brukes til å verifisere
 * relasjonstypen når artikkelens metadata-navn hentes til debug-panelet (ArticleMetadataDebugPanel).
 * Selve filtreringen skjer nå server-side hos Drupal (se buildOnboardingModule.server.ts og
 * getCollection()-filteret i drupalClient.server.ts).
 */
export const METADATA_TERM_TYPES: Readonly<Record<MetadataDimension, string>> = {
    age: "taxonomy_term--shared_content_age",
    experience: "taxonomy_term--shared_content_experience",
    audience: "taxonomy_term--situations",
};
