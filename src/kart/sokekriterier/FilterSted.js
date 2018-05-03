import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, SkjemaGruppe } from 'nav-frontend-skjema';
import { RestApiError } from '../rest';
import dataService from './../DataService';
import { toUrl } from './../sokekriterier/SearchCriteria';

export default class FilterSted extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.query = '';
    }

    componentDidMount() {
        this.query = toUrl(this.props.query).replace(/&l(\d)(=[^&]*)/g, '');
        this.getFylker(this.query);
    }

    componentDidUpdate() {
        const query = toUrl(this.props.query).replace(/&l(\d)(=[^&]*)/g, '');
        if (this.query !== query) {
            this.query = query;
            this.getFylker(query);
        }
    }

    onHandleChange = (e) => {
        const urlParameter = e.target.value;
        const checked = e.target.checked;

        if (urlParameter.indexOf('l2=') !== -1) { // Kommune
            const fylkeParameter = urlParameter.split('___')[0];
            const kommuneParameter = urlParameter.split('___')[1];
            this.setState({
                fylker: this.state.fylker.map((fylke) => {
                    if (fylke.urlParameter === fylkeParameter) {
                        return {
                            ...fylke,
                            kommuner: fylke.kommuner.map((kommune) => {
                                if (kommune.urlParameter === kommuneParameter) {
                                    return {
                                        ...kommune,
                                        isChecked: checked
                                    };
                                }
                                return kommune;
                            })
                        };
                    }
                    return fylke;
                })
            }, () => {
                this.onHandleChangeComplete();
            });
        } else if (urlParameter.indexOf('l1=') !== -1) { // Fylke
            this.setState({
                fylker: this.state.fylker.map((fylke) => {
                    if (fylke.urlParameter === urlParameter) {
                        return {
                            ...fylke,
                            isChecked: checked,
                            kommuner: fylke.kommuner.map((kommune) => {
                                if (fylke.isChecked) {
                                    return {
                                        ...kommune,
                                        isChecked: false
                                    };
                                }
                                return kommune;
                            })
                        };
                    }
                    return fylke;
                })
            }, () => {
                this.onHandleChangeComplete();
            });
        }
    };

    /**
     * Oppdaterer steder brukt i søkeparametere mot backenden
     */
    onHandleChangeComplete = () => {
        const valgteSteder = [];
        this.state.fylker.forEach((fylke) => {
            let oneOrMoreKommunerIsChecked = false;
            fylke.kommuner.forEach((kommune) => {
                if (kommune.isChecked) {
                    oneOrMoreKommunerIsChecked = true;
                    valgteSteder.push(kommune.urlParameter);
                }
            });
            if (fylke.isChecked && !oneOrMoreKommunerIsChecked) {
                valgteSteder.push(fylke.urlParameter);
            }
        });

        this.props.onChange(valgteSteder);
    };

    getFylker = () => {
        dataService.getData(`/sok/rest/stillingsok/steder/geografi${this.query}`).then(
            (response) => {
                this.setState({
                    fylker: response.map((fylke) => {
                        let oneOrMoreKommunerIsChecked = false;
                        return {
                            ...fylke,
                            kommuner: !fylke.kommuner ? [] : fylke.kommuner.map((kommune) => {
                                if (this.props.query.steder.includes(kommune.urlParameter)) {
                                    oneOrMoreKommunerIsChecked = true;
                                }
                                return {
                                    ...kommune,
                                    isChecked: this.props.query.steder.includes(kommune.urlParameter)
                                };
                            }),
                            isChecked: oneOrMoreKommunerIsChecked || this.props.query.steder.includes(fylke.urlParameter)
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
        if (this.state.fylker) {
            return (
                <SkjemaGruppe title="Sted" className="filter">
                    {this.state.fylker.map((fylke) => (
                        <div key={fylke.urlParameter}>
                            <Checkbox
                                label={`${fylke.navn} (${fylke.count})`}
                                value={fylke.urlParameter}
                                name={fylke.urlParameter}
                                className={fylke.count === '0' ? 'muted filter-item' : 'filter-item'}
                                checked={fylke.isChecked}
                                onChange={this.onHandleChange}
                            />

                            {fylke.isChecked && fylke.kommuner && fylke.kommuner.map((kommune) => (
                                <Checkbox
                                    className={kommune.count === '0' ? 'muted understed filter-item' : 'understed filter-item'}
                                    key={kommune.urlParameter}
                                    label={`${kommune.navn} (${kommune.count})`}
                                    value={`${fylke.urlParameter}___${kommune.urlParameter}`}
                                    name={kommune.urlParameter}
                                    checked={kommune.isChecked}
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

FilterSted.defaultProps = {
    query: {
        steder: []
    },
    update: 0
};

FilterSted.propTypes = {
    onChange: PropTypes.func.isRequired,
    onLoaded: PropTypes.func.isRequired,
    query: PropTypes.shape({
        steder: PropTypes.array.isRequired
    }).isRequired
};
