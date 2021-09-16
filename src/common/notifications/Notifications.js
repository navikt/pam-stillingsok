import PropTypes from 'prop-types';
import React from 'react';
import StickyAlertStripe from '../components/StickyAlertStripe';
import './Notifications.less';

const Notifications = ({ notifications }) => {
    return (
        <div className="Notifications" aria-live="polite">
            {notifications.map((it) => (
                <div key={it.id}>
                    <StickyAlertStripe type={it.type}>
                        {it.message}
                    </StickyAlertStripe>
                </div>
            ))}
        </div>
    );
};

Notifications.propTypes = {
    notifications: PropTypes.arrayOf(PropTypes.shape({
        type: PropTypes.oneOf(['suksess', 'feil']),
        message: PropTypes.string
    })).isRequired
};

export default Notifications;
