import * as actionTypes from './actionTypes';

export const getAllAssetHandler = allAsset => {
    return {
        type: actionTypes.GET_ALL_ASSET,
        payload: allAsset
    };
};