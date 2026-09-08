import { FOLLOW_USER, GET_USERS_BY_USER_IDS, GET_USER_BY_USERNAME, GET_USER_PROFILE, SEARCH_USER, SEARCH_USER_REQUEST, SEARCH_USER_FAILURE, UNFOLLOW_USER, UPDATE_USER } from "./ActionType"

const initialState={
    reqUser:null,
    findByUsername:null,
    searchResult:[],
    searchLoading:false,
    searchError:false,
    updatedUser:null,
    followUpdate:null,
    userByIds:[],

}

export const userReducer=(store=initialState,{type,payload})=>{
    if(type===GET_USER_PROFILE){
        return {...store, reqUser:payload}
    }
    else if(type===GET_USER_BY_USERNAME){
        return{...store, findByUsername:payload}
    }
    else if(type===GET_USERS_BY_USER_IDS){
        return{...store, userByIds:payload}
    }
    else if(type===SEARCH_USER_REQUEST){
        return{...store, searchLoading:true, searchError:false}
    }
    else if(type===SEARCH_USER){
        return{...store, searchResult: Array.isArray(payload) ? payload : [], searchLoading:false, searchError:false}
    }
    else if(type===SEARCH_USER_FAILURE){
        return{...store, searchLoading:false, searchError:true, searchResult:[]}
    }
    else if(type===UPDATE_USER){
        return{...store, updatedUser:payload}
    }
    else if(type===FOLLOW_USER || type===UNFOLLOW_USER){
        return{...store, followUpdate:payload}
    }

    return store;
}
