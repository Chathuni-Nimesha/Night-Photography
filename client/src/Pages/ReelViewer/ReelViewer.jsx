import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllReels } from "../../Redux/Reel/Action";
import { IconButton, Avatar, Text, Progress } from "@chakra-ui/react";
import {
  BsFillPlayFill,
  BsVolumeUp,
  BsVolumeMute,
} from "react-icons/bs";
import { GrNext, GrPrevious } from "react-icons/gr";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { getAuthToken } from "../../Config/auth";

const ReelViewer = () => {
  const [currentReel, setCurrentReel] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef(null);

  const dispatch = useDispatch();
  const { reel } = useSelector((store) => store);
  const jwt = getAuthToken();
  const reels = Array.isArray(reel.reels) ? reel.reels : [];
  const active = reels[currentReel];
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (jwt) dispatch(getAllReels(jwt));
  }, [jwt, dispatch]);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, currentReel, active?.video]);

  const handleNextReel = () => {
    if (reels.length === 0) return;
    setCurrentReel((index) => (index === reels.length - 1 ? 0 : index + 1));
    setProgress(0);
  };

  const handlePrevReel = () => {
    if (reels.length === 0) return;
    setCurrentReel((index) => (index === 0 ? reels.length - 1 : index - 1));
    setProgress(0);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current?.duration) {
      setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
    }
  };

  if (reel.loading && reels.length === 0) {
    return (
      <div className="nl-reels-shell">
        <div className="nl-reels-frame nl-skeleton" aria-busy="true" aria-label="Loading reels" />
      </div>
    );
  }

  if (!reel.loading && reel.error && reels.length === 0) {
    return (
      <div className="nl-reels-shell">
        <section className="nl-empty nl-card" style={{ maxWidth: "22rem" }}>
          <p className="nl-auth-kicker">Reels</p>
          <h1>Reels could not be loaded.</h1>
          <p>Something went wrong while fetching moving frames.</p>
          <div className="nl-empty-actions">
            <button type="button" className="nl-btn-primary" onClick={() => jwt && dispatch(getAllReels(jwt))}>
              Try again
            </button>
          </div>
        </section>
      </div>
    );
  }

  if (!reel.loading && reels.length === 0) {
    return (
      <div className="nl-reels-shell">
        <section className="nl-empty nl-card" style={{ maxWidth: "22rem" }}>
          <p className="nl-auth-kicker">Reels</p>
          <h1>No moving frames yet.</h1>
          <p>When photographers publish reels, they will appear here.</p>
        </section>
      </div>
    );
  }

  return (
    <div className="nl-reels-shell">
      <motion.div
        className="nl-reels-frame"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={reduceMotion ? undefined : { opacity: 0 }}
      >
        <Progress
          value={progress}
          size="xs"
          className="nl-reels-progress"
          position="absolute"
          top="0"
          width="100%"
          zIndex="10"
          bg="rgba(255,255,255,0.12)"
        />

        <video
          ref={videoRef}
          src={active?.video}
          className="w-full h-full object-cover"
          loop={false}
          muted={isMuted}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleNextReel}
          onClick={() => setIsPlaying((playing) => !playing)}
          aria-label={active?.caption || "Night photography reel"}
        />

        <AnimatePresence>
          {!isPlaying && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40"
            >
              <BsFillPlayFill className="text-white text-6xl" aria-hidden="true" />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute inset-y-0 left-0 flex items-center">
          <IconButton
            onClick={handlePrevReel}
            icon={<GrPrevious />}
            variant="ghost"
            colorScheme="whiteAlpha"
            className="text-white"
            aria-label="Previous reel"
          />
        </div>
        <div className="absolute inset-y-0 right-0 flex items-center">
          <IconButton
            onClick={handleNextReel}
            icon={<GrNext />}
            variant="ghost"
            colorScheme="whiteAlpha"
            className="text-white"
            aria-label="Next reel"
          />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 nl-reels-chrome">
          <div className="flex items-center mb-4">
            <Avatar
              size="sm"
              src={active?.user?.userImage}
              name={active?.user?.username}
            />
            <Text className="ml-2 text-night-text font-medium">
              {active?.user?.username}
            </Text>
          </div>

          <div className="flex justify-end items-center">
            <IconButton
              onClick={() => setIsMuted((muted) => !muted)}
              icon={isMuted ? <BsVolumeMute /> : <BsVolumeUp />}
              variant="ghost"
              colorScheme="whiteAlpha"
              aria-label={isMuted ? "Unmute" : "Mute"}
            />
          </div>

          {active?.caption && (
            <Text className="text-night-text mt-2 text-sm">{active.caption}</Text>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ReelViewer;
