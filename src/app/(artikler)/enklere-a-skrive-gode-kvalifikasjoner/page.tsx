import { getMetadataTitle } from "@/app/metadata";
import EnklereASkriveGodeKvalifikasjoner from "@/app/(artikler)/enklere-a-skrive-gode-kvalifikasjoner/EnklereASkriveGodeKvalifikasjoner";

export const metadata = {
    title: getMetadataTitle(
        "Nå er det enklere enn noensinne å skrive gode kvalifikasjoner og overskrifter til din jobbannonse",
    ),
};

export default function Page() {
    return <EnklereASkriveGodeKvalifikasjoner />;
}
