import React, { ReactElement, useCallback } from "react";
import { BodyLong, Button, VStack } from "@navikt/ds-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AVSTAND_PARAM_NAME, DISTANCE_VALUES } from "@/app/sommerjobb/_components/constants";

function UtvidReiseavstanden(): ReactElement {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const avstand = searchParams.has(AVSTAND_PARAM_NAME) ? parseInt(searchParams.get(AVSTAND_PARAM_NAME)!) : 0;
    const avstandIndex = DISTANCE_VALUES.indexOf(avstand);
    const nextLevel = DISTANCE_VALUES[avstandIndex + 1];

    const utvidReiseavstand = useCallback(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.set(AVSTAND_PARAM_NAME, `${nextLevel}`);
        router.push(pathname + "?" + params.toString(), { scroll: false });
    }, [searchParams, pathname, router]);

    if (nextLevel) {
        return (
            <VStack align="center">
                <Button
                    onClick={() => {
                        utvidReiseavstand();
                    }}
                >
                    Utvid reiseavstanden til {nextLevel} kilometer
                </Button>
            </VStack>
        );
    } else {
        return (
            <VStack align="center">
                <BodyLong>Finner ingen sommerjobber innen {avstand} kilometer reiseavstand</BodyLong>
            </VStack>
        );
    }
}

export default UtvidReiseavstanden;
