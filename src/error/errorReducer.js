import {
    ADD_TO_FAVOURITES_FAILURE,
    FETCH_FAVOURITES_FAILURE,
    REMOVE_FROM_FAVOURITES_FAILURE
} from '../favourites/favouritesReducer';
import {
    ADD_SAVED_SEARCH_FAILURE,
    FETCH_SAVED_SEARCHES_FAILURE,
    REMOVE_SAVED_SEARCH_FAILURE,
    UPDATE_SAVED_SEARCH_FAILURE
} from '../savedSearches/savedSearchesReducer';
import { SEARCH_FAILURE } from '../search/searchReducer';
import { FETCH_STILLING_FAILURE } from '../stilling/stillingReducer';
import {
    CREATE_USER_FAILURE,
    DELETE_USER_FAILURE,
    FETCH_USER_FAILURE,
    UPDATE_USER_EMAIL_FAILURE
} from '../user/userReducer';
import { FETCH_IS_AUTHENTICATED_FAILURE } from '../authentication/authenticationReducer';
import { FETCH_INTERAL_STILLING_FAILURE } from '../stilling/internalStillingReducer';

export const HIDE_ERROR = 'HIDE_ERROR';

const initialState = {
    messages: [],
    searchFailed: false
};

function prependMessage(messages, message) {
    if (messages.includes(message)) {
        return messages;
    }
    return [message, ...messages];
}

export default function errorReducer(state = initialState, action) {
    switch (action.type) {
        case HIDE_ERROR:
            return {
                ...state,
                messages: []
            };
        case FETCH_IS_AUTHENTICATED_FAILURE:
            return {
                ...state,
                messages: prependMessage(state.messages, 'Klarte ikke å sjekke om du er innlogget')
            };
        case SEARCH_FAILURE:
            return {
                ...state,
                searchFailed: true
                // TODO - Is this message necessary
                // messages: prependMessage(state.messages, 'Klarte ikke å utføre søket')
            };
        case FETCH_STILLING_FAILURE:
        case FETCH_INTERAL_STILLING_FAILURE:
            return {
                ...state,
                messages: prependMessage(state.messages, 'Klarte ikke å laste annonsen')
            };
        case FETCH_SAVED_SEARCHES_FAILURE:
            return {
                ...state,
                messages: prependMessage(state.messages, 'Klarte ikke å ikke hente lagrede søk')
            };
        case REMOVE_SAVED_SEARCH_FAILURE:
            return {
                ...state,
                messages: prependMessage(state.messages, 'Klarte ikke å slette lagret søk')
            };
        case UPDATE_SAVED_SEARCH_FAILURE:
            return {
                ...state,
                messages: prependMessage(state.messages, 'Klarte ikke å oppdatere lagret søk')
            };
        case ADD_SAVED_SEARCH_FAILURE:
            return {
                ...state,
                messages: prependMessage(state.messages, 'Klarte ikke å lagre søk')
            };
        case FETCH_FAVOURITES_FAILURE:
            return {
                ...state,
                messages: prependMessage(state.messages, 'Klarte ikke å ikke hente favoritter')
            };
        case ADD_TO_FAVOURITES_FAILURE:
            return {
                ...state,
                messages: prependMessage(state.messages, 'Klarte ikke å lagre favoritt')
            };
        case REMOVE_FROM_FAVOURITES_FAILURE:
            return {
                ...state,
                messages: prependMessage(state.messages, 'Klarte ikke å slette favoritt')
            };
        case UPDATE_USER_EMAIL_FAILURE:
            return {
                ...state,
                messages: prependMessage(state.messages, 'Klarte ikke å endre e-postadresse')
            };
        case DELETE_USER_FAILURE:
            return {
                ...state,
                messages: prependMessage(state.messages, 'Klarte ikke å slette bruker')
            };
        case CREATE_USER_FAILURE:
            return {
                ...state,
                messages: prependMessage(state.messages, 'Klarte ikke å opprette bruker')
            };
        case FETCH_USER_FAILURE:
            return {
                ...state,
                messages: prependMessage(state.messages, 'Klarte ikke å laste bruker')
            };
        default:
            return state;
    }
}

