import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useLocation } from "react-router";

export const HistoryContext = React.createContext({});

function HistoryProvider({ children }) {
    const location = useLocation();
    const [currentLocation, setCurrentLocation] = useState(undefined);
    const [previousLocation, setPreviousLocation] = useState(undefined);
    const [historyCount, setHistoryCount] = useState(0);

    useEffect(() => {
        setCurrentLocation(location);
        setPreviousLocation(currentLocation);
        setHistoryCount((prevState) => prevState + 1);
    }, [location]);

    return (
        <HistoryContext.Provider value={{ previousLocation, hasHistory: historyCount > 1 }}>
            {children}
        </HistoryContext.Provider>
    );
}

HistoryProvider.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default HistoryProvider;
