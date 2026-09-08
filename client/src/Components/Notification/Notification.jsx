import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getNotificationsAction,
  markNotificationAsReadAction,
  deleteNotificationAction,
} from "../../Redux/Notification/Action";
import { useToast } from "@chakra-ui/react";
import { timeDifference } from "../../Config/Logic";
import { optimizedMediaUrl } from "../../Config/media";
import { useNavigate } from "react-router-dom";

const Notification = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const { notification } = useSelector((store) => store);
  const token = localStorage.getItem("token");
  const [busyId, setBusyId] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [readNotifications, setReadNotifications] = useState(new Set());

  useEffect(() => {
    if (token) dispatch(getNotificationsAction(token));
  }, [token, dispatch]);

  useEffect(() => {
    const readIds = new Set(
      (notification.notifications || []).filter((item) => item.isRead).map((item) => item.id)
    );
    setReadNotifications(readIds);
  }, [notification.notifications]);

  const handleMarkAsRead = async (item) => {
    try {
      setBusyId(item.id);
      await dispatch(markNotificationAsReadAction(item.id));
      setReadNotifications((prev) => new Set([...prev, item.id]));
    } catch (error) {
      toast({
        title: "Could not update that notification",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      setBusyId(notificationId);
      await dispatch(deleteNotificationAction(notificationId));
    } catch (error) {
      toast({
        title: "Could not delete that notification",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setBusyId(null);
    }
  };

  const handleNavigateToPost = (postId) => {
    if (postId) navigate(`/p/${postId}`);
  };

  const filterNotifications = () => {
    const items = [...(notification.notifications || [])];
    if (activeTab === "unread") return items.filter((item) => !readNotifications.has(item.id));
    if (activeTab === "read") return items.filter((item) => readNotifications.has(item.id));
    return items;
  };

  const tabs = [
    { id: "all", label: "All" },
    { id: "unread", label: "Unread" },
    { id: "read", label: "Read" },
  ];

  const filtered = filterNotifications();
  const initialLoad = notification.loading && (!notification.notifications || notification.notifications.length === 0);

  return (
    <div className="nl-activity">
      <header className="nl-activity-header">
        <p className="nl-auth-kicker" style={{ textAlign: "left" }}>
          Activity
        </p>
        <h1>Notifications</h1>
      </header>
      <div className="nl-card overflow-hidden">
        <div className="flex border-b border-[var(--nl-border)]" role="tablist" aria-label="Activity filters">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 text-xs uppercase tracking-[0.14em] bg-transparent border-0 min-h-[2.75rem] ${
                activeTab === tab.id ? "text-night-accent" : "text-night-muted"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {initialLoad && (
          <div className="p-4" aria-busy="true" aria-label="Loading activity">
            <div className="nl-skeleton" style={{ height: "4rem", marginBottom: "0.5rem" }} />
            <div className="nl-skeleton" style={{ height: "4rem", marginBottom: "0.5rem" }} />
            <div className="nl-skeleton" style={{ height: "4rem" }} />
          </div>
        )}

        {!initialLoad && notification.error && (!notification.notifications || notification.notifications.length === 0) && (
          <div className="nl-empty">
            <h2>Activity could not be loaded.</h2>
            <p>Something went wrong while fetching notifications.</p>
            <div className="nl-empty-actions">
              <button type="button" className="nl-btn-primary" onClick={() => dispatch(getNotificationsAction(token))}>
                Try again
              </button>
            </div>
          </div>
        )}

        {!initialLoad && filtered.length === 0 && !notification.error && (
          <div className="nl-empty">
            <h2>No activity yet</h2>
            <p>Follow photographers or share a frame to see likes and comments here.</p>
          </div>
        )}

        {!initialLoad && filtered.length > 0 && (
          <ul className="divide-y divide-[var(--nl-border)]">
            {filtered.map((item) => {
              const unread = !readNotifications.has(item.id);
              return (
                <li key={item.id} className={`nl-activity-item ${unread ? "is-unread" : ""}`}>
                  <div className="flex items-start gap-3">
                    <img
                      className="h-8 w-8 rounded-full object-cover"
                      src={
                        optimizedMediaUrl(item.user?.userImage, { width: 96 }) ||
                        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                      }
                      alt={item.user?.username ? `${item.user.username} profile` : "Photographer"}
                      loading="lazy"
                      decoding="async"
                      width="32"
                      height="32"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{item.user?.username}</span> {item.message}
                      </p>
                      {item.createdAt && (
                        <p className="mt-1 text-xs text-night-muted">{timeDifference(item.createdAt)}</p>
                      )}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {unread && (
                          <button
                            type="button"
                            onClick={() => handleMarkAsRead(item)}
                            disabled={busyId === item.id}
                            className="nl-btn-ghost"
                            style={{ minHeight: "2.4rem", padding: "0.35rem 0.8rem" }}
                          >
                            Mark as read
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          disabled={busyId === item.id}
                          className="nl-btn-ghost"
                          style={{ minHeight: "2.4rem", padding: "0.35rem 0.8rem" }}
                        >
                          Delete
                        </button>
                        {item.postId && (
                          <button
                            type="button"
                            onClick={() => handleNavigateToPost(item.postId)}
                            className="nl-btn-ghost"
                            style={{ minHeight: "2.4rem", padding: "0.35rem 0.8rem" }}
                          >
                            View frame
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Notification;
