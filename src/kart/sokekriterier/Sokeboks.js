import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'nav-frontend-skjema';
import { Column, Row } from 'nav-frontend-grid';

export default class Sokeboks extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sokeord: props.sokeord
        };
    }

    onChangeInput = (e) => {
        this.setState({
            sokeord: e.target.value
        });
    };

    onBlur = (e) => {
        if (e.target.value === '') {
            this.props.onSubmitSok(this.state.sokeord);
        }
    };

    onSubmit = (e) => {
        e.preventDefault();
        this.props.onSubmitSok(this.state.sokeord);
    };

    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <Row>
                    <Column xs="12">
                        <div className={`search-input ${this.props.className}`}>
                            <Input
                                type="search"
                                label=""
                                placeholder={this.props.placeholder}
                                value={this.state.sokeord}
                                onChange={this.onChangeInput}
                                onBlur={this.onBlur}
                            />
                        </div>
                    </Column>
                </Row>
            </form>
        );
    }
}

Sokeboks.defaultProps = {
    sokeord: '',
    className: undefined,
    placeholder: 'Søk etter yrke, stillingstittel eller bedrift'
};

Sokeboks.propTypes = {
    onSubmitSok: PropTypes.func.isRequired,
    sokeord: PropTypes.string,
    className: PropTypes.string,
    placeholder: PropTypes.string
};
