import React from 'react';
import PropTypes from 'prop-types';
import { Column, Container, Row } from 'nav-frontend-grid';
import NavFrontendSpinner from 'nav-frontend-spinner';
import Lukknapp from 'nav-frontend-lukknapp';
import { Element } from 'nav-frontend-typografi';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';

import dataService from '../DataService';
import Sokeboks from '../sokekriterier/Sokeboks';
import FilterAnsettelsesforhold from '../sokekriterier/FilterAnsettelsesforhold';
import FilterHD from '../sokekriterier/FilterHD';
import FilterYrke from '../sokekriterier/FilterYrke';
import { fromUrl, toUrl } from '../sokekriterier/SearchCriteria';
import Kartleaflet from './Kartleaflet';
import GeojsonDataService from './GeojsonDataService';

export default class Kart extends React.Component {
    static finnFilterHoyde() {
        const panelPadding = 16;
        const headingHoyde = document.getElementById('app').getBoundingClientRect().top || 175;
        return window.innerHeight - headingHoyde - panelPadding;
    }

    static utenOsloGeojson(response) {
        return {
            fylkegrenser: {
                ...response.fylkegrenser,
                features: response.fylkegrenser.features
                    .filter((feature) => feature.properties.navn !== 'Oslo')
                    .map((feature) => ({
                        ...feature,
                        properties: {
                            ...feature.properties,
                            navn: feature.properties.navn === 'Akershus' ? 'Oslo og Akershus' : feature.properties.navn
                        }
                    }))
            },
            kommunegrenser: response.kommunegrenser
        };
    }

    constructor(props) {
        super(props);

        const searchCriteriaMedSted = fromUrl(this.props.location.search);
        const tilbakenavigeringData = {
            steder: searchCriteriaMedSted.steder,
            p: searchCriteriaMedSted.p
        };

        const searchCriteriaForKart = {
            ...searchCriteriaMedSted,
            steder: [],
            p: 0
        };

        this.state = {
            isFetching: false,
            searchCriteria: searchCriteriaForKart,
            tilbakenavigeringData,
            hoyde: Kart.finnFilterHoyde(),
            visFilterPaaMobil: false,
            geojson: {
                isFetching: false
            }
        };
    }

    componentWillMount() {
        this.props.history.replace(toUrl(this.state.searchCriteria));

        this.setState({
            geojson: {
                isFetching: true
            }
        });

        GeojsonDataService.getData().then(
            (response) => {
                const utenOsloGeojson = Kart.utenOsloGeojson(response);
                this.setState({
                    geojson: {
                        ...utenOsloGeojson,
                        isFetching: false
                    }
                });
            },
            (error) => {
                this.setState({
                    geojson: {
                        isFetching: false,
                        error
                    }
                });
            }
        );
    }

    componentDidMount() {
        this.getFylker();
        window.addEventListener('resize', this.oppdaterDimensjoner);
    }

    onSubmitSok = (sokeord) => {
        this.setState(
            {
                searchCriteria: {
                    ...this.state.searchCriteria,
                    p: 0,
                    sokeord
                }
            },
            () => {
                this.getFylker();
            }
        );
    };

    onFilterYrkeChange = (stillingtyper) => {
        this.setState(
            {
                searchCriteria: {
                    ...this.state.searchCriteria,
                    p: 0,
                    stillingtyper
                }
            },
            () => {
                this.getFylker();
            }
        );
    };

    onFilterHDChange = (hd) => {
        this.setState(
            {
                searchCriteria: {
                    ...this.state.searchCriteria,
                    p: 0,
                    hd
                }
            },
            () => {
                this.getFylker();
            }
        );
    };

    onFilterForholdChange = (forhold) => {
        this.setState(
            {
                searchCriteria: {
                    ...this.state.searchCriteria,
                    p: 0,
                    forhold
                }
            },
            () => {
                this.getFylker();
            }
        );
    };

    onVisFilterClick = () => {
        this.setState({ visFilterPaaMobil: true });
    };

    getFylker = () => {
        this.setState({
            isFetching: true
        });

        const urlParams = toUrl(this.state.searchCriteria);
        this.props.history.replace(urlParams);

        dataService.getData(`/sok/rest/stillingsok/steder/geografi${urlParams}`).then(
            (response) => {
                this.leggOsloAntallIAkershus(response);
            },
            (error) => {
                this.setState({
                    error,
                    isFetching: false
                });
            }
        );
    };

    oppdaterDimensjoner = () => {
        this.setState({ hoyde: Kart.finnFilterHoyde() });
    };

    visFilterPaaMobil = () => {
        this.setState({ visFilterPaaMobil: false });
    };

