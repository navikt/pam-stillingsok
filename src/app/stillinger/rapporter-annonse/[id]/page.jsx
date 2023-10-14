import ReportAdWrapper from "../../../../migrating/use-client/ReportAdWrapper";

export const metadata = {
    title: "Rapporter annonse - arbeidsplassen.no",
};

export default async function Page({ params }) {
    return <ReportAdWrapper id={params.id} />;
}
