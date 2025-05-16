import ThonHotelSuperrask from "@/app/(artikler)/thon-hotel-superrask/ThonHotelSuperrask";
import { Metadata } from "@/app/stillinger/stilling/_data/types";

export const metadata: Metadata = {
    title: "Ansatte sommervikarer med superrask søknad",
};

export default function Page() {
    return <ThonHotelSuperrask />;
}
