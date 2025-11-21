"use client";

import { useEffect } from "react";
import googleTranslateWorkaround from "@/app/_common/googleTranslateWorkaround/googleTranslateWorkaround";

export default function GoogleTranslateWorkaroundInitializer(): null {
    useEffect(() => {
        googleTranslateWorkaround();
    }, []);

    return null;
}
