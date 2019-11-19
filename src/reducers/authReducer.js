import {LOGIN,ERROR} from '../actions/types';

const initialState={
    isAuthenticated:false,
    user:{},
    error:''
}

const authReducer=(state=initialState,action)=>{

    switch (action.type) {
        case LOGIN:
            return {
                ...state,
                isAuthenticated:action.payload.isAuthenticated,
                user:action.payload.user
            }
        case ERROR:
            return {
                ...state,
                error:action.payload
            }
    
        default:
            return state;
    }

}

export default authReducer;