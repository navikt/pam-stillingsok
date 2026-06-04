import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDefaultHeaders } from "@/app/stillinger/_common/utils/fetch";
import { getAdData } from "@/app/stillinger/stilling/_data/adDataActions";
import type { CreateApplicationResponse } from "@/app/stillinger/stilling/[id]/superrask-soknad/_types/CreateApplicationResponse";
import { getStillingDescription, getSuperraskTitle } from "../_components/getMetaData";
import { ApplicationFormNotFoundError, fetchApplicationForm } from ".";
import { getSuperraskSoknadTokenIfLoggedIn } from "./_actions/superraskSoknadAuth";
import NewApplication, { type State } from "./_components/NewApplication";
import validateForm, { parseFormData } from "./_components/validateForm";

export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const params = await props.params;
    const stilling = await getAdData(params.id);

    return {
        title: getSuperraskTitle(stilling),
        description: getStillingDescription(stilling),
        robots: stilling && stilling.status !== "ACTIVE" ? "noindex" : "",
    };
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const stilling = await getAdData(params.id);
    let applicationForm: Awaited<ReturnType<typeof fetchApplicationForm>>;
    try {
        applicationForm = await fetchApplicationForm(params.id);
    } catch (error) {
        if (error instanceof ApplicationFormNotFoundError) {
            notFound();
        }
        throw error;
    }

    async function submitApplication(formData: FormData): Promise<State> {
        "use server";
        // TODO: Flytt action ut av page i en stabil serverAction fil
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
            const headers = await getDefaultHeaders();
            const oboToken = await getSuperraskSoknadTokenIfLoggedIn();
            if (oboToken) {
                headers.set("Authorization", `Bearer ${oboToken}`);
            }
            const response = await fetch(`${process.env.INTEREST_API_URL}/application-form/${params.id}/application`, {
                body: JSON.stringify(application),
                method: "POST",
                headers: headers,
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

            if (response.status !== 201) {
                const errorJson = await response.json();
                return {
                    ...defaultState,
                    error: errorJson.error_code || "unknown",
                };
            }

            const responseData: CreateApplicationResponse = await response.json();

            return {
                ...defaultState,
                success: true,
                data: {
                    email: application.email,
                    applicationId: responseData.applicationId,
                    emailAlreadyVerified: responseData.emailAlreadyVerified,
                },
            };
        } catch {
            return {
                ...defaultState,
                error: "unknown",
            };
        }
    }

    return <NewApplication ad={stilling} applicationForm={applicationForm} submitApplication={submitApplication} />;
}
