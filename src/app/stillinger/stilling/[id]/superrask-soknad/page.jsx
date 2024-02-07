import { notFound } from "next/navigation";
import NewApplicationWrapper from "../../../../../migrating/use-client/NewApplicationWrapper";
import validateForm, { parseFormData } from "./_components/validateForm";
import SuperraskSoknadAPI from "../../../../../modules/stilling/superrask-soknad/api/SuperraskSoknadAPI";

export const metadata = {
    title: "Superrask søknad - arbeidsplassen.no",
};

async function getAd(id) {
    const res = await fetch(`https://arbeidsplassen.intern.dev.nav.no/stillinger/api/stilling/${id}`);
    if (res.status === 404) {
        notFound();
    }
    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }

    return res.json();
}

async function getApplicationForm(id) {
    const res = await fetch(`https://arbeidsplassen.intern.dev.nav.no/interesse-api/application-form/${id}`);
    if (res.status === 404) {
        notFound();
    }
    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }

    return res.json();
}

export default async function Page({ params }) {
    const ad = await getAd(params.id);
    const applicationForm = await getApplicationForm(params.id);

    async function submitApplication(prevState, formData) {
        "use server";

        const applicationFormFields = await getApplicationForm(params.id);
        const application = parseFormData(formData, applicationFormFields.qualifications);
        const errors = validateForm(application);
        const isValid = Object.keys(errors).length === 0;
        const defaultState = {
            success: false,
            validationErrors: {},
            error: undefined,
            data: undefined,
        };

        if (!isValid) {
            return {
                ...defaultState,
                validationErrors: errors,
            };
        }

        try {
            await SuperraskSoknadAPI.post(
                `https://arbeidsplassen.intern.dev.nav.no/interesse-api/application-form/${params.id}/application`,
                application,
                false,
            );
            return {
                ...defaultState,
                success: true,
                data: { email: application.email },
            };
        } catch (err) {
            return {
                ...defaultState,
                error: err.message,
            };
        }
    }

    return <NewApplicationWrapper ad={ad} applicationForm={applicationForm} submitApplication={submitApplication} />;
}
