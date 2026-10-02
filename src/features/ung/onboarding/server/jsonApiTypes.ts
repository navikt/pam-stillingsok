export type JsonApiResourceIdentifier = Readonly<{
    type: string;
    id: string;
}>;

export type JsonApiRelationship = Readonly<{
    data: JsonApiResourceIdentifier | readonly JsonApiResourceIdentifier[] | null;
}>;

export type JsonApiResource = Readonly<{
    type: string;
    id: string;
    attributes: Readonly<Record<string, unknown>>;
    relationships?: Readonly<Record<string, JsonApiRelationship | undefined>>;
}>;

export type JsonApiDocument = Readonly<{
    jsonapi?: Readonly<{
        version: string;
    }>;
    data: JsonApiResource;
    included: readonly JsonApiResource[];
}>;

export type JsonApiCollectionDocument = Readonly<{
    jsonapi?: Readonly<{
        version: string;
    }>;
    data: readonly JsonApiResource[];
    included: readonly JsonApiResource[];
    links?: Readonly<{
        next?: string;
    }>;
    meta?: Readonly<{
        count?: number;
        omitted?: Readonly<{
            links: Readonly<Record<string, string>>;
        }>;
    }>;
}>;

export type WebformDocument = Readonly<{
    id: string;
    title?: string;
    yaml: string;
}>;
