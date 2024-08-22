import { Query } from "@/app/(sok)/_components/searchBox/buildSearchBoxOptions";
import { ComboboxOption } from "@navikt/ds-react/cjs/form/combobox/types";
import { buildSelectedOptions } from "@/app/(sok)/_components/searchBox/buildSelectedOptions";

const query: Query = {
    from: 0,
    size: 25,
    q: "",
    municipals: [],
    counties: [],
    countries: [],
    international: false,
    remote: ["Ikke oppgitt"],
    occupations: [],
    occupationFirstLevels: ["Uoppgitt/ ikke identifiserbare"],
    occupationSecondLevels: [],
    needDriversLicense: ["Ikke oppgitt"],
    extent: ["Heltid"],
    engagementType: ["Annet"],
    sector: ["Ikke oppgitt"],
    education: ["Ikke oppgitt"],
    workLanguage: ["Ikke oppgitt"],
    experience: [],
    sort: "",
    v: 1,
};

describe("selectedOptions", () => {
    test("getQuerySelectedOptions should not contain label Ikke oppgitt", () => {
        const queryOptions = buildSelectedOptions(query).filter(
            (item): item is ComboboxOption => typeof item !== "string",
        );
        const hasIkkeOppgitt = queryOptions.some((option) => option.label === "Ikke oppgitt");
        expect(hasIkkeOppgitt).toBe(false);
    });
});
