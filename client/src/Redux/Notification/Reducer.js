import {
    GET_NOTIFICATIONS,
    GET_NOTIFICATIONS_REQUEST,
    GET_UNREAD_NOTIFICATIONS,
    MARK_NOTIFICATION_AS_READ,
    DELETE_NOTIFICATION,
    CREATE_NOTIFICATION,
    NOTIFICATION_ERROR,
    CLEAR_NOTIFICATION_ERROR,
} from "./ActionType";

const initialState = {
    notifications: [],
    unreadNotifications: [],
    loading: false,
    error: false,
};

export const notificationReducer = (store = initialState, { type, payload }) => {
    if (type === GET_NOTIFICATIONS_REQUEST) {
        return { ...store, loading: true, error: false };
    } else if (type === GET_NOTIFICATIONS) {
        return { ...store, notifications: payload, loading: false, error: false };
    } else if (type === GET_UNREAD_NOTIFICATIONS) {
        return { ...store, unreadNotifications: payload };
    } else if (type === MARK_NOTIFICATION_AS_READ) {
        const updatedNotifications = store.notifications.map((notification) =>
            notification.id === payload.id ? payload : notification
        );
        const updatedUnreadNotifications = store.unreadNotifications.filter(
            (notification) => notification.id !== payload.id
        );
        return {
            ...store,
            notifications: updatedNotifications,
            unreadNotifications: updatedUnreadNotifications,
        };
    } else if (type === DELETE_NOTIFICATION) {
        const updatedNotifications = store.notifications.filter(
            (notification) => notification.id !== payload
        );
        const updatedUnreadNotifications = store.unreadNotifications.filter(
            (notification) => notification.id !== payload
        );
        return {
            ...store,
            notifications: updatedNotifications,
            unreadNotifications: updatedUnreadNotifications,
        };
    } else if (type === CREATE_NOTIFICATION) {
        return {
            ...store,
            notifications: [payload, ...store.notifications],
            unreadNotifications: [payload, ...store.unreadNotifications],
        };
    } else if (type === NOTIFICATION_ERROR) {
        return { ...store, error: true, loading: false };
    } else if (type === CLEAR_NOTIFICATION_ERROR) {
        return { ...store, error: false };
    }
    return store;
};
