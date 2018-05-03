import PropTypes from 'prop-types';

export default PropTypes.shape({
    uuid: PropTypes.string,
    title: PropTypes.string,
    properties: PropTypes.shape({
        updated: PropTypes.string,
        jobtitle: PropTypes.string,
        employer: PropTypes.string,
        location: PropTypes.string
    })
});
