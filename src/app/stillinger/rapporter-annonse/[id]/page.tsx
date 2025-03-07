import validateForm from "@/app/stillinger/stilling/[id]/_components/validate";
import { getMetadataTitle } from "@/constants/layout";
import { getDefaultHeaders } from "@/app/stillinger/_common/utils/fetch";
import { Metadata } from "@/app/stillinger/stilling/_data/types";
import ReportAd from "./_components/ReportAd";
import { getAdData } from "@/app/stillinger/stilling/_data/adDataActions";
import { FormState } from "@/app/stillinger/_common/types/FormState";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: getMetadataTitle("Rapporter annonse"),
        robots: "noindex",
    };
}

interface FormDataParsed {
    category: string;
    title: string;
    postingId: string;
    description: FormDataEntryValue | null;
}

function parseFormData(formData: FormData, categories: string[], adId: string): FormDataParsed {
    const categoryString = categories.join(", ");
    return {
        category: categoryString,
        title: `En stilling har blitt rapportert for ${categoryString.toLowerCase()}`,
        postingId: adId,
        description: formData.get("description"),
    };
}

interface PageProps {
    params: {
        id: string;
    };
}

export default async function Page({ params }: PageProps): Promise<JSX.Element> {
    const stilling = await getAdData(params.id);
    async function submitForm(formData: FormData): Promise<FormState> {
        "use server";

        const categories = formData.getAll("category").filter((item): item is string => typeof item === "string");
        const reportPostingData = parseFormData(formData, categories, stilling.id as string);
        const errors = validateForm(categories, reportPostingData.description as string);

        const isValid = Object.keys(errors).length === 0;

        const defaultState: FormState = {
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
            const response = await fetch(`${process.env.PAMADUSER_URL}/api/v1/reportposting`, {
                body: JSON.stringify(reportPostingData),
                method: "POST",
                headers: getDefaultHeaders(),
            });

            if (response.status === 200) {
                return {
                    ...defaultState,
                    success: true,
                };
            }
            return {
                ...defaultState,
                success: false,
                error: "report_ad_general_error",
            };
        } catch (err: unknown) {
            let errorMessage: string;

            if (err instanceof Error) {
                errorMessage = err.message;
            } else {
                errorMessage = "Ukjent feil oppstod";
            }
            return {
                ...defaultState,
                error: errorMessage,
            };
        }
    }

    return <ReportAd ad={stilling} submitForm={submitForm} />;
}
