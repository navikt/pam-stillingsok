import { describe, expect, it } from "vitest";
import {
    SharedContentMappingError,
    safeParseSharedContentDocument,
} from "@/features/ung/onboarding/server/drupal/jsonApi";
import {
    mapOnboardingModule,
    mapOnboardingResult,
} from "@/features/ung/onboarding/server/mock/mockSharedContentAdapter";
import onboardingFixture from "@/features/ung/onboarding/server/mock/onboarding.fixture.json";

describe("mapOnboardingModule", () => {
    it("normaliserer modulteksten", () => {
        const parsed = safeParseSharedContentDocument(onboardingFixture);
        if (!parsed.ok) {
            throw new Error("Fixture følger ikke kontrakten");
        }

        const module = mapOnboardingModule(parsed.data);

        expect(module).toMatchObject({
            id: "enklere-vei-til-jobb",
            title: "Hva passer best for deg akkurat nå?",
            resultTitle: "Jobb for deg",
        });
    });

    it("følger relasjonsrekkefølgen, ikke rekkefølgen i included", () => {
        const parsed = safeParseSharedContentDocument(onboardingFixture);
        if (!parsed.ok) {
            throw new Error("Fixture følger ikke kontrakten");
        }

        const module = mapOnboardingModule(parsed.data);

        expect(module.questions.map((question) => question.id)).toEqual([
            "question-age",
            "question-situation",
            "question-goals",
        ]);
        expect(module.questions[0]?.options.map((option) => option.id)).toEqual(["age-under-18", "age-18-or-older"]);
    });

    it("normaliserer enkeltvalg og flervalg", () => {
        const parsed = safeParseSharedContentDocument(onboardingFixture);
        if (!parsed.ok) {
            throw new Error("Fixture følger ikke kontrakten");
        }

        const module = mapOnboardingModule(parsed.data);

        expect(module.questions.map((question) => question.selectionMode)).toEqual(["single", "single", "multiple"]);
    });

    it("avviser en modul uten spørsmål", () => {
        const fixtureWithoutQuestions = structuredClone(onboardingFixture);
        fixtureWithoutQuestions.data.relationships.field_questions.data = [];
        const parsed = safeParseSharedContentDocument(fixtureWithoutQuestions);
        if (!parsed.ok) {
            throw new Error("Test-fixture følger ikke grunnkontrakten");
        }

        expect(() => mapOnboardingModule(parsed.data)).toThrowError(
            new SharedContentMappingError("Onboarding-modulen mangler spørsmål"),
        );
    });

    it("beholder første forekomst når en innholdsrelasjon er duplisert", () => {
        const fixtureWithDuplicateContent = structuredClone(onboardingFixture);
        const section = fixtureWithDuplicateContent.included.find((resource) => resource.id === "section-recommended");
        const content = section?.relationships?.field_content?.data;
        if (!Array.isArray(content)) {
            throw new Error("Test-fixture mangler resultatinnhold");
        }
        content.push({
            type: "node--shared_content",
            id: "article-ready-to-apply",
        });
        const parsed = safeParseSharedContentDocument(fixtureWithDuplicateContent);
        if (!parsed.ok) {
            throw new Error("Test-fixture følger ikke grunnkontrakten");
        }

        const result = mapOnboardingResult(parsed.data, { answerIds: [] });

        expect(result.sections.flatMap((resultSection) => resultSection.content.map((item) => item.id))).toEqual([
            "article-ready-to-apply",
            "faq-summer-jobs",
            "faq-apprenticeship",
            "faq-general",
            "faq-cv",
            "faq-find-jobs",
        ]);
    });

    it("mapper ordnede, rike svarblokker uten å lekke JSON API-modellen", () => {
        const parsed = safeParseSharedContentDocument(onboardingFixture);
        if (!parsed.ok) {
            throw new Error("Fixture følger ikke kontrakten");
        }

        const result = mapOnboardingResult(parsed.data, { answerIds: ["age-under-18"] });
        const faq = result.sections
            .flatMap((resultSection) => resultSection.content)
            .find((item) => item.id === "faq-under-18");

        expect(faq?.type).toBe("faq");
        if (faq?.type !== "faq") {
            throw new Error("Forventet spørsmål med rike svarblokker");
        }
        expect(faq.blocks.map((block) => block.type)).toEqual(["video", "html", "link", "related-card"]);
        expect(faq.blocks[0]).toMatchObject({
            type: "video",
            provider: "qbrick",
            mediaId: "b87f69fe-5b28-40e6-8446-6e08c8beb3d5",
            title: "5 tips til deg som skal søke sommerjobb",
            thumbnail: {
                src: "/images/video-thumbnail-sommerjobb-tips.jpeg",
            },
        });

        const findJobsFaq = result.sections
            .flatMap((resultSection) => resultSection.content)
            .find((item) => item.id === "faq-find-jobs");
        expect(findJobsFaq?.type).toBe("faq");
        if (findJobsFaq?.type !== "faq") {
            throw new Error("Forventet spørsmål med Vimeo-video");
        }
        expect(findJobsFaq.blocks.map((block) => block.type)).toEqual(["html", "video"]);
        expect(findJobsFaq.blocks[1]).toMatchObject({
            type: "video",
            provider: "vimeo",
            href: "https://player.vimeo.com/video/1180806925?",
            title: "Hvordan finner jeg flere relevante jobber?",
        });
    });

    it("avviser ugyldig Qbrick media-ID", () => {
        const fixtureWithInvalidMediaId = structuredClone(onboardingFixture);
        const qbrickVideo = fixtureWithInvalidMediaId.included.find(
            (resource) => resource.id === "answer-video-under-18",
        );
        if (!qbrickVideo) {
            throw new Error("Test-fixture mangler Qbrick-video");
        }
        qbrickVideo.attributes.field_qbrick_media_id = "ugyldig";
        const parsed = safeParseSharedContentDocument(fixtureWithInvalidMediaId);
        if (!parsed.ok) {
            throw new Error("Test-fixture følger ikke grunnkontrakten");
        }

        expect(() => mapOnboardingResult(parsed.data, { answerIds: ["age-under-18"] })).toThrowError(
            new SharedContentMappingError("Ugyldige attributter for paragraph--answer_video", [
                "attributes.field_qbrick_media_id",
            ]),
        );
    });

    it.each(["http://vimeo.com/1180806925", "https://vimeo.com.evil.example/1180806925"])(
        "avviser Vimeo-URL som ikke er tillatt: %s",
        (unsafeUrl) => {
            const fixtureWithUnsafeVimeoUrl = structuredClone(onboardingFixture);
            const vimeoVideo = fixtureWithUnsafeVimeoUrl.included.find(
                (resource) => resource.id === "answer-video-find-jobs",
            );
            if (!vimeoVideo) {
                throw new Error("Test-fixture mangler Vimeo-video");
            }
            vimeoVideo.attributes.source_url = unsafeUrl;
            const parsed = safeParseSharedContentDocument(fixtureWithUnsafeVimeoUrl);
            if (!parsed.ok) {
                throw new Error("Test-fixture følger ikke grunnkontrakten");
            }

            expect(() => mapOnboardingResult(parsed.data, { answerIds: [] })).toThrowError(
                new SharedContentMappingError("Vimeo-lenken har en URL som ikke er tillatt"),
            );
        },
    );

    it.each([
        "javascript:alert(1)",
        "//evil.example",
        "/\\evil.example",
        "https:\\evil.example",
        "https://bruker:passord@evil.example/innhold",
        "https://example.com/\ninnhold",
    ])("avviser skadelig URL i svarblokk: %s", (unsafeUrl) => {
        const fixtureWithUnsafeLink = structuredClone(onboardingFixture);
        const answerLink = fixtureWithUnsafeLink.included.find((resource) => resource.id === "answer-link-under-18");
        if (!answerLink) {
            throw new Error("Test-fixture mangler svarlenken");
        }
        answerLink.attributes.source_url = unsafeUrl;
        const parsed = safeParseSharedContentDocument(fixtureWithUnsafeLink);
        if (!parsed.ok) {
            throw new Error("Test-fixture følger ikke grunnkontrakten");
        }

        expect(() => mapOnboardingResult(parsed.data, { answerIds: ["age-under-18"] })).toThrowError(
            new SharedContentMappingError("Svarlenken har en protokoll som ikke er tillatt"),
        );
    });
});
