import PropTypes from 'prop-types';

export default PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
    count: PropTypes.number,
    municipals: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string,
        count: PropTypes.number
    }))
}));
