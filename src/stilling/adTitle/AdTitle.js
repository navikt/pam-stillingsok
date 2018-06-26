import React from 'react';
import PropTypes from 'prop-types';
import { Innholdstittel, Normaltekst } from 'nav-frontend-typografi';
import './AdTitle.less';

export function commaSeparate(...strings) {
    const onlyStrings = strings.filter((string) => (
        typeof string === 'string'
    ));
    return onlyStrings.join(', ');
}

export default function AdTitle({ title, employer, location }) {
    return (
        <div className="AdTitle">
            <Normaltekst>
                {commaSeparate(employer, location)}
            </Normaltekst>
            <Innholdstittel>
                {title}
            </Innholdstittel>
        </div>
    );
}

AdTitle.defaultProps = {
    title: '',
    employer: '',
    location: ''
};

AdTitle.propTypes = {
    title: PropTypes.string,
    employer: PropTypes.string,
    location: PropTypes.string
};
