import { isValidEmail, isValidTelephone } from "@/app/_common/utils/utils";

export const MOTIVATION_MAX_LENGTH = 800;

export function parseFormData(formData, qualifications) {
    return {
        name: formData.get("fullName"),
        telephone: formData.get("telephone"),
        email: formData.get("email"),
        motivation: formData.get("motivation"),
        qualifications: qualifications.map((it) => ({
            ...it,
            checked: formData.getAll("qualification").includes(it.label),
        })),
    };
}

export function validateMotivationText(motivationText) {
    if (motivationText.length > MOTIVATION_MAX_LENGTH) {
        return `Du har brukt ${
            motivationText.replace(/\r\n/g, "\n").length - MOTIVATION_MAX_LENGTH
        } tegn for mye i din begrunnelse. Begrunnelsen kan ikke være lengre enn ${MOTIVATION_MAX_LENGTH} tegn`;
    }
    return undefined;
}

export function validateEmail(email) {
    if (!email || email.trim().length === 0) {
        return "Du må oppgi din e-post for å kunne sende inn søknaden";
    }
    if (email && email.length > 0 && !isValidEmail(email)) {
        return "E-postadressen er ugyldig";
    }
    return undefined;
}

export function validateTelephone(telephone) {
    if (!telephone || telephone.trim().length === 0) {
        return "Du må oppgi ditt telefonnummer for å kunne sende inn søknaden";
    }
    if (telephone && telephone.trim().length > 0 && !isValidTelephone(telephone)) {
        return "Telefonnummer er ugyldig";
    }
    return undefined;
}

export default function validateForm(application) {
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
