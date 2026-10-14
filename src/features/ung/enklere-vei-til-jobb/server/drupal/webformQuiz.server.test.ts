import { describe, expect, it } from "vitest";
import {
    MAX_QUIZ_OPTIONS,
    MAX_QUIZ_QUESTIONS,
    MAX_QUIZ_SECTIONS,
    MAX_WEBFORM_YAML_LENGTH,
    parseWebformQuiz,
} from "@/features/ung/enklere-vei-til-jobb/server/drupal/webformQuiz.server";

function question(name: string, overrides: { options?: Record<string, string>; quiz?: Record<string, unknown> } = {}) {
    const options = overrides.options ?? { Ja: "Ja", Nei: "Nei" };
    const quiz = overrides.quiz ?? {
        Ja: { is_correct: true, feedback: "<p>Bra</p>" },
        Nei: { is_correct: false, feedback: "Prøv igjen" },
    };
    return [
        `${name}:`,
        "  '#type': quiz_element_radios",
        `  '#title': Spørsmål ${name}`,
        "  '#options':",
        ...Object.entries(options).map(([key, label]) => `    '${key}': '${label}'`),
        "  '#quiz__options':",
        ...Object.entries(quiz).flatMap(([key, value]) => {
            const entry = value as { is_correct?: boolean; feedback?: string };
            return [
                `    '${key}':`,
                ...(entry.is_correct === undefined ? [] : [`      is_correct: ${entry.is_correct}`]),
                ...(entry.feedback === undefined ? [] : [`      feedback: '${entry.feedback}'`]),
            ];
        }),
    ].join("\n");
}

function fieldset(
    name: string,
    title: string,
    theme: "rose" | "peach" | "mint" | "lavender" | undefined,
    questionNames: readonly string[],
    duplicateThemeClass = false,
) {
    const themeClass = theme === undefined ? [] : [`      - content-group--${theme}`];
    return [
        `${name}:`,
        "  '#type': fieldset",
        `  '#title': '${title}'`,
        "  '#attributes':",
        "    class:",
        "      - content-group",
        ...themeClass,
        ...(duplicateThemeClass ? themeClass : []),
        ...questionNames.flatMap((questionName) =>
            question(questionName)
                .split("\n")
                .map((line) => `  ${line}`),
        ),
    ].join("\n");
}

const parse = (yaml: string) => parseWebformQuiz(yaml);

