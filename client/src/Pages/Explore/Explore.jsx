import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import FrameLightbox from "../../Components/Photography/FrameLightbox";
import PhotoGrid from "../../Components/Photography/PhotoGrid";
import { useCreateActions } from "../../Components/Layout/CreateContext";
import { getAuthToken } from "../../Config/auth";
import { getAllPostsAction } from "../../Redux/Post/Action";

const Explore = () => {
  const dispatch = useDispatch();
  const token = getAuthToken();
  const { openCreatePost } = useCreateActions();
  const { posts, postsLoading, postsError, createdPost, deletedPost, updatedPost } = useSelector(
    (store) => store.post
  );
  const [activePost, setActivePost] = useState(null);

  useEffect(() => {
    if (token) dispatch(getAllPostsAction({ jwt: token }));
  }, [token, createdPost, deletedPost, updatedPost, dispatch]);

  const frames = Array.isArray(posts) ? posts : [];

  useEffect(() => {
    if (!activePost?.id) return;
    const next = frames.find((item) => item?.id === activePost.id);
    if (next && next !== activePost) {
      setActivePost(next);
    }
  }, [frames, activePost]);

  return (
    <section className="nl-explore">
      <header className="nl-explore-header">
        <p className="nl-auth-kicker">
          Explore
        </p>
        <h1>Explore the night</h1>
        <p>Frames shared by the community. Photography first — nothing invented here.</p>
      </header>

      {postsLoading && (
        <div className="nl-skeleton-grid nl-photo-grid-wide" aria-busy="true" aria-label="Loading frames">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="nl-skeleton" />
          ))}
        </div>
      )}

      {!postsLoading && postsError && (
        <section className="nl-empty nl-card">
          <h2>The night could not be loaded.</h2>
          <p>Something went wrong while fetching community frames.</p>
          <div className="nl-empty-actions">
            <button
              type="button"
              className="nl-btn-primary"
              onClick={() => token && dispatch(getAllPostsAction({ jwt: token }))}
            >
              Try again
            </button>
          </div>
        </section>
      )}

      {!postsLoading && !postsError && frames.length === 0 && (
        <section className="nl-empty nl-card">
          <h2>No frames to explore yet.</h2>
          <p>Share a night photograph, or return to your feed until the first frames appear.</p>
          <div className="nl-empty-actions">
            <Link to="/" className="nl-btn-ghost">
              Back to feed
            </Link>
            <button type="button" className="nl-btn-primary" onClick={openCreatePost}>
              Share a frame
            </button>
          </div>
        </section>
      )}

      {!postsLoading && !postsError && frames.length > 0 && (
        <PhotoGrid posts={frames} wide onOpen={setActivePost} />
      )}

      <FrameLightbox post={activePost} isOpen={Boolean(activePost)} onClose={() => setActivePost(null)} />
    </section>
  );
};

export default Explore;
