import { Loader } from "@navikt/ds-react";
import { PageBlock } from "@navikt/ds-react/Page";

export default function Loading() {
    return (
        <PageBlock width="text" gutters className="mt-responsive mb-responsive">
            <Loader size="xlarge" title="Laster innhold" />
        </PageBlock>
    );
}
