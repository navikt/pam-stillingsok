// eslint-disable-next-line
import { expect } from "vitest";
// eslint-disable-next-line
import axe from "axe-core";
import config from "@/app/_common/config/axe-config";

const runAxeTest = async (container) => {
    axe.configure(config);
    const results = await axe.run(container);
    if (results.violations.length !== 0) {
        console.log("AXE ERRORS: ", results.violations);
    }
    expect(results.violations.length).toBe(0);
};

export default runAxeTest;
