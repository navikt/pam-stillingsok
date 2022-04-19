import PropTypes from "prop-types";
import React from "react";
import "./Notifications.less";

const Notifications = ({ notifications }) => (
    <div className="Notifications" role="alert" aria-live="assertive" aria-atomic={true}>
        {notifications.map((it) => (
            <React.Fragment key={it.id}>
                {it.type === "error" ? (
                    <div className="Notifications__alertstripe Notifications__alertstripe--error">{it.message}</div>
                ) : (
                    <div className="Notifications__alertstripe Notifications__alertstripe--success">{it.message}</div>
                )}
            </React.Fragment>
        ))}
    </div>
);

Notifications.propTypes = {
    notifications: PropTypes.arrayOf(
        PropTypes.shape({
            type: PropTypes.oneOf(["success", "error"]),
            message: PropTypes.string
        })
    ).isRequired
};

export default Notifications;
