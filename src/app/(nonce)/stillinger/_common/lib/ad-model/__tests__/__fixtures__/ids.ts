export type UuidString = `${string}-${string}-${string}-${string}-${string}`;

export type EsIndexName = `ad-${number}`;

export const FAKE_ID: UuidString = "123e4567-e89b-12d3-a456-426614174000" as const;
export const FAKE_INDEX: EsIndexName = "ad-12345678";
