import { CREATE_COMMENT, DELETE_COMMENT, EDIT_COMMENT, GET_ALL_COMMENT, GET_POST_COMMENT, LIKE_COMMENT, UNLIKE_COMMENT } from "./ActionType"

const initialState={
    createdComment:null,
    postComments:null,
    likedComment:null,
    updatedComment:null,
    deletedComment:null,
    comments:null,
}

export const commentReducer=(store=initialState,{type,payload})=>{
    if(type===CREATE_COMMENT){
        const list = Array.isArray(store.comments) ? store.comments : [];
        const already = payload?.id && list.some((item) => item?.id === payload.id);
        return {
            ...store,
            createdComment: payload,
            comments: already || !payload ? list : [...list, payload],
        };
    }
    else if(type===GET_POST_COMMENT){
        return {...store, postComments:payload}
    }
    else if(type===LIKE_COMMENT || type===UNLIKE_COMMENT){
        const list = Array.isArray(store.comments) ? store.comments : [];
        return {
            ...store,
            likedComment: payload,
            comments: payload?.id ? list.map((item) => (item?.id === payload.id ? payload : item)) : list,
        };
    }
    else if(type===EDIT_COMMENT){
        const list = Array.isArray(store.comments) ? store.comments : [];
        return {
            ...store,
            updatedComment: payload,
            comments: payload?.id
                ? list.map((item) => (item?.id === payload.id ? { ...item, content: payload.content } : item))
                : list,
        };
    }
    else if(type===DELETE_COMMENT){
        const list = Array.isArray(store.comments) ? store.comments : [];
        return {
            ...store,
            deletedComment: payload,
            comments: payload?.id ? list.filter((item) => item?.id !== payload.id) : list,
        };
    }
    else if(type===GET_ALL_COMMENT){
        return{...store,comments: Array.isArray(payload) ? payload : []}
    }
    return store;
}