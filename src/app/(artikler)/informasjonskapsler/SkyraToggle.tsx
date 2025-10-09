import { useCallback } from "react";

import { Switch } from "@navikt/ds-react/esm";
import { ConsentValues, updateConsent } from "@navikt/arbeidsplassen-react";
import { clearSkyraCookies, updateSkyraConsent } from "@/app/_common/skyra/skyraRuntime";

type SkyraToggleProps = {
    setConsentValues: (value: ConsentValues | ((prevState: ConsentValues) => ConsentValues)) => void;
    checked?: boolean;
};

export default function SkyraToggle({ setConsentValues, checked }: SkyraToggleProps) {
    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const next = e.currentTarget.checked;
            updateConsent({
                userActionTaken: true,
                consent: {
                    surveys: next,
                },
            });

            // 2) La Skyra reagere på endringen (cookieless -> cookies on/off).
            updateSkyraConsent(next);

            if (!next) clearSkyraCookies();

            // 3) Synk lokal app-state (UI).
            setConsentValues((prev) => ({
                ...prev,
                surveysConsent: next,
            }));
        },
        [setConsentValues],
    );

    return (
        <Switch
            onChange={handleChange}
            checked={checked ?? false}
            description="Hvis du samtykker kan vi vise popup-undersøkelser og lagre et par funksjonelle
          informasjonskapsler som husker om du har svart/lukket. Uten samtykke kan vi fortsatt
          vise enkelte undersøkelser uten cookies (inline/“Fant du det du lette etter?”).
        "
        >
            Brukerundersøkelser (Skyra)
        </Switch>
    );
}
