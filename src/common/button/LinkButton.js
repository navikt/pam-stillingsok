import React from 'react';
import ButtonBase from './ButtonBase';

export default function LinkButton(props) {
    return (
        <ButtonBase {...props} type="link" />
    );
}

