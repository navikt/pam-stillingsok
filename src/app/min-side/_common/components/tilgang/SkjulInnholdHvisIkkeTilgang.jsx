"use client";

import React, { useContext } from "react";
import { PersonaliaContext } from "@/app/min-side/_common/components/context/PersonaliaContext";
import UngIkkeTilgang from "@/app/min-side/_common/components/tilgang/UngIkkeTilgang";

// function logout() {
//     window.location.href = `/min-side/oauth2/logout?redirect=/`;
// }

export default function SkulInnholdHvisIkkeTilgang({ children }) {
    const personalia = useContext(PersonaliaContext);

    if (personalia.data && personalia.data.erUnderFemten === true) {
        return <UngIkkeTilgang />;
    }

    if (personalia.data && personalia.data.kanLoggePaa === false) {
        return <></>;
        // return (
        //     <Modal
        //         width="medium"
        //         onClose={logout}
        //         header={{
        //             heading: "Du kan dessverre ikke ta i bruk de innloggede tjenestene",
        //             closeButton: false,
        //         }}
        //         open
        //     >
        //         <>
        //             <Modal.Body>
        //                 <BodyLong style={{ marginBottom: "2rem" }}>
        //                     Personnummeret ditt kan ikke brukes for innloggede tjenester og vi må logge deg ut. Vi
        //                     beklager dette. Du kan fortsatt søke etter stillinger og delta på jobbtreff selv om du ikke
        //                     er innlogget.
        //                 </BodyLong>
        //                 <HStack justify="center">
        //                     <WorriedFigure />
        //                 </HStack>
        //             </Modal.Body>
        //             <Modal.Footer>
        //                 <Button variant="primary" onClick={logout}>
        //                     Logg ut
        //                 </Button>
        //             </Modal.Footer>
        //         </>
        //     </Modal>
        // );
    }

    return <>{children}</>;
}
