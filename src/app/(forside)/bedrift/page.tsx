import type { Metadata } from "next";
import Bedrift from "@/app/(forside)/bedrift/Bedrift";

export const metadata: Metadata = {
    title: "Bedrift",
};

export default function Page() {
    return <Bedrift />;
}
