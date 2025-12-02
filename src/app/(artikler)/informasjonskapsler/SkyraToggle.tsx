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
                    skyraSurveys: next,
                },
            });

            // 2) La Skyra reagere på endringen (cookieless -> cookies on/off).
            updateSkyraConsent(next);

            if (!next) clearSkyraCookies();

            // 3) Synk lokal app-state (UI).
            setConsentValues((prev) => ({
                ...prev,
                skyraConsent: next,
            }));
        },
        [setConsentValues],
    );

    return (
        <Switch
            onChange={handleChange}
            checked={checked ?? false}
            description="Om du samtykkjer kan me visa popup-undersøkelser og lagra eit par funksjonelle
          informasjonskapslar som hugsar om du har svart/lukka. Utan samtykke kan me framleis
          visa enkelte undersøkingar utan cookies (inline/“Fann du det du leita etter?”).
        "
        >
            Brukarundersøkingar (Skyra)
        </Switch>
    );
}
