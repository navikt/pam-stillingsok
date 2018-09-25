import { Knapp } from 'nav-frontend-knapper';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import './ViewMode.less';
import { SET_VIEW_MODE } from './viewModeReducer';

class ViewMode extends React.Component {
    onNormalClick = () => {
        this.props.setMode('normal');
    };

    onCompactClick = () => {
        this.props.setMode('compact');
    };

    render() {
        return (
            <div className="ViewMode">
                {this.props.mode === 'compact' ? (
                    <Knapp mini className="" onClick={this.onNormalClick}>
                        Normal visning
                    </Knapp>
                ) : (
                    <Knapp mini className="" onClick={this.onCompactClick}>
                        Kompakt visning
                    </Knapp>
                )}
            </div>
        );
    }
}

ViewMode.propTypes = {
    mode: PropTypes.string.isRequired,
    setMode: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    mode: state.viewMode.mode
});

const mapDispatchToProps = (dispatch) => ({
    setMode: (mode) => dispatch({ type: SET_VIEW_MODE, mode })
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewMode);
