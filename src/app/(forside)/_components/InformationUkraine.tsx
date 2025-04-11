import { Box, BodyLong, Heading, Link as AkselLink, Bleed } from "@navikt/ds-react";
import Link from "next/link";
import UkrainianFlag from "@/app/(forside)/_components/UkrainianFlag";

export default function InformationUkraine() {
    return (
        <Bleed marginInline="full" className="overflow-x-hidden">
            <Box background="surface-alt-3-moderate" paddingBlock={{ xs: "6", md: "8" }}>
                <section className="container-large ukraine">
                    <Heading spacing level="2" size="large" lang="uk">
                        Інформація про роботу в Норвегії для українських біженців
                    </Heading>
                    <ul
                        className="ukraine-grid mb-6"
                        aria-label="Liste med lenker til informasjonssider for Ukrainske flyktninger"
                    >
                        <li>
                            <BodyLong lang="en">
                                <AkselLink as={Link} locale="en" href="/en/work-in-norway">
                                    Information about working in Norway
                                </AkselLink>
                            </BodyLong>
                        </li>
                        <li>
                            <BodyLong lang="uk">
                                <AkselLink as={Link} locale="uk" href="/uk/work-in-norway">
                                    Інформація українською мовою
                                </AkselLink>
                            </BodyLong>
                        </li>
                        <li>
                            <BodyLong lang="ru">
                                <AkselLink as={Link} locale="ru" href="/ru/work-in-norway">
                                    Информация на русском языке
                                </AkselLink>
                            </BodyLong>
                        </li>
                    </ul>
                    <UkrainianFlag />
                </section>
            </Box>
        </Bleed>
    );
}
