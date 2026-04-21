import { RefObject, useEffect, useRef, useState } from "react";
import { SkyraStatus } from "@/app/_common/skyra/skyraTypes";
import { isSkyraSurveyRendered } from "@/app/_common/skyra/skyraDom";

type UseSkyraParams = {
    skyraSurveyRef: RefObject<HTMLElement | null>;
    openState: boolean;
    setOpenState: (value: boolean) => void;
    delayMs: number;
};

const POLL_INTERVAL_MS = 150;
const MAX_WAIT_MS = 8000;

export function useSkyra({ skyraSurveyRef, openState, setOpenState, delayMs }: UseSkyraParams): SkyraStatus {
    const [status, setStatus] = useState<SkyraStatus>("idle");
    const hasEverBeenReadyRef = useRef<boolean>(false);
    const initialCheckDoneRef = useRef<boolean>(false);

    useEffect(() => {
        if (!openState) {
            setStatus("idle");
            hasEverBeenReadyRef.current = false;
            initialCheckDoneRef.current = false;
            return;
        }

        setStatus("loading");

        const element = skyraSurveyRef.current;

        const markReady = () => {
            hasEverBeenReadyRef.current = true;
            setStatus("ready");
        };

        // Ved direkte sidelasting (f.eks. bekreft-side fra e-postlenke) er Skyras
        // state machine allerede ferdig med oppstartssekvensen når <skyra-survey>
        // kobles til DOM-en via Popover-portalen. Elementets connectedCallback
        // treffer da en tilstand som ikke plukker opp nye elementer.
        // En enkelt reload() etter en kort forsinkelse restarter pipelinen slik at
        // Skyra oppdager og rendrer elementet.
        const reloadTimeout = window.setTimeout(() => {
            if (!isSkyraSurveyRendered(skyraSurveyRef.current)) {
                window.skyra?.reload?.();
            }
        }, 100);

        const initialCheckTimeout = window.setTimeout(() => {
            if (isSkyraSurveyRendered(skyraSurveyRef.current)) {
                markReady();
            }
            initialCheckDoneRef.current = true;
        }, delayMs);

        const observer = new MutationObserver(() => {
            const currentElement = skyraSurveyRef.current;
            const readyNow = isSkyraSurveyRendered(currentElement);

            if (readyNow) {
                markReady();
                return;
            }

            // Lukk kun hvis den har vært klar tidligere og nå mister innhold.
            if (initialCheckDoneRef.current && hasEverBeenReadyRef.current) {
                setOpenState(false);
                window.skyra?.reload?.();
            }
        });

        if (element) {
            observer.observe(element, { childList: true, subtree: true, attributes: true });
            if (element.shadowRoot) {
                observer.observe(element.shadowRoot, { childList: true, subtree: true });
            }
        }

        // MutationObserver fanger ikke opp shadow root-opprettelse (attachShadow),
        // og heller ikke endringer inne i en shadow root som ikke ble observert ved oppstart.
        // Polling som fallback sikrer at vi oppdager renderingen uansett.
        let observingShadowRoot = element?.shadowRoot != null;
        const startedAt = Date.now();

        const pollId = window.setInterval(() => {
            const currentElement = skyraSurveyRef.current;

            if (isSkyraSurveyRendered(currentElement)) {
                markReady();
                window.clearInterval(pollId);
                return;
            }

            // Begynn å observere shadow root så snart den dukker opp
            if (currentElement?.shadowRoot && !observingShadowRoot) {
                observer.observe(currentElement.shadowRoot, { childList: true, subtree: true });
                observingShadowRoot = true;
            }

            if (Date.now() - startedAt >= MAX_WAIT_MS) {
                // Skyra rendret aldri — skjul spinneren og vis det Skyra har
                setStatus("ready");
                window.clearInterval(pollId);
            }
        }, POLL_INTERVAL_MS);

        return () => {
            window.clearTimeout(reloadTimeout);
            window.clearTimeout(initialCheckTimeout);
            window.clearInterval(pollId);
            observer.disconnect();
        };
    }, [openState, skyraSurveyRef, setOpenState, delayMs]);

    return status;
}
