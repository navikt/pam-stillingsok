import { baseHit } from "@/app/(nonce)/stillinger/_common/lib/ad-model/__tests__/__fixtures__/elasticHit.fixture";
import { unwrapOk } from "@/app/(nonce)/stillinger/_common/lib/ad-model/core/result-utils";
import { elasticHitToAdDTOResult } from "@/app/(nonce)/stillinger/_common/lib/ad-model";

it("fjerner script og beholder tillatte tags", () => {
    const hit = structuredClone(baseHit);
    hit._source!.properties!.adtext = '<p>Hei</p><script>alert(1)</script><a href="mailto:a@b.no">epost</a>';
    const adDTO = unwrapOk(elasticHitToAdDTOResult(hit));
    expect(adDTO.adTextHtml).toContain("<p>Hei</p>");
    expect(adDTO.adTextHtml).toContain('href="mailto:a@b.no"');
    expect(adDTO.adTextHtml).not.toContain("<script>");
});
