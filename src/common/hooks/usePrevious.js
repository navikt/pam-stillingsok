// Henter forrige state for en komponent (tar over for previousProps fra componentDidUpdate)
import {useEffect, useRef} from "react";

export const usePrevious = (state) => {
    const ref = useRef();

    useEffect(() => {
        ref.current = state;
    });

    return ref.current;
};