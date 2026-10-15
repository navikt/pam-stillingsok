import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { appLogger } from "@/app/_common/logging/appLogger";
import type { OnboardingModule } from "@/features/ung/enklere-vei-til-jobb/domain/onboarding";
import {
    mapArticle,
    mapArticleCollection,
} from "@/features/ung/enklere-vei-til-jobb/server/drupal/articleMapper.server";
import type {
    JsonApiCollectionDocument,
    JsonApiDocument,
    JsonApiResource,
} from "@/features/ung/enklere-vei-til-jobb/server/drupal/jsonApi";

const ON_ITS_OWN_ID = "cf446cee-9e2e-46cd-9e1b-09dc4cb1abbb";
const WEBFORM_ID = "fcb6a11e-5b6a-400a-a4dd-69bfc36b1f69";

beforeEach(() => {
    const originalWarn = appLogger.warn;
    vi.spyOn(appLogger, "warn").mockImplementation((message, context) => {
        if (
            message === "Hopper over en artikkelblokk som ikke støttes" ||
            message === "Hopper over en artikkelvideo med en leverandør eller URL som ikke støttes"
        ) {
            return;
        }
        originalWarn(message, context);
    });
});

afterEach(() => {
    vi.restoreAllMocks();
});

const testModule: OnboardingModule = {
    id: "module",
    title: "Tittel",
    intro: "Ingress",
    resultTitle: "Resultat",
    resultIntro: "Resultatingress",
    steps: [
        {
            id: "step-1",
            title: "Steg 1",
            questions: [
                {
                    id: "age",
                    title: "Alder",
                    controlType: "radios",
                    required: true,
                    multiple: false,
                    dimension: "age",
                    options: [{ id: "age-18-or-older", label: "18 år eller eldre" }],
                },
                {
                    id: "goals",
                    title: "Mål",
                    controlType: "checkboxes",
                    required: false,
                    multiple: true,
                    dimension: "audiences",
                    options: [{ id: "goal-find-job", label: "Finne en jobb" }],
                },
            ],
        },
    ],
};

function withBlock(
    block: JsonApiResource,
    options: { extra?: readonly JsonApiResource[]; contentRelation?: boolean } = {},
): JsonApiDocument {
    return {
        data: {
            type: "node--shared_content",
            id: ON_ITS_OWN_ID,
            attributes: {
                title: "Tittel",
                field_sc_intro: { value: "<p>Ingress &amp; mer</p>", format: "basic_html" },
            },
            relationships: {
                field_sc_content: { data: [{ type: block.type, id: block.id }] },
            },
        },
        included: [block, ...(options.extra ?? [])],
    };
}

function paragraph(
    type: string,
    attributes: Record<string, unknown>,
    relationships?: JsonApiResource["relationships"],
) {
    return {
        type,
        id: "11111111-1111-4111-8111-111111111111",
        attributes: { field_hide_block: false, ...attributes },
        ...(relationships ? { relationships } : {}),
    } satisfies JsonApiResource;
}

function teaserFileResource(id: string, uri: string): JsonApiResource {
    return {
        type: "file--file",
        id,
        attributes: { uri: { url: uri } },
    };
}

function articleSummaryNode(id: string, relationships?: JsonApiResource["relationships"]): JsonApiResource {
    return {
        type: "node--shared_content",
        id,
        attributes: {
            title: "Tittel",
            field_sc_intro: { value: "<p>Ingress</p>", format: "basic_html" },
        },
        ...(relationships ? { relationships } : {}),
    };
}

function articleCollectionDocument(
    data: JsonApiResource[],
    included: JsonApiResource[] = [],
): JsonApiCollectionDocument {
    return { data, included };
}

