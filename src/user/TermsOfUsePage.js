import React from 'react';
import PropTypes from 'prop-types';
import TermsOfUse from './TermsOfUse';
import './TermsOfUsePage.less';
import PageHeader from '../common/pageHeader/PageHeader';

export default class TermsOfUsePage extends React.Component {
    onCancelClick = () => {
        window.location.href = 'https://arbeidsplassen.nav.no';
    };

    render() {
        return (
            <div>
                <PageHeader
                    title="Samtykke"
                    backUrl="https://arbeidsplassen.nav.no"
                    backLabel="Til forsiden"
                    isInternalRedirect={false}
                />
                <div className="TermsOfUsePage">
                    <TermsOfUse
                        onCancel={this.onCancelClick}
                        redirectPage="/"
                        history={this.props.history}
                    />
                </div>
            </div>
        );
    }
}

TermsOfUsePage.propTypes = {
    history: PropTypes.shape({}).isRequired
};
