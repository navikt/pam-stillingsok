import React from 'react';
import PropTypes from 'prop-types';
import { Row, Column } from 'nav-frontend-grid';

export default class StillingListPagineringKart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: this.props.page,
            count: this.props.count
        };
    }

    onChangePage = () => {
        this.props.changePage(this.state.page);
    };

    onNextClick = () => {
        this.setState(
            {
                page: this.state.page + 1
            },
            this.onChangePage
        );
    };

    onBackClick = () => {
        this.setState(
            {
                page: this.state.page - 1
            },
            this.onChangePage
        );
    };

    render() {
        return (
            <div>
                <Row>
                    <Column xs="4" className="typo-undertekst">
                        {this.state.page > 0 && (
                            <button className="lenke nav-frontend-lenker lenke-liten" onClick={this.onBackClick} title="Gå til forrige innslag">
                                Forrige
                            </button>
                        )}
                    </Column>
                    <Column xs="4" className="sentrer typo-undertekst">
                        {this.state.page + 1}/{this.props.count}
                    </Column>
                    <Column xs="4" className="text-right typo-undertekst">
                        {this.state.page < Math.floor((this.state.count - 1) / this.props.itemsPerPage) && (
                            <button
                                className="lenke text-center nav-frontend-lenker lenke-liten"
                                onClick={this.onNextClick}
                                title="Gå til neste innslag"
                            >
                                Neste
                            </button>
                        )}
                    </Column>
                </Row>
            </div>
        );
    }
}

StillingListPagineringKart.defaultProps = {
    page: 0,
    count: 0
};

StillingListPagineringKart.propTypes = {
    changePage: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    count: PropTypes.number.isRequired,
    itemsPerPage: PropTypes.number.isRequired
};
