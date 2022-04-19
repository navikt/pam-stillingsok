import React from "react";
import Spinner from "nav-frontend-spinner";
import "./DelayedSpinner.less";

export default class DelayedSpinner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showSpinner: false
        };
    }

    componentDidMount() {
        this.spinnerTimeout = setTimeout(() => {
            this.setState({
                showSpinner: true
            });
        }, 1000);
    }

    componentWillUnmount() {
        clearTimeout(this.spinnerTimeout);
    }

    render() {
        return <div className="DelayedSpinner">{this.state.showSpinner && <Spinner type="XL" />}</div>;
    }
}
