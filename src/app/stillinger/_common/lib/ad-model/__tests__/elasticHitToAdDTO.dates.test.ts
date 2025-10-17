import { baseHit } from "@/app/stillinger/_common/lib/ad-model/__tests__/__fixtures__/elasticHit.fixture";
import { unwrapOk } from "@/app/stillinger/_common/lib/ad-model/core/result-utils";
import { elasticHitToAdDTOResult } from "@/app/stillinger/_common/lib/ad-model";

it("setter applicationDueLabel når dato ikke er ISO", () => {
    const hit = structuredClone(baseHit);
    hit._source!.properties!.applicationdue = "Snarest";
    const adDTO = unwrapOk(elasticHitToAdDTOResult(hit));
    expect(adDTO.application.applicationDueDate).toBeNull();
    expect(adDTO.application.applicationDueLabel).toBe("Snarest");
});
