import React from "react";
import { BodyShort, Heading, Label, Stack } from "@navikt/ds-react";
import { formatDate, mediumDisplayName } from "@/app/stillinger/_common/utils/utils";
import { type AdDTO } from "@/app/stillinger/_common/lib/ad-model";

type MulighetDetailsProps = {
    adData: AdDTO;
};
export default function MulighetDetails({ adData }: MulighetDetailsProps) {
    return (
        <section className="full-width">
            <Stack
                gap="space-16"
                direction={{ xs: "column", sm: "row" }}
                align={{ xs: "start", sm: "center" }}
                justify="space-between"
            >
                <Heading level="2" size="medium">
                    Annonsedata
                </Heading>
                <dl className="ad-description-list">
                    {adData.id && (
                        <div>
                            <dt>
                                <Label as="span">Stillingsnummer</Label>
                            </dt>
                            <dd>
                                <BodyShort>{adData.id}</BodyShort>
                            </dd>
                        </div>
                    )}
                    {adData.updated && (
                        <div>
                            <dt>
                                <Label as="span">Sist endret</Label>
                            </dt>
                            <dd>
                                <BodyShort>{formatDate(adData.updated)}</BodyShort>
                            </dd>
                        </div>
                    )}
                    {adData.medium && (
                        <div>
                            <dt>
                                <Label as="span">Hentet fra</Label>
                            </dt>
                            <dd>
                                <BodyShort>{mediumDisplayName(adData.medium)}</BodyShort>
                            </dd>
                        </div>
                    )}
                    {adData.reference && (
                        <div>
                            <dt>
                                <Label as="span">Referanse</Label>
                            </dt>
                            <dd>
                                <BodyShort>{adData.reference}</BodyShort>
                            </dd>
                        </div>
                    )}
                </dl>
            </Stack>
        </section>
    );
}
