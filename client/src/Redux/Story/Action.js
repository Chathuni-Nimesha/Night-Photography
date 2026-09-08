import { BASE_URL } from "../../Config/api";
import { handleUnauthorized } from "../../Config/auth";
import { FETCH_USER_STORY, CREATE_STORY } from "./ActionType";

export const findStoryByUserId = (data) => async (dispatch) => {
  try {
    const res = await fetch(
      `${BASE_URL}/api/stories/${data.userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + data.jwt,
        },
      }
    );
    if (handleUnauthorized(res)) return;
    if (!res.ok) {
      throw new Error("Could not load stories");
    }
    
    const stories = await res.json();
    dispatch({ type: FETCH_USER_STORY, payload: stories });
  } catch (error) {
    console.error("Error fetching stories:", error);
    dispatch({ type: FETCH_USER_STORY, payload: [] });
  }
};

export const createStory = (data) => async (dispatch) => {
  try {
    const res = await fetch(
      `${BASE_URL}/api/stories/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + data.jwt,
        },
        body: JSON.stringify(data.story),
      }
    );
    if (handleUnauthorized(res)) return;
    if (!res.ok) {
      throw new Error("Could not publish that story");
    }
    
    const createdStory = await res.json();
    dispatch({ type: CREATE_STORY, payload: createdStory });
  } catch (error) {
    console.error("Error creating story:", error);
  }
};
