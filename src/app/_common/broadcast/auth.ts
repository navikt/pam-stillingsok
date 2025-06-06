const AUTH_CHANNEL = "auth_channel";

type AuthEvent = { type: "USER_LOGGED_OUT"; browserTabId?: string } | { type: "USER_LOGGED_IN"; browserTabId?: string };

export const broadcastLogout = (options?: { browserTabId?: string }) => {
    const channel = new BroadcastChannel(AUTH_CHANNEL);
    channel.postMessage({
        type: "USER_LOGGED_OUT",
        browserTabId: options?.browserTabId,
    });
    channel.close();
};

export const broadcastLogin = () => {
    const channel = new BroadcastChannel(AUTH_CHANNEL);
    channel.postMessage({ type: "USER_LOGGED_IN" });
    channel.close();
};

export const listenForAuthEvents = (callback: (event: AuthEvent) => void) => {
    const channel = new BroadcastChannel(AUTH_CHANNEL);
    const handler = (event: MessageEvent<AuthEvent>) => {
        callback(event.data);
    };
    channel.addEventListener("message", handler);
    return () => {
        channel.removeEventListener("message", handler);
        channel.close();
    };
};
