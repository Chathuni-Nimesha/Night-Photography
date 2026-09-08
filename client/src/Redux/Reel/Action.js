import { BASE_URL } from "../../Config/api";
import { handleUnauthorized } from "../../Config/auth";
import {
  CREATE_REEL_FAILURE,
  CREATE_REEL_REQUEST,
  CREATE_REEL_SUCCESS,
  DELETE_REEL_FAILURE,
  DELETE_REEL_REQUEST,
  DELETE_REEL_SUCCESS,
  GET_ALL_REELS_FAILURE,
  GET_ALL_REELS_REQUEST,
  GET_ALL_REELS_SUCCESS,
} from "./ActionType";

export const createReel = (data) => async (dispatch) => {
  dispatch({ type: CREATE_REEL_REQUEST });
  try {
    const response = await fetch(`${BASE_URL}/api/reels/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + data.jwt,
      },
      body: JSON.stringify(data.reelData),
    });

    if (handleUnauthorized(response)) return;
    if (!response.ok) {
      throw new Error("Could not publish that reel");
    }
    const responseData = await response.json();
    dispatch({
      type: CREATE_REEL_SUCCESS,
      payload: responseData,
    });
  } catch (error) {
    dispatch({
      type: CREATE_REEL_FAILURE,
      payload: error.message,
    });
  }
};

export const deleteReel = (data) => async (dispatch) => {
  dispatch({ type: DELETE_REEL_REQUEST });
  try {
    const response = await fetch(
      `${BASE_URL}/api/reels/delete/${data.reelId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + data.jwt,
        },
      }
    );
    if (handleUnauthorized(response)) return;
    if (!response.ok) {
      throw new Error("Could not delete that reel");
    }
    const responseData = await response.json();
    dispatch({
      type: DELETE_REEL_SUCCESS,
      payload: responseData,
    });
  } catch (error) {
    dispatch({
      type: DELETE_REEL_FAILURE,
      payload: error.message,
    });
  }
};

export const getAllReels = (jwt) => async (dispatch) => {
  dispatch({ type: GET_ALL_REELS_REQUEST });
  try {
    const response = await fetch(`${BASE_URL}/api/reels/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + jwt,
      },
    });
    if (handleUnauthorized(response)) return;
    if (!response.ok) {
      throw new Error("Could not load reels");
    }
    const responseData = await response.json();

    dispatch({
      type: GET_ALL_REELS_SUCCESS,
      payload: responseData,
    });
  } catch (error) {
    dispatch({
      type: GET_ALL_REELS_FAILURE,

      payload: error.message,
    });
  }
};
