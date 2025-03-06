/* eslint-disable */
// Only used for running tests
import { expect } from "vitest";
import axe from "axe-core";
/* eslint-enable */
import config from "@/app/stillinger/_common/config/axe-config";

const runAxeTest = async (container: axe.ElementContext) => {
    axe.configure(config);
    const results = await axe.run(container);
    if (results.violations.length !== 0) {
        console.log("AXE ERRORS: ", results.violations);
    }
    expect(results.violations.length).toBe(0);
};

export default runAxeTest;
