import { Buildings3Icon, LocationPinIcon } from "@navikt/aksel-icons";
import { BodyLong, HStack } from "@navikt/ds-react";
import type { AdDTO } from "@/app/stillinger/_common/lib/ad-model";
import getWorkLocation from "@/app/stillinger/_common/utils/getWorkLocation";

type SummaryProps = {
    adData: AdDTO;
};
export default function Summary({ adData }: SummaryProps) {
    const location = getWorkLocation(adData.locationList, false);

    return (
        <section>
            {adData.employer?.name && (
                <HStack className="mb-2" gap="space-12" align="center" wrap={false}>
                    <HStack align="center">
                        <Buildings3Icon title="Arbeidsgiver" fontSize="1.5rem" />
                    </HStack>
                    <BodyLong weight="semibold">{adData.employer.name}</BodyLong>
                </HStack>
            )}

            {location && (
                <HStack className="mb-2" gap="space-12" align="center" wrap={false}>
                    <HStack align="center">
                        <LocationPinIcon title="Sted" fontSize="1.5rem" />
                    </HStack>
                    <BodyLong weight="semibold">{location}</BodyLong>
                </HStack>
            )}
        </section>
    );
}
