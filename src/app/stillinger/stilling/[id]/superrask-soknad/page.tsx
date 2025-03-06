import { notFound } from "next/navigation";
import { getDefaultHeaders } from "@/app/stillinger/_common/utils/fetch";
import { ReactElement } from "react";
import { Metadata } from "next";
import { ApplicationForm } from "@/app/stillinger/stilling/[id]/superrask-soknad/_types/Application";
import { defaultOpenGraphImage } from "@/constants/layout";
import validateForm, { parseFormData } from "./_components/validateForm";
import NewApplication, { State } from "./_components/NewApplication";
import { getStillingDescription, getSuperraskTitle } from "../_components/getMetaData";
import { getAdData } from "@/app/stillinger/stilling/_data/adDataActions";

async function fetchApplicationForm(id: string): Promise<ApplicationForm> {
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

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const stilling = await getAdData(params.id);

    return {
        title: getSuperraskTitle(stilling),
        description: getStillingDescription(stilling),
        openGraph: {
            title: getSuperraskTitle(stilling),
            description: getStillingDescription(stilling),
            images: [defaultOpenGraphImage],
        },
        robots: stilling && stilling.status !== "ACTIVE" ? "noindex" : "",
    };
}

export default async function Page({ params }: { params: { id: string } }): Promise<ReactElement> {
    const stilling = await getAdData(params.id);
    const applicationForm = await fetchApplicationForm(params.id);

    async function submitApplication(formData: FormData): Promise<State> {
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
                headers: getDefaultHeaders(),
            });

            // Custom errors based on http response code
            if (response.status === 409) {
                return {
                    ...defaultState,
                    error: "conflict",
                };
            }

            if (response.status === 403) {
                return {
                    ...defaultState,
                    error: "forbidden",
                };
            }

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

    return <NewApplication ad={stilling} applicationForm={applicationForm} submitApplication={submitApplication} />;
}
