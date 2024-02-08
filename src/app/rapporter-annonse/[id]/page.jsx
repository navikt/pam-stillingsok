import ReportAd from "./_components/ReportAd";

export const metadata = {
    title: "Rapporter annonse - arbeidsplassen.no",
};

export default async function Page({ params }) {
    return <ReportAd id={params.id} />;
}
