import React, { Component } from 'react';
import { Map, TileLayer, ZoomControl, GeoJSON, Pane, FeatureGroup, PropTypes as LPropTypes } from 'react-leaflet';
import ReactDOM from 'react-dom';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import L from 'leaflet';
import RouterForwarder from './RouterForwarder';
import { fromUrl, toUrl } from '../sokekriterier/SearchCriteria';
import KartPopup from './KartPopup';
import CustomControl from './CustomControl';

require('nav-frontend-knapper-style');

const ZOOM_LEVEL_KOMMUNE = 6;
const ZOOM_LEVEL_DEFAULT = 5;

class Kartleaflet extends Component {
    static finnKartHoyde() {
        const panelPadding = 16;
        const marginKart = 32;
        const headingHoyde = document.getElementById('app').getBoundingClientRect().top || 175;
        return window.innerHeight - headingHoyde - panelPadding - marginKart;
    }

    static finnKommuner(fylker) {
        return fylker.map((f) => f.kommuner).reduce((a, b) => a.concat(b), []).filter(
            (kommuner) => kommuner != null && kommuner.count != null && kommuner.count != null
        );
    }

    /**
     * Oppdaterer antall og fargelegging for alle fylker og fargelegging, 
     * uten av vi trenger å rendre hele komponenten på nytt.
     * @param layer Represeneterer et element for fylke eller kommune på kartet.
     * @param featureData Dataene for et fylke eller en kommune, 
     * altså grunnlaget for fargelegging eller antall på kartet 
     */
    static oppfriskFeature(layer, featureData) {
        const antallStillingerIFeature = featureData && featureData.count;

        layer.unbindTooltip();
        if (antallStillingerIFeature && antallStillingerIFeature > 0) {
            layer.bindTooltip(antallStillingerIFeature, {
                permanent: 'true',
                direction: 'top',
                className: 'karttooltip'
            });
            layer.on({
                mouseover: () => {
                    layer.setStyle({ weight: 3 });
                }
            });
            layer.setStyle({
                color: '#ffbd66',
                fillOpacity: 0.1,
                borderWidth: '2px',
                fillColor: '#0067C5'
            });
        } else {
            layer.setStyle({
                color: '#ffbd66',
                fillOpacity: 0
            });
        }
    }

    /** 
     * Finner stillingsinformasjon for en kommune eller fylke
     */
    static finnStillingsdata(navn, data) {
        if (data === undefined) {
            return undefined;
        }
        const treff = data.find((element) => navn === element.navn);
        return treff;
    }

    constructor(props) {
        super(props);

        this.state = {
            visKommuner: this.props.viewport.zoom >= ZOOM_LEVEL_KOMMUNE,
            visMinZoomKnapp: this.props.viewport.zoom !== ZOOM_LEVEL_DEFAULT,
            hoyde: Kartleaflet.finnKartHoyde()
        };

        this.fylker = this.props.fylker;
        this.kommuner = Kartleaflet.finnKommuner(this.fylker);
        this.searchCriteria = fromUrl(this.props.location.search);

        window.addEventListener('resize', this.oppdaterDimensjoner);

        // Sørger for at vi vet når esc for å lukke popup er gjort. Kjøres i tilleg til at popup lukkes av leaflet.
        document.getElementById('kart').onkeyup = (e) => {
            if (e.key === 'Escape') {
                this.closePopup();
            }
        };
    }

    componentWillReceiveProps() {
        this.closePopup();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (
            nextState.visKommuner !== this.state.visKommuner ||
            nextState.hoyde !== this.state.hoyde ||
            nextState.visMinZoomKnapp !== this.state.visMinZoomKnapp ||
            JSON.stringify(nextProps.fylker) !== JSON.stringify(this.fylker)
        );
    }

    componentWillUpdate(nextProps) {
        this.fylker = nextProps.fylker;
        this.kommuner = Kartleaflet.finnKommuner(nextProps.fylker);
        this.searchCriteria = fromUrl(this.props.location.search);
        this.featureGroupElement.leafletElement.unbindTooltip();
    }

    componentDidUpdate() {
        this.oppfriskFeatures.bind(this)();
    }

    onZoomChangeEnd = (e) => {
        this.closePopup();
        this.setState({
            visKommuner: e.target.getZoom() >= ZOOM_LEVEL_KOMMUNE,
            visMinZoomKnapp: e.target.getZoom() !== ZOOM_LEVEL_DEFAULT
        });
    };

