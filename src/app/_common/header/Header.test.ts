import { describe, expect, it } from "vitest";
import { getActiveMenuItem, getHeaderAuthenticationStatus, getHeaderVariant } from "@/app/_common/header/Header";
import { AuthenticationStatus } from "@/app/(nonce)/stillinger/_common/auth/contexts/AuthenticationProvider";

describe("getActiveMenuItem", () => {
    it("should return 'sommerjobb' as active menu item", () => {
        expect(getActiveMenuItem("/sommerjobb")).toBe("sommerjobb");
    });

    it("should return no active menu item", () => {
        expect(getActiveMenuItem("/sommerjobb/something")).toBe(undefined);
    });

    it("should return 'ledige-stillinger' as active menu item", () => {
        expect(getActiveMenuItem("/stillinger")).toBe("ledige-stillinger");
    });

    it("should return 'ledige-stillinger' as active menu item also for sub routes", () => {
        expect(getActiveMenuItem("/stillinger/stilling/1234")).toBe("ledige-stillinger");
    });

    it("should return no active menu item", () => {
        expect(getActiveMenuItem("/bedrift")).toBe(undefined);
    });
});

describe("getHeaderAuthenticationStatus", () => {
    it("should return 'is-authenticated' if user is logged in", () => {
        expect(getHeaderAuthenticationStatus(AuthenticationStatus.IS_AUTHENTICATED)).toBe("is-authenticated");
    });

    it("should return 'not-authenticated' if user is not logged in", () => {
        expect(getHeaderAuthenticationStatus(AuthenticationStatus.NOT_AUTHENTICATED)).toBe("not-authenticated");
    });

    it("should return 'unknown' if auth status has failure", () => {
        expect(getHeaderAuthenticationStatus(AuthenticationStatus.FAILURE)).toBe("unknown");
    });

    it("should return 'unknown' if auth status is fetching", () => {
        expect(getHeaderAuthenticationStatus(AuthenticationStatus.IS_FETCHING)).toBe("unknown");
    });

    it("should return 'unknown' if auth status is not fetched", () => {
        expect(getHeaderAuthenticationStatus(AuthenticationStatus.NOT_FETCHED)).toBe("unknown");
    });

    it("should return 'nunknown' if auth status is invalid", () => {
        expect(getHeaderAuthenticationStatus("something-else")).toBe("unknown");
    });

    it("should return 'unknown' if auth status is undefined", () => {
        expect(getHeaderAuthenticationStatus(undefined)).toBe("unknown");
    });
});

describe("getHeaderVariant", () => {
    it("should return person menu variant for front page", () => {
        expect(getHeaderVariant("/")).toBe("person");
    });

    it("should return person menu variant for ledige stillinger", () => {
        expect(getHeaderVariant("/stillinger")).toBe("person");
    });

    it("should return person menu variant for stillingsannonser", () => {
        expect(getHeaderVariant("/stillinger/stilling/1234")).toBe("person");
    });

    it("should return person menu variant for sommerjobb", () => {
        expect(getHeaderVariant("/sommerjobb")).toBe("person");
    });

    it("should return company menu variant for bedrift page", () => {
        expect(getHeaderVariant("/bedrift")).toBe("company");
    });
});
