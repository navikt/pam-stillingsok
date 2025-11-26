import { promises as fs } from "fs";
import path from "path";
import ts from "typescript";
import type { ArticleConfig, PageInfo } from "@/app/(artikler)/pageInfoTypes";
import { ESLint } from "eslint";

const ARTICLES_ROOT = path.join(process.cwd(), "src/app/(artikler)");

type PageEntry = {
    readonly slug: string;
    readonly filePath: string;
};

function isValidIdentifier(key: string): boolean {
    return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key);
}
async function lintGeneratedFile(filePath: string): Promise<void> {
    const eslint = new ESLint({ fix: true });

    const results = await eslint.lintFiles([filePath]);
    await ESLint.outputFixes(results);
}
async function collectPageEntries(
    dir: string,
    slugParts: ReadonlyArray<string> = [],
): Promise<ReadonlyArray<PageEntry>> {
    const dirents = await fs.readdir(dir, { withFileTypes: true });
    const entries: PageEntry[] = [];

    for (const dirent of dirents) {
        if (dirent.isDirectory()) {
            const name = dirent.name;

            // Hopp over hjelpe-mapper som ikke er ruter
            if (name.startsWith("_")) {
                continue;
            }

            const nextSlugParts = [...slugParts, name];
            const childDir = path.join(dir, name);
            const childEntries = await collectPageEntries(childDir, nextSlugParts);
            entries.push(...childEntries);
        } else if (dirent.isFile() && dirent.name === "page.tsx") {
            const adjustedSlugParts = [...slugParts];

            // Hvis siste segment er [[...slug]] vil route-root være mappen over (f.eks. /cv)
            const lastIndex = adjustedSlugParts.length - 1;
            const lastPart = adjustedSlugParts[lastIndex];

            if (typeof lastPart === "string" && lastPart.startsWith("[[...") && lastPart.endsWith("]]")) {
                adjustedSlugParts.splice(lastIndex, 1);
            }

            const slug = adjustedSlugParts.join("/");

            if (slug.length === 0) {
                // Ingen route på rotnivå her, hopp over
                continue;
            }

            entries.push({
                slug,
                filePath: path.join(dir, dirent.name),
            });
        }
    }

    return entries;
}

async function getPageEntries(): Promise<ReadonlyArray<PageEntry>> {
    const entries = await collectPageEntries(ARTICLES_ROOT);
    const sorted = [...entries].sort((a, b) => a.slug.localeCompare(b.slug));
    return sorted;
}

async function readPageFile(filePath: string): Promise<string | null> {
    try {
        const content = await fs.readFile(filePath, "utf8");
        return content;
    } catch {
        // eslint-disable-next-line no-console
        console.warn(`Could not read ${filePath}, skipping.`);
        return null;
    }
}

function objectLiteralToPageInfo(objectLiteral: ts.ObjectLiteralExpression, filePath: string): PageInfo {
    const result: Record<string, string | boolean> = {};

    for (const prop of objectLiteral.properties) {
        if (!ts.isPropertyAssignment(prop)) {
            // eslint-disable-next-line no-console
            console.warn(`Unsupported property kind in pageInfo in ${filePath}, skipping one prop.`);
            continue;
        }

        const nameNode = prop.name;
        let key: string | null = null;

        if (ts.isIdentifier(nameNode)) {
            key = nameNode.text;
        } else if (ts.isStringLiteral(nameNode)) {
            key = nameNode.text;
        }

        if (key == null) {
            // eslint-disable-next-line no-console
            console.warn(`Unsupported key in pageInfo in ${filePath}, skipping one prop.`);
            continue;
        }

        const valueNode = prop.initializer;

        if (ts.isStringLiteral(valueNode)) {
            result[key] = valueNode.text;
        } else if (valueNode.kind === ts.SyntaxKind.TrueKeyword) {
            result[key] = true;
        } else if (valueNode.kind === ts.SyntaxKind.FalseKeyword) {
            result[key] = false;
        } else {
            // eslint-disable-next-line no-console
            console.warn(
                `Unsupported value for "${key}" in pageInfo in ${filePath}. Only string/boolean is supported.`,
            );
        }
    }

    return result as PageInfo;
}

