import Image from "next/image";
import { BodyLong, Box, Heading, HGrid, Link as AkselLink } from "@navikt/ds-react";
import { ArrowRightIcon } from "@navikt/aksel-icons";

function KarriereveiledningPanel() {
    return (
        <AkselLink
            href="https://karriereveiledning.no/karrierevalg/verktoy-soke-jobb"
            className="box-link"
            rel="external"
            //TODO: REWRITE UMAMI HANDLING
            data-umami-event="Min side klikk karriereveiledning"
        >
            <Box background="surface-alt-3-subtle" padding={{ xs: "6", lg: "6" }} borderRadius="medium">
                <HGrid gap={{ xs: "6", lg: "6" }} columns={{ xs: "1", md: "1fr 1fr", lg: "1fr 344px" }} align="center">
                    <div>
                        <Heading spacing level="2" size="medium">
                            Vet du ikke hva du vil jobbe med?
                        </Heading>
                        <BodyLong size="medium" className="mb-1">
                            På Karriereveiledning.no finner du tips og verktøy. Du kan også få gratis veiledning på
                            chat, telefon og e-post.
                        </BodyLong>
                        <ArrowRightIcon aria-hidden="true" fontSize="2rem" />
                    </div>
                    <Image
                        className="box-link-image"
                        height={216}
                        width={344}
                        src="/images/confused-youth.png"
                        alt="En person som holder et kart i hånda, og klør seg i hodet."
                        quality={90}
                    />
                </HGrid>
            </Box>
        </AkselLink>
    );
}
export default KarriereveiledningPanel;
