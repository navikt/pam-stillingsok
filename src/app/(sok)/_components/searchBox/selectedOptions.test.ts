import { Query } from "@/app/(sok)/_components/searchBox/searchBoxOptions";
import { ComboboxOption } from "@navikt/ds-react/cjs/form/combobox/types";
import { getQuerySelectedOptions } from "@/app/(sok)/_components/searchBox/selectedOptions";

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
    sort: "",
    v: "1",
};

describe("selectedOptions", () => {
    test("getQuerySelectedOptions should not contain label Ikke oppgitt", () => {
        const queryOptions = getQuerySelectedOptions(query);
        const hasIkkeOppgitt = queryOptions.some((option: ComboboxOption) => option.label === "Ikke oppgitt");
        expect(hasIkkeOppgitt).toBe(false);
    });
});
