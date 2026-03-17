"use client";

import React from "react";
import { QueryProvider } from "@/app/stillinger/(sok)/_components/QueryProvider";

type SearchPageClientShellProps = {
    readonly children: React.ReactNode;
};

export default function SearchPageClientShell({ children }: SearchPageClientShellProps) {
    return <QueryProvider>{children}</QueryProvider>;
}
