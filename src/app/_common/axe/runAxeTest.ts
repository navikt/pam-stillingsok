// Only used for running tests
import { expect } from "vitest";
import axe from "axe-core";
import config from "@/app/_common/axe/axe-config";
import { logger } from "@navikt/next-logger";

const runAxeTest = async (container: axe.ElementContext) => {
    axe.configure(config);
    const results = await axe.run(container);
    if (results.violations.length !== 0) {
        logger.info(new Error("AXE ERRORS: ", { cause: results.violations }));
    }
    expect(results.violations.length).toBe(0);
};

export default runAxeTest;
