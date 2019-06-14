import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';


// initial state
const initState = {
    isAuth: false
};


// leaner
const isAuth = ( state, action ) => {
    return updateObject( state, { isAuth: true })
};
const isNotAuth = ( state, action ) => {
    return updateObject( state, { isAuth: false })
};


// reducer
const reducer = (state = initState, action) => {
    switch (action.type) {
      case actionTypes.IS_AUTH: return isAuth( state, action );
      case actionTypes.IS_NOT_AUTH: return isNotAuth( state, action );
      default:
        return state
    }
};

export default reducer;