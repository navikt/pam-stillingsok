import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";
vi.mock("next/headers", () => ({
    headers: () => ({
        get: () => "mocked-header-value",
    }),
}));

// Mock `HTMLCanvasElement.getContext` for canvas-støtte
HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({});
