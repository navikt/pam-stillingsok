import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { Element } from 'nav-frontend-typografi';
import Lukknapp from 'nav-frontend-lukknapp';
import DelayedSpinner from '../loading/DelayedSpinner';
import SearchResultItem from './SearchResultsItem';
import SearchResultsItemCompact from './SearchResultsItemCompact';
import Pagination from '../pagination/Pagination';
import NoResults from '../noResults/NoResults';
import { PAGE_SIZE } from '../searchReducer';
import './SearchResults.less';

class SearchResults extends React.Component {
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
        const { searchResult, isSearching, page, mode, deprecatedFirstLevels, deprecatedSecondLevels,
            deprecatedCounties, deprecatedMunicipals, deprecatedEngagementType, deprecatedExtent,
            deprecatedSector } = this.props;

        if (searchResult) {
            const { stillinger, total } = searchResult;
            const totalPages = total / PAGE_SIZE;
            const hasMore = page + 1 < totalPages;
            const count = ((page * PAGE_SIZE) + PAGE_SIZE) > total ? total : (page * PAGE_SIZE) + PAGE_SIZE;

            const deprecatedParams = [...deprecatedFirstLevels, ...deprecatedSecondLevels, ...deprecatedCounties,
                ...deprecatedMunicipals, ...deprecatedExtent, ...deprecatedEngagementType, ...deprecatedSector];
            const deprecatedParamTitles = [
                deprecatedFirstLevels.length > 0 || deprecatedSecondLevels.length > 0 ? 'yrket' : undefined,
                deprecatedCounties.length > 0 || deprecatedMunicipals.length > 0 ? 'området' : undefined,
                deprecatedExtent.length > 0 ? 'heltid/deltid' : undefined,
                deprecatedEngagementType.length > 0 ? 'ansettelsesformen' : undefined,
                deprecatedSector.length > 0 ? 'sektoren' : undefined
            ].filter((t) => t !== undefined);
            return (
                <div role="region" className="SearchResults">
                    <div>
                        {this.state.showAlertStripe && deprecatedParams.length > 0 && (
                            <AlertStripeInfo solid className="SearchResults__deprecatedParams">
                                <div className="SearchResults__AlertStripe__close">
                                    <Lukknapp onClick={this.hideAlertStripe}>Skjul alertstripe</Lukknapp>
                                </div>
                                <Element className="SearchResults__AlertStripe__title">
                                    {deprecatedParamTitles.map((t, i) => (
                                        `${(i > 0 && i !== deprecatedParamTitles.length - 1) ? ', ' : ''}
                                    ${(i > 0 && i === deprecatedParamTitles.length - 1) ? ' og ' : ''}
                                    ${i === 0 ? t.charAt(0).toUpperCase() + t.substr(1) : t}`
                                    ))}{' du har valgt har blitt endret eller slettet'}
                                </Element>
                                {deprecatedParams.map((p, i) => (
                                    `${(i > 0 && i !== deprecatedParams.length - 1) ? ', ' : ''}
                                ${(i > 0 && i === deprecatedParams.length - 1) ? ' og ' : ''}«${p}»`
                                ))}{' finnes ikke lenger. For å få treff må du velge nye kriterier og lagre søket på nytt.'}
                            </AlertStripeInfo>
                        )}

                        {mode !== 'compact' && stillinger && stillinger.map((stilling) => (
                            <SearchResultItem
                                key={stilling.uuid}
                                stilling={stilling}
                            />
                        ))}

                        {mode === 'compact' && stillinger && stillinger.map((stilling) => (
                            <SearchResultsItemCompact
                                key={stilling.uuid}
                                stilling={stilling}
                            />
                        ))}

                        {hasMore && (
                            <div className="SearchResults__numberOfTotal typo-normal">
                                Viser {count} av {total} treff
                            </div>
                        )}

                        {!isSearching && total === 0 && (
                            <NoResults />
                        )}

                        <div className="SearchResults__end">
                            {total > 0 && !isSearching && !hasMore && (
                                <div className="SearchResults__numberOfTotal typo-normal">
                                    Viser {count} av {total} treff
                                </div>
                            )}
                            {hasMore && (
                                <Pagination />
                            )}
                        </div>
                    </div>
                </div>
            );
        }
        return (
            <div role="region" className="SearchResults">
                <div className="SearchResults__spinner">
                    <DelayedSpinner />
                </div>
            </div>
        );
    }
}

SearchResults.defaultProps = {
    searchResult: undefined
};

SearchResults.propTypes = {
    searchResult: PropTypes.shape({
        stillinger: PropTypes.arrayOf(PropTypes.object),
        total: PropTypes.number
    }),
    isSearching: PropTypes.bool.isRequired,
    page: PropTypes.number.isRequired,
    mode: PropTypes.string.isRequired,
    deprecatedFirstLevels: PropTypes.arrayOf(PropTypes.string).isRequired,
    deprecatedSecondLevels: PropTypes.arrayOf(PropTypes.string).isRequired,
    deprecatedCounties: PropTypes.arrayOf(PropTypes.string).isRequired,
    deprecatedMunicipals: PropTypes.arrayOf(PropTypes.string).isRequired,
    deprecatedEngagementType: PropTypes.arrayOf(PropTypes.string).isRequired,
    deprecatedExtent: PropTypes.arrayOf(PropTypes.string).isRequired,
    deprecatedSector: PropTypes.arrayOf(PropTypes.string).isRequired
};

const mapStateToProps = (state) => ({
    isSearching: state.search.isSearching,
    searchResult: state.search.searchResult,
    page: state.search.page,
    mode: state.viewMode.mode,
    deprecatedFirstLevels: state.occupations.deprecatedFirstLevels,
    deprecatedSecondLevels: state.occupations.deprecatedSecondLevels,
    deprecatedCounties: state.counties.deprecatedCounties,
    deprecatedMunicipals: state.counties.deprecatedMunicipals,
    deprecatedEngagementType: state.engagement.deprecatedEngagementType,
    deprecatedExtent: state.extent.deprecatedExtent,
    deprecatedSector: state.sector.deprecatedSector
});

export default connect(mapStateToProps)(SearchResults);
