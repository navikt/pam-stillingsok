import React from "react";
import FavouritesProvider from "@/app/stillinger/favoritter/_components/FavouritesProvider";

export default function StillingerLayout({ children }: { children: React.ReactNode }) {
    return <FavouritesProvider>{children}</FavouritesProvider>;
}
