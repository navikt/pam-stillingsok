import { isValidEmail, isValidTelephone } from "@/app/_common/utils/utils";
import { Application, Qualification } from "@/app/stilling/[id]/superrask-soknad/_types/Application";
import { ValidationErrors } from "@/app/stilling/[id]/superrask-soknad/_types/ValidationErrors";

export const MOTIVATION_MAX_LENGTH = 800;

export function parseFormData(formData: FormData, qualifications: Qualification[]): Application {
    return {
        name: formData.get("fullName") as string,
        telephone: formData.get("telephone") as string,
        email: formData.get("email") as string,
        motivation: (formData.get("motivation") as string).replace(/\r\n/g, "\n") as string,
        qualifications: qualifications.map((it: Qualification) => ({
            ...it,
            checked: formData.getAll("qualification").includes(it.label),
        })),
    };
}

export function validateMotivationText(motivationText: string): string | undefined {
    if (motivationText.length > MOTIVATION_MAX_LENGTH) {
        return `Du har brukt ${
            motivationText.length - MOTIVATION_MAX_LENGTH
        } tegn for mye i din begrunnelse. Begrunnelsen kan ikke være lengre enn ${MOTIVATION_MAX_LENGTH} tegn`;
    }
    return undefined;
}

export function validateEmail(email: string): string | undefined {
    if (!email || email.trim().length === 0) {
        return "Du må oppgi din e-post for å kunne sende inn søknaden";
    }
    if (email && email.length > 0 && !isValidEmail(email)) {
        return "E-postadressen er ugyldig";
    }
    return undefined;
}

export function validateTelephone(telephone: string): string | undefined {
    if (!telephone || telephone.trim().length === 0) {
        return "Du må oppgi ditt telefonnummer for å kunne sende inn søknaden";
    }
    if (telephone && telephone.trim().length > 0 && !isValidTelephone(telephone)) {
        return "Telefonnummer er ugyldig";
    }
    return undefined;
}

export default function validateForm(application: Application): ValidationErrors {
    let errors = {};

    const emailError = validateEmail(application.email);
    if (emailError) {
        errors = {
            ...errors,
            email: emailError,
        };
    }

    const telephoneError = validateTelephone(application.telephone);
    if (telephoneError) {
        errors = {
            ...errors,
            telephone: telephoneError,
        };
    }

    const motivationError = validateMotivationText(application.motivation);
    if (motivationError) {
        errors = {
            ...errors,
            motivation: motivationError,
        };
    }
    return errors;
}
