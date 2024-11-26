import React, { ReactElement } from "react";
import { BodyLong, HStack } from "@navikt/ds-react";
import { Buldings3Icon, LocationPinIcon } from "@navikt/aksel-icons";
import getWorkLocation from "@/app/_common/utils/getWorkLocation";
import { StillingDetaljer } from "@/app/lib/stillingSchema";

type SummaryProps = {
    adData: StillingDetaljer;
};
export default function Summary({ adData }: SummaryProps): ReactElement {
    const location = getWorkLocation(adData.location, adData.locationList, false);

    return (
        <section>
            {adData.employer && adData.employer.name && (
                <HStack className="mb-2" gap="3" align="center" wrap={false}>
                    <HStack align="center">
                        <Buldings3Icon title="Arbeidsgiver" fontSize="1.5rem" />
                    </HStack>
                    <BodyLong weight="semibold">{adData.employer.name}</BodyLong>
                </HStack>
            )}
            {location && (
                <HStack className="mb-2" gap="3" align="center" wrap={false}>
                    <HStack align="center">
                        <LocationPinIcon title="Sted" fontSize="1.5rem" />
                    </HStack>
                    <BodyLong weight="semibold">{location}</BodyLong>
                </HStack>
            )}
        </section>
    );
}
