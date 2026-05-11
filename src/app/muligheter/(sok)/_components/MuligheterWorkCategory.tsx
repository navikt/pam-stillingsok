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

function getSelectedCategories(searchParams: URLSearchParams): string[] {
    const raw = searchParams.get(MULIGHETER_KATEGORI_PARAM_NAME);
    if (!raw) return [];
    return raw.split(",").filter(Boolean);
}

export default function MuligheterWorkCategory() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const onChipClick = useCallback(
        (value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            const selected = getSelectedCategories(params);
            const isSelected = selected.includes(value);

            if (isSelected) {
                const remaining = selected.filter((v) => v !== value);
                if (remaining.length > 0) {
                    params.set(MULIGHETER_KATEGORI_PARAM_NAME, remaining.join(","));
                } else {
                    params.delete(MULIGHETER_KATEGORI_PARAM_NAME);
                }
            } else {
                params.set(MULIGHETER_KATEGORI_PARAM_NAME, [...selected, value].join(","));
            }

            params.delete(PAGE_PARAM_NAME);
            router.replace(buildUrl(pathname, params), { scroll: false });
        },
        [searchParams, pathname, router],
    );

    const selected = getSelectedCategories(new URLSearchParams(searchParams.toString()));
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
                                selected={selected.includes(item)}
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
