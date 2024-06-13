import { register } from "prom-client";
import * as client from "prom-client";

const adUserRequests =
    register.getSingleMetric("aduser_requests_total") === undefined
        ? new client.Counter({
              name: "aduser_requests_total",
              help: "Calls to aduser",
              labelNames: ["operation", "result"],
          })
        : register.getSingleMetric("aduser_requests_total");

export function incrementAdUserRequests(operation, success) {
    adUserRequests.inc({
        operation: operation,
        result: success ? "success" : "failure",
    });
}
