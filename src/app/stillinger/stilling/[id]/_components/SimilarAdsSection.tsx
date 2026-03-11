import SimilarAds from "./SimilarAds";
import type { AdDTO } from "@/app/stillinger/_common/lib/ad-model";
import { getSimilarAds } from "@/app/stillinger/stilling/_data/adDataActions";

type SimilarAdsSectionProps = Readonly<{
    adData: AdDTO;
    adId: string;
    explain: boolean;
}>;

export default async function SimilarAdsSection({ adData, adId, explain }: SimilarAdsSectionProps) {
    const searchResult = await getSimilarAds(adData, adId, explain);

    if (!searchResult || searchResult.ads.length === 0) {
        return null;
    }

    return <SimilarAds searchResult={searchResult} />;
}
