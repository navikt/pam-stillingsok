import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { COLLAPSE_FACET_PANEL, EXPAND_FACET_PANEL } from './facetPanelsReducer';
import './Facet.less';

export function toFacetTitleWithCount(facetName, facetCount) {
    if (facetCount === 1) {
        return `${facetName} (1 valgt)`;
    } else if (facetCount > 1) {
        return `${facetName} (${facetCount} valgte)`;
    }
    return facetName;
}

class Facet extends React.Component {

    onPanelClick = () => {
        if(this.props.expandedFacetPanels.includes(this.props.panelId)) {
            this.props.collapsePanel(this.props.panelId);
        } else {
            this.props.expandPanel(this.props.panelId);
        }
    };

    render() {
        const { panelId, count, expandedFacetPanels, title, children } = this.props;
        return (
            <Ekspanderbartpanel
                tittel={toFacetTitleWithCount(title, count.length)}
                className="Facet ekspanderbartPanel--green"
                onClick={this.onPanelClick}
                apen={expandedFacetPanels.includes(panelId)}
            >
                <div
                    role="group"
                    aria-label={title}
                    className="Facet__inner"
                >
                    {children}
                </div>
            </Ekspanderbartpanel>
        );
    }
}

Facet.propTypes = {
    panelId: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
    expandedFacetPanels: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node)
    ]).isRequired
};

const mapStateToProps = (state) => ({
    expandedFacetPanels: state.facetPanels.expandedFacetPanels
});

const mapDispatchToProps = (dispatch) => ({
    expandPanel: (panelId) => dispatch({ type: EXPAND_FACET_PANEL, panelId }),
    collapsePanel: (panelId) => dispatch({ type: COLLAPSE_FACET_PANEL, panelId }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Facet);
