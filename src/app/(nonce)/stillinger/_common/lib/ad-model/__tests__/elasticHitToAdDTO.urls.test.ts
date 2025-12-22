import { baseHit } from "@/app/(nonce)/stillinger/_common/lib/ad-model/__tests__/__fixtures__/elasticHit.fixture";
import { unwrapOk } from "@/app/(nonce)/stillinger/_common/lib/ad-model/core/result-utils";
import { elasticHitToAdDTOResult } from "@/app/(nonce)/stillinger/_common/lib/ad-model";

it.each([
    ["dalen-fjell.no", "https://dalen-fjell.no/"],
    ["http://dalen-fjell.no", "http://dalen-fjell.no/"],
    ["https://dalen-fjell.no", "https://dalen-fjell.no/"],
    ["www.dalen-fjell.no/", "https://www.dalen-fjell.no/"],
    ["javascript:alert(1)", null],
])("normaliserer employerhomepage '%s' → '%s'", (input, expected) => {
    const hit = structuredClone(baseHit);
    hit._source!.properties!.employerhomepage = input;
    const adDTO = unwrapOk(elasticHitToAdDTOResult(hit));
    expect(adDTO.employer.homepage).toBe(expected);
});