    onZoomChangeStart = (e) => {
        this.closePopup();
        this.setState({
            visKommuner: e.target.getZoom() >= ZOOM_LEVEL_KOMMUNE,
            visMinZoomKnapp: e.target.getZoom() !== ZOOM_LEVEL_DEFAULT
        });
    };


    setSistePopupSted(sted) {
        this.sistePopupSted = sted;
    }

    /**
     * Ved render kjøres denne for alle fylker, og setter opp fargelegging, antall stillinger og eventer
     */
    initierFeatureKommune = (feature, layer) => {
        const featureData = Kartleaflet.finnStillingsdata(layer.feature.properties.navn, this.kommuner);
        // eslint-disable-next-line no-unused-expressions
        this.state.visKommuner && Kartleaflet.oppfriskFeature(layer, featureData);
        this.addLayerEventer(feature, layer);
    };

    /**
     * Ved render kjøres denne for alle fylker, og setter opp fargelegging, antall stillinger og eventer
     */
    initierFeatureFylke = (feature, layer) => {
        const featureData = Kartleaflet.finnStillingsdata(layer.feature.properties.navn, this.fylker);
        // eslint-disable-next-line no-unused-expressions
        this.state.visKommuner || Kartleaflet.oppfriskFeature(layer, featureData);
        this.addLayerEventer(feature, layer);
    };

    /**
     * Legger til eventer for kommuner/fylker
     * @param feature metadata fra geojson for kommune/fylke
     * @param layer posisjon og opptegning for geojson
     * @param featureData data fra stillingstjenesten for fylke/kommune
     */
    addLayerEventer(feature, layer) {
        layer.on({
            mouseover: () => {
                layer.setStyle({ weight: 3 });
                this.featureGroupElement.leafletElement.bindTooltip(feature.properties.navn);
            },
            mouseout: () => {
                layer.setStyle({ weight: 1 });
            },
            click: (e) => {
                const data = this.finnFeatureData(feature.properties.navn);
                if (
                    data &&
                    data.count > 0 &&
                    (this.sistePopupSted !== data.navn || !this.featureGroupElement.leafletElement.isPopupOpen())
                ) {
                    this.bindPopup(data, this.closePopup, e.latlng, 1);
                    this.setSistePopupSted(data.navn);
                } else {
                    this.closePopup();
                    this.featureGroupElement.leafletElement.unbindPopup();
                }
            },
            contextmenu: (e) => {
                this.mapElement.leafletElement.fitBounds(e.target.getBounds());
            }
        });
    }

    bindPopup(featureData, closePopup, latlng, startSide) {
        const popupLayer = this.featureGroupElement.leafletElement.bindPopup(
            this.lagPopupElement(featureData, this.closePopup, startSide),
            {
                className: 'kartpopup',
                autoPanPaddingTopLeft: L.point(10, 200),
                closeButton: false,
                closeOnClick: false,
                latlng
            }
        );
        popupLayer.getPopup().setLatLng(latlng);
        popupLayer.getPopup().openOn(this.featureGroupElement.leafletElement);
    }

    /**
     * Popup for kommune/fylke med stillingsdata
     * @param featureData data fra stillingstjeneten
     */
    lagPopupElement(featureData, closePopup, startSide) {
        const jsx = (
            <RouterForwarder context={this.context}>
                <KartPopup
                    searchCriteria={{
                        ...this.searchCriteria,
                        steder: [featureData.urlParameter]
                    }}
                    location={this.props.location}
                    closePopup={closePopup}
                    prepopulerteStillinger={
                        featureData.navn === 'Oslo og Akershus' ? this.props.osloAkershusStillinger : []
                    }
                    startSide={startSide}
                />
            </RouterForwarder>
        );

        const doc = document.createElement('div');
        ReactDOM.render(jsx, doc);

        return doc;
    }

    finnFeatureData(navn) {
        return Kartleaflet.finnStillingsdata(navn, this.state.visKommuner ? this.kommuner : this.fylker);
    }

    oppdaterDimensjoner = () => {
        this.setState({
            hoyde: Kartleaflet.finnKartHoyde()
        });
    };

    closePopup = () => {
        this.mapElement.leafletElement.closePopup();
        this.setSistePopupSted('lukket');
    };

    /**
     * Går gjennom alle kommuner/fylker og oppdaterer farger og antall stillinger
     */
    oppfriskFeatures() {
        const featureRefs = this.state.visKommuner ? this.kommunerElement : this.fylkerElement;
        // eslint-disable-next-line no-unused-expressions
        featureRefs &&
            featureRefs.leafletElement.getLayers().forEach((layer) => {
                const featureData = this.finnFeatureData(layer.feature.properties.navn);
                return Kartleaflet.oppfriskFeature(layer, featureData);
            });
    }

