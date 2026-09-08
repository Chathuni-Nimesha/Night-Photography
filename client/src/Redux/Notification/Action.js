// Redux/Notification/Action.js
import { BASE_URL } from "../../Config/api";
import { handleUnauthorized } from "../../Config/auth";
import {
    GET_NOTIFICATIONS,
    GET_NOTIFICATIONS_REQUEST,
    GET_UNREAD_NOTIFICATIONS,
    MARK_NOTIFICATION_AS_READ,
    DELETE_NOTIFICATION,
    CREATE_NOTIFICATION,
    NOTIFICATION_ERROR,
    CLEAR_NOTIFICATION_ERROR
} from "./ActionType";

export const getNotificationsAction = (token) => async (dispatch) => {
    dispatch({ type: GET_NOTIFICATIONS_REQUEST });
    try {
        const res = await fetch(`${BASE_URL}/api/notifications/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        });

        if (handleUnauthorized(res)) return;
        if (!res.ok) {
            throw new Error("Could not load activity");
        }

        const notifications = await res.json();
        dispatch({ type: GET_NOTIFICATIONS, payload: Array.isArray(notifications) ? notifications : [] });
    } catch (error) {
        dispatch({ type: NOTIFICATION_ERROR, payload: true });
    }
};

export const getUnreadNotificationsAction = (token) => async (dispatch) => {
    try {
        const res = await fetch(`${BASE_URL}/api/notifications/unread`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        });

        if (handleUnauthorized(res)) return;
        if (!res.ok) return;
        const notifications = await res.json().catch(() => []);
        dispatch({ type: GET_UNREAD_NOTIFICATIONS, payload: Array.isArray(notifications) ? notifications : [] });
    } catch {
        return;
    }
};

export const markNotificationAsReadAction = (notificationId) => async (dispatch) => {
    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/api/notifications/read/${notificationId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        });

        if (handleUnauthorized(res)) return;
        if (!res.ok) {
            throw new Error('Failed to mark notification as read');
        }

        const notification = await res.json();
        dispatch({ type: MARK_NOTIFICATION_AS_READ, payload: notification });
        return notification;
    } catch (error) {
        dispatch({ type: NOTIFICATION_ERROR, payload: true });
        throw error;
    }
};

export const deleteNotificationAction = (notificationId) => async (dispatch) => {
    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/api/notifications/delete/${notificationId}`, {
            method: "DELETE",
            headers: {
                Authorization: "Bearer " + token,
            },
        });

        if (handleUnauthorized(res)) return;
        if (!res.ok) {
            throw new Error('Failed to delete notification');
        }

        dispatch({ type: DELETE_NOTIFICATION, payload: notificationId });
    } catch (error) {
        dispatch({ type: NOTIFICATION_ERROR, payload: true });
        throw error;
    }
};

export const createNotificationAction = (notification, token) => async (dispatch) => {
    try {
        const res = await fetch(`${BASE_URL}/api/notifications/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify(notification),
        });

        if (handleUnauthorized(res)) return;
        if (!res.ok) {
            throw new Error('Failed to create notification');
        }

        const newNotification = await res.json();
        dispatch({ type: CREATE_NOTIFICATION, payload: newNotification });
        return newNotification;
    } catch (error) {
        dispatch({ type: NOTIFICATION_ERROR, payload: true });
        throw error;
    }
};

export const clearNotificationError = () => ({
    type: CLEAR_NOTIFICATION_ERROR
});