describe("mapArticleCollection", () => {
    it("normaliserer artiklene til sammendrag med lokal href, uten å filtrere", () => {
        const document = articleCollectionDocument([
            articleSummaryNode(ON_ITS_OWN_ID),
            articleSummaryNode("8eb7f9d6-361c-4ac0-92c6-b272374e84d5"),
        ]);
        const result = mapArticleCollection(document, {}, testModule);
        if (!result.ok) {
            throw new Error("Forventet vellykket mapping");
        }

        expect(result.data).toHaveLength(2);
        expect(result.data[0]).toMatchObject({
            id: ON_ITS_OWN_ID,
            title: "Tittel",
            href: `/ung/enklere-vei-til-jobb/artikkel/${ON_ITS_OWN_ID}?`,
        });
        expect(result.data[0]).not.toHaveProperty("metadata");
        expect(result.data[0]?.description).not.toMatch(/<|&nbsp;/);
    });

    it("bevarer valgene i artikkellenka uten å filtrere bort artikler", () => {
        const selection = {
            age: { dimension: "age" as const, optionIds: ["age-18-or-older"] },
            goals: { dimension: "audiences" as const, optionIds: ["goal-find-job"] },
        };
        const result = mapArticleCollection(
            articleCollectionDocument([articleSummaryNode(ON_ITS_OWN_ID)]),
            selection,
            testModule,
        );
        if (!result.ok) {
            throw new Error("Forventet vellykket mapping");
        }

        expect(result.data).toHaveLength(1);
        const article = result.data.find((item) => item.id === ON_ITS_OWN_ID);
        expect(article?.href).toBe(
            `/ung/enklere-vei-til-jobb/artikkel/${ON_ITS_OWN_ID}?age=age%3Aage-18-or-older&goals=audiences%3Agoal-find-job`,
        );
    });

    it("feiler ved uventet ressurstype i samlingen", () => {
        const result = mapArticleCollection(
            articleCollectionDocument([{ type: "node--page", id: ON_ITS_OWN_ID, attributes: {} }]),
            {},
            testModule,
        );

        expect(result).toMatchObject({ ok: false, error: { type: "invalid-contract" } });
    });

    describe("listebilde (field_sc_teaser_image/field_seo_image)", () => {
        it("bruker field_sc_teaser_image når den finnes, med bredde/høyde fra meta", () => {
            const document = articleCollectionDocument(
                [
                    articleSummaryNode(ON_ITS_OWN_ID, {
                        field_sc_teaser_image: {
                            data: {
                                type: "file--file",
                                id: "file-1",
                                meta: { alt: "Et bilde", width: 400, height: 300 },
                            },
                        },
                    }),
                ],
                [teaserFileResource("file-1", "/sites/default/files/bilde.jpg")],
            );

            const result = mapArticleCollection(document, {}, testModule, "https://cms.example.no");
            if (!result.ok) {
                throw new Error("Forventet vellykket mapping");
            }

            expect(result.data[0]?.image).toEqual({
                src: "https://cms.example.no/sites/default/files/bilde.jpg",
                alt: "Et bilde",
                width: 400,
                height: 300,
            });
        });

        it("faller tilbake til en firkantet standardstørrelse når meta mangler bredde/høyde (slik staging viser for field_sc_teaser_image)", () => {
            const document = articleCollectionDocument(
                [
                    articleSummaryNode(ON_ITS_OWN_ID, {
                        field_sc_teaser_image: {
                            data: {
                                type: "file--file",
                                id: "file-1",
                                meta: { alt: "bilde av klokke", width: null, height: null },
                            },
                        },
                    }),
                ],
                [teaserFileResource("file-1", "https://cms.example.no/sites/default/files/klokke.jpg")],
            );

            const result = mapArticleCollection(document, {}, testModule);
            if (!result.ok) {
                throw new Error("Forventet vellykket mapping");
            }

            expect(result.data[0]?.image).toEqual({
                src: "https://cms.example.no/sites/default/files/klokke.jpg",
                alt: "bilde av klokke",
                width: 60,
                height: 60,
            });
        });

        it("bruker field_seo_image som reserve når field_sc_teaser_image mangler", () => {
            const document = articleCollectionDocument(
                [
                    articleSummaryNode(ON_ITS_OWN_ID, {
                        field_sc_teaser_image: { data: null },
                        field_seo_image: {
                            data: {
                                type: "file--file",
                                id: "file-2",
                                meta: { alt: "SEO-bilde", width: 1200, height: 630 },
                            },
                        },
                    }),
                ],
                [teaserFileResource("file-2", "https://cms.example.no/sites/default/files/seo.jpg")],
            );

            const result = mapArticleCollection(document, {}, testModule);
            if (!result.ok) {
                throw new Error("Forventet vellykket mapping");
            }

            expect(result.data[0]?.image).toEqual({
                src: "https://cms.example.no/sites/default/files/seo.jpg",
                alt: "SEO-bilde",
                width: 1200,
                height: 630,
            });
        });

        it("dropper bildet uten å feile hele artikkelen når verken teaser- eller SEO-bilde finnes", () => {
            const document = articleCollectionDocument([
                articleSummaryNode(ON_ITS_OWN_ID, {
                    field_sc_teaser_image: { data: null },
                    field_seo_image: { data: null },
                }),
            ]);

            const result = mapArticleCollection(document, {}, testModule);
            if (!result.ok) {
                throw new Error("Forventet vellykket mapping");
            }

            expect(result.data[0]).not.toHaveProperty("image");
        });

        it("dropper bildet uten å feile når fil-ressursen mangler i included", () => {
            const document = articleCollectionDocument([
                articleSummaryNode(ON_ITS_OWN_ID, {
                    field_sc_teaser_image: {
                        data: { type: "file--file", id: "missing-file", meta: { alt: "", width: 10, height: 10 } },
                    },
                }),
            ]);

            const result = mapArticleCollection(document, {}, testModule);
            if (!result.ok) {
                throw new Error("Forventet vellykket mapping");
            }

            expect(result.data[0]).not.toHaveProperty("image");
        });
    });
});

