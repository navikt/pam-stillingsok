export type SharedContentError =
    | Readonly<{
          type: "configuration" | "invalid-request" | "network" | "not-found" | "invalid-response";
          message: string;
      }>
    | Readonly<{
          type: "http";
          message: string;
          status: number;
      }>
    | Readonly<{
          type: "invalid-contract";
          message: string;
          issuePaths: readonly string[];
      }>;

export type SharedContentResult<T> =
    | Readonly<{
          ok: true;
          data: T;
      }>
    | Readonly<{
          ok: false;
          error: SharedContentError;
      }>;
