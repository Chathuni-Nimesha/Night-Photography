import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { IoMenuOutline, IoCloseOutline } from "react-icons/io5";
import BrandMark from "../Brand/BrandMark";
import { useCreateActions } from "../Layout/CreateContext";
import { getActiveNavId, mobileNav, unreadActivityCount } from "../Sidebar/SidebarConfig";
import { clearAuth } from "../../Config/auth";

const MobileNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, notification } = useSelector((store) => store);
  const { openCreatePost, openCreateReel, setIsSearchOpen } = useCreateActions();
  const [menuOpen, setMenuOpen] = useState(false);
  const username = user.reqUser?.username;
  const activeId = getActiveNavId(location.pathname, username);
  const unreadCount = unreadActivityCount(notification);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  const handleNav = (item) => {
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
    <>
      <header className="nl-mobile-top">
        <BrandMark to="/" compact />
        <button
          type="button"
          className="nl-btn-ghost"
          style={{ minHeight: "2.5rem", padding: "0.4rem 0.7rem" }}
          aria-expanded={menuOpen}
          aria-controls="mobile-more-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <IoCloseOutline aria-hidden="true" size={22} /> : <IoMenuOutline aria-hidden="true" size={22} />}
          <span>Menu</span>
        </button>
      </header>

      {menuOpen && (
        <div className="nl-sheet" role="presentation" onClick={() => setMenuOpen(false)}>
          <div
            id="mobile-more-menu"
            className="nl-sheet-panel"
            role="dialog"
            aria-modal="true"
            aria-label="More"
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" className="nl-nav-item" onClick={() => navigate("/learning_plan")}>
              Craft
            </button>
            <button type="button" className="nl-nav-item" onClick={() => navigate("/learning-progress")}>
              Progress
            </button>
            <button type="button" className="nl-nav-item" onClick={() => navigate("/about")}>
              About
            </button>
            <button type="button" className="nl-nav-item" onClick={() => navigate("/notifications")}>
              Activity
              {unreadCount > 0 && (
                <span className="nl-nav-badge" aria-hidden="true">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
            <button
              type="button"
              className="nl-nav-item"
              onClick={() => {
                setMenuOpen(false);
                setIsSearchOpen(true);
              }}
            >
              Search
            </button>
            <button type="button" className="nl-nav-item" onClick={() => navigate("/create-story")}>
              New story
            </button>
            <button
              type="button"
              className="nl-nav-item"
              onClick={() => {
                setMenuOpen(false);
                openCreateReel();
              }}
            >
              New reel
            </button>
            <button type="button" className="nl-nav-item" onClick={handleLogout}>
              Log out
            </button>
          </div>
        </div>
      )}

      <nav className="nl-mobile-nav" aria-label="Mobile">
        {mobileNav.map((item) => {
          const Icon = activeId === item.id ? item.activeIcon : item.icon;
          const isActive = activeId === item.id;
          if (item.to && item.to !== "profile" && !item.action) {
            return (
              <Link
                key={item.id}
                to={item.to}
                className={isActive ? "is-active" : ""}
                aria-current={isActive ? "page" : undefined}
                aria-label={item.label}
              >
                <Icon aria-hidden="true" size={22} />
                <span>{item.label}</span>
              </Link>
            );
          }
          return (
            <button
              key={item.id}
              type="button"
              className={isActive ? "is-active" : ""}
              aria-label={item.label}
              onClick={() => handleNav(item)}
            >
              <Icon aria-hidden="true" size={22} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};

export default MobileNav;
