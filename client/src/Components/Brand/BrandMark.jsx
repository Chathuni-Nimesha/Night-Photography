import React from "react";
import { Link } from "react-router-dom";

const BrandMark = ({ to, compact = false, className = "" }) => {
  const content = (
    <>
      <span className="nl-brand-word">Nightlife</span>
      {!compact && <span className="nl-brand-sub">Photography</span>}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={`nl-brand ${className}`.trim()} aria-label="Nightlife home">
        {content}
      </Link>
    );
  }

  return (
    <p className={`nl-brand ${className}`.trim()} aria-label="Nightlife">
      {content}
    </p>
  );
};

export default BrandMark;
