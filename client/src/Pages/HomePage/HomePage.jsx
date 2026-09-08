import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import HomeRight from "../../Components/HomeRight/HomeRight";
import PostCard from "../../Components/Post/PostCard/PostCard";
import StoryCircle from "../../Components/Story/StoryCircle/StoryCircle";
import CommentModal from "../../Components/Comment/CommentModal";
import { useCreateActions } from "../../Components/Layout/CreateContext";

import { hasStory, isPostLikedByUser, isSavedPost, suggetions } from "../../Config/Logic";
import { findPostByIdAction, findUserPost, likePostAction, savePostAction, unLikePostAction, unSavePostAction } from "../../Redux/Post/Action";
import { findByUserIdsAction, getUserProfileAction } from "../../Redux/User/Action";
import { getAuthToken } from "../../Config/auth";
import "./HomePage.css";

const HomePage = () => {
  const dispatch = useDispatch();
  const token = getAuthToken();
  const reqUser = useSelector((store) => store.user.reqUser);
  const { user, post } = useSelector((store) => store);
  const [suggestedUser, setSuggestedUser] = useState([]);
  const [feedLoading, setFeedLoading] = useState(true);
  const { openCreatePost } = useCreateActions();
  const { postId } = useParams();

  const userIds = useMemo(() => {
    if (!reqUser) return [];
    return [reqUser.id, ...(reqUser.following?.map((followed) => followed.id) || [])].filter(Boolean);
  }, [reqUser]);

  useEffect(() => {
    if (token) dispatch(getUserProfileAction(token));
  }, [token, dispatch]);

  useEffect(() => {
    if (reqUser) setSuggestedUser(suggetions(reqUser));
  }, [reqUser]);

  useEffect(() => {
    if (!reqUser) return undefined;
    if (!token || userIds.length === 0) {
      setFeedLoading(false);
      return undefined;
    }

    const data = {
      userIds: userIds.join(","),
      jwt: token,
    };

    setFeedLoading(true);
    Promise.resolve(dispatch(findUserPost(data)))
      .then(() => dispatch(findByUserIdsAction(data)))
      .finally(() => setFeedLoading(false));
  }, [userIds, post.createdPost, post.deletedPost, post.updatedPost, dispatch, token, reqUser]);

  useEffect(() => {
    if (postId && token) {
      dispatch(findPostByIdAction({ jwt: token, postId }));
    }
  }, [postId, token, dispatch]);

  const storyUsers = hasStory(user.userByIds);
  const posts = Array.isArray(post.userPost) ? post.userPost : [];
  const hasPosts = posts.length > 0;
  const waiting = !reqUser || feedLoading;
  const deepPost =
    (post.singlePost && String(post.singlePost.id) === String(postId) && post.singlePost) ||
    posts.find((item) => String(item?.id) === String(postId)) ||
    null;
  const deepLikeData = { jwt: token, postId: deepPost?.id };

  return (
    <div className="nl-home">
      <div className="nl-home-feed">
        {storyUsers.length > 0 && (
          <div className="nl-stories nl-card flex space-x-2 p-4 justify-start w-full mb-8 overflow-x-auto">
            {storyUsers.map((item) => (
              <StoryCircle
                key={item?.id}
                image={
                  item?.image ||
                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                }
                username={item?.username}
                userId={item?.id}
              />
            ))}
          </div>
        )}

        {waiting ? (
          <div aria-busy="true" aria-label="Loading feed">
            <div className="nl-skeleton" style={{ height: "22rem", marginBottom: "1rem" }} />
            <div className="nl-skeleton" style={{ height: "22rem" }} />
          </div>
        ) : hasPosts ? (
          <div className="nl-feed w-full">
            {posts.map((item) => (
              <PostCard
                key={item?.id}
                username={item?.user?.username}
                location={item?.location}
                post={item}
              />
            ))}
          </div>
        ) : (
          <section className="nl-empty nl-card">
            <p className="nl-auth-kicker">Nightlife</p>
            <h1>The feed is still dark.</h1>
            <p>
              Follow photographers or share a night frame. Your home feed shows work from you and
              the people you follow — nothing is invented here.
            </p>
            <div className="nl-empty-actions">
              <Link to="/explore" className="nl-btn-ghost">
                Explore the night
              </Link>
              <button type="button" className="nl-btn-primary" onClick={openCreatePost}>
                Share a frame
              </button>
            </div>
          </section>
        )}
      </div>
      <aside className="nl-home-aside">
        <HomeRight suggestedUser={suggestedUser} />
      </aside>
      <CommentModal
        isOpen={Boolean(postId && deepPost)}
        onClose={() => {}}
        postData={deepPost}
        handleLikePost={() => deepPost && dispatch(likePostAction(deepLikeData))}
        handleUnLikePost={() => deepPost && dispatch(unLikePostAction(deepLikeData))}
        handleSavePost={() => deepPost && dispatch(savePostAction(deepLikeData))}
        handleUnSavePost={() => deepPost && dispatch(unSavePostAction(deepLikeData))}
        isPostLiked={isPostLikedByUser(deepPost, reqUser?.id)}
        isSaved={isSavedPost(reqUser, deepPost?.id)}
        redirectOnClose={false}
      />
    </div>
  );
};

export default HomePage;
