import { ConsentValues, updateConsent } from "@navikt/arbeidsplassen-react";
import { onConsentChanged } from "@/app/_common/umami";
import { Switch } from "@navikt/ds-react/esm";
import { useCallback } from "react";

type UmamiToggleProps = {
    setConsentValues: (value: ConsentValues | ((prevState: ConsentValues) => ConsentValues)) => void;
    checked?: boolean;
};
export default function UmamiToggle({ setConsentValues, checked }: UmamiToggleProps) {
    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const next = e.currentTarget.checked;

            updateConsent({
                userActionTaken: true,
                consent: { analytics: next },
            });

            onConsentChanged();

            setConsentValues((prev) => ({
                ...prev,
                analyticsConsent: next,
            }));
        },
        [setConsentValues],
    );
    return (
        <Switch
            onChange={handleChange}
            checked={checked ?? false}
            description="Samler anonymisert statistikk om hvordan arbeidsplassen.no brukes.
               Hjelper oss å forstå hvilke sider som besøkes og forbedre tjenesten.
               Dataene deles ikke med reklamenettverk."
        >
            Analyse og statistikk (Umami)
        </Switch>
    );
}
