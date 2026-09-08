import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import SuggestionsUserCard from "./SuggestionsUserCard";

const HomeRight = ({ suggestedUser }) => {
  const { user } = useSelector((store) => store);
  const suggestions = suggestedUser || [];

  return (
    <aside className="nl-card p-5">
      <div className="flex items-center gap-3">
        <img
          className="w-12 h-12 rounded-full object-cover"
          src={
            user.reqUser?.image ||
            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
          }
          alt={user.reqUser?.username ? `${user.reqUser.username} profile` : "Your profile"}
          decoding="async"
        />
        <div>
          <p className="text-sm">{user.reqUser?.name || user.reqUser?.username}</p>
          <p className="text-sm text-night-muted">{user.reqUser?.username}</p>
        </div>
      </div>

      <p className="mt-6 mb-3 text-xs uppercase tracking-[0.16em] text-night-muted">
        Photographers you may know
      </p>

      <div className="space-y-4">
        {suggestions.length > 0 ? (
          suggestions.map((item) => (
            <SuggestionsUserCard
              key={item.id || item.username}
              image={
                item.userImage ||
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
              }
              username={item.username}
              description="Follows you"
            />
          ))
        ) : (
          <p className="text-sm text-night-muted">
            When someone follows you, they can appear here.
          </p>
        )}
      </div>

      <nav className="mt-8 flex flex-wrap gap-x-3 gap-y-1 text-xs text-night-muted" aria-label="Nightlife">
        <Link to="/about">About</Link>
        <Link to="/learning_plan">Craft</Link>
        <Link to="/explore">Explore</Link>
      </nav>
    </aside>
  );
};

export default HomeRight;
