/* eslint-disable no-undef */
import { useEffect } from 'react';

export default (title) => {
    useEffect(() => {
        document.title = title;
    }, []);
};
