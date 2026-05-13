import { type RefObject, useEffect, useRef, useState } from "react";
import { isSkyraSurveyRendered } from "@/app/_common/skyra/skyraDom";
import type { SkyraStatus } from "@/app/_common/skyra/skyraTypes";

type UseSkyraParams = {
    skyraSurveyRef: RefObject<HTMLElement | null>;
    openState: boolean;
    setOpenState: (value: boolean) => void;
};

const POLL_MS = 150;
const RELOAD_AFTER_MS = 3000;
const MAX_WAIT_MS = 10_000;

export function useSkyra({ skyraSurveyRef, openState, setOpenState }: UseSkyraParams): SkyraStatus {
    const [status, setStatus] = useState<SkyraStatus>("idle");
    const hasBeenReadyRef = useRef(false);

    useEffect(() => {
        if (!openState) {
            setStatus("idle");
            hasBeenReadyRef.current = false;
            return;
        }

        setStatus("loading");

        const startedAt = Date.now();
        let reloaded = false;

        const pollId = window.setInterval(() => {
            if (isSkyraSurveyRendered(skyraSurveyRef.current)) {
                hasBeenReadyRef.current = true;
                setStatus("ready");
                return;
            }

            if (hasBeenReadyRef.current) {
                setOpenState(false);
                window.skyra?.reload?.();
                window.clearInterval(pollId);
                return;
            }

            const elapsed = Date.now() - startedAt;

            // Skyra kan ha fullført oppstart før elementet ble lagt til DOM-en.
            // Én reload() restarter pipelinen slik at elementet blir oppdaget.
            if (!reloaded && elapsed >= RELOAD_AFTER_MS) {
                reloaded = true;
                window.skyra?.reload?.();
            }

            if (elapsed >= MAX_WAIT_MS) {
                setStatus("error");
                window.clearInterval(pollId);
            }
        }, POLL_MS);

        return () => {
            window.clearInterval(pollId);
        };
    }, [openState, skyraSurveyRef, setOpenState]);

    return status;
}
