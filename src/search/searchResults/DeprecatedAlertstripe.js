import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import Lukknapp from 'nav-frontend-lukknapp';
import capitalizeLocation from '../../common/capitalizeLocation';
import './DeprecatedAlertstripe.less';

class DeprecatedAlertstripe extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showAlertStripe: true
        };
    }

    hideAlertStripe = () => {
        this.setState({
            showAlertStripe: false
        });
    };

    render() {
        const { deprecatedFirstLevels, deprecatedSecondLevels, deprecatedCounties, deprecatedMunicipals,
            deprecatedEngagementType, deprecatedExtent, deprecatedSector, currentSavedSearch } = this.props;

        const deprecatedOccupations = [...deprecatedFirstLevels, ...deprecatedSecondLevels];
        const deprecatedLocation = [...deprecatedCounties, ...deprecatedMunicipals];
        const deprecatedParamTitles = [
            deprecatedOccupations.length > 0 ? 'yrket' : undefined,
            deprecatedLocation.length > 0 ? 'området' : undefined,
            deprecatedExtent.length > 0 ? 'heltid/deltid' : undefined,
            deprecatedEngagementType.length > 0 ? 'ansettelsesformen' : undefined,
            deprecatedSector.length > 0 ? 'sektoren' : undefined
        ].filter((t) => t !== undefined);

        if (this.state.showAlertStripe && deprecatedParamTitles.length > 0) {
            return (
                <AlertStripeInfo solid className="DeprecatedAlertstripe">
                    <div className="DeprecatedAlertstripe__close">
                        <Lukknapp onClick={this.hideAlertStripe}>Skjul alertstripe</Lukknapp>
                    </div>
                    <Element className="DeprecatedAlertstripe__title">
                        {deprecatedParamTitles.map((t, i) => (
                            `${(i > 0 && i !== deprecatedParamTitles.length - 1) ? ', ' : ''}
                                    ${(i > 0 && i === deprecatedParamTitles.length - 1) ? ' og ' : ''}
                                    ${i === 0 ? t.charAt(0).toUpperCase() + t.substr(1) : t}`
                        ))}{' du har valgt er utgått.'}
                    </Element>
                    <Normaltekst>
                        {currentSavedSearch !== undefined
                            ? 'For å få nye treff må du fjerne utgåtte kriterier, velge nye og lagre søket på nytt.'
                            : 'For å få nye treff må du fjerne utgåtte kriterier og velge nye.'}
                    </Normaltekst>
                    <div>
                        {deprecatedOccupations.length > 0 && (
                            <div className="DeprecatedAlertstripe__queryParams">
                                <Element>Valgte yrker:</Element>
                                {deprecatedFirstLevels.map((o) => (
                                    <Normaltekst key={o}>
                                        {o}<span className="Search__expired"> (Utgått)</span>
                                    </Normaltekst>
                                ))}
                                {deprecatedSecondLevels.map((o) => (
                                    <Normaltekst key={o}>
                                        {o.split('.')[1]}
                                        <span className="Search__expired"> (Utgått)</span>
                                    </Normaltekst>
                                ))}
                            </div>
                        )}
                        {deprecatedLocation.length > 0 && (
                            <div className="DeprecatedAlertstripe__queryParams">
                                <Element>Valgte områder:</Element>
                                {deprecatedCounties.map((c) => (
                                    <Normaltekst key={c}>
                                        {capitalizeLocation(c)}
                                        <span className="Search__expired"> (Utgått)</span>
                                    </Normaltekst>
                                ))}
                                {deprecatedMunicipals.map((m) => (
                                    <Normaltekst key={m}>
                                        {capitalizeLocation(m.split('.')[1])}
                                        <span className="Search__expired"> (Utgått)</span>
                                    </Normaltekst>
                                ))}
                            </div>
                        )}
                        {deprecatedExtent.length > 0 && (
                            <div className="DeprecatedAlertstripe__queryParams">
                                <Element>Valgt heltid/deltid:</Element>
                                {deprecatedExtent.map((e) => (
                                    <Normaltekst key={e}>
                                        {e}<span className="Search__expired"> (Utgått)</span>
                                    </Normaltekst>
                                ))}
                            </div>
                        )}
                        {deprecatedEngagementType.length > 0 && (
                            <div className="DeprecatedAlertstripe__queryParams">
                                <Element>Valgte ansettelsesformer:</Element>
                                {deprecatedEngagementType.map((e) => (
                                    <Normaltekst key={e}>
                                        {e}<span className="Search__expired"> (Utgått)</span>
                                    </Normaltekst>
                                ))}
                            </div>
                        )}
                        {deprecatedSector.length > 0 && (
                            <div className="DeprecatedAlertstripe__queryParams">
                                <Element>Valgte sektorer:</Element>
                                {deprecatedSector.map((s) => (
                                    <Normaltekst key={s}>
                                        {s}<span className="Search__expired"> (Utgått)</span>
                                    </Normaltekst>
                                ))}
                            </div>
                        )}
                    </div>
                </AlertStripeInfo>
            );
        }
        return null;
    }
}

DeprecatedAlertstripe.defaultProps = {
    currentSavedSearch: undefined
};

DeprecatedAlertstripe.propTypes = {
    deprecatedFirstLevels: PropTypes.arrayOf(PropTypes.string).isRequired,
    deprecatedSecondLevels: PropTypes.arrayOf(PropTypes.string).isRequired,
    deprecatedCounties: PropTypes.arrayOf(PropTypes.string).isRequired,
    deprecatedMunicipals: PropTypes.arrayOf(PropTypes.string).isRequired,
    deprecatedEngagementType: PropTypes.arrayOf(PropTypes.string).isRequired,
    deprecatedExtent: PropTypes.arrayOf(PropTypes.string).isRequired,
    deprecatedSector: PropTypes.arrayOf(PropTypes.string).isRequired,
    currentSavedSearch: PropTypes.shape()
};

const mapStateToProps = (state) => ({
    deprecatedFirstLevels: state.occupations.deprecatedFirstLevels,
    deprecatedSecondLevels: state.occupations.deprecatedSecondLevels,
    deprecatedCounties: state.counties.deprecatedCounties,
    deprecatedMunicipals: state.counties.deprecatedMunicipals,
    deprecatedEngagementType: state.engagement.deprecatedEngagementType,
    deprecatedExtent: state.extent.deprecatedExtent,
    deprecatedSector: state.sector.deprecatedSector,
    currentSavedSearch: state.savedSearches.currentSavedSearch
});

export default connect(mapStateToProps)(DeprecatedAlertstripe);
