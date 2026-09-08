import { useDisclosure, useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { BsBookmark, BsBookmarkFill, BsThreeDots } from "react-icons/bs";
import { FaRegComment } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  isPostLikedByUser,
  isReqUserPost,
  isSavedPost,
  timeDifference,
} from "../../../Config/Logic";
import { getPostMedia, isVideoUrl, postAltText, optimizedMediaUrl } from "../../../Config/media";
import { createComment } from "../../../Redux/Comment/Action";
import {
  deletePostAction,
  likePostAction,
  savePostAction,
  unLikePostAction,
  unSavePostAction,
} from "../../../Redux/Post/Action";
import CommentModal from "../../Comment/CommentModal";
import "./PostCard.css";
import EditPostModal from "../Create/EditPostModal";

const PostCard = ({ username, location, post }) => {
  const [commentContent, setCommentContent] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const token = localStorage.getItem("token");
  const { user } = useSelector((store) => store);
  const [isSaved, setIsSaved] = useState(false);
  const [isPostLiked, setIsPostLiked] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [openEditPostModal, setOpenEditPostModal] = useState(false);
  const [numberOfLikes, setNumberOfLike] = useState(0);

  const media = getPostMedia(post);
  const data = {
    jwt: token,
    postId: post.id,
  };

  const handleAddComment = () => {
    if (!commentContent?.trim()) return;
    dispatch(
      createComment({
        jwt: token,
        postId: post.id,
        data: { content: commentContent },
      })
    );
    setCommentContent("");
  };

  const handleLikePost = () => {
    dispatch(likePostAction(data));
    setIsPostLiked(true);
    setNumberOfLike(numberOfLikes + 1);
  };

  const handleUnLikePost = () => {
    dispatch(unLikePostAction(data));
    setIsPostLiked(false);
    setNumberOfLike(Math.max(0, numberOfLikes - 1));
  };

  useEffect(() => {
    setIsSaved(isSavedPost(user.reqUser, post.id));
    setIsPostLiked(isPostLikedByUser(post, user.reqUser?.id));
    setNumberOfLike(post?.likedByUsers?.length || 0);
  }, [user.reqUser, post]);

  useEffect(() => {
    const handleWindowClick = (event) => {
      if (!event.target.closest(".nl-post-menu")) setShowDropdown(false);
    };
    window.addEventListener("click", handleWindowClick);
    return () => window.removeEventListener("click", handleWindowClick);
  }, []);

  const isOwnPost = isReqUserPost(post, user.reqUser);
  const current = media[currentMediaIndex];

  return (
    <article className="nl-post">
      <header className="nl-post-header">
        <button
          type="button"
          className="nl-post-user"
          onClick={() => username && navigate(`/${username}`)}
        >
          <img
            className="nl-post-avatar"
            src={
              optimizedMediaUrl(post.user?.userImage, { width: 96 }) ||
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
            }
            alt={post?.user?.username ? `${post.user.username} profile` : "Photographer profile"}
            loading="lazy"
            decoding="async"
            width="40"
            height="40"
          />
          <span>
            <span className="nl-post-name">{post?.user?.username}</span>
            <span className="nl-post-time">{timeDifference(post?.createdAt)}</span>
          </span>
        </button>
        {isOwnPost && (
          <div className="nl-post-menu relative">
            <button
              type="button"
              className="nl-icon-btn dots"
              aria-label="Frame options"
              aria-expanded={showDropdown}
              onClick={() => setShowDropdown((open) => !open)}
            >
              <BsThreeDots />
            </button>
            {showDropdown && (
              <div className="nl-card absolute right-0 top-10 z-10 w-40 p-1">
                <button
                  type="button"
                  className="nl-nav-item"
                  onClick={() => {
                    setOpenEditPostModal(true);
                    setShowDropdown(false);
                  }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="nl-nav-item"
                  onClick={async () => {
                    const result = await dispatch(deletePostAction({ jwt: token, postId: post.id }));
                    toast({
                      title: result?.ok ? "Frame deleted" : "Could not delete this frame",
                      status: result?.ok ? "success" : "error",
                      duration: 3000,
                      isClosable: true,
                    });
                    setShowDropdown(false);
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {current && (
        <div className="nl-post-media">
          {isVideoUrl(current) ? (
            <video src={current} controls preload="metadata" />
          ) : (
            <img
              src={optimizedMediaUrl(current, { width: 1080 })}
              alt={postAltText(post, currentMediaIndex)}
              loading="lazy"
              decoding="async"
            />
          )}
          {media.length > 1 && (
            <>
              <button
                type="button"
                className="nl-media-nav prev"
                aria-label="Previous media"
                onClick={() =>
                  setCurrentMediaIndex((i) => (i === 0 ? media.length - 1 : i - 1))
                }
              >
                ‹
              </button>
              <button
                type="button"
                className="nl-media-nav next"
                aria-label="Next media"
                onClick={() =>
                  setCurrentMediaIndex((i) => (i === media.length - 1 ? 0 : i + 1))
                }
              >
                ›
              </button>
              <div className="nl-media-dots">
                {media.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    className={index === currentMediaIndex ? "is-active" : ""}
                    aria-label={`Go to media ${index + 1}`}
                    onClick={() => setCurrentMediaIndex(index)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <div className="nl-post-body">
        {post.caption && <p className="nl-post-caption">{post.caption}</p>}
        {location && <p className="nl-post-location">{location}</p>}
        <div className="nl-post-actions">
          <button
            type="button"
            className={`nl-icon-btn ${isPostLiked ? "is-liked" : ""}`}
            aria-label={isPostLiked ? "Unlike" : "Like"}
            onClick={isPostLiked ? handleUnLikePost : handleLikePost}
          >
            {isPostLiked ? <AiFillHeart size={22} /> : <AiOutlineHeart size={22} />}
          </button>
          <button
            type="button"
            className="nl-icon-btn"
            aria-label="Open comments"
            onClick={() => {
              navigate(`/p/${post.id}`);
              onOpen();
            }}
          >
            <FaRegComment size={20} />
          </button>
          <button
            type="button"
            className="nl-icon-btn nl-post-actions-end"
            aria-label={isSaved ? "Unsave" : "Save"}
            onClick={() => {
              if (isSaved) {
                dispatch(unSavePostAction(data));
                setIsSaved(false);
              } else {
                dispatch(savePostAction(data));
                setIsSaved(true);
              }
            }}
          >
            {isSaved ? <BsBookmarkFill size={20} /> : <BsBookmark size={20} />}
          </button>
        </div>
        {numberOfLikes > 0 && <p className="nl-post-meta">{numberOfLikes} likes</p>}
        {post?.comments?.length > 0 && (
          <button
            type="button"
            className="nl-link mt-2"
            onClick={() => {
              navigate(`/p/${post.id}`);
              onOpen();
            }}
          >
            View {post.comments.length} comments
          </button>
        )}
        <div className="nl-post-comment">
          <label htmlFor={`comment-${post.id}`} className="sr-only">
            Add a comment
          </label>
          <input
            id={`comment-${post.id}`}
            onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
            onChange={(e) => setCommentContent(e.target.value)}
            value={commentContent}
            type="text"
            placeholder="Write a note…"
          />
        </div>
      </div>

      <EditPostModal
        onClose={() => setOpenEditPostModal(false)}
        isOpen={openEditPostModal}
        onOpen={() => setOpenEditPostModal(true)}
        post={post}
      />

      <CommentModal
        handleLikePost={handleLikePost}
        handleSavePost={() => dispatch(savePostAction(data))}
        handleUnSavePost={() => dispatch(unSavePostAction(data))}
        handleUnLikePost={handleUnLikePost}
        isPostLiked={isPostLiked}
        isSaved={isSaved}
        postData={post}
        isOpen={isOpen}
        onClose={onClose}
        onOpen={onOpen}
      />
    </article>
  );
};

export default PostCard;
