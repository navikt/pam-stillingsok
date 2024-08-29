import RekruttereFlyktninger from "@/app/(artikler)/rekruttere-flyktninger/RekruttereFlyktninger";
import { getMetadataTitle } from "@/app/layout";

export const metadata = {
    title: getMetadataTitle("Ønsker du å rekruttere flyktninger?"),
};

export default function Page() {
    return <RekruttereFlyktninger />;
}
