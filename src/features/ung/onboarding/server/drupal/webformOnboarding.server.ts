import "server-only";
import { z } from "zod";
import type { ControlType, FilterDimension } from "@/features/ung/onboarding/domain/onboarding";
import { runMapping, SharedContentMappingError } from "@/features/ung/onboarding/server/drupal/jsonApi";
import { parseWebformYamlSafely } from "@/features/ung/onboarding/server/drupal/webformYamlParser.server";
import type { SharedContentResult } from "@/features/ung/onboarding/server/sharedContentResult";

export const MAX_WEBFORM_YAML_LENGTH = 50_000;
export const MAX_STEPS = 10;
export const MAX_QUESTIONS_PER_STEP = 10;
export const MAX_OPTIONS_PER_QUESTION = 30;
const MAX_ID_LENGTH = 128;
const MAX_TITLE_LENGTH = 300;
const MAX_DESCRIPTION_LENGTH = 1_000;
const MAX_EMPTY_OPTION_LENGTH = 200;
const MAX_LABEL_LENGTH = 300;

// Handlingsknapper (send-knapp) rendres ikke og ignoreres. Alt annet ukjent interaktivt gir kontraktfeil.
const IGNORED_ELEMENT_TYPES = new Set(["webform_actions"]);
// Rene layout-/grupperingselementer. Traverseres rekursivt, men danner ikke egne steg.
const CONTAINER_ELEMENT_TYPES = new Set(["container", "fieldset", "details", "webform_flexbox", "webform_section"]);
const CONTROL_ELEMENT_TYPES = new Set<ControlType>(["select", "radios", "checkboxes"]);
const FILTER_DIMENSIONS = new Set<FilterDimension>(["age", "experience", "audiences"]);

const elementIdSchema = z
    .string()
    .min(1)
    .max(MAX_ID_LENGTH)
    .regex(/^[^\p{Cc}]+$/u);

// Generisk konvolutt: selve elementtreet valideres element for element når vi vet hva det er.
const elementNodeSchema = z.record(z.string(), z.unknown());

const wizardPageElementSchema = z.object({
    "#type": z.literal("webform_wizard_page"),
    "#title": z.string().min(1).max(MAX_TITLE_LENGTH),
});

const questionElementSchema = z.object({
    "#type": z.enum(["select", "radios", "checkboxes"]),
    "#title": z.string().min(1).max(MAX_TITLE_LENGTH),
    "#description": z.string().max(MAX_DESCRIPTION_LENGTH).optional(),
    "#required": z.boolean().optional(),
    "#multiple": z.boolean().optional(),
    "#empty_option": z.string().max(MAX_EMPTY_OPTION_LENGTH).optional(),
    "#sc_dimension": z.enum(["age", "experience", "audiences"]),
    "#sc_terms": z.array(z.uuid()).min(1).max(MAX_OPTIONS_PER_QUESTION),
    "#options": z.record(elementIdSchema, z.string().min(1).max(MAX_LABEL_LENGTH)).optional(),
});

export type OnboardingWebformQuestion = Readonly<{
    id: string;
    title: string;
    description?: string;
    emptyLabel?: string;
    controlType: ControlType;
    required: boolean;
    multiple: boolean;
    dimension: FilterDimension;
    /** Taxonomy-term-UUID-er i Webform-rekkefølge. Etikettene kommer fra gjeldende taxonomy, ikke herfra. */
    termIds: readonly string[];
}>;

export type OnboardingWebformStep = Readonly<{
    id: string;
    title: string;
    questions: readonly OnboardingWebformQuestion[];
}>;

export type OnboardingWebformDefinition = Readonly<{
    steps: readonly OnboardingWebformStep[];
}>;

type WalkContext = Readonly<{
    step?: { questions: OnboardingWebformQuestion[] };
}>;

/**
 * Parser den onboarding-spesifikke Webform-kontrakten: `webform_wizard_page` som steg, med
 * `select`/`radios`/`checkboxes`-spørsmål nestet direkte eller i layout-containere. Ukjente
 * interaktive feltyper (f.eks. fritekst eller filopplasting) gir kontraktfeil i stedet for å bli
 * stille ignorert, se "Støttet Webform-kontrakt" i implementeringsplanen.
 */
