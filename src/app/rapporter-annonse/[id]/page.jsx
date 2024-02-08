import { notFound } from "next/navigation";
import ReportAd from "./_components/ReportAd";
import validateForm from "../../stilling/[id]/_components/validate";

export const metadata = {
    title: "Rapporter annonse - arbeidsplassen.no",
};

const sourceExcludes = [
    "administration",
    "categoryList",
    "created",
    "createdBy",
    "employer.id",
    "employer.uuid",
    "employer.mediaList",
    "employer.contactList",
    "employer.createdBy",
    "employer.updatedBy",
    "employer.created",
    "employer.updated",
    "employer.deactivated",
    "employer.employees",
    "employer.orgform",
    "employer.orgnr",
    "employer.parentOrgnr",
    "employer.properties",
    "employer.publicName",
    "employer.status",
    "geopoint",
    "mediaList",
    "privacy",
    "location.latitude",
    "location.longitude",
    "location.county",
    "occupationList",
    "properties.author",
    "properties.industry",
    "properties.keywords",
    "properties.occupation",
    "properties.searchtags",
    "properties.sourceupdated",
    "updatedBy",
    "uuid",
].join(",");

const host = process.env.PAMSEARCHAPI_URL ? process.env.PAMSEARCHAPI_URL : "http://pam-search-api";

async function getAd(id) {
    const res = await fetch(`${host}/stillingsok/ad/ad/${id}?_source_excludes=${sourceExcludes}`, {
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
    const ad = await getAd(params.id);

    async function submitForm(prevState, formData) {
        "use server";

        const categories = formData.getAll("category");
        const data = parseFormData(formData, categories, ad._id);
        const errors = validateForm(categories, data.description);

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
            // TODO: api call
            // await UserAPI.post(
            //     "api/v1/reportposting",
            //     data,
            //     false,
            // );
            // logAmplitudeEvent("Rapportering av stillingsannonse", {
            //     category: categoryString,
            //     title,
            //     postingId: ad._id,
            // });
            return {
                ...defaultState,
                success: true,
            };
        } catch (err) {
            return {
                ...defaultState,
                error: err.message,
            };
        }
    }

    return <ReportAd ad={ad} id={params.id} submitForm={submitForm} />;
}
