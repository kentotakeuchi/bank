import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';


// initial state
const initState = {
    assets: []
};


// leaner
const getAll = ( state, action ) => {
    return updateObject( state, { assets: action.payload })
};


// reducer
const reducer = (state = initState, action) => {
    switch (action.type) {
      case actionTypes.GET_ALL_ASSET: return getAll( state, action );
      default:
        return state
    }
};

export default reducer;


// export const updateObject = (oldObject, updatedProperties) => {
//     return {
//         ...oldObject,
//         ...updatedProperties
//     };
// };