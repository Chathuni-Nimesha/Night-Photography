import React from "react";
import { Link } from "react-router-dom";

const SuggestionsUserCard = ({ image, username, description }) => {
  return (
    <div className="flex justify-between items-center gap-3">
      <Link to={`/${username}`} className="flex items-center min-w-0">
        <img className="w-9 h-9 rounded-full object-cover" src={image} alt={`${username} profile`} loading="lazy" decoding="async" width="36" height="36" />
        <div className="ml-2 min-w-0">
          <p className="text-sm truncate">{username}</p>
          <p className="text-xs text-night-muted truncate">{description}</p>
        </div>
      </Link>
    </div>
  );
};

export default SuggestionsUserCard;
