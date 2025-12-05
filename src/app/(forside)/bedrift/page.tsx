import Bedrift from "@/app/(forside)/bedrift/Bedrift";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Bedrift",
};

export default function Page() {
    return <Bedrift />;
}
