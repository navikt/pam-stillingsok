import { getQueryOptions } from "@/app/(sok)/_components/combobox/comboboxUtils";

const query = {
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

describe("comboboxUtils", () => {
    test("getQueryOptions should not contain label Ikke oppgitt", () => {
        const queryOptions = getQueryOptions(query);
        const hasIkkeOppgitt = queryOptions.some((option) => option.label === "Ikke oppgitt");
        expect(hasIkkeOppgitt).toBe(false);
    });
});
