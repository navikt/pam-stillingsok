import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import runAxeTest from "@/app/stillinger/_common/utils/runAxeTest";
import SavedSearchesList from "./SavedSearchesList";
import { act } from "react";

const savedSearch = [
    {
        id: 1010,
        uuid: "a8ba7f87-6e6f-4f97-9061-04de82365f81",
        title: "Test10",
        searchQuery: "?q=test10",
        lastSearched: "2024-05-21T15:04:28.388538",
        updated: "2024-05-23T08:49:21.335147",
        duration: 0,
        expires: "2024-05-23T08:49:21.320377",
        status: "ACTIVE",
        notifyType: "EMAIL",
        userUuid: "f28e5bdd-8e92-4c7d-9f2a-477198ec78f2",
    },
];

describe("Saved search", () => {
    test("render saved search", async () => {
        const { container } = render(<SavedSearchesList data={savedSearch} />);

        await act(async () => {
            await runAxeTest(container);
        });

        const heading = screen.queryByText("Lagrede søk");

        expect(heading).toBeInTheDocument();
    });
});
