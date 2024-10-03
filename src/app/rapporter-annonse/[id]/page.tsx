import validateForm from "@/app/stilling/[id]/_components/validate";
import { getMetadataTitle } from "@/app/layout";
import { fetchAd } from "@/app/stilling/FetchAd";
import { getDefaultHeaders } from "@/app/_common/utils/fetch";
import ReportAd from "./_components/ReportAd";

export const metadata = {
    title: getMetadataTitle("Rapporter annonse"),
    robots: "noindex",
};

interface FormDataParsed {
    category: string;
    title: string;
    postingId: string;
    description: FormDataEntryValue | null;
}

interface DefaultState {
    success: boolean;
    validationErrors: ValidationErrors;
    error?: string;
    data?: unknown;
}

interface ValidationErrors {
    categoryFieldset?: string;
    messageField?: string;
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
    const ad = await fetchAd(params.id);

    async function submitForm(formData: FormData): Promise<DefaultState> {
        "use server";

        const categories = formData.getAll("category") as string[];
        const reportPostingData = parseFormData(formData, categories, ad._id as string);
        const errors = validateForm(categories, reportPostingData.description as string);

        const isValid = Object.keys(errors).length === 0;

        const defaultState: DefaultState = {
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
            await fetch(`${process.env.PAMADUSER_URL}/api/v1/reportposting`, {
                body: JSON.stringify(reportPostingData),
                method: "POST",
                headers: getDefaultHeaders(),
            });

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return {
                ...defaultState,
                error: err.message,
            };
        }
        return {
            ...defaultState,
            success: true,
        };
    }

    return <ReportAd ad={ad} submitForm={submitForm} />;
}
