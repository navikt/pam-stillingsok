import type { ReactElement, ReactNode } from "react";
import App from "@/app/App";
import SkyraInitStaticClient from "@/app/_common/skyra/SkyraInitStatic.client";

type StaticLayoutProps = {
    readonly children: ReactNode;
};

export default function StaticLayout({ children }: StaticLayoutProps): ReactElement {
    return (
        <>
            <App>{children}</App>
            <SkyraInitStaticClient />
        </>
    );
}
