import React, { useContext, useEffect, useState } from 'react';
import { userApiGet, userApiPost, userApiRemove } from '../api/userApi';
import { AD_USER_API } from '../fasitProperties';
import getWorkLocation from '../../server/common/getWorkLocation';
import getEmployer from '../../server/common/getEmployer';
import TermsOfUseNew from '../user/TermsOfUseNew';
import { REDIRECT_TO_LOGIN } from '../authentication/authenticationReducer';
import { connect } from 'react-redux';
import { fetchStilling } from '../api/api';
import ConfirmationModal from '../common/components/ConfirmationModal';
import { NotificationsContext } from '../common/notifications/NotificationsProvider';

export const FavouritesContext = React.createContext({});

/**
 * Global context for å hente, legge til og slette favoritter.
 *
 * Sørger for å håndtere innlogging eller opprettelse av bruker
 * om det er nødvending før man kan ta i bruk favoritter.
 */
function FavouritesProvider({ children, redirectToLogin }) {

    const [state, setState] = useState({
        favourites: undefined,
        isSavingOrDeleting: false,
        isFetching: false,
        fetchError: undefined,
        error: undefined,
        adToRetry: undefined,
        hasRestoredFormSessionStorage: false,
        sortBy: 'published'
    });

    const notify = useContext(NotificationsContext);

    /**
     * Fetch favoritter
     */
    useEffect(() => {
        setState((prev) => ({
            ...prev,
            isFetching: true,
            fetchError: undefined
        }));

        userApiGet(`${AD_USER_API}/api/v1/userfavouriteads?size=999&sort=favouriteAd.${state.sortBy},${state.sortBy === 'expires' ? 'asc' : 'desc'}`).then(
            (res) => {
                setState((prev) => ({
                    ...prev,
                    isFetching: false,
                    favourites: res && res.content ? res.content : []
                }));
            },
            (error) => {
                setState((prev) => ({
                    ...prev,
                    isFetching: false,
                    fetchError: error,
                    favourites: []
                }));
            }
        )
    }, [state.sortBy]);


    /**
     * Lagrer en annonse som favoritt.
     * Her kan hende man få feil fra backend, hvis man må logge inn eller opprette en bruker først.
     */
    const addFavourite = (ad) => {
        if (!state.isSavingOrDeleting && !state.isFetching) {

            setState((prev) => ({
                ...prev,
                isSavingOrDeleting: true,
                error: undefined
            }));

            const favourite = {
                favouriteAd: {
                    uuid: ad.uuid,
                    source: ad.source,
                    reference: ad.reference,
                    title: ad.title,
                    jobTitle: ad.properties.jobtitle ? ad.properties.jobtitle : null,
                    status: ad.status,
                    applicationdue: ad.properties.applicationdue ? ad.properties.applicationdue : null,
                    location: getWorkLocation(ad.properties.location, ad.locationList),
                    employer: getEmployer(ad),
                    published: ad.published,
                    expires: ad.expires
                }
            };
            userApiPost(`${AD_USER_API}/api/v1/userfavouriteads`, favourite).then(
                (res) => {
                    setState((prev) => {
                        //Annonsen kan allerede ha blitt lagret som favoritt, erstatt da med ny favoritt
                        const favouritesWithoutAd = prev.favourites.filter((it) => it.favouriteAd.uuid !== ad.uuid)
                        return ({
                            ...prev,
                            isSavingOrDeleting: false,
                            favourites: [res, ...favouritesWithoutAd]
                        });
                    });
                    notify('Stillingsannonsen er lagret i Favoritter')
                },
                (error) => {
                    setState((prev) => ({
                        ...prev,
                        isSavingOrDeleting: false,
                        error: error,
                        adToRetry: ad
                    }));
                }
            );
        }
    };

    /**
     * Hvis man må logge inn før favoritten kan lagres, så må vi huske hvilken annonse det gjelder
     */
    const onLoginClick = () => {
        if (state.adToRetry) {
            sessionStorage.setItem("ad-to-be-saved-as-favourite", state.adToRetry.uuid);
        }
        redirectToLogin();
    }

    /**
     * Forsøk å lagre annonsen på nytt hvis man måtte logget inn
     */
    useEffect(() => {
        if (state.favourites && !state.hasRestoredFormSessionStorage) {
            let uuidFromSessionStorage;
            try {
                uuidFromSessionStorage = sessionStorage.getItem('ad-to-be-saved-as-favourite');
                sessionStorage.removeItem('ad-to-be-saved-as-favourite');
            } catch (e) {
                // ignore sessionStorage errors
            }
            if (uuidFromSessionStorage) {
                fetchStilling(uuidFromSessionStorage).then((data) => {
                    addFavourite(data._source);
                });
            }
            setState((prev) => ({
                ...prev,
                hasRestoredFormSessionStorage: true
            }));
        }
    }, [state.favourites]);


    /**
     * Forsøk å lagre annonsen på nytt hvis man måtte opprette bruker
     */
    const onUserCreated = () => {
        if (state.adToRetry) {
            addFavourite(state.adToRetry);
        }
    }

    /**
     * Slett favoritt
     */
    const removeFavourite = (adUuid) => {
        if (!state.isSavingOrDeleting && !state.isFetching) {
            setState((prev) => ({
                ...prev,
                isSavingOrDeleting: true,
                error: undefined
            }));

            const favourite = state.favourites.find((f) => f.favouriteAd.uuid === adUuid);

            userApiRemove(`${AD_USER_API}/api/v1/userfavouriteads/${favourite.uuid}`).then(
                (data) => {
                    setState((prev) => ({
                        ...prev,
                        isSavingOrDeleting: false,
                        favourites: prev.favourites.filter((it) => it.favouriteAd.uuid !== adUuid)
                    }));
                    notify('Favoritten er slettet');
                },
                (error) => {
                    setState((prev) => ({
                        ...prev,
                        isSavingOrDeleting: false,
                        error: error
                    }));
                }
            )
        }
    };

    const isFavourite = (adUuid) => {
        return state.favourites !== undefined && state.favourites.findIndex((it) => it.favouriteAd.uuid === adUuid) !== -1;
    };

    const setSortBy = (field) => {
        setState((prev) => ({
            ...prev,
            sortBy: field
        }));
    };

    const onCancel = () => {
        setState((prev) => ({
            ...prev,
            error: undefined
        }));
    };


    const providerVaøues = {
        removeFavourite,
        addFavourite,
        isFavourite,
        setSortBy,
        favourites: state.favourites,
        isPending: state.isSavingOrDeleting || state.isFetching,
        isFetching: state.isFetching,
        sortBy: state.sortBy
    }

    return (
        <FavouritesContext.Provider value={providerVaøues}>
            {state.error && state.error.statusCode === 404 && (
                <TermsOfUseNew onUserCreated={onUserCreated} onCancel={onCancel}/>
            )}

            {state.error && state.error.statusCode === 401 && (
                <ConfirmationModal
                    onConfirm={onLoginClick}
                    onCancel={onCancel}
                    confirmLabel="Logg inn"
                    title="Du må logge inn for å lagre favoritter"
                >
                    Logg inn med MinID, BankID, BankID på mobil, Buypass eller Commfides.
                </ConfirmationModal>
            )}

            {state.error && state.error.statusCode !== 404 && state.error.statusCode !== 401 && (
                <ConfirmationModal
                    onConfirm={() => {
                        location.reload();
                    }}
                    onCancel={onCancel}
                    confirmLabel="Last siden på nytt"
                    title="Det oppsto en feil med favorittene"
                >
                    Forsøk å laste siden på nytt
                </ConfirmationModal>
            )}
            {children}
        </FavouritesContext.Provider>
    );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
    redirectToLogin: () => dispatch({ type: REDIRECT_TO_LOGIN })
});

export default connect(mapStateToProps, mapDispatchToProps)(FavouritesProvider);
