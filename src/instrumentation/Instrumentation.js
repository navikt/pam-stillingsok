import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { sendUrlEndring } from '../api/instrumentationApi';

class Instrumentation extends React.Component {
    componentDidMount() {
        this.logPageChange(this.props.location.pathname, this.props.location.search);
    }

    componentDidUpdate({ location: prevLocation }) {
        const {
            location: { pathname, search }
        } = this.props;
        const isDifferentPathname = pathname !== prevLocation.pathname;
        const isDifferentSearch = search !== prevLocation.search;

        if (isDifferentPathname || isDifferentSearch) {
            this.logPageChange(pathname, search);
        }
    }

    logPageChange(pathname, search = '') {
        const page = pathname + search;
        this.props.sendUrlEndring(page);
    }

    render() {
        return null;
    }
}

const mapDispatchToProps = (dispatch) => ({
    sendUrlEndring: (page) => dispatch(sendUrlEndring(page))
});

export default withRouter(connect(null, mapDispatchToProps)(Instrumentation));


