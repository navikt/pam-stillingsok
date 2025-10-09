import { BodyLong, Heading } from "@navikt/ds-react";
import FigureSleeping from "@/app/_common/components/FigureSleeping";
import { Link as AkselLink } from "@navikt/ds-react/esm/link";

export const metadata = {
    title: "CV",
    robots: { index: false, follow: false },
};

export default function Page() {
    return (
        <div className="container-small mt-10 mb-24 text-center">
            <Heading size="xlarge" level="1" spacing>
                Min CV på arbeidsplassen.no
            </Heading>

            <BodyLong spacing>CV-tjenesten ble lagt ned 1. oktober 2025.</BodyLong>

            <BodyLong>
                Du kan isteden bruke{" "}
                <AkselLink href="https://europass.europa.eu/no">CV-løsningen til Europass</AkselLink>. Den er gratis.
            </BodyLong>

            <div className="mt-12 mb-6">
                <FigureSleeping />
            </div>

            <BodyLong spacing>
                Dersom du er under oppfølging av Nav, vil CV-en din fremdeles være tilgjengelig på{" "}
                <AkselLink href="https://www.nav.no/min-cv">nav.no/min-cv</AkselLink>.
            </BodyLong>

            <BodyLong spacing>
                Med hilsen <AkselLink href="https://arbeidsplassen.nav.no/">arbeidsplassen.no</AkselLink>
            </BodyLong>
        </div>
    );
}
