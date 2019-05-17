import * as actionTypes from './actionTypes';


export const isAuthHandler = () => {
    return {
        type: actionTypes.IS_AUTH
    };
};

export const isNotAuthHandler = () => {
    return {
        type: actionTypes.IS_NOT_AUTH
    };
};