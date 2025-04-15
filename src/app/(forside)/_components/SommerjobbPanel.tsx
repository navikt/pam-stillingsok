import { BodyLong, Box, Heading, HGrid } from "@navikt/ds-react";
import { ArrowRightIcon } from "@navikt/aksel-icons";
import Link from "next/link";

function SommerjobbPanel() {
    return (
        <Link href="/sommerjobb" className="box-link">
            <Box background="surface-alt-1" padding={{ xs: "6", lg: "12" }} borderRadius="medium">
                <HGrid gap={{ xs: "6", lg: "12" }} columns={{ xs: "1", md: "1fr 1fr", lg: "504px 1fr" }} align="center">
                    <img
                        className="box-link-image"
                        src="/images/a-street-in-town.jpg"
                        height="316"
                        width="504"
                        alt="Sommeridyll"
                    />
                    <div>
                        <Heading spacing level="2" size="large">
                            Sommerjobben 2025
                        </Heading>
                        <BodyLong size="large" className="mb-1">
                            Kafé i Lofoten, butikk i Tromsø eller utendørs jobb i Oslo? Sikre sommereventyret i dag!
                        </BodyLong>
                        <ArrowRightIcon aria-hidden="true" fontSize="2rem" />
                    </div>
                </HGrid>
            </Box>
        </Link>
    );
}
export default SommerjobbPanel;
