import PropTypes from 'prop-types';

export default PropTypes.shape({
    arbeidsgiver: PropTypes.string,
    tittel: PropTypes.string,
    stillingUrl: PropTypes.string,
    registreringsdato: PropTypes.string,
    soknadsfrist: PropTypes.string,
    sted: PropTypes.string
});
