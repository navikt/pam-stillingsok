import * as React from 'react';
import './Popover.less';
import {useEffect} from "react";

const isDescendant = function isDescendant(parent, child) {
    let node = child.parentNode;

    while (node != null) {
        if (node === parent) {
            return true;
        }
        node = node.parentNode;
    }

    return false;
};


const Popover = ({onClose, children}) => {
    let el;

    useEffect(() => {
        document.body.addEventListener('click', onClickOutside);

        return () => {
            document.body.removeEventListener('click', onClickOutside);
        }
    }, []);

    const onClickOutside = (e) => {
        if (el !== e.target && !isDescendant(el, e.target)) {
            onClose();
        }
    };

    return (
        <div ref={(element) => {
            el = element;
        }} className="Popover">
            {children}
        </div>
    );
};

export default Popover;
