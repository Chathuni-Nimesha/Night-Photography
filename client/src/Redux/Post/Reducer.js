import {CREATE_NEW_POST, DELETE_POST, EDIT_POST, GET_ALL_POSTS, GET_ALL_POSTS_FAILURE, GET_ALL_POSTS_REQUEST, GET_SINGLE_POST, GET_USER_POST, LIKE_POST, REQ_USER_POST, SAVE_POST, UNLIKE_POST, UNSAVE_POST} from "./ActionType";

const initialState = {
  createdPost:null,
  userPost:[],
  reqUserPost:[],
  unsavePost:[],
  savedPost:null,
  likePost:null,
  singlePost:null,
  deletedPost:null,
  updatedPost:null,
  posts:[],
  postsLoading: false,
  postsError: null,
};

const replacePost = (list, updated) => {
  if (!Array.isArray(list) || !updated?.id) return list;
  return list.map((item) => (item?.id === updated.id ? { ...item, ...updated } : item));
};

const applyLikedPost = (store, payload) => ({
  ...store,
  likePost: payload,
  userPost: replacePost(store.userPost, payload),
  reqUserPost: replacePost(store.reqUserPost, payload),
  posts: replacePost(store.posts, payload),
  singlePost: store.singlePost?.id === payload?.id ? { ...store.singlePost, ...payload } : store.singlePost,
});

export const postReducer=(store=initialState, {type,payload})=>{
    if(type===CREATE_NEW_POST){
        return {...store, createdPost:payload};
    }
    else if(type===GET_USER_POST){
        return {...store, userPost:payload};
    }
    else if(type===LIKE_POST || type===UNLIKE_POST){
        return applyLikedPost(store, payload);
    }
    else if(type===REQ_USER_POST){
        return {...store, reqUserPost:payload};
    }
    else if(type===SAVE_POST){
        return {...store, savedPost:payload};
    }
    else if(type===UNSAVE_POST){
        return {...store, unsavePost:payload};
    }
    else if(type===GET_SINGLE_POST){
        return{...store, singlePost:payload}
    }
    else if(type===DELETE_POST){
        return{...store, deletedPost:payload}
    }
    else if(type===EDIT_POST){
        return{...store,updatedPost:payload}
    }
    else if(type===GET_ALL_POSTS_REQUEST){
        return{...store, postsLoading:true, postsError:null}
    }
    else if(type===GET_ALL_POSTS){
        return{...store,posts:payload, postsLoading:false, postsError:null}
    }
    else if(type===GET_ALL_POSTS_FAILURE){
        return{...store, postsLoading:false, postsError:payload, posts:[]}
    }
    return store;
}