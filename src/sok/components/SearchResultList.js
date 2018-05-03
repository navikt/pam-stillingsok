import React from 'react';
import { connect } from 'react-redux';
import SearchResultItem from './SearchResultItem';

export class SearchResultList extends React.Component {

    componentDidMount() {
        try {
            let lastScrollPosition = sessionStorage.getItem('lastScrollPosition');
            if (lastScrollPosition !== null) {
                lastScrollPosition = parseInt(lastScrollPosition, 10);
                sessionStorage.removeItem('lastScrollPosition');
                window.scrollTo(0, lastScrollPosition);
            }
        } catch (e) {
            // Do nothing
        }
    }

    render() {
        const { stillinger } = this.props.searchResult;
        return (
            <div>
                {stillinger && stillinger.map((stilling) => (
                    <SearchResultItem key={stilling.uuid} stilling={stilling} />
                ))}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    searchResult: state.searchResult
});

export default connect(mapStateToProps)(SearchResultList);
