import {
  GET_PROGRESS_UPDATES,
  GET_PROGRESS_UPDATES_REQUEST,
  GET_PROGRESS_UPDATES_FAILURE,
  CREATE_PROGRESS_UPDATE,
  UPDATE_PROGRESS_UPDATE,
  DELETE_PROGRESS_UPDATE,
} from "./ActionType";

const initialState = {
  updates: [],
  loading: false,
  error: false,
};

export const progressReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_PROGRESS_UPDATES_REQUEST:
      return { ...state, loading: true, error: false };
    case GET_PROGRESS_UPDATES:
      return { ...state, updates: payload, loading: false, error: false };
    case GET_PROGRESS_UPDATES_FAILURE:
      return { ...state, loading: false, error: true, updates: [] };
    case CREATE_PROGRESS_UPDATE:
      return { ...state, updates: [...state.updates, payload] };
    case UPDATE_PROGRESS_UPDATE:
      return {
        ...state,
        updates: state.updates.map((item) => (item.id === payload.id ? payload : item)),
      };
    case DELETE_PROGRESS_UPDATE:
      return {
        ...state,
        updates: state.updates.filter((item) => item.id !== payload),
      };
    default:
      return state;
  }
};
