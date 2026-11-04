import { z } from "zod";
import { getFritekstFeil } from "./fritekst";
import type { WizardState } from "./sokehjelperTypes";

export const wizardStateSchema: z.ZodType<WizardState> = z.object({
    jobbtypes: z.array(z.enum(["sommerjobb", "julejobb", "deltid", "foerste-jobb", "bytte-jobb", "superrask"])).max(10),
    steder: z.array(z.enum(["hele-landet", "hjemmekontor", "sted"])).max(5),
    county: z.string().max(100).nullable(),
    municipal: z.string().max(100).nullable().optional(),
    yrker: z.array(z.enum(["butikk", "helse", "restaurant", "transport", "it", "skole", "annet"])).max(10),
    fritekst: z.string().refine((value) => getFritekstFeil(value) === undefined),
    aktivtSteg: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
});
