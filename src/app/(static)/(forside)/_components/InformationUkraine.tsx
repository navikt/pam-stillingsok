import { Box, BodyLong, Heading, Bleed } from "@navikt/ds-react";
import UkrainianFlag from "@/app/(static)/(forside)/_components/UkrainianFlag";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";

export default function InformationUkraine() {
    return (
        <Bleed marginInline="full" className="overflow-x-hidden ukraine">
            <Box background="surface-alt-3-moderate" paddingBlock={{ xs: "6", md: "8" }}>
                <Heading spacing level="2" size="large" lang="uk">
                    Інформація про роботу в Норвегії для українських біженців
                </Heading>
                <ul
                    className="ukraine-grid mb-6"
                    aria-label="Liste med lenker til informasjonssider for Ukrainske flyktninger"
                >
                    <li>
                        <BodyLong lang="en">
                            <AkselNextLink href="/en/work-in-norway">Information about working in Norway</AkselNextLink>
                        </BodyLong>
                    </li>
                    <li>
                        <BodyLong lang="uk">
                            <AkselNextLink href="/uk/work-in-norway">Інформація українською мовою</AkselNextLink>
                        </BodyLong>
                    </li>
                    <li>
                        <BodyLong lang="ru">
                            <AkselNextLink href="/ru/work-in-norway">Информация на русском языке</AkselNextLink>
                        </BodyLong>
                    </li>
                </ul>
                <UkrainianFlag />
            </Box>
        </Bleed>
    );
}
