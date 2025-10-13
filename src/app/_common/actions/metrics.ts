"use server";

type MetricsData = {
    method: string;
    path: string;
    cookieConsent: string;
};

export async function trackMetrics(data: MetricsData) {
    console.log("Tracking metrics:", data);
    fetch(`http://localhost:${process.env.PORT}/api/internal/metrics`, {
        method: "POST",
        body: JSON.stringify({ method: data.method, path: data.path, cookieConsent: data.cookieConsent }),
    }).catch((error) => {
        console.error("Error recording metric:", error);
    });
}
