import { Counter, Histogram, register } from "prom-client";
import * as client from "prom-client";

export const httpRequests: Counter =
    register.getSingleMetric("http_requests") === undefined
        ? new client.Counter({
              name: "http_requests",
              help: "Total number of incoming HTTP requests",
              labelNames: ["method", "path", "cookieConsent"],
          })
        : (register.getSingleMetric("http_requests") as Counter);

const adUserRequests: Counter =
    register.getSingleMetric("aduser_requests") === undefined
        ? new client.Counter({
              name: "aduser_requests",
              help: "Calls to aduser",
              labelNames: ["operation", "result"],
          })
        : (register.getSingleMetric("aduser_requests") as Counter);

const suggestionRequests: Counter =
    register.getSingleMetric("suggestion_requests") === undefined
        ? new client.Counter({
              name: "suggestion_requests",
              help: "Calls to get suggestions",
              labelNames: ["result"],
          })
        : (register.getSingleMetric("suggestion_requests") as Counter);

export const suggestionDurationHistogram: Histogram =
    register.getSingleMetric("suggestion_duration_seconds") === undefined
        ? new client.Histogram({
              name: "suggestion_duration_seconds",
              help: "Duration of calls for suggestions",
          })
        : (register.getSingleMetric("suggestion_duration_seconds") as Histogram);

const elasticSearchRequests: Counter =
    register.getSingleMetric("elastic_search_requests") === undefined
        ? new client.Counter({
              name: "elastic_search_requests",
              help: "Calls to elastic search",
              labelNames: ["result"],
          })
        : (register.getSingleMetric("elastic_search_requests") as Counter);

export const elasticSearchDurationHistogram: Histogram =
    register.getSingleMetric("elastic_search_duration_seconds") === undefined
        ? new client.Histogram({
              name: "elastic_search_duration_seconds",
              help: "Duration of calls to elastic search",
          })
        : (register.getSingleMetric("elastic_search_duration_seconds") as Histogram);

export function incrementAdUserRequests(operation: string, success: boolean): void {
    adUserRequests.inc({
        operation: operation,
        result: success ? "success" : "failure",
    });
}

export function incrementSuggestionRequests(success: boolean): void {
    suggestionRequests.inc({
        result: success ? "success" : "failure",
    });
}

export function incrementElasticSearchRequests(success: boolean): void {
    elasticSearchRequests.inc({
        result: success ? "success" : "failure",
    });
}
