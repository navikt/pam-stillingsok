// Only used for running tests
import { expect } from "vitest";
import axe from "axe-core";
import config from "@/app/_common/axe/axe-config";
import { appLogger } from "@/app/_common/logging/appLogger";

const runAxeTest = async (container: axe.ElementContext) => {
    axe.configure(config);
    const results = await axe.run(container);
    if (results.violations.length !== 0) {
        appLogger.info("AXE ERRORS", { violations: results.violations });
    }
    expect(results.violations.length).toBe(0);
};

export default runAxeTest;
