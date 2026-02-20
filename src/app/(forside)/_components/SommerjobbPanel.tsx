import Image from "next/image";
import { BodyLong, Box, Heading, HGrid } from "@navikt/ds-react";
import { ArrowRightIcon } from "@navikt/aksel-icons";
import streetImg from "@images/a-street-in-town.jpg";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";

function SommerjobbPanel() {
    return (
        <AkselNextLink href="/sommerjobb" className="box-link">
            <Box className="bg-brand-green-moderate" padding={{ xs: "space-24", lg: "space-48" }} borderRadius="12">
                <HGrid
                    gap={{ xs: "space-24", lg: "space-48" }}
                    columns={{ xs: "1", md: "1fr 1fr", lg: "504px 1fr" }}
                    align="center"
                >
                    <Image
                        className="box-link-image"
                        src={streetImg}
                        width={504}
                        height={316}
                        alt="Sommeridyll"
                        unoptimized
                        quality={75}
                    />
                    <div>
                        <Heading spacing level="2" size="large">
                            Sommerjobben {new Date().getFullYear()}
                        </Heading>
                        <BodyLong size="large" className="mb-1">
                            Kafé i Lofoten, butikk i Tromsø eller utendørs jobb i Oslo? Sikre sommereventyret i dag!
                        </BodyLong>
                        <ArrowRightIcon aria-hidden="true" fontSize="2rem" />
                    </div>
                </HGrid>
            </Box>
        </AkselNextLink>
    );
}
export default SommerjobbPanel;
