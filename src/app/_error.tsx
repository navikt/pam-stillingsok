import { NextPageContext } from "next";
import { ReactElement } from "react";

type ErrorPageProps = {
    statusCode?: number;
    errorMessage?: string;
    err?: unknown;
};

function CustomErrorPage({ statusCode, errorMessage, err }: ErrorPageProps): ReactElement {
    const isZodError = errorMessage && errorMessage.includes("ZodError");

    // Log the error to an external service or console
    if (errorMessage) {
        console.error(`Error occurred: ${errorMessage}`, err);
    }

    return (
        <div>
            <h1>{statusCode || 500} - Something went wrong</h1>
            {isZodError ? (
                <p>There was an issue with the data validation. Please check the inputs and try again.</p>
            ) : (
                <p>{errorMessage || "An unexpected error has occurred."}</p>
            )}
        </div>
    );
}

// Server-side error fetching
CustomErrorPage.getInitialProps = ({
    res,
    err,
}: NextPageContext): { statusCode: number; errorMessage: string; err: unknown } => {
    const statusCode = res?.statusCode ?? 500;
    const errorMessage = err?.message ?? "Unknown error occurred";

    return { statusCode, errorMessage, err };
};

export default CustomErrorPage;
