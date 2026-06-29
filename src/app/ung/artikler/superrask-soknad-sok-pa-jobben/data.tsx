import { BodyLong, List } from "@navikt/ds-react";
import { ListItem } from "@navikt/ds-react/List";

export const tipsList: { title: string; description: string; id: string }[] = [
    {
        id: "superrask-rad-1",
        title: "Se etter annonser med «superrask søknad»",
        description: (
            <>
                <BodyLong className="mb-2">Først og fremst må du finne jobber som du kan søke på.</BodyLong>
                <List aria-label="Finn annonser med superrask søknad">
                    <ListItem>Bruk vårt nye filter «superrask søknad» i stillingssøket.</ListItem>
                    <ListItem>
                        Kombiner gjerne med stedsfilter og reisevei, så får du annonser med superrask søknad nær deg.
                    </ListItem>
                </List>
            </>
        ),
    },
    {
        id: "superrask-rad-2",
        title: "Les stillingsannonsen nøye",
        description: (
            <>
                <BodyLong className="mb-2">
                    Selv om det går fort å søke, er det viktig at du vet hva du søker på.
                </BodyLong>
                <List aria-label="Les stillingsannonsen nøye">
                    <ListItem>Sjekk om arbeidsoppgavene passer for deg.</ListItem>
                    <ListItem>Sjekk hvilke krav som stilles.</ListItem>
                    <ListItem>Tenk deg om: passer jobben for deg? Har du lyst på denne jobben?</ListItem>
                </List>
            </>
        ),
    },
    {
        id: "superrask-rad-3",
        title: "Tenk gjennom hva du skriver",
        description: (
            <>
                <BodyLong className="mb-2">
                    Du skal ikke skrive en lang søknad, men det er viktig å bruke litt tid på teksten likevel. En god
                    beskrivelse gjør at du skiller deg ut, selv i en superrask søknad. Dette bør være med:
                </BodyLong>
                <List aria-label="Tenk gjennom hva du skriver">
                    <ListItem>Skriv kort om hvem du er.</ListItem>
                    <ListItem>Vis hvorfor du har lyst på akkurat den jobben.</ListItem>
                </List>
            </>
        ),
    },
    {
        id: "superrask-rad-4",
        title: "Hold oversikten med «Mine søknader»",
        description: (
            <>
                <BodyLong className="mb-2">
                    På «Mine søknader» kan du se alle søknader du har sendt. En god oversikt gjør jobbsøkingen enklere
                    og mer ryddig.
                </BodyLong>
                <List aria-label="Bruk Mine søknader">
                    <ListItem>Få oversikt over hvilke søknader du har sendt.</ListItem>
                    <ListItem>Følg med på hvordan det går med søknaden.</ListItem>
                    <ListItem>Unngå å søke på samme jobb flere ganger.</ListItem>
                </List>
            </>
        ),
    },
    {
        id: "superrask-rad-5",
        title: "Vær aktiv",
        description: (
            <>
                <BodyLong className="mb-2">
                    Selv om superrask søknad gjør jobbjakten mye enklere, kan det lønne seg å gjøre litt ekstra. Det kan
                    være det som gjør at du skiller deg ut, og blir valgt.
                </BodyLong>
                <List aria-label="Vær aktiv i jobbsøkingen">
                    <ListItem>Ta kontakt med arbeidsgiveren hvis du har spørsmål.</ListItem>
                    <ListItem>Vis interesse for jobben.</ListItem>
                    <ListItem>Følg opp hvis du ikke hører noe fra arbeidsgiveren.</ListItem>
                </List>
            </>
        ),
    },
];
