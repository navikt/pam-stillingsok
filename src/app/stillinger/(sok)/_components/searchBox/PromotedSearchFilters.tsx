"use client";

import { PlusIcon, SnowIcon } from "@navikt/aksel-icons";
import { Button, HStack } from "@navikt/ds-react";
import { track } from "@/app/_common/umami";
import useQuery from "@/app/stillinger/(sok)/_components/QueryProvider";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";

type PromotedFilter = Readonly<{
    queryName: string;
    value: string;
    label: string;
}>;

const promotedFilters: readonly PromotedFilter[] = [
    {
        queryName: QueryNames.IS_XMAS_JOB,
        value: "true",
        label: "Julejobb",
    },
];

export default function PromotedSearchFilters() {
    const query = useQuery();
    const availableFilters = promotedFilters.filter((filter) => !query.has(filter.queryName, filter.value));

    if (availableFilters.length === 0) {
        return null;
    }

    return (
        <HStack gap="space-8">
            {availableFilters.map((filter) => (
                <Button
                    key={filter.queryName}
                    variant="secondary"
                    size="small"
                    icon={<SnowIcon aria-hidden="true" />}
                    aria-label={`Legg til filteret ${filter.label}`}
                    onClick={() => {
                        document
                            .querySelector<HTMLInputElement>(".search-combobox-input")
                            ?.focus({ preventScroll: true });
                        query.set(filter.queryName, filter.value);
                        track("Søk - la til filter", {
                            filterGroup: filter.label,
                            filterSource: "prioritert-filter",
                        });
                    }}
                >
                    <HStack as="span" align="center" gap="space-4">
                        <span>{filter.label}</span>
                        <PlusIcon aria-hidden="true" />
                    </HStack>
                </Button>
            ))}
        </HStack>
    );
}
