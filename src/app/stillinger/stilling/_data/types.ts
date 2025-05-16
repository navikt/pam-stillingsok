export type ApiResponse<T> =
    | { success: true; status: number; data: T }
    | { success: false; status: number; errorMessage: string; error?: unknown };

export type OpenGraphImage = {
    url: string;
    width: number;
    height: number;
};
export type OpenGraph = {
    title?: string;
    description?: string;
    images?: OpenGraphImage[];
};
export type FormatDetection = {
    telephone: boolean;
    date: boolean;
    email: boolean;
    address: boolean;
};

export type Metadata = {
    title:
        | string
        | {
              template: string;
              default: string;
          };
    description?: string;
    openGraph?: OpenGraph;
    icons?: {
        icon: string;
    };
    formatDetection?: FormatDetection;
    robots?: string;
    alternates?: {
        canonical: string;
    };
};
