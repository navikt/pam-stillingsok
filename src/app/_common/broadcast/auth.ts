const AUTH_CHANNEL = "auth_channel";

type AuthEvent = { type: "USER_LOGGED_OUT" } | { type: "USER_LOGGED_IN" };

export const broadcastLogout = () => {
    const channel = new BroadcastChannel(AUTH_CHANNEL);
    channel.postMessage({ type: "USER_LOGGED_OUT" });
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
