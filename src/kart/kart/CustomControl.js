import React from 'react';
import ReactDOM from 'react-dom';
import L from 'leaflet';
import PropTypes from 'prop-types';
import { MapControl } from 'react-leaflet';

export default class CustomControl extends MapControl {
    constructor(props) {
        super(props);
        this.onClick = this.props.click;
    }

    componentWillMount() {
        const customControl = L.control({ position: this.props.position });

        customControl.onAdd = () => {
            const container = L.DomUtil.create(
                'input',
                `knapp knapp--standard ${this.props.className} `
            );
            container.type = 'button';

            if (this.props.backgroundImage) {
                // eslint-disable-next-line no-unused-expressions
                this.props.backgroundImage &&
                    (container.style['background-image'] = `url(${this.props.backgroundImage})`);
                container.style['background-size'] = '100% 100%';
                container.style.height = `${this.props.big ? 66 : 33}px`;
                container.style.width = `${this.props.big ? 66 : 33}px`;
            }
            // eslint-disable-next-line no-unused-expressions
            this.props.text && (container.value = `${this.props.text}`);

            container.style.cursor = 'pointer';
            container.title = this.props.title;
            ReactDOM.render(<div />, container);
            container.onclick = this.onClick;

            return container;
        };

        this.leafletElement = customControl;
    }
}

CustomControl.defaultProptypes = {
    big: false
};

CustomControl.propTypes = {
    position: PropTypes.string.isRequired,
    click: PropTypes.func.isRequired,
    backgroundImage: PropTypes.string,
    big: PropTypes.bool,
    className: PropTypes.string,
    title: PropTypes.string.isRequired,
    text: PropTypes.string
};
