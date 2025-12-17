import { Metadata } from "next";
import UngMainPage from "@/features/ung/ui/UngMainPage";

export const metadata: Metadata = {
    title: "Er du ung og vil jobbe?",
};

export default function Page() {
    return <UngMainPage />;
}
