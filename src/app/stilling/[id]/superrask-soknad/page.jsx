import { notFound } from "next/navigation";
import validateForm, { parseFormData } from "./_components/validateForm";
import NewApplication from "./_components/NewApplication";
import { getStillingDescription, getSuperraskTitle } from "../_components/getMetaData";
import { defaultOpenGraphImage } from "@/app/layout";
import { fetchAd } from "@/app/stilling/FetchAd";
import { getDefaultHeaders } from "@/app/_common/utils/fetch";

async function fetchApplicationForm(id) {
    const res = await fetch(`${process.env.INTEREST_API_URL}/application-form/${id}`, {
        headers: getDefaultHeaders(),
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
    let ad = {};
    let applicationForm = {};
    console.log("page");
    try {
        ad = await fetchAd(params.id);
        applicationForm = await fetchApplicationForm(params.id);
    } catch (e) {}

    async function submitApplication(prevState, formData) {
        "use server";
        console.log("BEGIN2");
        try {
            console.log("BEGIN3", formData);

            const application = parseFormData(formData, applicationForm.qualifications);
            const errors = validateForm(application);
            const isValid = Object.keys(errors).length === 0;
            console.log("ERRORS", errors);
            console.log("IS VALID", isValid);
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

            console.log("SEND");
            const response = await fetch(`${process.env.INTEREST_API_URL}/application-form/${params.id}/application`, {
                body: JSON.stringify(application),
                method: "POST",
                headers: getDefaultHeaders(),
            });

            if (response.status !== 200) {
                const errorJson = await response.json();
                return {
                    ...defaultState,
                    error: errorJson.error_code || "unknown",
                };
            }
        } catch (err) {
            console.log("ERRORS", err);
            const defaultState = {
                success: false,
                validationErrors: {},
                error: undefined,
                data: undefined,
            };
            return {
                ...defaultState,
                error: "unknown",
            };
        }

        const defaultState = {
            success: false,
            validationErrors: {},
            error: undefined,
            data: undefined,
        };

        return {
            ...defaultState,
            success: true,
            data: { email: application.email },
        };
    }

    return <NewApplication ad={ad} applicationForm={applicationForm} submitApplication={submitApplication} />;
}
