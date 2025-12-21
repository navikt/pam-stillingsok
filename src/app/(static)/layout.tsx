import type { ReactElement, ReactNode } from "react";
import App from "@/app/App";

type StaticLayoutProps = {
    readonly children: ReactNode;
};

export default function StaticLayout({ children }: StaticLayoutProps): ReactElement {
    return <App>{children}</App>;
}
