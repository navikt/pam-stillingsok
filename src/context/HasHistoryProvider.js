import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useLocation } from "react-router";

export const HasHistoryContext = React.createContext({});

const HasHistoryProvider = ({ children }) => {
    let location = useLocation();
    const [historyCount, setHistoryCount] = useState(0);

    useEffect(() => {
        setHistoryCount((prevState) => prevState + 1);
    }, [location]);

    return <HasHistoryContext.Provider value={{ hasHistory: historyCount > 1 }}>{children}</HasHistoryContext.Provider>;
};

HasHistoryProvider.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired
};

export default HasHistoryProvider;
