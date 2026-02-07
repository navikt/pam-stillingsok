import "server-only";
import { revalidateTag } from "next/cache";

export const GEOGRAFI_CACHE_TAG = "geografi" as const;

export const revalidateGeografiTag = (): void => {
    revalidateTag(GEOGRAFI_CACHE_TAG);
};
