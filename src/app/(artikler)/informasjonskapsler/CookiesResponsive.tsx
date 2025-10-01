import React from "react";
import styles from "./CookiesResponsive.module.css";
import type { CookieItem } from "./cookiesData";
import { Table } from "@navikt/ds-react/esm";
import { Accordion } from "@navikt/ds-react/Accordion";

export type CookiesResponsiveProps = Readonly<{
    cookies: ReadonlyArray<CookieItem>;
}>;

export function CookiesResponsive({ cookies }: CookiesResponsiveProps) {
    return (
        <div className={styles["cookie-wrapper"]}>
            <Table size="small" className={styles["cookie-table"]}>
                <caption className={"visually-hidden"}>
                    Nødvendige informasjonskapsler brukt på arbeidsplassen.no
                </caption>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell scope="col">Navn</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Formål</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Varighet</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Utsteder</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Kommentar</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {cookies.map((c) => (
                        <Table.Row key={c.name}>
                            <Table.HeaderCell scope="col" textSize="small">
                                {c.name}
                            </Table.HeaderCell>
                            <Table.DataCell textSize="small">{c.purpose}</Table.DataCell>
                            <Table.DataCell textSize="small">{c.duration}</Table.DataCell>
                            <Table.DataCell textSize="small">{c.provider}</Table.DataCell>
                            <Table.DataCell textSize="small">{c.comment ?? "—"}</Table.DataCell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>

            <div className={styles["cookie-accordion"]} aria-hidden={false}>
                <Accordion>
                    {cookies.map((cookie, index) => {
                        const slug = slugify(cookie.name);
                        return (
                            <Accordion.Item key={cookie.name} defaultOpen={index < 2}>
                                <Accordion.Header>
                                    <span className={styles["cookie-accordion-title"]}>
                                        {cookie.name} - {cookie.purpose}
                                    </span>
                                </Accordion.Header>
                                <Accordion.Content>
                                    <dl className={styles["cookie-dl"]} aria-labelledby={`${slug}-title`}>
                                        <div className={styles["cookie-row"]}>
                                            <dt>Formål</dt>
                                            <dd>{cookie.purpose}</dd>
                                        </div>
                                        <div className={styles["cookie-row"]}>
                                            <dt>Varighet</dt>
                                            <dd>{cookie.duration}</dd>
                                        </div>
                                        {cookie.provider ? (
                                            <div className={styles["cookie-row"]}>
                                                <dt>Utsteder</dt>
                                                <dd>{cookie.provider}</dd>
                                            </div>
                                        ) : null}
                                        {cookie.comment ? (
                                            <div className={styles["cookie-row"]}>
                                                <dt>Kommentar</dt>
                                                <dd>{cookie.comment}</dd>
                                            </div>
                                        ) : null}
                                    </dl>
                                </Accordion.Content>
                            </Accordion.Item>
                        );
                    })}
                </Accordion>
            </div>
        </div>
    );
}

function slugify(input: string): string {
    return input
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
}
