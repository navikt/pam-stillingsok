import { describe, expect, it } from "vitest";
import { mapArticle, mapArticleCollection } from "@/features/ung/onboarding/server/drupal/articleMapper.server";
import {
    type JsonApiDocument,
    type JsonApiResource,
    safeParseSharedContentCollection,
    safeParseSharedContentDocument,
} from "@/features/ung/onboarding/server/drupal/jsonApi";
import collectionFixture from "./__fixtures__/collection.json";
import onItsOwnFixture from "./__fixtures__/on_its_own.json";

const STAGING_ARTICLE_ID = "8eb7f9d6-361c-4ac0-92c6-b272374e84d5";
const ON_ITS_OWN_ID = "cf446cee-9e2e-46cd-9e1b-09dc4cb1abbb";
const WEBFORM_ID = "fcb6a11e-5b6a-400a-a4dd-69bfc36b1f69";

function getCollection() {
    const parsed = safeParseSharedContentCollection(collectionFixture);
    if (!parsed.ok) {
        throw new Error("Collection-fixturen følger ikke kontrakten");
    }
    return parsed.data;
}

function getOnItsOwnDocument(): JsonApiDocument {
    const parsed = safeParseSharedContentDocument(onItsOwnFixture);
    if (!parsed.ok) {
        throw new Error("on_its_own-fixturen følger ikke kontrakten");
    }
    return parsed.data;
}

function getStagingArticleDocument(): JsonApiDocument {
    const collection = getCollection();
    const data = collection.data.find((resource) => resource.id === STAGING_ARTICLE_ID);
    if (!data) {
        throw new Error("Fant ikke staging-artikkelen");
    }
    return { data, included: collection.included };
}

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

describe("kontrakt-parsing av sanerte fixtures", () => {
    it("parser samlingen med fire artikler i API-rekkefølge", () => {
        const collection = getCollection();

        expect(collection.data.map((resource) => resource.attributes.title)).toEqual([
            "Hvordan finner jeg flere relevante jobber?",
            "Få hjelp og støtte",
            "Forbered deg til jobbintervjuet",
            "Staging: Slik kommer du i gang med jobbsøkingen",
        ]);
        expect(JSON.stringify(collectionFixture)).not.toContain("api-key=");
    });

    it("parser enkeltartikkelen", () => {
        expect(getOnItsOwnDocument().data.id).toBe(ON_ITS_OWN_ID);
        expect(JSON.stringify(onItsOwnFixture)).not.toContain("api-key=");
    });
});

describe("mapArticleCollection", () => {
    it("normaliserer artiklene til sammendrag med lokal href og bevart selection", () => {
        const result = mapArticleCollection(getCollection(), { answerIds: [] });
        if (!result.ok) {
            throw new Error("Forventet vellykket mapping");
        }

        expect(result.data).toHaveLength(4);
        expect(result.data[0]).toMatchObject({
            id: ON_ITS_OWN_ID,
            title: "Hvordan finner jeg flere relevante jobber?",
            href: `/ung/enklere-vei-til-jobb/artikkel/${ON_ITS_OWN_ID}?v=1`,
            metadata: {
                ageTermIds: ["7d074491-7231-4c1c-aef3-bdd917776198"],
                experienceTermIds: ["a2dc822c-1eea-4201-bf2e-bcd61077ca05"],
                audienceTermIds: ["03c6bc26-0b80-42c0-95aa-d001c6e9c5e2"],
            },
        });
        expect(result.data[0]?.description).not.toMatch(/<|&nbsp;/);
    });

    it("bevarer valgene i artikkellenka", () => {
        const result = mapArticleCollection(getCollection(), { answerIds: ["age-18-or-older", "goal-find-job"] });
        if (!result.ok) {
            throw new Error("Forventet vellykket mapping");
        }

        expect(result.data.map((article) => article.id)).toEqual([ON_ITS_OWN_ID]);
        expect(result.data[0]?.href).toBe(
            `/ung/enklere-vei-til-jobb/artikkel/${ON_ITS_OWN_ID}?v=1&svar=age-18-or-older&svar=goal-find-job`,
        );
    });

    it("feiler ved uventet ressurstype i samlingen", () => {
        const collection = getCollection();
        const result = mapArticleCollection(
            { ...collection, data: [{ type: "node--page", id: ON_ITS_OWN_ID, attributes: {} }] },
            { answerIds: [] },
        );

        expect(result).toMatchObject({ ok: false, error: { type: "invalid-contract" } });
    });
});

