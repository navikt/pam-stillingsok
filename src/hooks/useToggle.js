import { useState } from "react";

function useToggle(defaultValue = false) {
    const [state, setState] = useState(defaultValue);

    function on() {
        setState(true);
    }

    function off() {
        setState(false);
    }

    return [state, on, off];
}

export default useToggle;
