import { Ingress } from 'nav-frontend-typografi';
import React from 'react';
import { connect } from 'react-redux';
import './NoResults.less';
import searchCriteriaToString from '../../common/searchCriteriaToString';

function NoResults({ state }) {
    return (
        <div className="NoResults">
            <Ingress>
                Ingen treff på <b>&#34;{searchCriteriaToString(state)}&#34;</b>
            </Ingress>
        </div>
    );
}


const mapStateToProps = (state) => ({
    state
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(NoResults);
