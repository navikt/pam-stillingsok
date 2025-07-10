"use client";

import Image from "next/image";
import { BodyLong, Box, Heading, HGrid, Link as AkselLink } from "@navikt/ds-react";
import { ArrowRightIcon } from "@navikt/aksel-icons";
import { umamiTracking } from "@/app/_common/umami/umamiTracking";
import jobseekerImg from "@images/tired-jobseeker.jpg";
import { FORSIDE_KLIKK_KARRIEREVEILEDNING } from "@/app/_common/umami/constants";

function KarriereveiledningPanel() {
    return (
        <AkselLink
            href="https://karriereveiledning.no/karrierevalg/verktoy-soke-jobb"
            className="box-link"
            rel="external"
            onClick={() => {
                umamiTracking(FORSIDE_KLIKK_KARRIEREVEILEDNING);
            }}
        >
            <Box background="surface-alt-2-subtle" padding={{ xs: "6", lg: "12" }} borderRadius="medium">
                <HGrid gap={{ xs: "6", lg: "12" }} columns={{ xs: "1", md: "1fr 1fr", lg: "1fr 504px" }} align="center">
                    <div>
                        <Heading spacing level="2" size="large">
                            Trenger du hjelp til å søke jobb?
                        </Heading>
                        <BodyLong size="large" className="mb-1">
                            På Karriereveiledning.no finner du verktøy for å søke jobb, og du kan få gratis veiledning
                            på chat, telefon og e-post.
                        </BodyLong>
                        <ArrowRightIcon aria-hidden="true" fontSize="2rem" />
                    </div>
                    <Image
                        className="box-link-image"
                        src={jobseekerImg}
                        height={316}
                        width={504}
                        alt="En person som søker jobb."
                        quality={90}
                    />
                </HGrid>
            </Box>
        </AkselLink>
    );
}
export default KarriereveiledningPanel;
