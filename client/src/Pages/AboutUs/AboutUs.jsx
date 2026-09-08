import React from "react";

const AboutUs = () => {
  return (
    <article className="nl-about">
      <p className="nl-kicker">Nightlife</p>
      <h1>Night photography, shared.</h1>
      <p>
        Nightlife is a community for people who photograph after dark. Members publish night frames,
        follow other photographers, and keep a personal record of craft.
      </p>
      <p>
        The work here is about long exposure, city light, and quiet scenes — shared as posts, stories,
        and reels, not as a studio brochure.
      </p>
      <ul className="nl-about-list">
        <li>
          Share night photography
          <span>Publish stills and video from the hours after sunset.</span>
        </li>
        <li>
          Follow photographers
          <span>Build a feed from the people whose night work you want to see.</span>
        </li>
        <li>
          Stories and Reels
          <span>Short sequences and moving frames sit alongside still photographs.</span>
        </li>
        <li>
          Craft progress
          <span>Learning plans and progress notes help you track technique over time.</span>
        </li>
      </ul>
    </article>
  );
};

export default AboutUs;
