import React from "react";
import { AiFillHeart } from "react-icons/ai";
import { FaComment } from "react-icons/fa";
import { getPostMedia, isVideoUrl, postAltText, optimizedMediaUrl } from "../../Config/media";

const PhotoGridItem = ({ post, onOpen }) => {
  const media = getPostMedia(post);
  const first = media[0];
  const likes = post?.likedByUsers?.length;
  const comments = post?.comments?.length;
  const photographer = post?.user?.username;

  if (!first) return null;

  return (
    <button
      type="button"
      className="nl-photo-cell"
      onClick={() => onOpen(post)}
      aria-label={postAltText(post)}
    >
      {isVideoUrl(first) ? (
        <video src={first} muted playsInline preload="metadata" />
      ) : (
        <img
          src={optimizedMediaUrl(first, { width: 720 })}
          alt={postAltText(post)}
          loading="lazy"
          decoding="async"
        />
      )}
      <span className="nl-photo-overlay">
        <span>{photographer}</span>
        <span className="flex items-center gap-3">
          {likes > 0 && (
            <span className="flex items-center gap-1">
              <AiFillHeart aria-hidden="true" />
              {likes}
            </span>
          )}
          {comments > 0 && (
            <span className="flex items-center gap-1">
              <FaComment aria-hidden="true" />
              {comments}
            </span>
          )}
        </span>
      </span>
    </button>
  );
};

const PhotoGrid = ({ posts, onOpen, wide = false }) => {
  return (
    <div className={`nl-photo-grid ${wide ? "nl-photo-grid-wide" : ""}`}>
      {posts.map((post) => (
        <PhotoGridItem key={post.id} post={post} onOpen={onOpen} />
      ))}
    </div>
  );
};

export default PhotoGrid;
