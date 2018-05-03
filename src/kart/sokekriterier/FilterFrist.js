import React from 'react';
import PropTypes from 'prop-types';
import { Radio, SkjemaGruppe } from 'nav-frontend-skjema';

export default class FilterFrist extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            frist: this.props.frist
        };
    }

    onHandleChange = (e) => {
        const frist = e.target.value;
        this.setState({
            frist
        });
        this.props.onChange(frist);
    };

    onHandleClick = () => {
        const frist = '';
        this.setState({
            frist
        });
        this.props.onChange(frist);
    };

    render() {
        return (
            <SkjemaGruppe title="Søknadsfrist" className="filter">
                <Radio
                    label="I dag"
                    value="N1"
                    name="N1"
                    checked={this.state.frist === 'N1'}
                    onChange={this.onHandleChange}
                />
                <Radio
                    label="Neste 3 dager"
                    value="N3"
                    name="N3"
                    checked={this.state.frist === 'N3'}
                    onChange={this.onHandleChange}
                />
                <Radio
                    label="Neste uke"
                    value="N7"
                    name="N7"
                    checked={this.state.frist === 'N7'}
                    onChange={this.onHandleChange}
                />
                <Radio
                    label="Neste 14 dager"
                    value="N14"
                    name="N14"
                    checked={this.state.frist === 'N14'}
                    onChange={this.onHandleChange}
                />
                <Radio
                    label="Neste måned"
                    value="N1M"
                    name="N1M"
                    checked={this.state.frist === 'N1M'}
                    onChange={this.onHandleChange}
                />
                {this.state.frist !== '' && (
                    <button className="lenke" onClick={this.onHandleClick}>Fjern filter</button>
                )}
            </SkjemaGruppe>
        );
    }
}

FilterFrist.defaultProps = {
    frist: ''
};

FilterFrist.propTypes = {
    onChange: PropTypes.func.isRequired,
    frist: PropTypes.string
};
