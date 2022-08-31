import React, { useEffect, useState } from "react";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import useTrackPageview from "../../hooks/useTrackPageview";
import { CONTEXT_PATH } from "../../environment";
import useScrollToTop from "../../hooks/useScrollToTop";
import BackLink from "../../components/backlink/BackLink";
import H1WithAutoFocus from "../../components/h1WithAutoFocus/H1WithAutoFocus";
import "./Interest.less";
import "../../components/buttons/LinkMainButton.less";

function Interest() {
    const [stillingId, setStillingId] = useState(null);
    useEffect(() => {
        setStillingId(document.location.pathname.split("/")[3]);
    }, []);

    const title = "Meld interesse";

    useDocumentTitle(title);
    useTrackPageview(`${CONTEXT_PATH}/.../meld-interesse`, title + " - Ny funksjon");
    useScrollToTop();

    return (
        <div className="Interest">
            <BackLink to={`${CONTEXT_PATH}/stilling/${stillingId}`} text="Tilbake til annonsen" />
            <H1WithAutoFocus className="Interest__h1">👏<br /> Du har funnet en ny funksjon som vi holder på å
                utvikle!</H1WithAutoFocus>
            <p>
                Med denne nye funksjonen vil du kunne gi beskjed til bedriften at du ønsker å bli kontaktet angående
                stillingen.
            </p>
            <p>
                Før vi lanserer funksjonen hadde vi satt stort pris på dine tilbakemeldinger under en kort brukertest
                digitalt. Det er helt frivillig å delta og du kan trekke deg når som helst. Det vil ta ca 30 minutter.
            </p>
            <p>
                Hvis du kunne tenkt deg å se vårt konsept og gi dine tilbakemeldinger, trykk på knappen nedenfor og send
                oss en e-post.
            </p>
            <a className="LinkMainButton" href="mailto:nav.team.arbeidsplassen@nav.no">Jeg vil delta på
                brukertest</a>
        </div>
    );
}

export default Interest;
