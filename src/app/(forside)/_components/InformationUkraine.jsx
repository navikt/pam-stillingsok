import { BodyLong, Heading, Link as AkselLink, Panel } from "@navikt/ds-react";
import NextLink from "next/link";
import UkrainianFlag from "@/app/(forside)/_components/UkrainianFlag";

export default function InformationUkraine() {
    return (
        <Panel className="container-xlarge ukraine">
            <Heading spacing level="2" size="large" lang="uk">
                Інформація про роботу в Норвегії для українських біженців
            </Heading>
            <ul
                className="ukraine-grid mb-6"
                aria-label="Liste med lenker til informasjonssider for Ukrainske flyktninger"
            >
                <li>
                    <BodyLong lang="en">
                        <AkselLink as={NextLink} locale="en" href="/work-in-norway">
                            Information about working in Norway
                        </AkselLink>
                    </BodyLong>
                </li>
                <li>
                    <BodyLong lang="uk">
                        <AkselLink as={NextLink} locale="uk" href="/work-in-norway">
                            Інформація українською мовою
                        </AkselLink>
                    </BodyLong>
                </li>
                <li>
                    <BodyLong lang="ru">
                        <AkselLink as={NextLink} locale="ru" href="/work-in-norway">
                            Информация на русском языке
                        </AkselLink>
                    </BodyLong>
                </li>
            </ul>
            <UkrainianFlag className="ukraine-flag" ariaHidden="true" />
        </Panel>
    );
}