describe("mapArticle", () => {
    it("mapper Webform-relasjonen", () => {
        const document: JsonApiDocument = {
            data: {
                type: "node--shared_content",
                id: ON_ITS_OWN_ID,
                attributes: {
                    title: "Tittel",
                    field_sc_intro: { value: "<p>Ingress</p>", format: "basic_html" },
                },
                relationships: {
                    field_sc_content: { data: [] },
                    field_sc_webform: { data: { type: "webform--webform", id: WEBFORM_ID } },
                },
            },
            included: [],
        };
        const result = mapArticle(document);
        if (!result.ok) {
            throw new Error(`Forventet vellykket mapping: ${JSON.stringify(result)}`);
        }

        expect(result.data.webformId).toBe(WEBFORM_ID);
    });

    describe("field_tti_layout og field_tti_style", () => {
        it("mapper img_left og coloured_box", () => {
            const result = mapArticle(
                withBlock(
                    paragraph("paragraph--title_text_image", {
                        field_tti_title: "Tilpass søknaden",
                        field_tti_heading_level: "h4",
                        field_tti_layout: "img_left",
                        field_tti_style: "coloured_box",
                    }),
                ),
            );
            if (!result.ok) {
                throw new Error(`Forventet vellykket mapping: ${JSON.stringify(result)}`);
            }

            expect(result.data.blocks[0]).toMatchObject({
                headingLevel: "4",
                layout: "left",
                style: "coloured-box",
            });
        });

        it("faller tilbake til høyre og simpel når feltene mangler", () => {
            const result = mapArticle(
                withBlock(paragraph("paragraph--title_text_image", { field_tti_title: "Standard" })),
            );
            if (!result.ok) {
                throw new Error(`Forventet vellykket mapping: ${JSON.stringify(result)}`);
            }

            expect(result.data.blocks[0]).toMatchObject({
                headingLevel: "2",
                layout: "right",
                style: "simple",
            });
        });
    });

    describe("field_accordion_style", () => {
        const accordionItem: JsonApiResource = {
            type: "paragraph--accordion_item",
            id: "44444444-4444-4444-8444-444444444444",
            attributes: {
                field_accordion_item_title: "Spørsmål",
                field_accordion_item_content: { value: "<p>Svar</p>" },
            },
        };

        function accordionBlock(attributes: Record<string, unknown>) {
            return paragraph("paragraph--accordion", attributes, {
                field_accordion_items: { data: [{ type: accordionItem.type, id: accordionItem.id }] },
            }) satisfies JsonApiResource;
        }

        it("mapper secondary", () => {
            const result = mapArticle(
                withBlock(accordionBlock({ field_accordion_style: "secondary" }), { extra: [accordionItem] }),
            );
            if (!result.ok) {
                throw new Error(`Forventet vellykket mapping: ${JSON.stringify(result)}`);
            }

            expect(result.data.blocks[0]).toMatchObject({ style: "secondary" });
        });

        it("faller tilbake til primary når feltet mangler", () => {
            const result = mapArticle(withBlock(accordionBlock({}), { extra: [accordionItem] }));
            if (!result.ok) {
                throw new Error(`Forventet vellykket mapping: ${JSON.stringify(result)}`);
            }

            expect(result.data.blocks[0]).toMatchObject({ style: "primary" });
        });

        it("faller tilbake til primary når feltet er null", () => {
            const result = mapArticle(
                withBlock(accordionBlock({ field_accordion_style: null }), { extra: [accordionItem] }),
            );
            if (!result.ok) {
                throw new Error(`Forventet vellykket mapping: ${JSON.stringify(result)}`);
            }

            expect(result.data.blocks[0]).toMatchObject({ style: "primary" });
        });

        it("feiler på ukjent verdi", () => {
            const result = mapArticle(
                withBlock(accordionBlock({ field_accordion_style: "tertiary" }), { extra: [accordionItem] }),
            );

            expect(result).toMatchObject({ ok: false, error: { type: "invalid-contract" } });
        });

        it("mapper valgfri overskrift og heading-nivå", () => {
            const result = mapArticle(
                withBlock(
                    accordionBlock({
                        field_accordion_heading: "Vanlige spørsmål",
                        field_accordion_heading_level: "h3",
                    }),
                    { extra: [accordionItem] },
                ),
            );
            if (!result.ok) {
                throw new Error(`Forventet vellykket mapping: ${JSON.stringify(result)}`);
            }

            expect(result.data.blocks[0]).toMatchObject({
                heading: { text: "Vanlige spørsmål", level: "3" },
            });
        });

        it("bruker H2 som standard og utelater tom overskrift", () => {
            const withHeading = mapArticle(
                withBlock(accordionBlock({ field_accordion_heading: "Standardnivå" }), { extra: [accordionItem] }),
            );
            const withoutHeading = mapArticle(
                withBlock(
                    accordionBlock({
                        field_accordion_heading: "   ",
                        field_accordion_heading_level: "h4",
                    }),
                    { extra: [accordionItem] },
                ),
            );

            expect(withHeading).toMatchObject({
                ok: true,
                data: { blocks: [{ heading: { text: "Standardnivå", level: "2" } }] },
            });
            if (!withoutHeading.ok) {
                throw new Error(`Forventet vellykket mapping: ${JSON.stringify(withoutHeading)}`);
            }
            expect(withoutHeading.data.blocks[0]).not.toHaveProperty("heading");
        });

        it("feiler på ukjent heading-nivå", () => {
            const result = mapArticle(
                withBlock(
                    accordionBlock({
                        field_accordion_heading: "Vanlige spørsmål",
                        field_accordion_heading_level: "h5",
                    }),
                    { extra: [accordionItem] },
                ),
            );

            expect(result).toMatchObject({ ok: false, error: { type: "invalid-contract" } });
        });
    });

    describe("field_tti_image", () => {
        const mediaImage: JsonApiResource = {
            type: "media--image",
            id: "22222222-2222-4222-8222-222222222222",
            attributes: {},
            relationships: {
                field_media_image: {
                    data: {
                        type: "file--file",
                        id: "33333333-3333-4333-8333-333333333333",
                        meta: { alt: "Alt-tekst", width: 800, height: 600 },
                    },
                },
            },
        };
        const file: JsonApiResource = {
            type: "file--file",
            id: "33333333-3333-4333-8333-333333333333",
            attributes: { uri: { url: "https://cms.staging.karriereveiledning.no/sites/default/files/bilde.jpg" } },
        };

        function titleTextImageBlock() {
            return paragraph(
                "paragraph--title_text_image",
                { field_tti_title: "Karriereveiledning.no" },
                { field_tti_image: { data: { type: "media--image", id: mediaImage.id } } },
            ) satisfies JsonApiResource;
        }

        it("mapper bildet når hele kjeden er gyldig", () => {
            const result = mapArticle(withBlock(titleTextImageBlock(), { extra: [mediaImage, file] }));
            if (!result.ok) {
                throw new Error(`Forventet vellykket mapping: ${JSON.stringify(result)}`);
            }

            expect(result.data.blocks[0]).toMatchObject({
                type: "title-text-image",
                image: {
                    src: "https://cms.staging.karriereveiledning.no/sites/default/files/bilde.jpg",
                    alt: "Alt-tekst",
                    width: 800,
                    height: 600,
                },
            });
        });

        it("gjør en relativ fil-URL absolutt mot CMS-origin", () => {
            const relativeFile: JsonApiResource = {
                ...file,
                attributes: { uri: { url: "/sites/default/files/2026-03/sarah.png" } },
            };
            const result = mapArticle(
                withBlock(titleTextImageBlock(), { extra: [mediaImage, relativeFile] }),
                "https://cms.staging.karriereveiledning.no",
            );
            if (!result.ok) {
                throw new Error(`Forventet vellykket mapping: ${JSON.stringify(result)}`);
            }

            expect(result.data.blocks[0]).toMatchObject({
                image: { src: "https://cms.staging.karriereveiledning.no/sites/default/files/2026-03/sarah.png" },
            });
        });

        it("tillater tom alt-tekst for dekorative bilder", () => {
            const decorativeMedia: JsonApiResource = {
                ...mediaImage,
                relationships: {
                    field_media_image: {
                        data: { type: "file--file", id: file.id, meta: { width: 800, height: 600 } },
                    },
                },
            };
            const result = mapArticle(withBlock(titleTextImageBlock(), { extra: [decorativeMedia, file] }));
            if (!result.ok) {
                throw new Error(`Forventet vellykket mapping: ${JSON.stringify(result)}`);
            }

            expect(result.data.blocks[0]).toMatchObject({ image: { alt: "" } });
        });

        it("gir ingen bilde-felt når field_tti_image mangler", () => {
            const result = mapArticle(
                withBlock(paragraph("paragraph--title_text_image", { field_tti_title: "Uten bilde" })),
            );
            if (!result.ok) {
                throw new Error(`Forventet vellykket mapping: ${JSON.stringify(result)}`);
            }

            expect((result.data.blocks[0] as { image?: unknown }).image).toBeUndefined();
        });

        it("feiler når field_tti_image er en flerverdirelasjon", () => {
            const block = paragraph(
                "paragraph--title_text_image",
                { field_tti_title: "Flere bilder" },
                {
                    field_tti_image: {
                        data: [
                            { type: "media--image", id: mediaImage.id },
                            { type: "media--image", id: "44444444-4444-4444-8444-444444444444" },
                        ],
                    },
                },
            );

            expect(mapArticle(withBlock(block, { extra: [mediaImage, file] }))).toMatchObject({
                ok: false,
                error: { type: "invalid-contract" },
            });
        });

        it("feiler når field_media_image mangler på media--image", () => {
            const mediaWithoutFile: JsonApiResource = { ...mediaImage, relationships: {} };
            const result = mapArticle(withBlock(titleTextImageBlock(), { extra: [mediaWithoutFile] }));

            expect(result).toMatchObject({ ok: false, error: { type: "invalid-contract" } });
        });

        it("feiler når meta mangler bredde eller høyde", () => {
            const mediaWithoutDimensions: JsonApiResource = {
                ...mediaImage,
                relationships: {
                    field_media_image: { data: { type: "file--file", id: file.id, meta: { alt: "Alt-tekst" } } },
                },
            };
            const result = mapArticle(withBlock(titleTextImageBlock(), { extra: [mediaWithoutDimensions, file] }));

            expect(result).toMatchObject({ ok: false, error: { type: "invalid-contract" } });
        });

        it("feiler på relativ fil-URL når CMS-origin ikke er kjent", () => {
            const relativeFile: JsonApiResource = {
                ...file,
                attributes: { uri: { url: "/sites/default/files/2026-03/sarah.png" } },
            };
            const result = mapArticle(withBlock(titleTextImageBlock(), { extra: [mediaImage, relativeFile] }));

            expect(result).toMatchObject({ ok: false, error: { type: "invalid-contract" } });
        });

        it("feiler når bilde-URL-en ikke er https", () => {
            const unsafeFile: JsonApiResource = {
                ...file,
                attributes: { uri: { url: "javascript:alert(1)" } },
            };
            const result = mapArticle(withBlock(titleTextImageBlock(), { extra: [mediaImage, unsafeFile] }));

            expect(result).toMatchObject({ ok: false, error: { type: "invalid-contract" } });
        });
    });

    it("feiler når en refert video mangler i included", () => {
        const video = paragraph(
            "paragraph--video",
            {},
            {
                field_video_media: {
                    data: { type: "media--remote_video", id: "22222222-2222-4222-8222-222222222222" },
                },
            },
        );

        expect(mapArticle(withBlock(video))).toMatchObject({
            ok: false,
            error: { type: "invalid-contract" },
        });
    });

    it("hopper over blokker som er skjult", () => {
        const result = mapArticle(
            withBlock(
                paragraph("paragraph--lpp_html", { field_hide_block: true, field_lpp_html_content: { value: "x" } }),
            ),
        );

        expect(result).toMatchObject({ ok: true, data: { blocks: [] } });
    });

    it("mapper heading-nivå for tip heading", () => {
        const result = mapArticle(
            withBlock(
                paragraph("paragraph--tip_heading", {
                    field_tip_heading_text: "Forbered deg",
                    field_tip_heading_level: "h3",
                }),
            ),
        );

        expect(result).toMatchObject({
            ok: true,
            data: { blocks: [{ type: "heading", text: "Forbered deg", level: "3" }] },
        });
    });

    it("feiler på ukjent heading-nivå for tip heading og title, text & image", () => {
        const tipResult = mapArticle(
            withBlock(
                paragraph("paragraph--tip_heading", {
                    field_tip_heading_text: "Forbered deg",
                    field_tip_heading_level: "h1",
                }),
            ),
        );
        const titleTextImageResult = mapArticle(
            withBlock(
                paragraph("paragraph--title_text_image", {
                    field_tti_title: "Tittel",
                    field_tti_heading_level: "h5",
                }),
            ),
        );

        expect(tipResult).toMatchObject({ ok: false, error: { type: "invalid-contract" } });
        expect(titleTextImageResult).toMatchObject({ ok: false, error: { type: "invalid-contract" } });
    });

    it("hopper over en ukjent synlig Paragraph-type", () => {
        const result = mapArticle(withBlock(paragraph("paragraph--ukjent", {})));

        expect(result).toMatchObject({ ok: true, data: { blocks: [] } });
    });

    it("saniterer HTML i brødtekst og lager ren tekst av ingress", () => {
        const result = mapArticle(
            withBlock(
                paragraph("paragraph--lpp_html", {
                    field_lpp_html_content: {
                        value: '<p onclick="x()">Hei<script>alert(1)</script><a href="javascript:alert(1)">a</a></p>',
                    },
                }),
            ),
        );
        if (!result.ok) {
            throw new Error("Forventet vellykket mapping");
        }

        const html = result.data.blocks[0]?.type === "rich-text" ? result.data.blocks[0].html : "";
        expect(html).not.toMatch(/script|onclick|javascript:/);
        expect(result.data.intro).toBe("Ingress & mer");
    });

    it.each([
        "javascript:alert(1)",
        "data:text/html,hei",
        "//evil.example/path",
        "http://example.com",
        "https://user:pass@example.com",
    ])("avviser usikker lenke %s", (uri) => {
        const result = mapArticle(
            withBlock(
                paragraph("paragraph--title_text_image", { field_tti_title: "T", field_tti_link: { uri, title: "L" } }),
            ),
        );

        expect(result).toMatchObject({ ok: false, error: { type: "invalid-contract" } });
    });

    it.each([
        "https://vimeo.com.evil.example/123",
        "https://example.com/video/123",
        "http://player.vimeo.com/video/123",
        "https://player.vimeo.com/video/abc",
    ])("hopper over Vimeo-lookalike eller ukjent leverandør %s", (url) => {
        const media: JsonApiResource = {
            type: "media--remote_video",
            id: "22222222-2222-4222-8222-222222222222",
            attributes: { name: "Video", field_media_oembed_video: url },
        };
        const video = paragraph(
            "paragraph--video",
            {},
            {
                field_video_media: { data: { type: media.type, id: media.id } },
            },
        );

        expect(mapArticle(withBlock(video, { extra: [media] }))).toMatchObject({ ok: true, data: { blocks: [] } });
    });

    describe("video-thumbnail", () => {
        function videoBlockWithMedia(mediaRelationships?: JsonApiResource["relationships"]) {
            const media: JsonApiResource = {
                type: "media--remote_video",
                id: "22222222-2222-4222-8222-222222222222",
                attributes: { name: "Video", field_media_oembed_video: "https://vimeo.com/123456789" },
                relationships: mediaRelationships,
            };
            const video = paragraph(
                "paragraph--video",
                {},
                { field_video_media: { data: { type: media.type, id: media.id } } },
            );
            return { video, media };
        }

        it("mapper thumbnailSrc når thumbnail-relasjonen finnes", () => {
            const file: JsonApiResource = {
                type: "file--file",
                id: "33333333-3333-4333-8333-333333333333",
                attributes: {
                    uri: { url: "https://cms.staging.karriereveiledning.no/sites/default/files/thumb.jpg" },
                },
            };
            const { video, media } = videoBlockWithMedia({ thumbnail: { data: { type: file.type, id: file.id } } });

            const result = mapArticle(withBlock(video, { extra: [media, file] }));
            if (!result.ok) {
                throw new Error(`Forventet vellykket mapping: ${JSON.stringify(result)}`);
            }

            expect(result.data.blocks[0]).toMatchObject({
                type: "video",
                thumbnailSrc: "https://cms.staging.karriereveiledning.no/sites/default/files/thumb.jpg",
            });
        });

        it("gjør en relativ thumbnail-URL absolutt mot CMS-origin", () => {
            const file: JsonApiResource = {
                type: "file--file",
                id: "33333333-3333-4333-8333-333333333333",
                attributes: { uri: { url: "/sites/default/files/oembed_thumbnails/thumb.jpg" } },
            };
            const { video, media } = videoBlockWithMedia({ thumbnail: { data: { type: file.type, id: file.id } } });

            const result = mapArticle(
                withBlock(video, { extra: [media, file] }),
                "https://cms.staging.karriereveiledning.no",
            );
            if (!result.ok) {
                throw new Error(`Forventet vellykket mapping: ${JSON.stringify(result)}`);
            }

            expect(result.data.blocks[0]).toMatchObject({
                thumbnailSrc:
                    "https://cms.staging.karriereveiledning.no/sites/default/files/oembed_thumbnails/thumb.jpg",
            });
        });

        it("gir ingen thumbnailSrc når thumbnail-relasjonen mangler", () => {
            const { video, media } = videoBlockWithMedia();

            const result = mapArticle(withBlock(video, { extra: [media] }));
            if (!result.ok) {
                throw new Error(`Forventet vellykket mapping: ${JSON.stringify(result)}`);
            }

            expect((result.data.blocks[0] as { thumbnailSrc?: unknown }).thumbnailSrc).toBeUndefined();
        });

        it("gir ingen thumbnailSrc, men feiler ikke, når fil-ressursen mangler i included", () => {
            const { video, media } = videoBlockWithMedia({
                thumbnail: { data: { type: "file--file", id: "99999999-9999-4999-8999-999999999999" } },
            });

            const result = mapArticle(withBlock(video, { extra: [media] }));
            if (!result.ok) {
                throw new Error(
                    `Forventet vellykket mapping selv om thumbnail-filen mangler: ${JSON.stringify(result)}`,
                );
            }

            expect((result.data.blocks[0] as { thumbnailSrc?: unknown }).thumbnailSrc).toBeUndefined();
        });
    });

    describe("videooverskrift", () => {
        const media: JsonApiResource = {
            type: "media--remote_video",
            id: "22222222-2222-4222-8222-222222222222",
            attributes: {
                name: "Video",
                field_media_oembed_video: "https://vimeo.com/123456789",
            },
        };

        function videoBlock(attributes: Record<string, unknown>) {
            return paragraph("paragraph--video", attributes, {
                field_video_media: { data: { type: media.type, id: media.id } },
            });
        }

        it("mapper valgfri overskrift og heading-nivå", () => {
            const result = mapArticle(
                withBlock(
                    videoBlock({
                        field_video_heading: "Se hvordan du søker",
                        field_video_heading_level: "h4",
                    }),
                    { extra: [media] },
                ),
            );

            expect(result).toMatchObject({
                ok: true,
                data: { blocks: [{ heading: { text: "Se hvordan du søker", level: "4" } }] },
            });
        });

        it("bruker H2 som standard og utelater tom overskrift", () => {
            const withHeading = mapArticle(
                withBlock(videoBlock({ field_video_heading: "Standardnivå" }), { extra: [media] }),
            );
            const withoutHeading = mapArticle(
                withBlock(
                    videoBlock({
                        field_video_heading: "",
                        field_video_heading_level: "h3",
                    }),
                    { extra: [media] },
                ),
            );

            expect(withHeading).toMatchObject({
                ok: true,
                data: { blocks: [{ heading: { text: "Standardnivå", level: "2" } }] },
            });
            if (!withoutHeading.ok) {
                throw new Error(`Forventet vellykket mapping: ${JSON.stringify(withoutHeading)}`);
            }
            expect(withoutHeading.data.blocks[0]).not.toHaveProperty("heading");
        });

        it("feiler på ukjent heading-nivå", () => {
            const result = mapArticle(
                withBlock(
                    videoBlock({
                        field_video_heading: "Video",
                        field_video_heading_level: "h6",
                    }),
                    { extra: [media] },
                ),
            );

            expect(result).toMatchObject({ ok: false, error: { type: "invalid-contract" } });
        });
    });

    it("feiler på ugyldig toppressurs og duplikate ressurser", () => {
        const document = withBlock(paragraph("paragraph--spacer", {}));

        expect(mapArticle({ ...document, data: { ...document.data, type: "node--annet" } }).ok).toBe(false);
        expect(mapArticle({ ...document, included: [...document.included, ...document.included] }).ok).toBe(false);
    });
});
