import React, { ReactElement, useCallback } from "react";
import { Box, Chips, Heading, VStack } from "@navikt/ds-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { JOB_CATEGORY_PARAM_NAME, PAGE_PARAM_NAME } from "@/app/sommerjobb/_utils/constants";
import { SOMMERJOBB_CATEGORIES } from "@/app/sommerjobb/_utils/searchKeywords";

interface WrapperProps {
    children: React.ReactNode;
    headerText: string;
}

function Wrapper({ children, headerText }: WrapperProps): ReactElement {
    return (
        <>
            <VStack>
                <Box maxWidth={{ md: "800px" }}>
                    <Heading level="2" size="small" className="mb-4">
                        {headerText}
                    </Heading>
                    {children}
                </Box>
            </VStack>
        </>
    );
}

function SommerjobbWorkCategory(): ReactElement {
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
        searchParams.has(JOB_CATEGORY_PARAM_NAME, value)
            ? removeQueryParam(JOB_CATEGORY_PARAM_NAME, value)
            : appendQueryParam(JOB_CATEGORY_PARAM_NAME, value);
    };

    const headerText = "Jeg vil jobbe med";

    return (
        <>
            <Wrapper headerText={headerText}>
                <Chips aria-label={headerText}>
                    {SOMMERJOBB_CATEGORIES.map((item) => (
                        <Chips.Toggle
                            key={item.label}
                            selected={searchParams.has(JOB_CATEGORY_PARAM_NAME, item.label)}
                            checkmark={true}
                            onClick={() => onChipClick(item.label)}
                        >
                            {item.label}
                        </Chips.Toggle>
                    ))}
                </Chips>
            </Wrapper>
        </>
    );
}

export default SommerjobbWorkCategory;
