import { describe, expect, it } from "vitest";
import { getSoknadSendtTitle } from "@/app/_common/utils/getTitle";

describe("getSoknadSendtTitle", () => {
    it("inkluderer arbeidsgivernavnet når det er oppgitt", () => {
        expect(getSoknadSendtTitle("Stein Bånn AS")).toBe("Søknaden din til Stein Bånn AS er sendt");
    });

    it.each([undefined, "", "   "])("bruker generell tittel når arbeidsgivernavnet er %s", (employerName) => {
        expect(getSoknadSendtTitle(employerName)).toBe("Søknaden er sendt til arbeidsgiver");
    });
});
