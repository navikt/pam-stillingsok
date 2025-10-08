import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";
vi.mock("next/headers", () => ({
    headers: () => ({
        get: () => "mocked-header-value",
    }),
}));

process.env.TZ = "Europe/Oslo";

// Mock `HTMLCanvasElement.getContext` for canvas-støtte
HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({});
