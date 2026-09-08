import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { IoEllipsisHorizontal } from "react-icons/io5";
import BrandMark from "../Brand/BrandMark";
import { useCreateActions } from "../Layout/CreateContext";
import SearchComponent from "../SearchComponent/SearchComponent";
import { desktopNav, getActiveNavId, unreadActivityCount } from "./SidebarConfig";
import { clearAuth } from "../../Config/auth";
import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, notification } = useSelector((store) => store);
  const { openCreatePost, openCreateReel, isSearchOpen, setIsSearchOpen } = useCreateActions();
  const [showMore, setShowMore] = useState(false);
  const moreRef = useRef(null);
  const username = user.reqUser?.username;
  const activeId = getActiveNavId(location.pathname, username);
  const unreadCount = unreadActivityCount(notification);

  useEffect(() => {
    const onPointerDown = (event) => {
      if (moreRef.current && !moreRef.current.contains(event.target)) {
        setShowMore(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  const handleItem = (item) => {
    if (item.action === "create-post") {
      openCreatePost();
      return;
    }
    if (item.to === "profile") {
      if (username) navigate(`/${username}`);
      return;
    }
    if (item.to) navigate(item.to);
  };

  return (
    <aside className="nl-sidebar" aria-label="Main">
      {isSearchOpen ? (
        <SearchComponent setIsSearchVisible={setIsSearchOpen} />
      ) : (
        <>
          <div>
            <BrandMark to="/" />
            <nav className="nl-nav-list mt-10" aria-label="Primary">
              {desktopNav.map((item) => {
                const Icon = activeId === item.id ? item.activeIcon : item.icon;
                const isActive = activeId === item.id;
                if (item.to && item.to !== "profile" && !item.action) {
                  return (
                    <Link
                      key={item.id}
                      to={item.to}
                      className={`nl-nav-item ${isActive ? "is-active" : ""}`}
                      aria-current={isActive ? "page" : undefined}
                      aria-label={item.id === "activity" && unreadCount > 0 ? `${item.label}, ${unreadCount} unread` : undefined}
                    >
                      <Icon aria-hidden="true" className="text-xl" />
                      <span>{item.label}</span>
                      {item.id === "activity" && unreadCount > 0 && (
                        <span className="nl-nav-badge" aria-hidden="true">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </Link>
                  );
                }
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`nl-nav-item ${item.id === "create" ? "nl-nav-cta" : ""} ${isActive ? "is-active" : ""}`}
                    onClick={() => handleItem(item)}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon aria-hidden="true" className="text-xl" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="relative mt-auto" ref={moreRef}>
            <button
              type="button"
              className="nl-nav-item"
              aria-expanded={showMore}
              aria-haspopup="menu"
              onClick={() => setShowMore((open) => !open)}
            >
              <IoEllipsisHorizontal aria-hidden="true" className="text-xl" />
              <span>More</span>
            </button>
            {showMore && (
              <div className="nl-card absolute bottom-12 left-0 right-0 p-2 z-20" role="menu">
                <button
                  type="button"
                  role="menuitem"
                  className="nl-nav-item"
                  onClick={() => {
                    setIsSearchOpen(true);
                    setShowMore(false);
                  }}
                >
                  Search
                </button>
                <button
                  type="button"
                  role="menuitem"
                  className="nl-nav-item"
                  onClick={() => {
                    setShowMore(false);
                    navigate("/create-story");
                  }}
                >
                  New story
                </button>
                <button
                  type="button"
                  role="menuitem"
                  className="nl-nav-item"
                  onClick={() => {
                    setShowMore(false);
                    openCreateReel();
                  }}
                >
                  New reel
                </button>
                <button
                  type="button"
                  role="menuitem"
                  className="nl-nav-item"
                  onClick={() => {
                    setShowMore(false);
                    navigate("/learning-progress");
                  }}
                >
                  Progress
                </button>
                <button type="button" role="menuitem" className="nl-nav-item" onClick={handleLogout}>
                  Log out
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </aside>
  );
};

export default Sidebar;
