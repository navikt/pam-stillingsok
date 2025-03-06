import { ValidationErrors } from "@/app/stillinger/stilling/[id]/_components/validate";

export type FormState = {
    success: boolean;
    validationErrors: ValidationErrors;
    error?: string;
    data?: unknown; // Data hvis innsendelsen lykkes
};
