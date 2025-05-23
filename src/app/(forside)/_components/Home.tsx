import { BodyLong, Button, Heading, HStack, Show } from "@navikt/ds-react";
import { FiguresSideBySide } from "@navikt/arbeidsplassen-react";
import { MagnifyingGlassIcon, ParasolBeachIcon } from "@navikt/aksel-icons";
import SommerjobbPanel from "@/app/(forside)/_components/SommerjobbPanel";
import InformationUkraine from "@/app/(forside)/_components/InformationUkraine";
import Link from "next/link";
import KarriereveiledningPanel from "./Karriereveiledning";

export default function Home() {
    return (
        <div className="container-large mt-5 mb-24">
            <HStack gap="20" align="center">
                <div className="flex-3">
                    <Heading size="xlarge" level="1" spacing className="jumbo-h1">
                        Alle ledige jobber, <br />
                        samlet på én plass
                    </Heading>
                    <BodyLong size="large" spacing>
                        Lete etter jobb skal være enkelt. Fra deltid til direktør, finn jobben som passer for deg.
                    </BodyLong>

                    <HStack gap="4" className="mb-16">
                        <Button
                            variant="primary"
                            as={Link}
                            href="/stillinger"
                            role="link"
                            icon={<MagnifyingGlassIcon aria-hidden="true" />}
                        >
                            Søk etter jobber
                        </Button>
                        <Button
                            variant="secondary"
                            as={Link}
                            href="/sommerjobb"
                            role="link"
                            icon={<ParasolBeachIcon aria-hidden="true" />}
                        >
                            Sommerjobben 2025
                        </Button>
                    </HStack>
                </div>

                <Show above="lg">
                    <FiguresSideBySide />
                </Show>
            </HStack>

            <div className="mb-12">
                <SommerjobbPanel />
            </div>

            <div className="mb-12" data-nosnippet="true">
                <KarriereveiledningPanel />
            </div>

            <div className="mb-12">
                <InformationUkraine />
            </div>
        </div>
    );
}
