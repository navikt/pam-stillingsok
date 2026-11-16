import type { SanitizedHtml } from "@/server/utils/htmlSanitizer";

type SafeHtmlProps = Readonly<{
    html: SanitizedHtml;
}>;

export function SafeHtml({ html }: SafeHtmlProps) {
    // biome-ignore lint/security/noDangerouslySetInnerHtml: Komponenten godtar kun server-sanitert og brandet HTML.
    return <div className="arb-rich-text" dangerouslySetInnerHTML={{ __html: html }} />;
}
