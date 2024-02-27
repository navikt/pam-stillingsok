import { notFound } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import validateForm, { parseFormData } from "./_components/validateForm";
import NewApplication from "./_components/NewApplication";
import { getStillingDescription, getSuperraskTitle } from "../_components/getMetaData";
import { defaultOpenGraphImage } from "@/app/layout";
import { fetchAd } from "@/app/stilling/FetchAd";

async function fetchApplicationForm(id) {
    const res = await fetch(`${process.env.INTEREST_API_URL}/application-form/${id}`, {
        headers: { NAV_CALLID_FIELD: uuidv4() },
        next: { revalidate: 30 },
    });
    if (res.status === 404) {
        notFound();
    }
    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }

    return res.json();
}

export async function generateMetadata({ params }) {
    const data = await fetchAd(params.id);

    return {
        title: getSuperraskTitle(data._source),
        description: getStillingDescription(data._source),
        openGraph: {
            title: getSuperraskTitle(data._source),
            description: getStillingDescription(data._source),
            images: [defaultOpenGraphImage],
        },
        robots: data && data._source.status !== "ACTIVE" ? "noindex" : "",
    };
}

export default async function Page({ params }) {
    const ad = await fetchAd(params.id);
    const applicationForm = await fetchApplicationForm(params.id);

    async function submitApplication(prevState, formData) {
        "use server";

        const application = parseFormData(formData, applicationForm.qualifications);
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
            const response = await fetch(`${process.env.INTEREST_API_URL}/application-form/${params.id}/application`, {
                body: JSON.stringify(application),
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    NAV_CALLID_FIELD: uuidv4(),
                },
            });

            if (response.status !== 200) {
                const errorJson = await response.json();
                return {
                    ...defaultState,
                    error: errorJson.error_code || "unknown",
                };
            }
        } catch (err) {
            return {
                ...defaultState,
                error: "unknown",
            };
        }

        return {
            ...defaultState,
            success: true,
            data: { email: application.email },
        };
    }

    return <NewApplication ad={ad} applicationForm={applicationForm} submitApplication={submitApplication} />;
}
