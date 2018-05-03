import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, SkjemaGruppe } from 'nav-frontend-skjema';
import { RestApiError } from '../rest';
import dataService from './../DataService';
import { toUrl } from './../sokekriterier/SearchCriteria';

export default class FilterYrke extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.query = '';
    }

    componentDidMount() {
        this.query = toUrl(this.props.query).replace(/&s(\d)(=[^&]*)/g, '');
        this.getYrker(this.query);
    }

    componentDidUpdate() {
        const query = toUrl(this.props.query).replace(/&s(\d)(=[^&]*)/g, '');
        if (this.query !== query) {
            this.query = query;
            this.getYrker(query);
        }
    }

    onHandleChange = (e) => {
        const urlParameter = e.target.value;
        const checked = e.target.checked;

        if (urlParameter.indexOf('s2=') !== -1) { // UnderYrke
            const yrkeParameter = urlParameter.split('___')[0];
            const underYrkeParameter = urlParameter.split('___')[1];
            this.setState({
                yrker: this.state.yrker.map((yrke) => {
                    if (yrke.urlParameter === yrkeParameter) {
                        return {
                            ...yrke,
                            underYrker: yrke.underYrker.map((underYrke) => {
                                if (underYrke.urlParameter === underYrkeParameter) {
                                    return {
                                        ...underYrke,
                                        isChecked: checked
                                    };
                                }
                                return underYrke;
                            })
                        };
                    }
                    return yrke;
                })
            }, () => {
                this.onHandleChangeComplete();
            });
        } else if (urlParameter.indexOf('s1=') !== -1) { // Yrke
            this.setState({
                yrker: this.state.yrker.map((yrke) => {
                    if (yrke.urlParameter === urlParameter) {
                        return {
                            ...yrke,
                            isChecked: checked,
                            showUnderYrker: checked,
                            underYrker: yrke.underYrker.map((underYrke) => {
                                if (yrke.isChecked) {
                                    return {
                                        ...underYrke,
                                        isChecked: false
                                    };
                                }
                                return underYrke;
                            })
                        };
                    }
                    return yrke;
                })
            }, () => {
                this.onHandleChangeComplete();
            });
        }
    };

    onHandleChangeComplete = () => {
        const valgteSteder = [];
        this.state.yrker.forEach((yrke) => {
            let foundCheckedUnderYrke = false;
            yrke.underYrker.forEach((underYrke) => {
                if (underYrke.isChecked) {
                    foundCheckedUnderYrke = true;
                    valgteSteder.push(underYrke.urlParameter);
                }
            });
            if (yrke.isChecked && !foundCheckedUnderYrke) {
                valgteSteder.push(yrke.urlParameter);
            }
        });

        this.props.onChange(valgteSteder);
    };

    getYrker = () => {
        dataService.getData(`/sok/rest/stillingsok/yrker/stillingstype${this.query}`).then(
            (response) => {
                this.setState({
                    yrker: response.map((yrke) => {
                        let oneOrMoreUnderYrkerIsChecked = false;
                        return {
                            ...yrke,
                            underYrker: !yrke.yrker ? [] : yrke.yrker.map((underYrke) => {
                                if (this.props.query.stillingtyper.includes(underYrke.urlParameter)) {
                                    oneOrMoreUnderYrkerIsChecked = true;
                                }
                                return {
                                    ...underYrke,
                                    isChecked: this.props.query.stillingtyper.includes(underYrke.urlParameter)
                                };
                            }),
                            isChecked: oneOrMoreUnderYrkerIsChecked || this.props.query.stillingtyper.includes(yrke.urlParameter)
                        };
                    })
                }, () => {
                    this.props.onLoaded();
                });
            },
            (error) => {
                if (error instanceof RestApiError) {
                    this.setState({
                        error
                    });
                } else {
                    throw error;
                }
            }
        );
    };

    render() {
        if (this.state.yrker) {
            return (
                <SkjemaGruppe title="Yrke" className="filter">
                    {this.state.yrker.map((yrke) => (
                        <div key={yrke.urlParameter}>
                            <Checkbox
                                label={`${yrke.navn} (${yrke.count})`}
                                value={yrke.urlParameter}
                                name={yrke.urlParameter}
                                className={yrke.count === '0' ? 'muted filter-item' : 'filter-item'}
                                checked={yrke.isChecked}
                                onChange={this.onHandleChange}
                            />

                            {yrke.isChecked && yrke.underYrker && yrke.underYrker.map((underYrke) => (
                                <Checkbox
                                    className={underYrke.count === '0' ? 'muted understed filter-item' : 'understed filter-item'}
                                    key={underYrke.urlParameter}
                                    label={`${underYrke.navn} (${underYrke.count})`}
                                    value={`${yrke.urlParameter}___${underYrke.urlParameter}`}
                                    name={underYrke.urlParameter}
                                    checked={underYrke.isChecked}
                                    onChange={this.onHandleChange}
                                />
                            ))}
                        </div>
                    ))}
                </SkjemaGruppe>
            );
        }
        return (
            <div />
        );
    }
}

FilterYrke.defaultProps = {
    query: {
        stillingtyper: []
    },
    update: 0
};

FilterYrke.propTypes = {
    onChange: PropTypes.func.isRequired,
    onLoaded: PropTypes.func.isRequired,
    query: PropTypes.shape({
        stillingtyper: PropTypes.array.isRequired
    }).isRequired
};
