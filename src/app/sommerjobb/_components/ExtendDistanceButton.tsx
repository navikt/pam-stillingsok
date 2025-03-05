import React, { ReactElement, useCallback } from "react";
import { BodyLong, Button, VStack } from "@navikt/ds-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DISTANCE_PARAM_NAME, DISTANCE_VALUES } from "@/app/sommerjobb/_components/constants";

function ExtendDistanceButton(): ReactElement {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const selectedDistance = searchParams.has(DISTANCE_PARAM_NAME)
        ? parseInt(searchParams.get(DISTANCE_PARAM_NAME)!)
        : 0;
    const distanceIndex = DISTANCE_VALUES.indexOf(selectedDistance);
    const nextDistance = DISTANCE_VALUES[distanceIndex + 1];

    const onExtendDistance = useCallback(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.set(DISTANCE_PARAM_NAME, `${nextDistance}`);
        router.push(pathname + "?" + params.toString(), { scroll: false });
    }, [searchParams, pathname, router]);

    if (nextDistance) {
        return (
            <VStack align="center">
                <Button onClick={onExtendDistance}>Utvid reiseavstanden til {nextDistance} kilometer</Button>
            </VStack>
        );
    } else {
        return (
            <VStack align="center">
                <BodyLong>Finner ingen sommerjobber innen {selectedDistance} kilometer reiseavstand</BodyLong>
            </VStack>
        );
    }
}

export default ExtendDistanceButton;
