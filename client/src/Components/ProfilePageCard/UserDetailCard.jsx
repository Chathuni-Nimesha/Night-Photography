import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { followUserAction, unFollowUserAction } from "../../Redux/User/Action";
import { getAuthToken } from "../../Config/auth";
import "./UserDetailCard.css";

const UserDetailCard = ({ user, isRequser, isFollowing }) => {
  const token = getAuthToken();
  const { post } = useSelector((store) => store);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isFollow, setIsFollow] = useState(false);

  const goToAccountEdit = () => {
    navigate("/account/edit");
  };

  const data = {
    jwt: token,
    userId: user?.id,
  };

  const handleFollowUser = async () => {
    setIsFollow(true);
    const result = await dispatch(followUserAction(data));
    if (!result?.ok) setIsFollow(false);
  };

  const handleUnFollowUser = async () => {
    setIsFollow(false);
    const result = await dispatch(unFollowUserAction(data));
    if (!result?.ok) setIsFollow(true);
  };

  useEffect(() => {
    setIsFollow(isFollowing);
  }, [isFollowing]);

  const frameCount = Array.isArray(post?.reqUserPost) ? post.reqUserPost.length : 0;

  return (
    <header className="nl-profile-header">
        <img
          className="nl-profile-avatar"
          src={
            user?.image ||
            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
          }
          alt={user?.username ? `${user.username} profile` : "Profile"}
          decoding="async"
        />

      <div className="nl-profile-copy">
        <div className="nl-profile-identity">
          <div>
            <p className="nl-profile-username">{user?.username}</p>
            {user?.name && <h1 className="nl-profile-name">{user.name}</h1>}
          </div>
          {isRequser ? (
            <button type="button" className="nl-btn-ghost" onClick={goToAccountEdit}>
              Edit profile
            </button>
          ) : isFollow ? (
            <button type="button" className="nl-btn-ghost" onClick={handleUnFollowUser}>
              Unfollow
            </button>
          ) : (
            <button type="button" className="nl-btn-primary" onClick={handleFollowUser}>
              Follow
            </button>
          )}
        </div>

        {user?.bio && <p className="nl-profile-bio">{user.bio}</p>}

        <ul className="nl-profile-stats">
          <li>
            <span>{frameCount}</span> frames
          </li>
          <li>
            <span>{user?.follower?.length || 0}</span> followers
          </li>
          <li>
            <span>{user?.following?.length || 0}</span> following
          </li>
        </ul>
      </div>
    </header>
  );
};

export default UserDetailCard;
