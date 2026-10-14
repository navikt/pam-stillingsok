import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useEngagementTimer } from "@/app/_common/tracking/useEngagementTimer";
import { ArticleEngagementTracker } from "@/features/ung/enklere-vei-til-jobb/ui/ArticleEngagementTracker";

vi.mock("@/app/_common/tracking/useEngagementTimer", () => ({
    useEngagementTimer: vi.fn(),
}));

describe("ArticleEngagementTracker", () => {
    it("sender artikkelmetadata og tidsmålinger til engagement-hooken", () => {
        render(
            <ArticleEngagementTracker title="Article title" articleId="article-1" entryPoint="resultater" hasQuiz />,
        );

        expect(useEngagementTimer).toHaveBeenCalledWith(
            expect.objectContaining({
                eventName: "Tid - Enklere vei til jobb-artikkel",
                resetKey: "article-1",
            }),
        );

        const options = vi.mocked(useEngagementTimer).mock.calls[0]?.[0];
        expect(options?.getPayload({ tidTotalMs: 12_000, tidAktivMs: 8_000 })).toEqual({
            articleId: "article-1",
            entryPoint: "resultater",
            hasQuiz: true,
            tidTotalMs: 12_000,
            tidAktivMs: 8_000,
        });
    });
});
