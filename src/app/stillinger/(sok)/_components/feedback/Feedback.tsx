import { ThumbDownIcon, ThumbUpIcon } from "@navikt/aksel-icons";
import { BodyLong, Box, Button, Heading, HStack } from "@navikt/ds-react";
import { useState } from "react";
import SkyraSurvey from "@/app/_common/skyra/SkyraSurvey";
import { track } from "@/app/_common/umami";
import { RELEVANTE_SOKETREFF } from "@/app/_common/umami/constants";
import { logSearch } from "@/app/stillinger/_common/monitoring/search-logging";
import useQuery from "@/app/stillinger/(sok)/_components/QueryProvider";
import { parseSearchParams } from "@/app/stillinger/(sok)/_utils/parseSearchParams";
import { trackMetricsClient } from "@/features/metrics/trackMetricsClient";

export default function Feedback() {
    const [hasGivenRating, setHasGiverRating] = useState<boolean>(false);
    const query = useQuery();

    const onRatingClick = (text: string): void => {
        try {
            logSearch(text, parseSearchParams(query.urlSearchParams));
        } catch {
            // ignore
        }
        setHasGiverRating(true);
    };

    return (
        <div>
            <Box
                padding="space-16"
                borderRadius="8"
                className="text-center bg-brand-blue-subtle mb-4"
                id="feedback-panel"
            >
                <Heading level="2" id="feedback-panel-title" size="small" className="mb-2">
                    Var søketreffene relevante?
                </Heading>
                {!hasGivenRating ? (
                    <HStack justify="center" gap="space-6">
                        <Button
                            variant="tertiary-neutral"
                            aria-describedby="feedback-panel-title"
                            icon={<ThumbUpIcon aria-hidden="true" fontSize="1.5rem" />}
                            onClick={() => {
                                onRatingClick("Ja");
                                trackMetricsClient("Vurdering - Sokeresultat", { value: "Ja" });
                                track(RELEVANTE_SOKETREFF, {
                                    value: "Ja",
                                });
                            }}
                        >
                            Ja
                        </Button>
                        <Button
                            variant="tertiary-neutral"
                            aria-describedby="feedback-panel-title"
                            icon={<ThumbDownIcon aria-hidden="true" fontSize="1.5rem" />}
                            onClick={() => {
                                onRatingClick("Nei");
                                trackMetricsClient("Vurdering - Sokeresultat", { value: "Nei" });
                                track(RELEVANTE_SOKETREFF, {
                                    value: "Nei",
                                });
                            }}
                        >
                            Nei
                        </Button>
                    </HStack>
                ) : (
                    <BodyLong>Takk for din stemme!</BodyLong>
                )}
            </Box>
            <div className="text-center">
                <BodyLong className="mb-2">Har du tilbakemeldinger eller noe du savner?</BodyLong>
                <SkyraSurvey
                    buttonText="Skriv en kort tilbakemelding"
                    skyraSlug="arbeids-og-velferdsetaten-nav/test-arbeidsplassen-dev"
                />
            </div>
        </div>
    );
}
