import { useEffect, useState } from "react";

export default function useDebounce(value, timeout = 500) {
    // Save a local copy of `value` in this state which is local to our hook
    const [state, setState] = useState(value);

    useEffect(() => {
        // Set timeout to run after delay
        const handler = setTimeout(() => setState(value), timeout);

        // clear the setTimeout listener on unMount
        return () => clearTimeout(handler);
    }, [value, timeout]);

    return state;
}
