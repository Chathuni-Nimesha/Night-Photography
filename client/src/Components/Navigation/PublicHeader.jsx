import React from "react";
import { Link } from "react-router-dom";
import BrandMark from "../Brand/BrandMark";

const PublicHeader = () => {
  return (
    <header className="nl-public-header">
      <BrandMark to="/about" />
      <div className="nl-public-actions">
        <Link to="/login" className="nl-btn-ghost">
          Log in
        </Link>
        <Link to="/signup" className="nl-btn-primary">
          Join
        </Link>
      </div>
    </header>
  );
};

export default PublicHeader;