    zoomMin = () => {
        this.mapElement.leafletElement.setView({ lat: 66, lng: 18 }, 5);
        this.closePopup();
    };

    visFilter = () => {
        this.props.clickVisFilter();
    };

    tilbakeTilListe = () => {
        window.location.href = `/sok/${toUrl({
            ...this.searchCriteria,
            ...this.props.tilbakenavigeringData
        })}`;
    };

    render() {
        return (
            <div id="mapcontent">
                <div id="popupContainer" />
                <Map
                    ref={(map) => {
                        this.mapElement = map;
                    }}
                    zoomControl={false}
                    viewport={this.props.viewport}
                    onZoomend={this.onZoomChangeEnd}
                    onZoomstart={this.onZoomChangeStart}
                    maxZoom={8}
                    minZoom={5}
                    style={{ height: `${this.state.hoyde}px` }}
                    className="map"
                >
                    <ZoomControl position="bottomleft" />

                    <Pane className="kartknapper">
                        <CustomControl
                            position="topleft"
                            click={this.tilbakeTilListe}
                            className="knapp"
                            title="Tilbake til stillingslisten"
                            text="Tilbake til liste"
                        />

                        <CustomControl
                            position="topleft"
                            click={this.visFilter}
                            className="knapp filterknapp"
                            title="Stillingsfilter"
                            text="Vis filter"
                        />

                        {this.state.visMinZoomKnapp && (
                            <CustomControl
                                position="topleft"
                                click={this.zoomMin}
                                className="knapp"
                                title="Tilbakestill zoom"
                                text="Zoom ut"
                            />
                        )}
                    </Pane>

                    <TileLayer
                        url={'/sok/static/map/{z}_{x}_{y}.png'}
                        attribution="<a href='http://www.Kartleaflet.no'>Kartleaflet</a>"
                    />

                    <Pane className="geodata">
                        <FeatureGroup
                            ref={(fg) => {
                                this.featureGroupElement = fg;
                            }}
                            id="mapfeature"
                        >
                            <Pane
                                style={this.state.visKommuner ? { display: 'none' } : {}}
                                key={`fylke${this.state.visKommuner}`}
                            >
                                <GeoJSON
                                    ref={(fylker) => {
                                        this.fylkerElement = fylker;
                                    }}
                                    data={this.props.fylkegrenser}
                                    onEachFeature={this.initierFeatureFylke}
                                    style={{
                                        fillOpacity: 0,
                                        weight: 1,
                                        color: '#cccccc'
                                    }}
                                />
                            </Pane>
                            <Pane
                                style={this.state.visKommuner ? {} : { display: 'none' }}
                                key={`kommune${this.state.visKommuner}`}
                            >
                                <GeoJSON
                                    ref={(kommuner) => {
                                        this.kommunerElement = kommuner;
                                    }}
                                    data={this.props.kommunegrenser}
                                    onEachFeature={this.initierFeatureKommune}
                                    style={{
                                        fillOpacity: 0,
                                        weight: 1,
                                        color: '#cccccc'
                                    }}
                                />
                            </Pane>
                        </FeatureGroup>
                    </Pane>
                </Map>
            </div>
        );
    }
}

Kartleaflet.contextTypes = {
    router: PropTypes.object
};

Kartleaflet.propTypes = {
    location: PropTypes.shape({
        search: PropTypes.string
    }).isRequired,
    fylker: React.PropTypes.arrayOf(
        React.PropTypes.shape({
            count: React.PropTypes.string.isRequired,
            kommuner: React.PropTypes.array,
            navn: React.PropTypes.string.isRequired,
            underFasetterUrl: React.PropTypes.string,
            urlParameter: React.PropTypes.string.isRequired
        })
    ).isRequired,
    fylkegrenser: PropTypes.shape({
        type: PropTypes.string
    }).isRequired,
    kommunegrenser: PropTypes.shape({
        type: PropTypes.string
    }).isRequired,
    clickVisFilter: PropTypes.func.isRequired,
    tilbakenavigeringData: PropTypes.shape({
        steder: PropTypes.array,
        p: PropTypes.String
    }).isRequired,
    viewport: LPropTypes.viewport.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    osloAkershusStillinger: PropTypes.array.isRequired
};

export default withRouter(Kartleaflet);
