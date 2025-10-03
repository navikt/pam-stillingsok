const UUID_PATTERN = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g;
export function removeUuid(path: string): string {
    return path.replaceAll(UUID_PATTERN, "[id]");
}