export function parseOnboardingWebform(yaml: string): SharedContentResult<OnboardingWebformDefinition> {
    return runMapping(() => {
        const root = elementNodeSchema.safeParse(
            parseWebformYamlSafely(
                yaml,
                MAX_WEBFORM_YAML_LENGTH,
                "Onboarding-Webformen er for stor eller har ugyldig YAML",
            ),
        );
        if (!root.success) {
            throw new SharedContentMappingError("Onboarding-Webformen har en uventet struktur");
        }

        const steps: OnboardingWebformStep[] = [];
        const stepIds = new Set<string>();
        const questionIds = new Set<string>();

        walk(root.data, { step: undefined }, steps, stepIds, questionIds);

        if (steps.length === 0) {
            throw new SharedContentMappingError("Onboarding-Webformen har ingen steg");
        }
        if (steps.length > MAX_STEPS) {
            throw new SharedContentMappingError("Onboarding-Webformen har for mange steg");
        }

        return { steps };
    });
}

function walk(
    node: Record<string, unknown>,
    context: WalkContext,
    steps: OnboardingWebformStep[],
    stepIds: Set<string>,
    questionIds: Set<string>,
): void {
    for (const [id, rawElement] of Object.entries(node)) {
        if (id.startsWith("#")) {
            continue;
        }

        const element = elementNodeSchema.safeParse(rawElement);
        if (!element.success) {
            throw new SharedContentMappingError(`Webform-elementet ${id} har en uventet struktur`);
        }
        const elementType = typeof element.data["#type"] === "string" ? element.data["#type"] : undefined;

        if (elementType === "webform_wizard_page") {
            if (stepIds.has(id)) {
                throw new SharedContentMappingError("Onboarding-Webformen har duplikate steg-ID-er");
            }
            const parsed = wizardPageElementSchema.safeParse(element.data);
            if (!parsed.success) {
                throw new SharedContentMappingError("Et steg i onboarding-Webformen har en uventet struktur");
            }
            stepIds.add(id);
            const questions: OnboardingWebformQuestion[] = [];
            walk(element.data, { step: { questions } }, steps, stepIds, questionIds);
            if (questions.length === 0) {
                throw new SharedContentMappingError("Et steg i onboarding-Webformen har ingen spørsmål");
            }
            if (questions.length > MAX_QUESTIONS_PER_STEP) {
                throw new SharedContentMappingError("Et steg i onboarding-Webformen har for mange spørsmål");
            }
            steps.push({ id, title: parsed.data["#title"], questions });
            continue;
        }

        if (elementType !== undefined && IGNORED_ELEMENT_TYPES.has(elementType)) {
            continue;
        }

        if (elementType !== undefined && CONTROL_ELEMENT_TYPES.has(elementType as ControlType)) {
            if (!context.step) {
                throw new SharedContentMappingError("Onboarding-Webformen har et spørsmål som ikke ligger i et steg");
            }
            if (questionIds.has(id)) {
                throw new SharedContentMappingError("Onboarding-Webformen har duplikate spørsmåls-ID-er");
            }
            const parsed = questionElementSchema.safeParse(element.data);
            if (!parsed.success) {
                throw new SharedContentMappingError(`Spørsmålet ${id} i onboarding-Webformen har en uventet struktur`);
            }
            if (!FILTER_DIMENSIONS.has(parsed.data["#sc_dimension"])) {
                throw new SharedContentMappingError(`Spørsmålet ${id} har en ukjent filterdimensjon`);
            }
            // Drupals "elements_combined"-felt kan duplisere hele #sc_terms-lista (f.eks. [A, B, A, B])
            // når webformen ikke har egne oversettelser å kombinere med. #options beholder bare de unike
            // verdiene, så vi deduplikerer i stedet for å avvise: rekkefølgen på de unike ID-ene bevares.
            const termIds = [...new Set(parsed.data["#sc_terms"])];
            const optionKeys = Object.keys(parsed.data["#options"] ?? {});
            const termIdSet = new Set(termIds);
            if (optionKeys.some((optionKey) => !termIdSet.has(optionKey))) {
                throw new SharedContentMappingError(`Spørsmålet ${id} har valg som ikke er deklarert i #sc_terms`);
            }

            questionIds.add(id);
            context.step.questions.push({
                id,
                title: parsed.data["#title"],
                ...(parsed.data["#description"] ? { description: parsed.data["#description"] } : {}),
                ...(parsed.data["#empty_option"] ? { emptyLabel: parsed.data["#empty_option"] } : {}),
                controlType: parsed.data["#type"],
                required: parsed.data["#required"] === true,
                multiple: parsed.data["#type"] === "checkboxes" || parsed.data["#multiple"] === true,
                dimension: parsed.data["#sc_dimension"],
                termIds,
            });
            continue;
        }

        if (elementType === undefined || CONTAINER_ELEMENT_TYPES.has(elementType)) {
            walk(element.data, context, steps, stepIds, questionIds);
            continue;
        }

        throw new SharedContentMappingError(`Onboarding-Webformen har et element med en type som ikke støttes: ${id}`);
    }
}
