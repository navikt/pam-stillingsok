import { register } from "prom-client";
import * as client from "prom-client";

const adUserRequests =
    register.getSingleMetric("aduser_requests") === undefined
        ? new client.Counter({
              name: "aduser_requests",
              help: "Calls to aduser",
              labelNames: ["operation", "result"],
          })
        : register.getSingleMetric("aduser_requests");

const suggestionRequests =
    register.getSingleMetric("suggestion_requests") === undefined
        ? new client.Counter({
              name: "suggestion_requests",
              help: "Calls to get suggestions",
              labelNames: ["result"],
          })
        : register.getSingleMetric("suggestion_requests");

const elasticSearchRequests =
    register.getSingleMetric("elastic_search_requests") === undefined
        ? new client.Counter({
              name: "elastic_search_requests",
              help: "Calls to elastic search",
              labelNames: ["result"],
          })
        : register.getSingleMetric("elastic_search_requests");

export function incrementAdUserRequests(operation, success) {
    adUserRequests.inc({
        operation: operation,
        result: success ? "success" : "failure",
    });
}

export function incrementSuggestionRequests(success) {
    suggestionRequests.inc({
        result: success ? "success" : "failure",
    });
}

export function incrementElasticSearchRequests(success) {
    elasticSearchRequests.inc({
        result: success ? "success" : "failure",
    });
}
