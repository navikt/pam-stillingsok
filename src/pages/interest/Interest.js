import React from "react";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import useTrackPageview from "../../hooks/useTrackPageview";
import { CONTEXT_PATH } from "../../environment";
import useScrollToTop from "../../hooks/useScrollToTop";
import BackLink from "../../components/backlink/BackLink";
import H1WithAutoFocus from "../../components/h1WithAutoFocus/H1WithAutoFocus";
import "./Interest.less";

const Interest = ({ match }) => {

    const title = "Meld interesse";

    useDocumentTitle(title);
    useTrackPageview(`${CONTEXT_PATH}/.../meld-interesse`, title + " - Ny funksjon");
    useScrollToTop();

    return (
        <div className="Interest">
            <BackLink to={`${CONTEXT_PATH}/stilling/${match.params.uuid}`} text="Tilbake til annonsen" />
            <H1WithAutoFocus className="Interest__h1">👏<br /> Du har funnet en ny funksjon som vi holder på å
                utvikle!</H1WithAutoFocus>
            <p>
                Før vi lanserer funksjonen hadde vi satt stort pris på dine tilbakemeldinger under en
                kort brukertest digitalt. Det er helt frivillig å delta og du kan trekke deg når som
                helst. Det vil ta ca 30 minutter.
            </p>
            <p>
                Hvis du kunne tenkt deg å se vårt konsept og gi dine tilbakemeldinger, trykk på knappen nedenfor og send
                oss en e-post.
            </p>
            <p>
                <b>NB! Dette har ikke noe å gjøre med den spesifikke stillingen du var inne på. Denne henvendelsen
                    gjelder bare en frivillig brukertest for arbeidsplassen.no</b>
            </p>
            <a className="Button Button--primary" href="mailto:nav.team.arbeidsplassen@nav.no?subject=Deltagelse av brukertest på arbeidsplassen.no">
                Jeg vil delta på brukertest
            </a>
        </div>
    );
};

export default Interest;
