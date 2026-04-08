import { Box, BodyLong, Heading, Bleed } from "@navikt/ds-react";
import UkrainianFlag from "@/app/(forside)/_components/UkrainianFlag";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";
import { track } from "@/app/_common/umami";

export default function InformationUkraine() {
    return (
        <Bleed marginInline="full" className="overflow-x-hidden ukraine bg-brand-peach-soft">
            <Box paddingBlock={{ xs: "space-24", md: "space-32" }}>
                <Heading spacing level="2" size="large" lang="uk">
                    Інформація про роботу в Норвегії для українських біженців
                </Heading>
                <ul
                    className="ukraine-grid mb-6"
                    aria-label="Liste med lenker til informasjonssider for Ukrainske flyktninger"
                >
                    <li>
                        <BodyLong lang="en">
                            <AkselNextLink
                                href="/en/work-in-norway"
                                onClick={() => {
                                    track("Klikk - Forside flyktningbanner", {
                                        bannerId: "jobb-i-norge-for-ukrainske-flyktninger",
                                        linkId: "english",
                                        linkLabel: "Information about working in Norway",
                                        href: "/en/work-in-norway",
                                        language: "en",
                                        placement: "frontpage-banner",
                                    });
                                }}
                            >
                                Information about working in Norway
                            </AkselNextLink>
                        </BodyLong>
                    </li>
                    <li>
                        <BodyLong lang="uk">
                            <AkselNextLink
                                href="/uk/work-in-norway"
                                onClick={() => {
                                    track("Klikk - Forside flyktningbanner", {
                                        bannerId: "jobb-i-norge-for-ukrainske-flyktninger",
                                        linkId: "ukrainian",
                                        linkLabel: "Інформація українською мовою",
                                        href: "/uk/work-in-norway",
                                        language: "uk",
                                        placement: "frontpage-banner",
                                    });
                                }}
                            >
                                Інформація українською мовою
                            </AkselNextLink>
                        </BodyLong>
                    </li>
                    <li>
                        <BodyLong lang="ru">
                            <AkselNextLink
                                href="/ru/work-in-norway"
                                onClick={() => {
                                    track("Klikk - Forside flyktningbanner", {
                                        bannerId: "jobb-i-norge-for-ukrainske-flyktninger",
                                        linkId: "russian",
                                        linkLabel: "Информация на русском языке",
                                        href: "/ru/work-in-norway",
                                        language: "ru",
                                        placement: "frontpage-banner",
                                    });
                                }}
                            >
                                Информация на русском языке
                            </AkselNextLink>
                        </BodyLong>
                    </li>
                </ul>
                <UkrainianFlag />
            </Box>
        </Bleed>
    );
}