    leggOsloAntallIAkershus = (fylker) => {
        const osloFeature = fylker.find((fylke) => fylke.navn === 'Oslo');
        const akershusFeature = fylker.find((fylke) => fylke.navn === 'Akershus');

        const urlParams = toUrl({
            ...this.state.searchCriteria,
            steder: [osloFeature.urlParameter, akershusFeature.urlParameter],
            itemsPerPage: '999999'
        });

        this.setState({
            isFetching: true
        });

        dataService.getData(`/sok/rest/stillingsok/stillinger${urlParams}`).then(
            (response) => {
                if (response.unknown) {
                    response.stillinger = [];
                }


                // eslint-disable-next-line no-unused-expressions
                (this.osloAkershusStillinger = response.stillinger), // eslint-disable-line no-sequences
                this.setState({
                    isFetching: false,
                    errorOsloAkershus: undefined,
                    fylker: fylker.map(
                        (fylke) =>
                            (fylke.navn === 'Akershus'
                                ? {
                                    ...fylke,
                                    navn: 'Oslo og Akershus',
                                    count: `${response.stillinger && response.stillinger.length}`
                                }
                                : fylke)
                    )
                });
            },
            (error) => {
                this.setState({
                    error,
                    isFetching: false
                });
            }
        );
    };

    renderkartMedFilter = () => (
        <div className="panel">
            {this.state.fylker !== undefined &&
            this.state.geojson.fylkegrenser &&
            this.state.geojson.kommunegrenser &&
            this.renderLeaflet()}
        </div>
    );

    renderLeaflet = () => (
        <Kartleaflet
            fylker={this.state.fylker}
            clickVisFilter={this.onVisFilterClick}
            fylkegrenser={this.state.geojson.fylkegrenser}
            kommunegrenser={this.state.geojson.kommunegrenser}
            tilbakenavigeringData={this.state.tilbakenavigeringData}
            osloAkershusStillinger={this.osloAkershusStillinger}
            viewport={{ center: { lat: 66, lng: 18 }, zoom: 5 }}
        />
    );

    render() {
        return (
            <Container fluid id="kart" aria-hidden="true">
                <Row>
                    <Column
                        xs="12"
                        md="3"
                        id="filterkolonne"
                        className={this.state.visFilterPaaMobil ? 'vis-filter-paa-mobil' : ''}
                    >
                        <div className="panel blokk-xxs" id="kartfilter" style={{ height: this.state.hoyde }}>
                            <div className="lukk text-right">
                                <Lukknapp onClick={this.visFilterPaaMobil} />
                            </div>
                            <Sokeboks
                                sokeord={this.state.searchCriteria.sokeord}
                                onSubmitSok={this.onSubmitSok}
                                placeholder={'Søk etter yrke, stillingstittel eller bedrift'}
                            />
                            <FilterYrke
                                query={this.state.searchCriteria}
                                update={this.state.isFetching}
                                onChange={this.onFilterYrkeChange}
                                onLoaded={() => {
                                }}
                            />
                            <FilterHD
                                query={this.state.searchCriteria}
                                update={this.state.isFetching}
                                onChange={this.onFilterHDChange}
                            />
                            <FilterAnsettelsesforhold
                                forhold={this.state.searchCriteria.forhold}
                                onChange={this.onFilterForholdChange}
                            />
                        </div>
                    </Column>
                    <Column xs="12" md="9">
                        {this.state.geojson && this.state.geojson.isFetching && !document.getElementById('mapcontent') ? ( // eslint-disable-line
                            <div className="text-center">
                                <NavFrontendSpinner />
                                <Element>Laster kart</Element>
                            </div>
                        ) : this.state.isFetching && !document.getElementById('mapcontent') ? ( // eslint-disable-line no-nested-ternary
                            <div className="text-center">
                                <NavFrontendSpinner />
                                <Element>Laster kart</Element>
                            </div>
                        ) : this.state.error ? ( // eslint-disable-line no-nested-ternary
                            <AlertStripeAdvarsel>Lasting av data for kart feilet</AlertStripeAdvarsel>
                        ) : this.state.geojson && this.state.geojson.error ? ( // eslint-disable-line no-nested-ternary
                            <AlertStripeAdvarsel>Lasting av kart feilet</AlertStripeAdvarsel>
                        ) : this.state.fylker ? (
                            this.renderkartMedFilter()
                        ) : (
                            <AlertStripeAdvarsel>Lasting av kart feilet</AlertStripeAdvarsel>
                        )}
                    </Column>
                </Row>
            </Container>
        );
    }
}

Kart.propTypes = {
    history: PropTypes.shape({
        replace: PropTypes.func.isRequired
    }).isRequired,
    location: PropTypes.shape({
        search: PropTypes.string
    }).isRequired
};
