import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import {
    AuthenticationContext,
    AuthenticationStatus,
} from "@/app/stillinger/_common/auth/contexts/AuthenticationProvider";
import { HasAcceptedTermsStatus, UserContext } from "@/app/stillinger/_common/user/UserProvider";
import SaveSearchButton from "./SaveSearchButton";

const { track } = vi.hoisted(() => ({
    track: vi.fn(),
}));

vi.mock("@/app/_common/umami", () => ({ track }));
vi.mock("next/navigation", () => ({
    useSearchParams: () => new URLSearchParams("q=Utvikler&education=Bachelor"),
    useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
    usePathname: () => "/stillinger",
}));
vi.mock("@/app/stillinger/_common/auth/components/LoginModal", () => ({
    default: () => null,
}));

it("sporer lagreklikk med filternøkler uten filterverdier", async () => {
    const user = userEvent.setup();

    render(
        <AuthenticationContext.Provider
            value={{
                userNameAndInfo: false,
                authenticationStatus: AuthenticationStatus.NOT_AUTHENTICATED,
                muligheterAccessStatus: undefined,
                login: vi.fn(),
                logout: vi.fn(),
                loginAndRedirect: vi.fn(),
            }}
        >
            <UserContext.Provider
                value={{
                    updateUser: vi.fn(),
                    hasAcceptedTermsStatus: HasAcceptedTermsStatus.NOT_ACCEPTED,
                }}
            >
                <SaveSearchButton />
            </UserContext.Provider>
        </AuthenticationContext.Provider>,
    );

    await user.click(screen.getByRole("button", { name: "Lagre søk" }));

    expect(track).toHaveBeenCalledWith("Klikk - Lagre søk", {
        filterKeys: ["education", "q"],
    });
});
