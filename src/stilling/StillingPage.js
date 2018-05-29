import React from 'react';
import { Container } from 'nav-frontend-grid';
import Stilling from './components/Stilling';
import { fetchStilling } from './api';
import './stilling.less';

export default class StillingPage extends React.Component {
    constructor(props) {
        super(props);
        const urlFragments = window.location.href.split('/');
        this.state = {
            id: urlFragments[urlFragments.length - 1],
            stilling: undefined
        };
    }

    componentDidMount() {
        this.fetch();
    }

    fetch = () => {
        fetchStilling(this.state.id).then(
            (response) => {
                this.setState({
                    stilling: response.hits.hits[0]
                });
            },
            (error) => {
                this.setState({
                    error
                });
            }
        );
    };

    render() {
        return (
            <div>
                {this.state.error && (
                    <Container>Det oppstod en feil</Container>
                )}

                {this.state.stilling && (
                    <Stilling stilling={this.state.stilling} />
                )}
            </div>
        );
    }
}
