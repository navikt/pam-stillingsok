import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TermsOfUse from './TermsOfUse';
import './TermsOfUsePage.less';
import PageHeader from '../common/pageHeader/PageHeader';

class TermsOfUsePage extends React.Component {
    componentWillUpdate(nextProps) {
        if (nextProps.user !== undefined) {
            this.props.history.replace('/');
        }
    }

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
    history: PropTypes.shape({
        replace: PropTypes.func
    }).isRequired
};

const mapStateToProps = (state) => ({
    user: state.user.user
});

export default connect(mapStateToProps)(TermsOfUsePage);
