import { getMetadataTitle } from "@/app/metadata";
import RekrutereFlyktninger from "@/app/(artikler)/rekruttere-flyktninger/RekrutereFlyktninger";

export const metadata = {
    title: getMetadataTitle("Ønsker du å rekruttere flyktninger?"),
};

export default function Page() {
    return <RekrutereFlyktninger />;
}
