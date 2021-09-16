import React, { useRef, useState } from 'react';
import Notifications from './Notifications';

export const NotificationsContext = React.createContext({});

/**
 * Viser grønn/rød alert-stripe på toppen av siden, når
 * andre komponenter bruker notify('Kandidaten ble lagret');
 */
export default function NotificationsProvider({ children }) {
    const [notifications, setNotifications] = useState([]);
    const notificationRef = useRef([]);
    const indexRef = useRef(0);

    const notify = (message, type = 'suksess') => {
        indexRef.current += 1;
        const id = indexRef.current;
        notificationRef.current = [...notificationRef.current, {
            id,
            message,
            type
        }];
        setNotifications(notificationRef.current);
        setTimeout(() => {
            notificationRef.current = notificationRef.current.filter((it) => it.id !== id);
            setNotifications(notificationRef.current);
        }, type === 'suksess' ? 5000 : 10000);
    };

    return (
        <NotificationsContext.Provider value={notify}>
            {children}
            <Notifications notifications={notifications} />
        </NotificationsContext.Provider>
    );
};
