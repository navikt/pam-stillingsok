import { useLayoutEffect } from "react";

export default () => {
    useLayoutEffect(() => {
        window.scrollTo(0, 0);
    }, []);
};
