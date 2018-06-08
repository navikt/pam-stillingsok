export const HIDE_DISCLAIMER = 'HIDE_DISCLAIMER';

const initialState = {
    shouldShow: true
};

export default function disclaimerReducer(state = initialState, action) {
    switch (action.type) {
        case HIDE_DISCLAIMER:
            return {
                ...state,
                shouldShow: false
            };
        default:
            return state;
    }
}
