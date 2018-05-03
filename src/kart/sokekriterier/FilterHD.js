import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, SkjemaGruppe } from 'nav-frontend-skjema';

export default class FilterHD extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hd: this.props.query.hd
        };
    }

    onHandleChange = (e) => {
        let hd = this.state.hd;
        const value = e.target.value;
        const checked = e.target.checked;
        if (checked) {
            if (!hd.includes(value)) {
                hd.push(value);
            }
        } else {
            hd = hd.filter((f) => f !== value);
        }
        this.setState({
            hd
        });
        this.props.onChange(hd);
    };

    render() {
        return (
            <SkjemaGruppe title="Heltid/Deltid" className="filter">
                <Checkbox
                    label="Heltid"
                    value="Heltid+og+umerkede+stillinger"
                    name="Heltid"
                    className="filter-item"
                    checked={this.state.hd.includes('Heltid+og+umerkede+stillinger')}
                    onChange={this.onHandleChange}
                />
                <Checkbox
                    label="Deltid"
                    value="Stillinger+merket+med+deltid"
                    name="Deltid"
                    className="filter-item"
                    checked={this.state.hd.includes('Stillinger+merket+med+deltid')}
                    onChange={this.onHandleChange}
                />
            </SkjemaGruppe>
        );
    }
}

FilterHD.defaultProps = {
    query: {
        steder: [],
        forhold: [],
        hd: [],
        sokeord: undefined,
        frist: '',
        regdato: ''
    },
    update: 0
};

FilterHD.propTypes = {
    onChange: PropTypes.func.isRequired,
    query: PropTypes.shape({
        steder: PropTypes.array,
        forhold: PropTypes.array,
        hd: PropTypes.array,
        sokeord: PropTypes.string,
        frist: PropTypes.string,
        regdato: PropTypes.string
    })
};
