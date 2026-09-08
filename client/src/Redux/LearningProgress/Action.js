import { BASE_URL } from "../../Config/api";
import { handleUnauthorized } from "../../Config/auth";
import {
  GET_PROGRESS_UPDATES,
  GET_PROGRESS_UPDATES_REQUEST,
  GET_PROGRESS_UPDATES_FAILURE,
  CREATE_PROGRESS_UPDATE,
  UPDATE_PROGRESS_UPDATE,
  DELETE_PROGRESS_UPDATE,
} from "./ActionType";

export const getProgressUpdates = (jwt) => async (dispatch) => {
  dispatch({ type: GET_PROGRESS_UPDATES_REQUEST });
  try {
    const res = await fetch(`${BASE_URL}/api/progress/user`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    if (handleUnauthorized(res)) return;
    if (!res.ok) {
      dispatch({ type: GET_PROGRESS_UPDATES_FAILURE });
      return;
    }
    const data = await res.json().catch(() => []);
    dispatch({ type: GET_PROGRESS_UPDATES, payload: Array.isArray(data) ? data : [] });
  } catch (error) {
    dispatch({ type: GET_PROGRESS_UPDATES_FAILURE });
  }
};

export const createProgressUpdate = (jwt, updateData) => async (dispatch) => {
  const res = await fetch(`${BASE_URL}/api/progress/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(updateData),
  });
  if (handleUnauthorized(res)) return;
  if (!res.ok) {
    throw new Error("Could not save that note");
  }
  const data = await res.json();
  dispatch({ type: CREATE_PROGRESS_UPDATE, payload: data });
};

export const updateProgressUpdate = (jwt, id, updateData) => async (dispatch) => {
  const res = await fetch(`${BASE_URL}/api/progress/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(updateData),
  });
  if (handleUnauthorized(res)) return;
  if (!res.ok) {
    throw new Error("Could not save that note");
  }
  const data = await res.json();
  dispatch({ type: UPDATE_PROGRESS_UPDATE, payload: data });
};

export const deleteProgressUpdate = (jwt, id) => async (dispatch) => {
  const res = await fetch(`${BASE_URL}/api/progress/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${jwt}` },
  });
  if (handleUnauthorized(res)) return;
  if (!res.ok) {
    throw new Error("Could not delete that note");
  }
  dispatch({ type: DELETE_PROGRESS_UPDATE, payload: id });
};
