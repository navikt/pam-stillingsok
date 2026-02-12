import React, { ReactElement, useCallback } from "react";
import { Box, Chips, Label, VStack } from "@navikt/ds-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";

interface WrapperProps {
    children: React.ReactNode;
    headerText: string;
}

function Wrapper({ children, headerText }: WrapperProps): ReactElement {
    return (
        <>
            <VStack>
                <Box maxWidth={{ md: "800px" }}>
                    <Label className="mb-4" as="h2">
                        {headerText}
                    </Label>
                    {children}
                </Box>
            </VStack>
        </>
    );
}

function SommerjobbFiltering(): ReactElement {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const appendQueryParam = useCallback(
        (name: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (!params.has(name)) {
                params.append(name, "true");
            }
            router.replace(pathname + "?" + params.toString(), { scroll: false });
        },
        [searchParams, pathname, router],
    );

    const removeQueryParam = useCallback(
        (name: string) => {
            const params = new URLSearchParams(searchParams.toString());
            params.delete(name);
            router.replace(pathname + "?" + params.toString(), { scroll: false });
        },
        [searchParams, pathname, router],
    );

    const under18 = QueryNames.UNDER18;

    const onChipClick = (value: string) => {
        searchParams.has(value) ? removeQueryParam(under18) : appendQueryParam(under18);
    };

    const headerText = "Gjerne også";

    return (
        <Wrapper headerText={headerText}>
            <Chips aria-label={headerText}>
                <Chips.Toggle
                    key={under18}
                    selected={searchParams.has(under18)}
                    checkmark={true}
                    onClick={() => onChipClick(under18)}
                >
                    For meg under 18 år
                </Chips.Toggle>
            </Chips>
        </Wrapper>
    );
}

export default SommerjobbFiltering;
