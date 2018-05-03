import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, SkjemaGruppe } from 'nav-frontend-skjema';

export default class FilterAnsettelsesforhold extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            forhold: this.props.forhold
        };
    }

    onHandleChange = (e) => {
        let forhold = this.state.forhold;
        const value = e.target.value;
        const checked = e.target.checked;
        if (checked) {
            if (!forhold.includes(value)) {
                forhold.push(value);
            }
        } else {
            forhold = forhold.filter((f) => f !== value);
        }
        this.setState({
            forhold
        });
        this.props.onChange(forhold);
    };

    render() {
        return (
            <SkjemaGruppe title="Ferie/Sesongarbeid" className="filter">
                <Checkbox
                    label="Feriejobb"
                    value="Feriejobb"
                    name="Feriejobb"
                    className="filter-item"
                    checked={this.state.forhold.includes('Feriejobb')}
                    onChange={this.onHandleChange}
                />
                <Checkbox
                    label="Sesongarbeid"
                    value="Sesongarbeid"
                    name="Sesongarbeid"
                    className="filter-item"
                    checked={this.state.forhold.includes('Sesongarbeid')}
                    onChange={this.onHandleChange}
                />
            </SkjemaGruppe>
        );
    }
}

FilterAnsettelsesforhold.defaultProps = {
    forhold: []
};

FilterAnsettelsesforhold.propTypes = {
    onChange: PropTypes.func.isRequired,
    forhold: PropTypes.arrayOf(PropTypes.string)
};
