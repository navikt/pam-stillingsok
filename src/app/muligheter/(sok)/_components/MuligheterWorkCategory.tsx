import React, { useCallback } from "react";
import { Box, Chips, Heading, VStack } from "@navikt/ds-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PAGE_PARAM_NAME } from "@/app/sommerjobb/_utils/constants";
import { MULIGHETER_KATEGORIER, muligheterKategorierDisplayNames } from "@/app/muligheter/(sok)/_utils/searchKeywords";

const MULIGHETER_KATEGORI_PARAM_NAME = "occupationLevel1";

function buildUrl(pathname: string, params: URLSearchParams): string {
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
}

export default function MuligheterWorkCategory() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const appendQueryParam = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (!params.getAll(name).includes(value)) {
                params.append(name, value);
            }
            params.delete(PAGE_PARAM_NAME);
            router.replace(buildUrl(pathname, params), { scroll: false });
        },
        [searchParams, pathname, router],
    );

    const removeQueryParam = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            const remaining = params.getAll(name).filter((v) => v !== value);
            params.delete(name);
            remaining.forEach((v) => params.append(name, v));
            params.delete(PAGE_PARAM_NAME);
            router.replace(buildUrl(pathname, params), { scroll: false });
        },
        [searchParams, pathname, router],
    );

    const onChipClick = (value: string) => {
        searchParams.getAll(MULIGHETER_KATEGORI_PARAM_NAME).includes(value)
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
                                selected={searchParams.getAll(MULIGHETER_KATEGORI_PARAM_NAME).includes(item)}
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
