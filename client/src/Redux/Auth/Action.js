import { BASE_URL } from "../../Config/api";
import { SIGN_IN, SIGN_UP } from "./ActionType";

export const signinAction = (data) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_URL}/signin`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + btoa(data.email + ":" + data.password),
      },
    });

    if (!res.ok) {
      return { ok: false };
    }

    const headerToken = res.headers.get("Authorization");
    if (!headerToken) {
      return { ok: false };
    }

    const token = headerToken.replace(/^Bearer\s+/i, "");
    localStorage.setItem("token", token);
    dispatch({ type: SIGN_IN, payload: token });
    return { ok: true };
  } catch (error) {
    return { ok: false };
  }
};

export const signupAction = (data) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const user = await res.json().catch(() => null);
    if (!res.ok) {
      return { ok: false, message: "Could not create the account." };
    }

    dispatch({ type: SIGN_UP, payload: user });
    return { ok: true };
  } catch (error) {
    return { ok: false, message: "Could not create the account." };
  }
};
