import { notFound } from "next/navigation";
import ReportAd from "./_components/ReportAd";
import validateForm from "../../stilling/[id]/_components/validate";
import { excludes } from "../../stilling/[id]/page";
import { getMetadataTitle } from "../../layout";

export const metadata = {
    title: getMetadataTitle("Rapporter annonse"),
    robots: "noindex",
};

async function fetchAd(id) {
    const res = await fetch(`${process.env.PAMSEARCHAPI_URL}/stillingsok/ad/ad/${id}?_source_excludes=${excludes}`, {
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (res.status === 404) {
        notFound();
    }
    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }

    return res.json();
}

function parseFormData(formData, categories, adId) {
    const categoryString = categories.join(", ");
    return {
        category: categoryString,
        title: `En stilling har blitt rapportert for ${categoryString.toLowerCase()}`,
        postingId: adId,
        description: formData.get("description"),
    };
}

export default async function Page({ params }) {
    const ad = await fetchAd(params.id);

    async function submitForm(prevState, formData) {
        "use server";

        const categories = formData.getAll("category");
        const reportPostingData = parseFormData(formData, categories, ad._id);
        const errors = validateForm(categories, reportPostingData.description);

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
            const response = await fetch(`${process.env.PAMADUSER_URL}/api/v1/reportposting`, {
                body: JSON.stringify(reportPostingData),
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
        } catch (err) {
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

    return <ReportAd ad={ad} id={params.id} submitForm={submitForm} />;
}
