import React, { useEffect, useMemo, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useDisclosure } from "@chakra-ui/react";
import Sidebar from "../Sidebar/Sidebar";
import MobileNav from "../Navigation/MobileNav";
import CreatePostModal from "../Post/Create/CreatePostModal";
import CreateReelModal from "../Create/CreateReel";
import SearchComponent from "../SearchComponent/SearchComponent";
import { CreateContext } from "./CreateContext";
import { getAuthToken } from "../../Config/auth";
import { getUnreadNotificationsAction } from "../../Redux/Notification/Action";

const AppLayout = ({ children }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const token = getAuthToken();
  const hideDesktopSidebar = location.pathname === "/reels";
  const createPost = useDisclosure();
  const [isCreateReelOpen, setIsCreateReelOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const actions = useMemo(
    () => ({
      openCreatePost: createPost.onOpen,
      openCreateReel: () => setIsCreateReelOpen(true),
      openSearch: () => setIsSearchOpen(true),
      isSearchOpen,
      setIsSearchOpen,
    }),
    [createPost.onOpen, isSearchOpen]
  );

  useEffect(() => {
    if (token) dispatch(getUnreadNotificationsAction(token));
  }, [token, dispatch]);

  return (
    <CreateContext.Provider value={actions}>
      <div className="nl-app">
        <a className="nl-skip" href="#main-content">
          Skip to content
        </a>
        {!hideDesktopSidebar && <Sidebar />}
        {hideDesktopSidebar && (
          <Link to="/" className="nl-reels-home nl-btn-ghost">
            Nightlife
          </Link>
        )}
        <div className="nl-main">
          <MobileNav />
          {isSearchOpen && (
            <div className="lg:hidden p-4">
              <SearchComponent setIsSearchVisible={setIsSearchOpen} />
            </div>
          )}
          <main id="main-content">{children || <Outlet />}</main>
        </div>
        <CreatePostModal onClose={createPost.onClose} isOpen={createPost.isOpen} onOpen={createPost.onOpen} />
        <CreateReelModal
          onClose={() => setIsCreateReelOpen(false)}
          isOpen={isCreateReelOpen}
          onOpen={() => setIsCreateReelOpen(true)}
        />
      </div>
    </CreateContext.Provider>
  );
};

export default AppLayout;
