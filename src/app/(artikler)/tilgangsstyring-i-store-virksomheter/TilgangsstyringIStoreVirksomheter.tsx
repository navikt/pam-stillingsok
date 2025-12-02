import { Alert, BodyLong, BodyShort, Heading, Link as AkselLink } from "@navikt/ds-react";
import { ChevronLeftIcon } from "@navikt/aksel-icons";
import NextLink from "next/link";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import ArticleWrapper from "@/app/_common/article/ArticleWrapper";

type Props = {
    readonly meta: PageInfo;
};

export default function TilgangsstyringIStoreVirksomheter({ meta }: Props) {
    return (
        <ArticleWrapper lang={meta.language}>
            <AkselLink as={NextLink} href="/arbeidsgivertjenester" className="mb-8">
                <ChevronLeftIcon aria-hidden="true" />
                <BodyShort>Tilbake</BodyShort>
            </AkselLink>
            <Heading spacing size="xlarge" level="1">
                {meta.title}
            </Heading>
            <BodyLong spacing>
                Her tilbyr me informasjon til store verksemder om korleis tilgangsstyring kan handterast på ulike måtar.
                Formålet vårt er å visa korleis du gir og får tilgang til Navs rekrutteringstenester.
            </BodyLong>
            <BodyLong>Du finn svar på spørsmål om</BodyLong>
            <ul>
                <li>
                    <BodyLong>tilgangsstyring i store verksemder</BodyLong>
                </li>
                <li>
                    <BodyLong>overordna roller som gir vide tilgangar</BodyLong>
                </li>
                <li>
                    <BodyLong>å få tilgang til arbeidsplassen.no og kandidatlister frå Nav</BodyLong>
                </li>
            </ul>
            <BodyLong spacing>Lurer du framleis på noko, kan du ringje Altinn brukarstøtte på 75 00 60 00.</BodyLong>
            <Alert variant="info" className="mb-12">
                <BodyLong>
                    For at du eller ein kollega skal kunna nytta Navs rekrutteringsteneste på vegner av verksemda, må de
                    ha enkeltretten «Stillingsannonsar på arbeidsplassen.no», eller Altinn-rolle Lønn og
                    personalmedarbeidar, eller Altinn-rolle Utfyller/Innsender. Tilgangane kan givast på for hovudeining
                    (inkludert alle undereiningar) eller for ei enkelt undereining. Arbeidsgivar kan delegera tilgang
                    til deg via Altinn, om du ikkje har han allereie.
                </BodyLong>
            </Alert>

            <Heading spacing size="large" level="2">
                Generelt om tilgangsstyring
            </Heading>

            <Heading size="medium" level="3" spacing>
                Kvifor kan tilgangsstyring vera krevjande?
            </Heading>
            <BodyLong spacing>
                Verksemder kan ha utfordringar med å handtera tilgangsstyring, spesielt når organisasjonen er stor og
                kompleks. Tilsette kan oppleva at det er vanskeleg å finna ut kven i organisasjonen som kan gi tilgang.
                Det er stor avstand mellom dei som skal ha tilgang og dei som har styresmakt til å delegera.
            </BodyLong>
            <BodyLong spacing>
                På same måte kan dei som har styresmakt til å delegera oppleva det som krevjande å halda oversikt over
                medarbeidarar og kva tilgangar dei har eller skal ha.
            </BodyLong>
            <Heading size="medium" level="3" spacing>
                Verksemda mi har verksemdssertifikat, kan me bruka det på arbeidsplassen.no?
            </Heading>
            <BodyLong spacing>
                Nei, dette sertifikatet kan ikkje brukast. Tilgang til arbeidsplassen.no og kandidatlister frå Nav på Mi
                side Arbeidsgiver kan berre givast i Altinn.
            </BodyLong>
            <Heading size="medium" level="3" spacing>
                Tilgang til heile eller delar av organisasjonen?
            </Heading>
            <BodyLong spacing>
                Tilgangsstyringa på arbeidsplassen.no og kandidatlister frå Nav er basert på undereining. Arbeidsgivarar
                som gir tilgang, vel i Altinn om tilgangen skal vera avgrensa til ein eller fleire undereiningar, eller
                omfatta hovudeininga inkludert alle undereiningar. Det er altså ikkje nødvendig å gi personar tilgang
                til heile organisasjonen.
            </BodyLong>
            <BodyLong spacing>
                Dersom det er ønskjeleg at ein medarbeidar skal ha tilgang til alle undereiningar, er det praktisk for
                den som gir tilgang å kunna gi éin tilgang til hovudeining, som automatisk gir tilgang for alle
                undereiningar.
            </BodyLong>
            <Heading size="medium" level="3" spacing>
                Korleis løyser me rollestyring på ein praktisk måte i verksemda vår?
            </Heading>
            <BodyLong spacing>
                Dei fleste store og etablerte verksemder veit at det kan vera upraktisk at dagleg leiar eller eigar
                administrerer tilgangsstyring i Altinn. Ofte er denne oppgåva delegert til mellomleiarar eller HR. Det
                finst nokre praktiske måtar å løysa det på ved hjelp av rollene Tilgangsstyring og eventuelt
                Hovedadministrator. Sjå beskrivingar under.
            </BodyLong>

            <Heading size="large" level="2" spacing>
                Overordna roller med vide tilgangar
            </Heading>
            <Heading size="medium" level="3" spacing>
                Korleis fungerer rolla Tilgangsstyring?
            </Heading>
            <BodyLong spacing>
                Ein praktisk måte å organisera tilgangsstyring på, er å tildela ein eller fleire medarbeidarar rolla
                Tilgangsstyring. Denne rolla kan tildela rettar i organisasjonen. Merk at ein person som skal ha rolla
                Tilgangsstyring, sjølv må ha dei rollene/rettane hen skal administrera. Ein tilgangsstyrar må derfor ha
                enkeltretten «Stillingsannonsar på arbeidsplassen.no» og/eller rollene Lønn og personalmedarbeidar eller
                Utfyller/ Innsender, for å kunna gi andre den same retten som vil gi tilgang som arbeidsgivar til
                arbeidsplassen.no og kandidatlister frå Nav.
            </BodyLong>
            <Heading size="medium" level="3" spacing>
                Korleis fungerer rolla Hovedadministrator?
            </Heading>
            <BodyLong spacing>
                Viss verksemda ønskjer at éin nøkkelperson skal administrera alle Altinn-rettar på vegner av verksemda,
                er løysinga rolla Hovedadministrator. Styrets leiar, styrande reidar eller innehavar kan etablera denne
                rolla.
            </BodyLong>
            <BodyLong spacing>
                Hovudadministrator kan delegera alle roller og rettar for ei verksemd, også roller og rettar som
                hovudadministratoren ikkje har sjølv. Hovudadministrator kan derfor både gi og trekkja enkeltretten
                «Stillingsannonsar på arbeidsplassen.no», eller dei to rollene som gir tilgang til arbeidsplassen.no
                (Lønn og personalmedarbeidar og Utfyller/innsendar).
            </BodyLong>
            <BodyLong spacing>
                Hovudadministrator kan også gi ein eller fleire medarbeidarar rolla Tilgangsstyring. Hovudadministrator
                tek då ei overordna rolle, og tilgangsstyrarar administrerer roller og rettar, til dømes enkeltretten
                «Stillingsannonsar på arbeidsplassen.no».
            </BodyLong>
            <BodyLong spacing>
                Les meir om{" "}
                <AkselLink href="https://info.altinn.no/hjelp/profil/enkelttjenester-og-roller/">
                    Altinn-roller og rettar på altinn.no
                </AkselLink>
            </BodyLong>
            <Heading size="medium" level="3" spacing>
                I verksemda vår har me eigendefinerte roller. Kan eg bruka dei på arbeidsplassen.no?
            </Heading>
            <BodyLong spacing>
                Viss verksemda organiserer tilgangane sine i eigendefinerte roller i Altinn, kan ein inkludera
                enkeltretten «Stillingsannonsar på arbeidsplassen.no» i ei eigendefinert rolle.
            </BodyLong>
            <Heading size="large" level="2" spacing>
                Eg ønskjer tilgang til arbeidsplassen.no
            </Heading>
            <Heading size="medium" level="3" spacing>
                Hvordan kan eg vita om eg allereie har tilgang til arbeidsplassen.no?
            </Heading>
            <BodyLong spacing>
                Du kan sjå kva tilgangar du har når du er innlogga i Altinn. Du kan også prøva å logga inn som
                arbeidsgivar på arbeidsplassen.no. Har du ikkje tilgang, så får du ei melding om det.
            </BodyLong>
            <Heading size="medium" level="3" spacing>
                Kven kan eg spørja om tilgang til arbeidsplassen.no?
            </Heading>
            <BodyLong>
                Nokon i leiinga eller HR kan gi deg tilgang. Om du ikkje veit kven det kan vera, så kan du “be om
                tilgang” i Altinn eller på nav.no. Denne funksjonen er det førebels berre dei som allereie har ei
                Altinn-rolle frå før i verksemda som kan nytta. Når du ber om tilgang, vil rett person få ei melding på
                e-post eller SMS. Vel eit av alternativa:
            </BodyLong>
            <ul>
                <li>
                    <BodyLong>
                        Det kan gjerast på altinn.no. Les om korleis du kan{" "}
                        <AkselLink href="https://info.altinn.no/hjelp/profil/be-om-tilgang/hvordan-opprette-foresporsel/">
                            spørja om rett på Altinn.no
                        </AkselLink>
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>
                        Gå til nav.no, som har litt fleire støttefunksjonar for deg. På{" "}
                        <AkselLink href="https://arbeidsgiver.nav.no/min-side-arbeidsgiver/">
                            Mi side - arbeidsgivar
                        </AkselLink>
                        finnar du oversikt over roller eller enkeltrettar som ulike Nav-tenester krev. Når du er logga
                        inn vil du finna moglegheit for å “be om tilgang”.
                    </BodyLong>
                </li>
            </ul>
            <BodyLong spacing>
                Om du ikkje har høve til å be om tilgang som beskrivne, må du sjølv finna ut kven i HR eller leiinga som
                kan gi deg tilgang.
            </BodyLong>
            <Heading size="large" level="2" spacing>
                Eg skal gi tilgang til Arbeidsplassen
            </Heading>
            <Heading size="medium" level="3" spacing>
                Har eg allereie rett rolle for å gi tilgang til Arbeidsplassen?
            </Heading>
            <BodyLong>Logg inn i Altinn, då vil du sjå kva Altinn-tilgangar du har.</BodyLong>
            <ul>
                <li>
                    <BodyLong>
                        Om du er registrert i Einingsregisteret som daglig leiar, styrets leiar, styrande reidar eller
                        innehavar, vil du automatisk ha alle tilgangar som du kan gi vidare til andre.
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>
                        Har du rolla Hovedadministrator, kan du gi andre medarbeidarar dei tilgangane dei treng.
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>
                        Har du rolla Tilgangsstyrar, kan du gi andre medarbeidarar dei tilgangane dei treng, føresett at
                        du sjølv har dei rettane du skal tildela til andre (enkeltretten «Stillingsannonsar på
                        arbeidsplassen.no», eller Altinn-rolle Lønn og personalmedarbeidar, eller Altinn-rolle
                        Utfyller/innsendar).
                    </BodyLong>
                </li>
            </ul>
            <BodyLong spacing>
                Om du ikkje har dei nødvendige rollene for å kunna gi tilgang vidare, kan dagleg leiar eller
                hovudadministrator i verksemda di gi deg nødvendige tilgangar.
            </BodyLong>
            <Heading size="medium" level="3" spacing>
                Bør eg delegera tilgang til arbeidsplassen.no gjennom rolle eller enkeltrett?
            </Heading>
            <BodyLong spacing>
                Enkeltretten «Stillingsannonsar på arbeidsplassen.no» er tilstrekkeleg, om du som arbeidsgivar berre
                ønskjer å gi tilgang til Navs rekrutteringstenester. Då kan du som arbeidsgivar vita at ein medarbeidar
                ikkje får tilgang til andre tenester. Om du tildeler rolla Lønn og personalmedarbeidar eller
                Utfyller/Innsender, er det vide tilgangar som gir tilgang til fleire tenester enn berre
                arbeidsplassen.no og kandidatlister frå Nav.
            </BodyLong>
            <Heading size="medium" level="3" spacing>
                Eg er usikker på kva «Stillingsannonsar på arbeidsplassen.no» gir tilgang til?
            </Heading>
            <BodyLong spacing>
                Enkeltretten «Stillingsannonsar på arbeidsplassen.no» gir berre tilgang til Navs rekrutteringstenester
                på arbeidsplassen.no og kandidatlister tilsend frå Nav. Tildeler du enkeltretten «Stillingsannonsar på
                arbeidsplassen.no», kan du vera sikker på at du ikkje gir tilgang til andre tenester enn Navs
                rekrutteringstenester.
            </BodyLong>
            <Heading size="medium" level="3" spacing>
                Korleis kan eg halda oversikt over kven som har tilgangar i Altinn?
            </Heading>
            <BodyLong spacing>
                Alle som har roller i verksemda, kan gå inn på Altinn og sjå kva medarbeidarar som har roller og
                enkeltrettar, og kva roller og enkeltrettar dei har.
            </BodyLong>
        </ArticleWrapper>
    );
}