function parsePageInfoFromSource(sourceText: string, filePath: string): PageInfo | null {
    const sourceFile = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.ESNext, true, ts.ScriptKind.TSX);

    let foundMeta: PageInfo | null = null;

    const visit = (node: ts.Node): void => {
        // Hvis vi allerede har funnet pageInfo, trenger vi ikke traversere videre
        if (foundMeta != null) {
            return;
        }

        if (ts.isVariableStatement(node)) {
            for (const decl of node.declarationList.declarations) {
                if (
                    ts.isIdentifier(decl.name) &&
                    decl.name.text === "pageInfo" &&
                    decl.initializer != null &&
                    ts.isObjectLiteralExpression(decl.initializer)
                ) {
                    foundMeta = objectLiteralToPageInfo(decl.initializer, filePath);
                    return;
                }
            }
        }

        ts.forEachChild(node, visit);
    };

    visit(sourceFile);

    if (foundMeta == null) {
        // eslint-disable-next-line no-console
        console.warn(`No "pageInfo" variable found in ${filePath}, skipping.`);
    }

    return foundMeta;
}

function stringifyPageInfo(meta: PageInfo, indent: string): string {
    const innerIndent = `${indent}    `;
    const entries = Object.entries(meta) as ReadonlyArray<[string, string | boolean]>;
    const lines: string[] = [];

    lines.push("{");

    entries.forEach(([key, value], index) => {
        const propKey = isValidIdentifier(key) ? key : JSON.stringify(key);
        const propValue = typeof value === "string" ? JSON.stringify(value) : String(value);
        const suffix = index < entries.length - 1 ? "," : "";
        lines.push(`${innerIndent}${propKey}: ${propValue}${suffix}`);
    });

    lines.push(`${indent}}`);

    return lines.join("\n");
}

function stringifyArticleConfig(config: ArticleConfig): string {
    const indent = "    ";
    const lines: string[] = [];

    lines.push("{");

    const entries = Object.entries(config).sort((a, b) => a[0].localeCompare(b[0]));

    entries.forEach(([slug, meta], index) => {
        const key = isValidIdentifier(slug) ? slug : JSON.stringify(slug);
        const metaBlock = stringifyPageInfo(meta, indent);
        const suffix = index < entries.length - 1 ? "," : "";
        lines.push(`${indent}${key}: ${metaBlock}${suffix}`);
    });

    lines.push("}");

    return lines.join("\n");
}

async function generateArticleConfig(): Promise<void> {
    const entries = await getPageEntries();
    const config: ArticleConfig = {};

    for (const entry of entries) {
        // ⬇️ hopp over work-in-norway-variantene
        if (entry.slug.startsWith("[locale]/work-in-norway")) {
            continue;
        }
        const sourceText = await readPageFile(entry.filePath);

        if (sourceText == null) {
            continue;
        }

        const meta = parsePageInfoFromSource(sourceText, entry.filePath);

        if (meta == null) {
            continue;
        }

        config[entry.slug] = meta;
    }

    const outputPath = path.join(ARTICLES_ROOT, "articleConfig.generated.ts");
    const configString = stringifyArticleConfig(config);

    const fileContent = `/* This file is auto-generated by scripts/generate-article-config.ts */
import type { ArticleConfig } from "./pageInfoTypes";

export const articleConfig: ArticleConfig = ${configString};

export default articleConfig;
`;

    await fs.writeFile(outputPath, fileContent, "utf8");
    // Kjør eslint --fix
    await lintGeneratedFile(outputPath);
    // eslint-disable-next-line no-console
    console.log(`Wrote articleConfig for ${Object.keys(config).length} articles to ${outputPath}`);
}

generateArticleConfig().catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exitCode = 1;
});
