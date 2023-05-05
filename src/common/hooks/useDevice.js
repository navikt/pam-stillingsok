import { useEffect, useState } from "react";

export const MOBILE_MAX_SIZE = 768;

export const Device = {
    MOBILE: "mobile",
    DESKTOP: "desktop"
};
export default function useDevice() {
    const [deviceTmp, setDeviceTmp] = useState(window.innerWidth <= MOBILE_MAX_SIZE ? Device.MOBILE : Device.DESKTOP);
    const [device, setDevice] = useState(deviceTmp);

    useEffect(() => {
        // Set device only when it changes, not on every resize event.
        if (deviceTmp !== device) {
            setDevice(deviceTmp);
        }
    }, [deviceTmp]);

    const handleResize = () => {
        if (window.innerWidth <= MOBILE_MAX_SIZE) {
            setDeviceTmp(Device.MOBILE);
        } else if (window.innerWidth > MOBILE_MAX_SIZE) {
            setDeviceTmp(Device.DESKTOP);
        }
    };

    useEffect(() => {
        addEventListener("resize", handleResize);

        return () => removeEventListener("resize", handleResize);
    }, []);

    return { device };
}
