import { BodyLong, BodyShort, Heading, Link as AkselLink } from "@navikt/ds-react";
import { ChevronLeftIcon } from "@navikt/aksel-icons";
import NextLink from "next/link";

export default function VilkarSuperraskSoknad() {
    return (
        <article className="container-small mt-5 mb-24">
            <AkselLink as={NextLink} href="/vilkar-og-retningslinjer" className="mb-8">
                <ChevronLeftIcon aria-hidden="true" />
                <BodyShort>Til Vilkår og retningslinjer</BodyShort>
            </AkselLink>

            <Heading size="xlarge" level="1" spacing>
                Vilkår for bruk av superrask søknad
            </Heading>
            <BodyLong className="mb-12">
                Personopplysninger som du mottar fra jobbsøkere i “superrask søknad” kan kun brukes så lenge formålet er
                å bemanne og rekruttere til en konkret stilling.
            </BodyLong>
            <BodyLong>
                Det er ikke tillatt å bruke mottatte personopplysninger til andre formål, <br />
                slik som å
            </BodyLong>
            <ul className="mb-12">
                <li>
                    <BodyLong>
                        bruke opplysninger i forbindelse med salg eller markedsføring av varer eller tjenester
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>tilby arbeidssøkere stillinger der arbeidssøkeren må betale for å søke </BodyLong>
                </li>
                <li>
                    <BodyLong>tilby personer arbeidstreningsplasser</BodyLong>
                </li>
            </ul>

            <BodyLong className="mb-24">Nav vil følge opp brudd på disse vilkårene hvis det forekommer.</BodyLong>
        </article>
    );
}
