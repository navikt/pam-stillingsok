import { Button } from "@navikt/ds-react";
import Link from "next/link";

export default function BackToMuligheterLink() {
    return (
        <Button variant="secondary" as={Link} href="/muligheter">
            Se flere reserverte stillinger
        </Button>
    );
}
