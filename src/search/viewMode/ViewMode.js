import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ToggleGruppe, ToggleKnapp } from 'nav-frontend-skjema';
import './ViewMode.less';
import { SET_MODE } from '../searchReducer';

class ViewMode extends React.Component {
    onViewModeClick = (e) => {
        this.props.setMode(e.target.value);
    };

    render() {
        return (
            <div className="ViewMode">
                <label htmlFor="view-mode-toggle" className="skjemaelement__label">
                    Visning
                </label>
                <ToggleGruppe
                    id="view-mode-toggle"
                    className="ViewMode"
                    onChange={this.onViewModeClick}
                    name="toggleGruppe"
                >
                    <ToggleKnapp
                        value="normal"
                        defaultChecked={this.props.mode === 'normal'}
                    >
                        Normal
                    </ToggleKnapp>
                    <ToggleKnapp
                        value="compact"
                        defaultChecked={this.props.mode === 'compact'}
                    >
                        Kompakt
                    </ToggleKnapp>
                </ToggleGruppe>
            </div>
        );
    }
}

ViewMode.propTypes = {
    mode: PropTypes.string.isRequired,
    setMode: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    mode: state.search.mode
});

const mapDispatchToProps = (dispatch) => ({
    setMode: (mode) => dispatch({ type: SET_MODE, mode })
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewMode);
