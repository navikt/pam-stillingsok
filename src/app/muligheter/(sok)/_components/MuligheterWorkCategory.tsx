import React, { useCallback } from "react";
import { Box, Chips, Heading, VStack } from "@navikt/ds-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PAGE_PARAM_NAME } from "@/app/sommerjobb/_utils/constants";
import { MULIGHETER_KATEGORIER, muligheterKategorierDisplayNames } from "@/app/muligheter/(sok)/_utils/searchKeywords";

const MULIGHETER_KATEGORI_PARAM_NAME = "occupationLevel1";

export default function MuligheterWorkCategory() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const appendQueryParam = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (!params.has(name, value)) {
                params.append(name, value);
            }
            params.delete(PAGE_PARAM_NAME);
            router.replace(pathname + "?" + params.toString(), { scroll: false });
        },
        [searchParams, pathname, router],
    );

    const removeQueryParam = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            params.delete(name, value);
            params.delete(PAGE_PARAM_NAME);
            router.replace(pathname + "?" + params.toString(), { scroll: false });
        },
        [searchParams, pathname, router],
    );

    const onChipClick = (value: string) => {
        searchParams.has(MULIGHETER_KATEGORI_PARAM_NAME, value)
            ? removeQueryParam(MULIGHETER_KATEGORI_PARAM_NAME, value)
            : appendQueryParam(MULIGHETER_KATEGORI_PARAM_NAME, value);
    };

    const headerText = "Hva vil du jobbe med? ";

    return (
        <>
            <VStack>
                <Box maxWidth={{ md: "800px" }}>
                    <Heading level="2" size="small" className="mb-4">
                        {headerText}
                    </Heading>
                    <Chips aria-label={headerText} className="mb-4">
                        {MULIGHETER_KATEGORIER.map((item) => (
                            <Chips.Toggle
                                key={item}
                                selected={searchParams.has(MULIGHETER_KATEGORI_PARAM_NAME, item)}
                                checkmark
                                onClick={() => onChipClick(item)}
                            >
                                {muligheterKategorierDisplayNames(item)}
                            </Chips.Toggle>
                        ))}
                    </Chips>
                </Box>
            </VStack>
        </>
    );
}
