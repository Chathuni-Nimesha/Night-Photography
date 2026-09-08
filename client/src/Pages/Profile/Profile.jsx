import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ProfilePostsPart from "../../Components/ProfilePageCard/ProfilePostsPart";
import UserDetailCard from "../../Components/ProfilePageCard/UserDetailCard";
import { isFollowing, isReqUser } from "../../Config/Logic";
import { findByUsernameAction, getUserProfileAction } from "../../Redux/User/Action";
import { getAuthToken } from "../../Config/auth";

const Profile = () => {
  const dispatch = useDispatch();
  const token = getAuthToken();
  const { username } = useParams();
  const { user } = useSelector((store) => store);

  const isRequser = isReqUser(user.reqUser?.id, user.findByUsername?.id);
  const isFollowed = isFollowing(user.reqUser, user.findByUsername);
  const profileUser = isRequser ? user.reqUser : user.findByUsername;
  const profileReady = Boolean(profileUser?.username);

  useEffect(() => {
    const data = {
      token,
      username,
    };
    if (token) dispatch(getUserProfileAction(token));
    dispatch(findByUsernameAction(data));
  }, [username, user.reqUser?.following?.length, user.reqUser?.follower?.length, user.followUpdate, dispatch, token]);

  if (!profileReady) {
    return (
      <div className="nl-profile" aria-busy="true" aria-label="Loading profile">
        <div className="nl-skeleton" style={{ height: "8rem", marginBottom: "1.5rem" }} />
        <div className="nl-skeleton-grid nl-photo-grid">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="nl-skeleton" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="nl-profile">
      <UserDetailCard
        user={profileUser}
        isFollowing={isFollowed}
        isRequser={isRequser}
      />
      <ProfilePostsPart user={profileUser} isOwnProfile={isRequser} />
    </div>
  );
};

export default Profile;
