import React, { useEffect, useState } from "react";
import { RiVideoLine } from "react-icons/ri";
import { BiBookmark } from "react-icons/bi";
import { AiOutlineTable } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import FrameLightbox from "../Photography/FrameLightbox";
import PhotoGrid from "../Photography/PhotoGrid";
import { Link } from "react-router-dom";
import { reqUserPostAction } from "../../Redux/Post/Action";
import { getAuthToken } from "../../Config/auth";

const ProfilePostsPart = ({ user, isOwnProfile = false }) => {
  const [activeTab, setActiveTab] = useState("Post");
  const [activePost, setActivePost] = useState(null);
  const { post } = useSelector((store) => store);
  const token = getAuthToken();
  const dispatch = useDispatch();

  const tabs = [
    { tab: "Post", icon: <AiOutlineTable className="text-sm" aria-hidden="true" /> },
    { tab: "Reels", icon: <RiVideoLine className="text-sm" aria-hidden="true" /> },
    ...(isOwnProfile
      ? [{ tab: "Saved", icon: <BiBookmark className="text-sm" aria-hidden="true" /> }]
      : []),
  ];

  useEffect(() => {
    const data = {
      jwt: token,
      userId: user?.id,
    };
    if (user?.id) dispatch(reqUserPostAction(data));
  }, [user, post.createdPost, post.deletedPost, dispatch, token]);

  useEffect(() => {
    if (!isOwnProfile && activeTab === "Saved") {
      setActiveTab("Post");
    }
  }, [isOwnProfile, activeTab]);

  const posts = Array.isArray(post.reqUserPost) ? post.reqUserPost : [];
  const saved = Array.isArray(user?.savedPost) ? user.savedPost : [];

  const gridPosts = activeTab === "Saved" ? saved : posts;

  return (
    <div>
      <div className="nl-profile-tabs" role="tablist" aria-label="Profile frames">
        {tabs.map((item) => (
          <button
            key={item.tab}
            type="button"
            role="tab"
            aria-selected={item.tab === activeTab}
            onClick={() => setActiveTab(item.tab)}
            className={`nl-profile-tab ${item.tab === activeTab ? "is-active" : ""}`}
          >
            {item.icon}
            <span>{item.tab}</span>
          </button>
        ))}
      </div>

      {activeTab === "Reels" ? (
        <section className="nl-empty" style={{ padding: "3rem 1rem" }}>
          <h2>Reels live in their own viewer</h2>
          <p>This profile does not have a separate reels library. Watch moving night frames in Reels.</p>
          <div className="nl-empty-actions">
            <Link to="/reels" className="nl-btn-primary">
              Open Reels
            </Link>
          </div>
        </section>
      ) : gridPosts.length > 0 ? (
        <PhotoGrid posts={gridPosts} onOpen={setActivePost} />
      ) : (
        <section className="nl-empty" style={{ padding: "3rem 1rem" }}>
          <h2>{activeTab === "Saved" ? "No saved frames yet." : "No frames published yet."}</h2>
          <p>
            {activeTab === "Saved"
              ? "Frames you save will collect here."
              : "When this photographer publishes night work, it will appear in this grid."}
          </p>
        </section>
      )}

      <FrameLightbox post={activePost} isOpen={Boolean(activePost)} onClose={() => setActivePost(null)} />
    </div>
  );
};

export default ProfilePostsPart;
