import type { ComboboxProps } from "@navikt/ds-react";

export type ComboboxOption = Exclude<ComboboxProps["options"][number], string>;
