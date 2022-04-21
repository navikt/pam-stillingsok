import React, { useRef, useState } from "react";
import Notifications from "../components/notifications/Notifications";

export const NotificationsContext = React.createContext({});

/**
 * Notifies user with a green or red feedback message on page top.
 * Example usage:
 * notifySuccess('Saved your data') or notifyError('Something went wrong')
 */
const NotificationsProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const notificationRef = useRef([]);
    const indexRef = useRef(0);

    function notify(message, type = "success", timeout = 5000) {
        indexRef.current += 1;
        const id = indexRef.current;
        notificationRef.current = [
            ...notificationRef.current,
            {
                id,
                message,
                type
            }
        ];
        setNotifications(notificationRef.current);
        setTimeout(
            () => {
                notificationRef.current = notificationRef.current.filter((it) => it.id !== id);
                setNotifications(notificationRef.current);
            },
            type === "success" ? timeout : timeout
        );
    }

    function notifyError(message) {
        notify(message, "error", 2 * 60 * 1000); // 2min
    }

    function notifySuccess(message, timeout) {
        notify(message, "success", timeout);
    }

    return (
        <NotificationsContext.Provider value={{ notifySuccess, notifyError }}>
            <Notifications notifications={notifications} />
            {children}
        </NotificationsContext.Provider>
    );
};

export default NotificationsProvider;