describe("mapArticle", () => {
    it("mapper detaljartikkelen med accordion og Vimeo i relasjonsrekkefølge og returnerer webformId", () => {
        const result = mapArticle(getOnItsOwnDocument());
        if (!result.ok) {
            throw new Error(`Forventet vellykket mapping: ${JSON.stringify(result)}`);
        }

        expect(result.data.webformId).toBe(WEBFORM_ID);
        expect(result.data.blocks.map((block) => block.type)).toEqual(["accordion", "video"]);
        expect(result.data.blocks[1]).toMatchObject({
            type: "video",
            provider: "vimeo",
            href: "https://player.vimeo.com/video/1180806925?",
        });
        const accordion = result.data.blocks[0];
        expect(accordion?.type === "accordion" && accordion.items).toHaveLength(1);
    });

    it("mapper menneskelesbare metadata-navn og teller termer uten tilgang", () => {
        const result = mapArticle(getOnItsOwnDocument());
        if (!result.ok) {
            throw new Error(`Forventet vellykket mapping: ${JSON.stringify(result)}`);
        }

        expect(result.data.metadataNames).toEqual({
            owner: "Arbeidsplassen.no",
            availableTo: ["Arbeidsplassen.no"],
            audiences: [],
            age: [],
            experience: [],
            omittedCount: 3,
        });
    });

    describe("field_tti_layout og field_tti_style", () => {
        it("mapper img_left og coloured_box", () => {
            const result = mapArticle(
                withBlock(
                    paragraph("paragraph--title_text_image", {
                        field_tti_title: "Tilpass søknaden",
                        field_tti_layout: "img_left",
                        field_tti_style: "coloured_box",
                    }),
                ),
            );
            if (!result.ok) {
                throw new Error(`Forventet vellykket mapping: ${JSON.stringify(result)}`);
            }

            expect(result.data.blocks[0]).toMatchObject({ layout: "left", style: "coloured-box" });
        });

        it("faller tilbake til høyre og simpel når feltene mangler", () => {
            const result = mapArticle(
                withBlock(paragraph("paragraph--title_text_image", { field_tti_title: "Standard" })),
            );
            if (!result.ok) {
                throw new Error(`Forventet vellykket mapping: ${JSON.stringify(result)}`);
            }

            expect(result.data.blocks[0]).toMatchObject({ layout: "right", style: "simple" });
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

    it("mapper lpp_html, tip_heading, accordion, spacer og title_text_image med strukturert lenke", () => {
        const result = mapArticle(getStagingArticleDocument());
        if (!result.ok) {
            throw new Error(`Forventet vellykket mapping: ${JSON.stringify(result)}`);
        }

        expect(result.data.blocks.map((block) => block.type)).toEqual([
            "rich-text",
            "heading",
            "accordion",
            "spacer",
            "title-text-image",
        ]);
        expect(result.data.blocks[0]).toMatchObject({ html: expect.stringContaining("<h2>Kom i gang</h2>") });
        expect(result.data.blocks[1]).toMatchObject({ text: "Finn ut hva du kan tilby", number: "1" });
        const accordion = result.data.blocks[2];
        expect(accordion?.type === "accordion" && accordion.items).toHaveLength(2);
        expect(result.data.blocks[4]).toMatchObject({
            title: "Tilpass søknaden til jobben",
            layout: "left",
            style: "coloured-box",
        });
        expect((result.data.blocks[4] as { image?: unknown }).image).toBeUndefined();
        expect(result.data.webformId).toBe(WEBFORM_ID);
    });

    it("bevarer rekkefølgen fra relasjonen selv om included er stokket", () => {
        const document = getStagingArticleDocument();
        const shuffled = { ...document, included: [...document.included].reverse() };

        const result = mapArticle(shuffled);

        expect(result.ok && result.data.blocks.map((block) => block.type)).toEqual([
            "rich-text",
            "heading",
            "accordion",
            "spacer",
            "title-text-image",
        ]);
    });

    it("feiler når en refert video mangler i included", () => {
        const collection = getCollection();
        const data = collection.data[1];
        if (!data) {
            throw new Error("Mangler artikkel");
        }

        expect(mapArticle({ data, included: collection.included })).toMatchObject({
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

    it("feiler på ukjent synlig Paragraph-type", () => {
        const result = mapArticle(withBlock(paragraph("paragraph--ukjent", {})));

        expect(result).toMatchObject({ ok: false, error: { type: "invalid-contract" } });
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
    ])("avviser Vimeo-lookalike eller ukjent leverandør %s", (url) => {
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

        expect(mapArticle(withBlock(video, { extra: [media] }))).toMatchObject({
            ok: false,
            error: { type: "invalid-contract" },
        });
    });

    it("feiler på ugyldig toppressurs og duplikate ressurser", () => {
        const document = getOnItsOwnDocument();

        expect(mapArticle({ ...document, data: { ...document.data, type: "node--annet" } }).ok).toBe(false);
        expect(mapArticle({ ...document, included: [...document.included, ...document.included] }).ok).toBe(false);
    });
});
