import { z } from "zod";
import type { ExperimentDefinition, ExperimentKey, VariantKey } from "./types";

const VariantKeySchema = z.union([z.literal("standard"), z.literal("test")]) satisfies z.ZodType<VariantKey>;

const ExperimentKeySchema = z.union([z.literal("search_jobs_cta")]) satisfies z.ZodType<ExperimentKey>;

const VariantSchema = z.object({
    key: VariantKeySchema,
    weightPercent: z.number().int().min(0).max(100),
});

const ExperimentDefinitionSchema = z
    .object({
        key: ExperimentKeySchema,
        status: z.union([z.literal("on"), z.literal("off")]),
        trafficPercent: z.number().int().min(0).max(100),
        variants: z.array(VariantSchema).min(1),
        pathPrefixes: z.array(z.string()).optional(),
    })
    .superRefine((def, context) => {
        // 1) weights må summe til 100
        const sum = def.variants.reduce((total, v) => {
            return total + v.weightPercent;
        }, 0);

        if (sum !== 100) {
            context.addIssue({
                code: z.ZodIssueCode.custom,
                message: `variants.weightPercent må summe til 100, men var ${sum} for eksperiment "${def.key}"`,
                path: ["variants"],
            });
        }

        // 2) ingen duplikate variant-keys
        const keys = def.variants.map((v) => v.key);
        const uniqueKeys = new Set(keys);
        if (uniqueKeys.size !== keys.length) {
            context.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Duplikate variant-nøkler i eksperiment "${def.key}"`,
                path: ["variants"],
            });
        }

        // 3) pathPrefixes bør starte med "/" (valgfritt, men veldig greit)
        if (def.pathPrefixes) {
            const invalidPrefix = def.pathPrefixes.find((prefix) => {
                return !prefix.startsWith("/");
            });

            if (invalidPrefix) {
                context.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: `pathPrefixes må starte med "/". Fant "${invalidPrefix}" i eksperiment "${def.key}"`,
                    path: ["pathPrefixes"],
                });
            }
        }

        // 4) anbefaling: trafficPercent=0 betyr i praksis "off"
        // (vi gjør det ikke til error, men kunne vært en warning i logs)
    });

const ExperimentsSchema = z.array(ExperimentDefinitionSchema);

export type ValidateExperimentsResult =
    | Readonly<{
          readonly ok: true;
          readonly experiments: ReadonlyArray<ExperimentDefinition>;
      }>
    | Readonly<{
          readonly ok: false;
          readonly errorMessage: string;
      }>;

function formatZodError(error: z.ZodError): string {
    const lines = error.issues.map((issue) => {
        const path = issue.path.join(".");
        return path ? `${path}: ${issue.message}` : issue.message;
    });
    return lines.join("\n");
}

export function validateExperiments(experiments: ReadonlyArray<ExperimentDefinition>): ValidateExperimentsResult {
    const parsed = ExperimentsSchema.safeParse(experiments);
    if (!parsed.success) {
        return { ok: false, errorMessage: formatZodError(parsed.error) };
    }
    return { ok: true, experiments };
}
