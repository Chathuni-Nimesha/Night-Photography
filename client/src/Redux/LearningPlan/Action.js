import { BASE_URL } from "../../Config/api";
import { handleUnauthorized } from "../../Config/auth";
import {
  CREATE_LEARNING_PLAN,
  GET_LEARNING_PLANS_REQUEST,
  GET_LEARNING_PLANS_SUCCESS,
  GET_LEARNING_PLANS_FAILURE,
  UPDATE_LEARNING_PLAN,
  DELETE_LEARNING_PLAN,
  ADD_TOPIC,
  UPDATE_TOPIC,
  DELETE_TOPIC,
  ADD_RESOURCE,
  UPDATE_RESOURCE,
  DELETE_RESOURCE
} from "./ActionType";

export const createLearningPlan = (data) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_URL}/api/learning_plan/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + data.jwt,
      },
      body: JSON.stringify(data.planData),
    });

    if (handleUnauthorized(res)) return;
    if (!res.ok) {
      throw new Error("Could not save that plan");
    }

    const plan = await res.json();
    dispatch({ type: CREATE_LEARNING_PLAN, payload: plan });
    return plan;
  } catch (error) {
    throw error;
  }
};

export const getLearningPlans = (jwt) => async (dispatch) => {
  dispatch({ type: GET_LEARNING_PLANS_REQUEST });
  try {
    const res = await fetch(`${BASE_URL}/api/learning_plan/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + jwt,
      },
    });
    
    if (handleUnauthorized(res)) return;
    if (!res.ok) {
      throw new Error("Could not load learning plans");
    }
    
    const plans = await res.json();
    dispatch({ type: GET_LEARNING_PLANS_SUCCESS, payload: plans });
    return plans;
  } catch (error) {
    dispatch({ type: GET_LEARNING_PLANS_FAILURE, payload: true });
    throw error;
  }
};

export const updateLearningPlan = (data) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_URL}/api/learning_plan/${data.planId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + data.jwt,
      },
      body: JSON.stringify(data.planData),
    });
    
    if (handleUnauthorized(res)) return;
    if (res.status === 403) {
      throw new Error('You do not have permission to update this plan');
    }
    
    if (!res.ok) {
      throw new Error("Could not save that plan");
    }
    
    const plan = await res.json();
    dispatch({ type: UPDATE_LEARNING_PLAN, payload: plan });
    return plan;
  } catch (error) {
    throw error;
  }
};

export const deleteLearningPlan = (data) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_URL}/api/learning_plan/${data.planId}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + data.jwt,
      },
    });
    
    if (handleUnauthorized(res)) return;
    if (res.status === 403) {
      throw new Error('You do not have permission to delete this plan');
    }
    
    if (!res.ok) {
      throw new Error("Could not delete that plan");
    }
    
    dispatch({ type: DELETE_LEARNING_PLAN, payload: data.planId });
  } catch (error) {
    throw error;
  }
};

export const addTopicToPlan = (data) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_URL}/api/learning_plan/${data.planId}/topics`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + data.jwt,
      },
      body: JSON.stringify(data.topicData),
    });
    
    if (handleUnauthorized(res)) return;
    if (res.status === 403) {
      throw new Error('You do not have permission to add topics to this plan');
    }
    
    if (!res.ok) {
      throw new Error("Could not add that topic");
    }
    
    const topic = await res.json();
    dispatch({ type: ADD_TOPIC, payload: { planId: data.planId, topic } });
    return topic;
  } catch (error) {
    throw error;
  }
};

export const updateTopic = (data) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_URL}/api/learning_plan/topics/${data.topicId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + data.jwt,
      },
      body: JSON.stringify(data.topicData),
    });
    
    if (handleUnauthorized(res)) return;
    if (res.status === 403) {
      throw new Error('You do not have permission to update this topic');
    }
    
    if (!res.ok) {
      throw new Error("Could not save that topic");
    }
    
    const topic = await res.json();
    dispatch({ type: UPDATE_TOPIC, payload: topic });
    return topic;
  } catch (error) {
    throw error;
  }
};

export const deleteTopic = (data) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_URL}/api/learning_plan/topics/${data.topicId}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + data.jwt,
      },
    });
    
    if (handleUnauthorized(res)) return;
    if (res.status === 403) {
      throw new Error('You do not have permission to delete this topic');
    }
    
    if (!res.ok) {
      throw new Error("Could not delete that topic");
    }
    
    dispatch({ type: DELETE_TOPIC, payload: data.topicId });
  } catch (error) {
    throw error;
  }
};

export const addResourceToTopic = (data) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_URL}/api/learning_plan/topics/${data.topicId}/resources`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + data.jwt,
      },
      body: JSON.stringify(data.resourceData),
    });
    
    if (handleUnauthorized(res)) return;
    if (res.status === 403) {
      throw new Error('You do not have permission to add resources to this topic');
    }
    
    if (!res.ok) {
      throw new Error("Could not add that resource");
    }
    
    const resource = await res.json();
    dispatch({ type: ADD_RESOURCE, payload: { topicId: data.topicId, resource } });
    return resource;
  } catch (error) {
    throw error;
  }
};

export const updateResource = (data) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_URL}/api/learning_plan/resources/${data.resourceId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + data.jwt,
      },
      body: JSON.stringify(data.resourceData),
    });
    
    if (handleUnauthorized(res)) return;
    if (res.status === 403) {
      throw new Error('You do not have permission to update this resource');
    }
    
    if (!res.ok) {
      throw new Error("Could not save that resource");
    }
    
    const resource = await res.json();
    dispatch({ type: UPDATE_RESOURCE, payload: resource });
    return resource;
  } catch (error) {
    throw error;
  }
};

export const deleteResource = (data) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_URL}/api/learning_plan/resources/${data.resourceId}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + data.jwt,
      },
    });
    
    if (handleUnauthorized(res)) return;
    if (res.status === 403) {
      throw new Error('You do not have permission to delete this resource');
    }
    
    if (!res.ok) {
      throw new Error("Could not delete that resource");
    }
    
    dispatch({ type: DELETE_RESOURCE, payload: data.resourceId });
  } catch (error) {
    throw error;
  }
};