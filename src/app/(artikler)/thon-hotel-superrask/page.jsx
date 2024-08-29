import { getMetadataTitle } from "@/app/layout";
import ThonHotelSuperrask from "@/app/(artikler)/thon-hotel-superrask/ThonHotelSuperrask";

export const metadata = {
    title: getMetadataTitle("Ansatte sommervikarer med superrask søknad"),
};

export default function Page() {
    return <ThonHotelSuperrask />;
}
