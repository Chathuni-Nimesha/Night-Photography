import { BASE_URL } from "../../Config/api";
import { handleUnauthorized } from "../../Config/auth";
import { getUserProfileAction } from "../User/Action";
import {
  CREATE_NEW_POST,
  DELETE_POST,
  EDIT_POST,
  GET_SINGLE_POST,
  GET_USER_POST,
  LIKE_POST,
  REQ_USER_POST,
  SAVE_POST,
  UNLIKE_POST,
  UNSAVE_POST,
  GET_ALL_POSTS,
  GET_ALL_POSTS_FAILURE,
  GET_ALL_POSTS_REQUEST,
} from "./ActionType";

export const createPost = (data) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_URL}/api/posts/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + data.jwt,
      },
      body: JSON.stringify({
        caption: data.data.caption,
        mediaUrls: data.data.mediaUrls,
        location: data.data.location,
      }),
    });

    if (handleUnauthorized(res)) return { ok: false };
    const resData = await res.json().catch(() => null);
    if (!res.ok) {
      return { ok: false };
    }
    dispatch({ type: CREATE_NEW_POST, payload: resData });
    return { ok: true };
  } catch {
    return { ok: false };
  }
};

export const findUserPost = (data) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_URL}/api/posts/following/${data.userIds}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + data.jwt,
      },
    });

    if (handleUnauthorized(res)) return;
    const resData = await res.json().catch(() => null);

    if (!res.ok) {
      const message = resData?.message || "";
      if (/no post available/i.test(message) || /post not exist/i.test(message)) {
        dispatch({ type: GET_USER_POST, payload: [] });
        return;
      }
      dispatch({ type: GET_USER_POST, payload: [] });
      return;
    }

    dispatch({ type: GET_USER_POST, payload: Array.isArray(resData) ? resData : [] });
  } catch {
    dispatch({ type: GET_USER_POST, payload: [] });
  }
};

export const reqUserPostAction = (data) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_URL}/api/posts/all/${data.userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + data.jwt,
      },
    });

    if (handleUnauthorized(res)) return;
    const resData = await res.json().catch(() => null);
    dispatch({ type: REQ_USER_POST, payload: Array.isArray(resData) ? resData : [] });
  } catch {
    dispatch({ type: REQ_USER_POST, payload: [] });
  }
};

export const likePostAction = (data) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_URL}/api/posts/like/${data.postId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + data.jwt,
      },
      body: JSON.stringify(data.data),
    });

    if (handleUnauthorized(res)) return;
    if (!res.ok) return;
    const resData = await res.json().catch(() => null);
    if (resData?.id) dispatch({ type: LIKE_POST, payload: resData });
  } catch {
    return;
  }
};

export const unLikePostAction = (data) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_URL}/api/posts/unlike/${data.postId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + data.jwt,
      },
      body: JSON.stringify(data.data),
    });

    if (handleUnauthorized(res)) return;
    if (!res.ok) return;
    const resData = await res.json().catch(() => null);
    if (resData?.id) dispatch({ type: UNLIKE_POST, payload: resData });
  } catch {
    return;
  }
};

export const savePostAction = (data) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_URL}/api/posts/save_post/${data.postId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + data.jwt,
      },
    });
    if (handleUnauthorized(res)) return;
    if (!res.ok) return;
    const savedPost = await res.json().catch(() => ({}));
    dispatch({ type: SAVE_POST, payload: { ...savedPost, postId: data.postId } });
    if (data.jwt) dispatch(getUserProfileAction(data.jwt));
  } catch {
    return;
  }
};

export const unSavePostAction = (data) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_URL}/api/posts/unsave_post/${data.postId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + data.jwt,
      },
    });
    if (handleUnauthorized(res)) return;
    if (!res.ok) return;
    const unSavedPost = await res.json().catch(() => ({}));
    dispatch({ type: UNSAVE_POST, payload: { ...unSavedPost, postId: data.postId } });
    if (data.jwt) dispatch(getUserProfileAction(data.jwt));
  } catch {
    return;
  }
};

export const findPostByIdAction = (data) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_URL}/api/posts/${data.postId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + data.jwt,
      },
    });
    if (handleUnauthorized(res)) return;
    if (!res.ok) return;
    const found = await res.json().catch(() => null);
    if (found?.id) dispatch({ type: GET_SINGLE_POST, payload: found });
  } catch {
    return;
  }
};

export const editPOst = (data) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_URL}/api/posts/edit/${data.data.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + data.jwt,
      },
      body: JSON.stringify({
        caption: data.data.caption,
        location: data.data.location,
        mediaUrls: data.data.mediaUrls,
      }),
    });

    if (handleUnauthorized(res)) return;
    if (!res.ok) {
      throw new Error("Failed to update post");
    }

    const updatedPost = await res.json();
    dispatch({ type: EDIT_POST, payload: updatedPost });
    dispatch(getAllPostsAction({ jwt: data.jwt }));
  } catch {
    return;
  }
};

export const getAllPostsAction = (data) => async (dispatch) => {
  dispatch({ type: GET_ALL_POSTS_REQUEST });
  try {
    const res = await fetch(`${BASE_URL}/api/posts/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + data.jwt,
      },
    });

    if (handleUnauthorized(res)) return;
    const payload = await res.json().catch(() => null);

    if (!res.ok) {
      const message = payload?.message || "";
      if (res.status === 400 && /post not exist/i.test(message)) {
        dispatch({ type: GET_ALL_POSTS, payload: [] });
        return;
      }
      dispatch({ type: GET_ALL_POSTS_FAILURE, payload: "Could not load frames." });
      return;
    }

    dispatch({ type: GET_ALL_POSTS, payload: Array.isArray(payload) ? payload : [] });
  } catch {
    dispatch({ type: GET_ALL_POSTS_FAILURE, payload: "Could not load frames." });
  }
};

export const deletePostAction = (data) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_URL}/api/posts/delete/${data.postId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + data.jwt,
      },
    });

    if (handleUnauthorized(res)) return { ok: false };
    if (!res.ok) {
      return { ok: false };
    }

    const deletedPost = await res.json().catch(() => ({}));
    dispatch({ type: DELETE_POST, payload: deletedPost });
    dispatch(getAllPostsAction({ jwt: data.jwt }));
    return { ok: true };
  } catch {
    return { ok: false };
  }
};
