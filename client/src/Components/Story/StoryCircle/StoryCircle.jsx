import React from "react";
import { useNavigate } from "react-router-dom";

const StoryCircle = ({ image, username, userId }) => {
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate(`/story/${userId}`);
  };

  return (
    <button
      type="button"
      className="flex flex-col items-center bg-transparent border-0 p-0 min-h-0"
      onClick={handleNavigate}
    >
      <img
        className="w-16 h-16 rounded-full object-cover border border-[var(--nl-border)]"
        src={image}
        alt={username ? `${username} story` : "Story"}
        loading="lazy"
        decoding="async"
        width="64"
        height="64"
      />
      <p className="mt-2 text-xs text-night-muted">
        {username?.length > 9 ? username.substring(0, 9) + "..." : username}
      </p>
    </button>
  );
};

export default StoryCircle;
