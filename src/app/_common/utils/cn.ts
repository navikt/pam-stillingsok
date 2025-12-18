export type ClassNameInput = string | null | undefined | false;

export function cn(...classNames: ReadonlyArray<ClassNameInput>): string {
    return classNames
        .filter((className): className is string => {
            if (typeof className !== "string") {
                return false;
            }

            return className.trim().length > 0;
        })
        .join(" ");
}
