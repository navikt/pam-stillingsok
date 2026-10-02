import { describe, expect, it } from "vitest";
import type {
    JsonApiDocument,
    JsonApiResource,
    JsonApiResourceIdentifier,
} from "@/features/ung/onboarding/server/drupal/jsonApi";
import onboardingFixture from "./onboarding.fixture.json";

const document: JsonApiDocument = onboardingFixture;

function resourceKey(resource: JsonApiResourceIdentifier): string {
    return `${resource.type}:${resource.id}`;
}

function identifiers(resource: JsonApiResource): readonly JsonApiResourceIdentifier[] {
    return Object.values(resource.relationships ?? {}).flatMap((relationship) => {
        if (!relationship || relationship.data === null) {
            return [];
        }
        return Array.isArray(relationship.data) ? relationship.data : [relationship.data];
    });
}

describe("onboarding-fixture", () => {
    it("har unike ressurser og oppløselige relasjoner", () => {
        const resources = [document.data, ...document.included];
        const resourceKeys = resources.map(resourceKey);
        const knownResourceKeys = new Set(resourceKeys);

        expect(knownResourceKeys.size).toBe(resourceKeys.length);

        for (const resource of resources) {
            for (const identifier of identifiers(resource)) {
                expect(knownResourceKeys.has(resourceKey(identifier))).toBe(true);
            }
        }
    });
});
