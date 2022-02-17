import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {authenticationEnum, REDIRECT_TO_LOGIN} from '../authentication/authenticationReducer';
import {LOGOUT_URL} from '../fasitProperties';
import {USER_IS_UNDER_FIFTEEN} from "../user/userReducer";
import './TopMenu.less';

const TopMenu = ({isAuthenticated, redirectToLogin, setErUnderFemten}) => {

    const [userInfo, setUserInfo] = useState(undefined);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    useEffect(() => {
        if (!userInfo) {
            if (process.env.NODE_ENV === 'production') {
                fetch('/api/cv/rest/person/headerinfo', {
                    method: 'GET',
                    credentials: 'include'
                })
                    .then((response) => response.json())
                    .then((result) => {
                        setUserInfo(result);
                        setErUnderFemten(userInfo.erUnderFemten)
                    });
            } else {
                const testData = {
                    underOppfolging: true,
                    fornavn: 'Kristin',
                    etternavn: 'Lavransdatter',
                    erUnderFemten: false
                }
                setUserInfo(testData);
                setErUnderFemten(testData.erUnderFemten);
            }
        }
    }, []);

    useEffect(() => {
        const header = document.getElementById('arbeidsplassen-header-menu');
        header.className = showMobileMenu ? '' : 'arbeidsplassen-header-menu-hidden';
    }, [showMobileMenu])

    return (
        <React.Fragment>
            {isAuthenticated === authenticationEnum.IS_AUTHENTICATED && (
                <React.Fragment>
                    {ReactDOM.createPortal(
                        <button onClick={() => {
                            window.location.href = LOGOUT_URL;
                        }}>
                            Logg ut
                        </button>,
                        document.getElementById('arbeidsplassen-header-login-container')
                    )}
                    {ReactDOM.createPortal(
                        <React.Fragment>
                            {userInfo && userInfo.fornavn && userInfo.etternavn ? userInfo.fornavn + " " + userInfo.etternavn : ""}
                        </React.Fragment>,
                        document.getElementById('arbeidsplassen-header-current-user-container')
                    )}
                </React.Fragment>
            )}
            {isAuthenticated === authenticationEnum.NOT_AUTHENTICATED && (
                <React.Fragment>
                    {ReactDOM.createPortal(
                        <button onClick={(role) => {
                            redirectToLogin(role);
                        }}>
                            Logg inn
                        </button>,
                        document.getElementById('arbeidsplassen-header-login-container')
                    )}
                </React.Fragment>
            )}
            {ReactDOM.createPortal(
                <button
                    aria-expanded={showMobileMenu}
                    aria-controls="arbeidsplassen-header-menu-wrapper"
                    onClick={() => {
                        setShowMobileMenu(!showMobileMenu);
                    }}
                >
                    Meny
                </button>,
                document.getElementById('arbeidsplassen-header-menu-button-container')
            )}
        </React.Fragment>
    )
};

TopMenu.propTypes = {
    isAuthenticated: PropTypes.string.isRequired,
    setErUnderFemten: PropTypes.func.isRequired,
    redirectToLogin: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.authentication.isAuthenticated
});

const mapDispatchToProps = (dispatch) => ({
    redirectToLogin: (role) => dispatch({type: REDIRECT_TO_LOGIN, role}),
    setErUnderFemten: (erUnderFemten) => dispatch({ type: USER_IS_UNDER_FIFTEEN, erUnderFemten})
});

export default connect(mapStateToProps, mapDispatchToProps)(TopMenu);
