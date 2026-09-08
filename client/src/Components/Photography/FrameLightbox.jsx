import React, { useEffect, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { IoCloseOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { isPostLikedByUser, isSavedPost } from "../../Config/Logic";
import { getPostMedia, isVideoUrl, postAltText, optimizedMediaUrl } from "../../Config/media";
import { createComment, getAllComments } from "../../Redux/Comment/Action";
import {
  likePostAction,
  savePostAction,
  unLikePostAction,
  unSavePostAction,
} from "../../Redux/Post/Action";
import { getAuthToken } from "../../Config/auth";

const FrameLightbox = ({ post, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const token = getAuthToken();
  const { user, comments } = useSelector((store) => store);
  const [index, setIndex] = useState(0);
  const [comment, setComment] = useState("");
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const media = getPostMedia(post);

  useEffect(() => {
    setIndex(0);
    setComment("");
    setLiked(isPostLikedByUser(post, user.reqUser?.id));
    setSaved(isSavedPost(user.reqUser, post?.id));
    setLikeCount(post?.likedByUsers?.length || 0);
  }, [post, user.reqUser, isOpen]);

  useEffect(() => {
    if (isOpen && post?.id && token) {
      dispatch(getAllComments({ jwt: token, postId: post.id }));
    }
  }, [isOpen, post?.id, token, dispatch, comments?.createdComment]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.classList.add("nl-lock-scroll");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("nl-lock-scroll");
    };
  }, [isOpen, onClose]);

  if (!isOpen || !post) return null;

  const data = { jwt: token, postId: post.id };
  const current = media[index];

  const handleLike = () => {
    dispatch(likePostAction(data));
    setLiked(true);
    setLikeCount((count) => count + 1);
  };

  const handleUnlike = () => {
    dispatch(unLikePostAction(data));
    setLiked(false);
    setLikeCount((count) => Math.max(0, count - 1));
  };

  const handleComment = () => {
    if (!comment.trim()) return;
    dispatch(
      createComment({
        jwt: token,
        postId: post.id,
        data: { content: comment },
      })
    );
    setComment("");
  };

  return (
    <div
      className="nl-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={postAltText(post)}
      onClick={onClose}
    >
      <button type="button" className="nl-lightbox-close nl-btn-ghost" onClick={onClose} aria-label="Close frame">
        <IoCloseOutline size={22} />
      </button>
      <div className="nl-lightbox-media" onClick={(event) => event.stopPropagation()}>
        {current && isVideoUrl(current) ? (
          <video src={current} controls autoPlay={false} />
        ) : (
          current && <img src={optimizedMediaUrl(current, { width: 1600 })} alt={postAltText(post, index)} decoding="async" />
        )}
        {media.length > 1 && (
          <>
            <button
              type="button"
              className="nl-media-nav prev"
              aria-label="Previous frame"
              onClick={() => setIndex((i) => (i === 0 ? media.length - 1 : i - 1))}
            >
              ‹
            </button>
            <button
              type="button"
              className="nl-media-nav next"
              aria-label="Next frame"
              onClick={() => setIndex((i) => (i === media.length - 1 ? 0 : i + 1))}
            >
              ›
            </button>
          </>
        )}
      </div>
      <aside className="nl-lightbox-panel" onClick={(event) => event.stopPropagation()}>
        {post.user?.username && (
          <Link to={`/${post.user.username}`} className="nl-post-user mb-4" onClick={onClose}>
            <img
              className="nl-post-avatar"
              src={
                optimizedMediaUrl(post.user.userImage, { width: 96 }) ||
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
              }
              alt={`${post.user.username} profile`}
              loading="lazy"
              decoding="async"
              width="40"
              height="40"
            />
            <span>
              <span className="nl-post-name">{post.user.username}</span>
            </span>
          </Link>
        )}
        {post.caption && <p className="nl-post-caption">{post.caption}</p>}
        {post.location && <p className="nl-post-location">{post.location}</p>}
        <div className="nl-post-actions">
          <button
            type="button"
            className={`nl-icon-btn ${liked ? "is-liked" : ""}`}
            aria-label={liked ? "Unlike" : "Like"}
            onClick={liked ? handleUnlike : handleLike}
          >
            {liked ? <AiFillHeart size={22} /> : <AiOutlineHeart size={22} />}
          </button>
          <button
            type="button"
            className="nl-icon-btn nl-post-actions-end"
            aria-label={saved ? "Unsave" : "Save"}
            onClick={() => {
              if (saved) {
                dispatch(unSavePostAction(data));
                setSaved(false);
              } else {
                dispatch(savePostAction(data));
                setSaved(true);
              }
            }}
          >
            {saved ? <BsBookmarkFill size={20} /> : <BsBookmark size={20} />}
          </button>
        </div>
        {likeCount > 0 && <p className="nl-post-meta">{likeCount} likes</p>}
        {Array.isArray(comments?.comments) && comments.comments.length > 0 && (
          <div className="nl-post-meta" style={{ maxHeight: "10rem", overflowY: "auto" }}>
            {comments.comments.map((item) => (
              <p key={item?.id}>
                <strong>{item?.userDto?.username}</strong> {item?.content}
              </p>
            ))}
          </div>
        )}
        <div className="nl-post-comment">
          <label htmlFor={`lightbox-comment-${post.id}`} className="sr-only">
            Add a comment
          </label>
          <input
            id={`lightbox-comment-${post.id}`}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleComment()}
            placeholder="Write a note…"
          />
          <button type="button" className="nl-link" onClick={handleComment} disabled={!comment.trim()}>
            Post
          </button>
        </div>
      </aside>
    </div>
  );
};

export default FrameLightbox;
