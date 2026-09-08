import React from "react";
import { useNavigate } from "react-router-dom";

const SearchUserCard = ({ username, image, setIsSearchVisible }) => {
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate(`/${username}`);
    if (setIsSearchVisible) setIsSearchVisible(false);
  };
  return (
    <button type="button" onClick={handleNavigate} className="search-user">
      <img
        src={
          image ||
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
        }
        alt={`${username} profile`}
        loading="lazy"
        decoding="async"
        width="40"
        height="40"
      />
      <p>{username}</p>
    </button>
  );
};

export default SearchUserCard;
