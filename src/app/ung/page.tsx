import { Metadata } from "next";
import UngMainPage from "@/features/ung/ui/UngMainPage";

export const metadata: Metadata = {
    title: "Jobb for deg som er ung",
    description:
        "Leter du etter sommerjobb eller din første jobb? Her finner du stillinger og tips som gjør det enklere å søke",
};

export default function Page() {
    return <UngMainPage />;
}
