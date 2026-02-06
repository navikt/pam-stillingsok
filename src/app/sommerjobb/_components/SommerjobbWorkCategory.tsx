import React, { ReactElement, useCallback } from "react";
import { Box, Chips, ExpansionCard, Heading, Hide, Show, Stack, VStack } from "@navikt/ds-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { JOB_CATEGORY_PARAM_NAME, PAGE_PARAM_NAME } from "@/app/sommerjobb/_utils/constants";
import { CoffeeIcon } from "@navikt/aksel-icons";
import { SOMMERJOBB_CATEGORIES } from "@/app/sommerjobb/_utils/searchKeywords";

interface WrapperProps {
    children: React.ReactNode;
    headerText: string;
    defaultOpen?: boolean;
}

function Wrapper({ children, headerText, defaultOpen = false }: WrapperProps): ReactElement {
    return (
        <>
            <Show below="md">
                <ExpansionCard aria-label={headerText} defaultOpen={defaultOpen}>
                    <ExpansionCard.Header>
                        <ExpansionCard.Title as="h2" size="small">
                            <Stack as="span" wrap={false} gap={{ xs: "space-8", sm: "space-16" }} align="center">
                                <CoffeeIcon aria-hidden fontSize="2rem" />
                                {headerText}
                            </Stack>
                        </ExpansionCard.Title>
                    </ExpansionCard.Header>
                    <ExpansionCard.Content>{children}</ExpansionCard.Content>
                </ExpansionCard>
            </Show>
            <Hide below="md">
                <VStack align="center">
                    <Box maxWidth={{ md: "800px" }}>
                        <Heading align="center" level="2" size="small" className="mb-4">
                            {headerText}
                        </Heading>
                        {children}
                    </Box>
                </VStack>
            </Hide>
        </>
    );
}

function SommerjobbWorkCategory(): ReactElement {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    // TODO: delete when under18 debugging is done
    const isDebug = searchParams.get("explain") === "true";
    const under18Label = "Jobber for de under 18 år";

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

    const headerText = "Jeg vil jobbe med...";
    return (
        <>
            <Wrapper headerText={headerText} defaultOpen={searchParams.has(JOB_CATEGORY_PARAM_NAME)}>
                <Chips className="justify-content-center-on-md" aria-label={headerText}>
                    {/*TODO: rollback when under18 debugging is done*/}
                    {SOMMERJOBB_CATEGORIES.filter((item) => item.label !== under18Label).map((item) => (
                        <Chips.Toggle
                            key={item.label}
                            selected={searchParams.has(JOB_CATEGORY_PARAM_NAME, item.label)}
                            checkmark={true}
                            onClick={() => onChipClick(item.label)}
                        >
                            {item.label}
                        </Chips.Toggle>
                    ))}
                    {isDebug && (
                        <Chips.Toggle
                            key={under18Label}
                            selected={searchParams.has(JOB_CATEGORY_PARAM_NAME, under18Label)}
                            checkmark={true}
                            onClick={() => onChipClick(under18Label)}
                        >
                            {under18Label}
                        </Chips.Toggle>
                    )}
                </Chips>
            </Wrapper>
        </>
    );
}

export default SommerjobbWorkCategory;
