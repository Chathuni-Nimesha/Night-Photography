import { BASE_URL } from "../../Config/api";
import { handleUnauthorized } from "../../Config/auth";
import {
  FOLLOW_USER,
  GET_USERS_BY_USER_IDS,
  GET_USER_BY_USERNAME,
  GET_USER_PROFILE,
  SEARCH_USER,
  SEARCH_USER_REQUEST,
  SEARCH_USER_FAILURE,
  UNFOLLOW_USER,
  UPDATE_USER,
} from "./ActionType";

export const getUserProfileAction = (token) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_URL}/api/users/req`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });

    if (handleUnauthorized(res)) return;
    if (!res.ok) return;
    const reqUser = await res.json().catch(() => null);
    if (reqUser) dispatch({ type: GET_USER_PROFILE, payload: reqUser });
  } catch {
    return;
  }
};

export const findByUsernameAction = (data) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_URL}/api/users/username/${data.username}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + data.token,
      },
    });

    if (handleUnauthorized(res)) return;
    if (!res.ok) return;
    const user = await res.json();
    dispatch({ type: GET_USER_BY_USERNAME, payload: user });
  } catch {
    return;
  }
};

export const findByUserIdsAction = (data) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_URL}/api/users/m/${data.userIds}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + data.jwt,
      },
    });

    if (handleUnauthorized(res)) return;
    if (!res.ok) return;
    const users = await res.json();
    dispatch({ type: GET_USERS_BY_USER_IDS, payload: users });
  } catch {
    return;
  }
};

export const followUserAction = (data) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_URL}/api/users/follow/${data.userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + data.jwt,
      },
    });

    if (handleUnauthorized(res)) return { ok: false };
    if (!res.ok) return { ok: false };
    dispatch({ type: FOLLOW_USER, payload: { userId: data.userId } });
    if (data.jwt) dispatch(getUserProfileAction(data.jwt));
    return { ok: true };
  } catch {
    return { ok: false };
  }
};

export const unFollowUserAction = (data) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_URL}/api/users/unfollow/${data.userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + data.jwt,
      },
    });

    if (handleUnauthorized(res)) return { ok: false };
    if (!res.ok) return { ok: false };
    dispatch({ type: UNFOLLOW_USER, payload: { userId: data.userId } });
    if (data.jwt) dispatch(getUserProfileAction(data.jwt));
    return { ok: true };
  } catch {
    return { ok: false };
  }
};

export const searchUserAction = (data) => async (dispatch) => {
  dispatch({ type: SEARCH_USER_REQUEST });
  try {
    const res = await fetch(`${BASE_URL}/api/users/search?q=${encodeURIComponent(data.query)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + data.jwt,
      },
    });

    if (handleUnauthorized(res)) return;
    if (!res.ok) {
      dispatch({ type: SEARCH_USER_FAILURE });
      return;
    }

    const users = await res.json().catch(() => null);
    if (!Array.isArray(users)) {
      dispatch({ type: SEARCH_USER_FAILURE });
      return;
    }

    dispatch({ type: SEARCH_USER, payload: users });
  } catch {
    dispatch({ type: SEARCH_USER_FAILURE });
  }
};

export const editUserDetailsAction = (data) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_URL}/api/users/account/edit`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + data.jwt,
      },
      body: JSON.stringify(data.data),
    });

    if (handleUnauthorized(res)) return { ok: false };
    if (!res.ok) return { ok: false };
    const users = await res.json();
    dispatch({ type: UPDATE_USER, payload: users });
    if (users) dispatch({ type: GET_USER_PROFILE, payload: users });
    return { ok: true };
  } catch {
    return { ok: false };
  }
};
