import { ConsentValues, updateConsent } from "@navikt/arbeidsplassen-react";
import { onConsentChanged } from "@/app/_common/umami";
import { Switch } from "@navikt/ds-react/esm";
import { ChangeEvent, useCallback } from "react";

type UmamiToggleProps = {
    setConsentValues: (value: ConsentValues | ((prevState: ConsentValues) => ConsentValues)) => void;
    checked?: boolean;
};
export default function UmamiToggle({ setConsentValues, checked }: UmamiToggleProps) {
    const handleChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
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
            description="Samlar anonymisert statistikk om korleis arbeidsplassen.no blir brukt.
               Hjelpar oss å forstå kva sider som blir besøkte og forbetra tenesta.
               Data blir ikkje delte med reklamenettverk."
        >
            Analyse og statistikk (Umami)
        </Switch>
    );
}
