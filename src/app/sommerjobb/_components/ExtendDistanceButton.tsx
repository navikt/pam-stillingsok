import React, { ReactElement, useCallback } from "react";
import { Button, VStack } from "@navikt/ds-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DISTANCE_PARAM_NAME, DISTANCE_VALUES } from "@/app/sommerjobb/_utils/constants";
import { getDistanceValueOrDefault } from "@/app/sommerjobb/_utils/getDistanceValueOrDefault";

function ExtendDistanceButton(): ReactElement {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const selectedDistance = getDistanceValueOrDefault(searchParams.get(DISTANCE_PARAM_NAME));
    const distanceIndex = DISTANCE_VALUES.indexOf(selectedDistance);
    const nextDistance = DISTANCE_VALUES[distanceIndex + 1];

    const onExtendDistance = useCallback(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.set(DISTANCE_PARAM_NAME, `${nextDistance}`);
        router.replace(pathname + "?" + params.toString(), { scroll: false });
    }, [searchParams, pathname, router]);

    return (
        <VStack align="center" gap="space-16">
            <Button disabled={nextDistance === undefined} onClick={onExtendDistance}>
                {nextDistance ? `Utvid reiseavstanden til ${nextDistance} kilometer` : "Utvid reiseavstanden"}
            </Button>
        </VStack>
    );
}

export default ExtendDistanceButton;