describe("parseWebformQuiz", () => {
    it("parser en gyldig quiz med fem spørsmål i rekkefølge", () => {
        const yaml = ["q1", "q2", "q3", "q4", "q5"].map((name) => question(name)).join("\n");

        const result = parse(yaml);
        if (!result.ok) {
            throw new Error(`Forventet gyldig quiz: ${JSON.stringify(result)}`);
        }

        expect(result.data.sections).toHaveLength(1);
        expect(result.data.sections[0]?.title).toBeUndefined();
        expect(result.data.sections[0]?.theme).toBeUndefined();
        expect(result.data.sections[0]?.questions.map((q) => q.id)).toEqual(["q1", "q2", "q3", "q4", "q5"]);
        expect(result.data.sections[0]?.questions[0]).toMatchObject({
            statement: "Spørsmål q1",
            options: [
                { id: "Ja", label: "Ja", isCorrect: true, feedbackHtml: "<p>Bra</p>" },
                { id: "Nei", label: "Nei", isCorrect: false, feedbackHtml: "Prøv igjen" },
            ],
        });
    });

    it("parser fieldset-grupper med tittel og tema i rekkefølge", () => {
        const yaml = [
            fieldset("find_job", "Finn jobb", "rose", ["find_job_q1"], true),
            fieldset("application_cv", "Søknad og CV", "peach", ["application_q1"]),
            fieldset("interview", "Intervju", "mint", ["interview_q1"]),
            fieldset("rights", "Rettigheter", "lavender", ["rights_q1"]),
        ].join("\n");

        const result = parse(yaml);
        if (!result.ok) {
            throw new Error(`Forventet gyldig gruppert quiz: ${JSON.stringify(result)}`);
        }

        expect(
            result.data.sections.map((section) => ({
                id: section.id,
                title: section.title,
                theme: section.theme,
                questions: section.questions.map((question) => question.id),
            })),
        ).toEqual([
            { id: "find_job", title: "Finn jobb", theme: "rose", questions: ["find_job_q1"] },
            {
                id: "application_cv",
                title: "Søknad og CV",
                theme: "peach",
                questions: ["application_q1"],
            },
            { id: "interview", title: "Intervju", theme: "mint", questions: ["interview_q1"] },
            { id: "rights", title: "Rettigheter", theme: "lavender", questions: ["rights_q1"] },
        ]);
    });

    it("parser fieldset uten tema med hvit fallback", () => {
        const result = parse(fieldset("group", "Gruppe", undefined, ["q1"]));
        if (!result.ok) {
            throw new Error(`Forventet gyldig gruppert quiz: ${JSON.stringify(result)}`);
        }

        expect(result.data.sections[0]).toMatchObject({ id: "group", title: "Gruppe" });
        expect(result.data.sections[0]?.theme).toBeUndefined();
    });

    it("parser fieldset med ukjent tema med hvit fallback", () => {
        const yaml = fieldset("group", "Gruppe", undefined, ["q1"]).replace(
            "      - content-group",
            "      - content-group\n      - content-group--blue",
        );

        const result = parse(yaml);
        if (!result.ok) {
            throw new Error(`Forventet gyldig gruppert quiz: ${JSON.stringify(result)}`);
        }

        expect(result.data.sections[0]).toMatchObject({ id: "group", title: "Gruppe" });
        expect(result.data.sections[0]?.theme).toBeUndefined();
    });

    it("ignorerer send-knapper (webform_actions)", () => {
        const yaml = `${question("q1")}\nactions:\n  '#type': webform_actions\n`;

        expect(parse(yaml).ok).toBe(true);
    });

    it("parser en selvevalueringsquiz uten fasit som ungradert", () => {
        const yaml = question("q1", {
            options: { Ja: "Ja", "Trenger tips": "Trenger tips" },
            quiz: {
                Ja: { is_correct: false, feedback: "Supert!" },
                "Trenger tips": { is_correct: false, feedback: "Her er noen tips." },
            },
        });

        const result = parse(yaml);
        if (!result.ok) {
            throw new Error(`Forventet gyldig quiz: ${JSON.stringify(result)}`);
        }
        expect(result.data.sections[0]?.questions[0]?.options).toEqual([
            { id: "Ja", label: "Ja", isCorrect: false, feedbackHtml: "Supert!" },
            { id: "Trenger tips", label: "Trenger tips", isCorrect: false, feedbackHtml: "Her er noen tips." },
        ]);
    });

    it("saniterer skadelig feedback-markup", () => {
        const yaml = question("q1", {
            quiz: {
                Ja: { is_correct: true, feedback: '<p onclick="x()">Hei</p><script>alert(1)</script>' },
                Nei: { is_correct: false },
            },
        });

        const result = parse(yaml);
        if (!result.ok) {
            throw new Error("Forventet gyldig quiz");
        }
        expect(result.data.sections[0]?.questions[0]?.options[0]?.feedbackHtml).toBe("<p>Hei</p>");
    });

    it.each([
        ["ugyldig YAML", "q1: [uferdig"],
        ["YAML-alias", "a: &x\n  '#type': quiz_element_radios\nb: *x"],
        ["tom quiz", ""],
        ["ukjent synlig Webform-type", "q1:\n  '#type': textfield\n  '#title': Navn"],
        ["ikke-objekt på toppnivå", "- a\n- b"],
        ["flere riktige svar", question("q1", { quiz: { Ja: { is_correct: true }, Nei: { is_correct: true } } })],
        ["bare ett alternativ", question("q1", { options: { Ja: "Ja" }, quiz: { Ja: { is_correct: true } } })],
        [
            "fasit for ukjent alternativ",
            question("q1", { quiz: { Ja: { is_correct: true }, Ukjent: { is_correct: false } } }),
        ],
        ["blandet flat og gruppert quiz", `${question("q1")}\n${fieldset("group", "Gruppe", "rose", ["q2"])}`],
        [
            "flere gruppetema",
            fieldset("group", "Gruppe", "rose", ["q1"]).replace(
                "      - content-group--rose",
                "      - content-group--rose\n      - content-group--mint",
            ),
        ],
        [
            "samme spørsmåls-ID i flere grupper",
            `${fieldset("group_1", "Gruppe 1", "rose", ["q1"])}\n${fieldset("group_2", "Gruppe 2", "mint", ["q1"])}`,
        ],
        ["tom gruppe", fieldset("group", "Gruppe", "rose", [])],
    ])("returnerer invalid-contract for %s", (_name, yaml) => {
        expect(parse(yaml)).toMatchObject({ ok: false, error: { type: "invalid-contract" } });
    });

    it("avviser for stor YAML", () => {
        expect(parse(`# ${"x".repeat(MAX_WEBFORM_YAML_LENGTH)}\n${question("q1")}`).ok).toBe(false);
    });

    it("avviser for mange spørsmål", () => {
        const yaml = Array.from({ length: MAX_QUIZ_QUESTIONS + 1 }, (_, index) => question(`q${index}`)).join("\n");

        expect(parse(yaml).ok).toBe(false);
    });

    it("avviser for mange seksjoner", () => {
        const yaml = Array.from({ length: MAX_QUIZ_SECTIONS + 1 }, (_, index) =>
            fieldset(`group_${index}`, `Gruppe ${index}`, "rose", [`q${index}`]),
        ).join("\n");

        expect(parse(yaml).ok).toBe(false);
    });

    it("avviser for mange alternativer", () => {
        const keys = Array.from({ length: MAX_QUIZ_OPTIONS + 1 }, (_, index) => `o${index}`);
        const options = Object.fromEntries(keys.map((key) => [key, key]));
        const quiz = Object.fromEntries(keys.map((key, index) => [key, { is_correct: index === 0 }]));

        expect(parse(question("q1", { options, quiz })).ok).toBe(false);
    });

    it("avviser for lang spørsmålstekst", () => {
        const yaml = question("q1").replace("Spørsmål q1", "x".repeat(600));

        expect(parse(yaml).ok).toBe(false);
    });
});
