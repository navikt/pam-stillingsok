import { Heading, List } from "@navikt/ds-react";
import { ListItem } from "@navikt/ds-react/List";
import ArticleWrapper from "@/app/_common/article/ArticleWrapper";
import type { PageInfo } from "@/app/(artikler)/pageInfoTypes";

type Props = {
    readonly meta: PageInfo;
};
export default function Arbeidsgivertjenester({ meta }: Props) {
    return (
        <ArticleWrapper lang={meta.language} title={meta.title}>
            <Heading size="large" level="2" spacing>
                Tilgang via Altinn
            </Heading>
            <List className="mb-6">
                <ListItem>
                    Bare du som er arbeidsgiver kan bruke arbeidsgivertjenester fra Nav på arbeidsplassen.no.
                    Privatpersoner kan ikke bruke tjenestene, heller ikke privatpersoner som er oppdragsgiver uten å
                    være arbeidsgiver.
                </ListItem>
                <ListItem>
                    Bedriften må være registrert i Arbeidsgiver- og arbeidstakerregisteret for en underenhet. Underenhet
                    vil si en operativ enhet som kan ansette og lønne personer.
                </ListItem>
                <ListItem>
                    Du logger inn med ID-porten. Systemet vil sjekke rettighetene dine i Altinn. For at du eller en
                    kollega skal kunne bruke Navs nye rekrutteringstjeneste på vegne av virksomheten, må dere ha
                    enkelttjenesten «Stillingsannonser på arbeidsplassen.no» for underenheten. Du kan sjekke om du har
                    riktig tilgang ved å prøve å logge deg inn i tjenesten som arbeidsgiver.
                </ListItem>
                <ListItem>
                    Arbeidsgiver kan delegere tilgang til deg via Altinn, dersom du ikke allerede har den. Har du
                    tilgangspakken «Ansettelsesforhold» for underenhet, vil du automatisk ha enkelttjenesten
                    «Stillingsannonser på arbeidsplassen.no» på vegne av bedriften.
                </ListItem>
            </List>
        </ArticleWrapper>
    );
}
