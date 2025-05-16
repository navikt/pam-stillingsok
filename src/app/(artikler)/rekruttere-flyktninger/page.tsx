import RekrutereFlyktninger from "@/app/(artikler)/rekruttere-flyktninger/RekrutereFlyktninger";
import { Metadata } from "@/app/stillinger/stilling/_data/types";

export const metadata: Metadata = {
    title: "Ønsker du å rekruttere flyktninger?",
};

export default function Page() {
    return <RekrutereFlyktninger />;
}
