import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { getUserProfileAction } from "../../Redux/User/Action";
import { getAuthToken } from "../../Config/auth";
import Auth from "../Auth/Auth";
import EditProfilePage from "../EditProfile/EditProfilePage";
import HomePage from "../HomePage/HomePage";
import Profile from "../Profile/Profile";
import Story from "../Story/Story";
import ReelViewer from "../ReelViewer/ReelViewer";
import CreateStory from "../../Components/Story/CreateStory";
import Notification from "../../Components/Notification/Notification";
import LearningPlan from "../../Components/LearningPlan/LearningPlan";
import LearningProgress from "../../Components/LearningProgress/LearningProgress";
import AboutUs from "../AboutUs/AboutUs";
import OAuthSuccess from "../Auth/OAuthSuccess";
import Explore from "../Explore/Explore";
import AppLayout from "../../Components/Layout/AppLayout";
import PublicHeader from "../../Components/Navigation/PublicHeader";

const Routers = () => {
  const location = useLocation();
  const token = getAuthToken();
  const dispatch = useDispatch();
  const loggedIn = Boolean(token);

  useEffect(() => {
    if (token) {
      dispatch(getUserProfileAction(token));
    }
  }, [token, dispatch]);

  return (
    <Routes>
      <Route path="/login" element={loggedIn ? <Navigate to="/" replace /> : <Auth />} />
      <Route path="/signup" element={loggedIn ? <Navigate to="/" replace /> : <Auth />} />
      <Route path="/oauth-success" element={<OAuthSuccess />} />
      <Route
        path="/about"
        element={
          loggedIn ? (
            <AppLayout>
              <AboutUs />
            </AppLayout>
          ) : (
            <>
              <PublicHeader />
              <AboutUs />
            </>
          )
        }
      />
      <Route
        element={loggedIn ? <AppLayout /> : <Navigate to="/login" replace state={{ from: location.pathname }} />}
      >
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/p/:postId" element={<HomePage />} />
        <Route path="/p/:postId/edit" element={<HomePage />} />
        <Route path="/story/:userId" element={<Story />} />
        <Route path="/account/edit" element={<EditProfilePage />} />
        <Route path="/reels" element={<ReelViewer />} />
        <Route path="/notifications" element={<Notification />} />
        <Route path="/create-story" element={<CreateStory />} />
        <Route path="/learning_plan" element={<LearningPlan />} />
        <Route path="/learning-progress" element={<LearningProgress />} />
        <Route path="/:username" element={<Profile />} />
      </Route>
    </Routes>
  );
};

export default Routers;
