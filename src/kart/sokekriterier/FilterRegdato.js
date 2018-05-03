import React from 'react';
import PropTypes from 'prop-types';
import { Radio, SkjemaGruppe } from 'nav-frontend-skjema';

export default class FilterRegdato extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            regdato: this.props.regdato
        };
    }

    onHandleChange = (e) => {
        const regdato = e.target.value;
        this.setState({
            regdato
        });
        this.props.onChange(regdato);
    };

    onHandleClick = () => {
        const regdato = '';
        this.setState({
            regdato
        });
        this.props.onChange(regdato);
    };

    render() {
        return (
            <SkjemaGruppe title="Registreringsdato" className="filter">
                <Radio
                    label="I dag"
                    value="S1"
                    name="S1"
                    checked={this.state.regdato === 'S1'}
                    onChange={this.onHandleChange}
                />
                <Radio
                    label="Siste 3 dager"
                    value="S3"
                    name="S3"
                    checked={this.state.regdato === 'S3'}
                    onChange={this.onHandleChange}
                />
                <Radio
                    label="Siste uke"
                    value="S7"
                    name="S7"
                    checked={this.state.regdato === 'S7'}
                    onChange={this.onHandleChange}
                />
                <Radio
                    label="Siste 14 dager"
                    value="S14"
                    name="S14"
                    checked={this.state.regdato === 'S14'}
                    onChange={this.onHandleChange}
                />
                <Radio
                    label="Siste måned"
                    value="S1M"
                    name="S1M"
                    checked={this.state.regdato === 'S1M'}
                    onChange={this.onHandleChange}
                />
                {this.state.regdato !== '' && (
                    <button className="lenke" onClick={this.onHandleClick}>Fjern filter</button>
                )}
            </SkjemaGruppe>
        );
    }
}

FilterRegdato.defaultProps = {
    regdato: ''
};

FilterRegdato.propTypes = {
    onChange: PropTypes.func.isRequired,
    regdato: PropTypes.string
};
