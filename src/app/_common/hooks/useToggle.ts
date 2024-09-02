import { useState } from "react";

function useToggle(defaultValue: boolean = false): [boolean, () => void, () => void] {
    const [state, setState] = useState(defaultValue);

    function on(): void {
        setState(true);
    }

    function off(): void {
        setState(false);
    }

    return [state, on, off];
}

export default useToggle;
