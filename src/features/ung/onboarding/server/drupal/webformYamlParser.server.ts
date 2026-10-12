import "server-only";
import { parse } from "yaml";
import { SharedContentMappingError } from "@/features/ung/onboarding/server/drupal/jsonApi";

/**
 * Trygg YAML-parsing delt mellom Webform-quizen og onboarding-Webformen: kjerneschema uten
 * egendefinerte tags, aliaser slått av, og en størrelsesgrense satt av kalleren. Kaster
 * `SharedContentMappingError`, fanges av `runMapping` i kallerens parser.
 */
export function parseWebformYamlSafely(yaml: string, maxLength: number, errorMessage: string): unknown {
    if (yaml.length > maxLength) {
        throw new SharedContentMappingError(errorMessage);
    }
    try {
        return parse(yaml, { schema: "core", maxAliasCount: 0, uniqueKeys: true });
    } catch {
        throw new SharedContentMappingError(errorMessage);
    }
}
