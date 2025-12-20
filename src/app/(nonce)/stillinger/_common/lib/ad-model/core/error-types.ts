import { z } from "zod";

type ZodIssueCompat = z.ZodError<unknown>["issues"][number];

export type ZodIssueLite = {
    path: string;
    code: ZodIssueCompat["code"];
    message: string;
};

export type ParseError = {
    kind: "SchemaMismatch";
    id?: string;
    index?: string;
    summary: string; // kort oppsummering
    issues: ZodIssueLite[]; // nedtrimmet for logging/visning
};

export function summarizeZodIssues(
    issues: ReadonlyArray<ZodIssueCompat>,
    max = 8,
): { summary: string; lite: ZodIssueLite[] } {
    const lite = issues.slice(0, max).map((i) => ({
        path: i.path.map(String).join("."),
        code: i.code,
        message: i.message,
    }));
    const more = Math.max(0, issues.length - lite.length);
    const summary =
        issues.length === 0 ? "No issues" : `${issues.length} schema issue(s)${more ? ` (+${more} not shown)` : ""}`;
    return { summary, lite };
}

export const toParseError = (
    zerr: z.ZodError<unknown>,
    opts: { id?: string; index?: string; maxIssues?: number } = {},
): ParseError => {
    const { summary, lite } = summarizeZodIssues(zerr.issues, opts.maxIssues ?? 8);
    return {
        kind: "SchemaMismatch",
        id: opts.id,
        index: opts.index,
        summary,
        issues: lite,
    };
};
