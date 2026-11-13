import type { InitOptions } from "@nais/apm";

type BeforeSendHook = NonNullable<InitOptions["beforeSend"]>;

// `%71` er prosentkodet `q`. `\` stopper verdien så JSON-escaping ikke ødelegges.
const FREE_TEXT_PARAM = /([?&])(q|%71)=[^&#\s"'<>\\]*/g;
const FREE_TEXT_KEY = /(?:q|%71)=/;
export const FREE_TEXT_PLACEHOLDER = "[fritekst]";

export function redactFreeText(value: string): string {
    if (!FREE_TEXT_KEY.test(value)) {
        return value;
    }
    return value.replace(FREE_TEXT_PARAM, `$1$2=${FREE_TEXT_PLACEHOLDER}`);
}

/**
 * 🔴 Rød sone (personvern): erstatter verdien til fritekstsøk (`q`) overalt i telemetri-hendelsen
 * (page-URL, navigasjon, ytelse, fetch og trace-spans) før den sendes til delt Loki.
 * Hendelsen blir uansett sendt som JSON, så vi renser JSON-teksten i stedet for å gå gjennom objektet.
 * Kan den ikke gjøres om til JSON, droppes den heller enn å sendes urenset.
 */
export const stripFreeTextFromPageUrl: BeforeSendHook = (item) => {
    let json: string;
    try {
        json = JSON.stringify(item);
    } catch {
        return null;
    }

    const redacted = redactFreeText(json);
    return redacted === json ? item : JSON.parse(redacted);
};
