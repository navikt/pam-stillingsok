import { describe, expect, it } from "vitest";
import type { JsonApiDocument, JsonApiResource } from "@/features/ung/onboarding/server/jsonApiTypes";
import { mapArticle, mapArticleCollection } from "@/features/ung/onboarding/server/live/liveSharedContentAdapter";
import {
    safeParseSharedContentCollection,
    safeParseSharedContentDocument,
} from "@/features/ung/onboarding/server/sharedContentSchemas";
import collectionFixture from "../../../../../../docs/Enklere_vei_til_jobb/json_eksempler/collection.json";
import onItsOwnFixture from "../../../../../../docs/Enklere_vei_til_jobb/json_eksempler/on_its_own.json";

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
    it("parser samlingen med fire artikler i API-rekkefølge og meta.omitted", () => {
        const collection = getCollection();

        expect(collection.data.map((resource) => resource.attributes.title)).toEqual([
            "Hvordan finner jeg flere relevante jobber?",
            "Få hjelp og støtte",
            "Forbered deg til jobbintervjuet",
            "Staging: Slik kommer du i gang med jobbsøkingen",
        ]);
        expect(Object.keys(collection.meta?.omitted?.links ?? {})).toHaveLength(3);
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
        const result = mapArticleCollection(getCollection(), { answerIds: ["age-under-18", "goal-find-job"] });
        if (!result.ok) {
            throw new Error("Forventet vellykket mapping");
        }

        expect(result.data.map((article) => article.id)).toEqual([ON_ITS_OWN_ID]);
        expect(result.data[0]?.href).toBe(
            `/ung/enklere-vei-til-jobb/artikkel/${ON_ITS_OWN_ID}?v=1&svar=age-under-18&svar=goal-find-job`,
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
        });
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
