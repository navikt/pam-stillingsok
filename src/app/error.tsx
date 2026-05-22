"use client";

import GlobalError from "@/app/global-error";

export default function ErrorBoundary({ error }: { error: Error & { digest?: string } }) {
    return <GlobalError error={error} />;
}
