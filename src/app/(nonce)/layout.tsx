import type { ReactElement, ReactNode } from "react";
import { Suspense } from "react";
import App from "@/app/App";
import Providers from "@/app/Providers";
import ScrollTracker from "@/app/_common/umami/ScrollTracker";
import { UtmParamsHandler } from "@/app/_common/trackers/UtmParamsHandler";
import SkyraInit from "@/app/_common/skyra/SkyraInit";
import CookieMetrics from "@/app/_common/trackers/CookieMetrics";

export const dynamic = "force-dynamic";

type NonceLayoutProps = {
    readonly children: ReactNode;
};

export default function NonceLayout({ children }: NonceLayoutProps): ReactElement {
    return (
        <Providers>
            <App>{children}</App>

            <ScrollTracker />

            <Suspense fallback={null}>
                <UtmParamsHandler />
            </Suspense>

            <CookieMetrics />
            <SkyraInit />
        </Providers>
    );
}
