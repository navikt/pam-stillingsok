import { Ingress } from 'nav-frontend-typografi';
import React from 'react';
import { connect } from 'react-redux';
import './NoResults.less';
import { toReadableSearchQuery } from '../searchQueryReducer';

function NoResults({ readableSearchQuery }) {
    return (
        <div className="NoResults">
            <Ingress>
                Ingen treff på <b>&#34;{readableSearchQuery}&#34;</b>
            </Ingress>
        </div>
    );
}


const mapStateToProps = (state) => ({
    readableSearchQuery: toReadableSearchQuery(state.searchQuery)
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(NoResults);
