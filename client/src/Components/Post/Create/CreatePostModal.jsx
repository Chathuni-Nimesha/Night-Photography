import {
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/modal";
import { useToast } from "@chakra-ui/react";
import React, { useState } from "react";
import { FaPhotoVideo } from "react-icons/fa";
import { GoLocation } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import { createPost } from "../../../Redux/Post/Action";
import { uploadToCloudinary } from "../../../Config/UploadToCloudinary";
import SpinnerCard from "../../Spinner/Spinner";
import { getAuthToken } from "../../../Config/auth";
import { isVideoUrl } from "../../../Config/media";
import "./CreatePostModal.css";

const CreatePostModal = ({ isOpen, onClose }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  const dispatch = useDispatch();
  const token = getAuthToken();
  const toast = useToast();
  const { user } = useSelector((store) => store);

  const [postData, setPostData] = useState({
    mediaUrls: [],
    caption: "",
    location: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPostData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    handleFiles(droppedFiles);
    setIsDragOver(false);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleOnChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    handleFiles(selectedFiles);
  };

  const handleFiles = async (files) => {
    const validFiles = files.filter(
      (file) => file.type.startsWith("image/") || file.type.startsWith("video/")
    );

    if (validFiles.length === 0) {
      setUploadStatus("error");
      return;
    }

    setUploadStatus("uploading");
    try {
      const uploadPromises = validFiles.map((file) => uploadToCloudinary(file));
      const urls = await Promise.all(uploadPromises);
      const next = urls.filter((url) => url);
      if (next.length === 0) {
        setUploadStatus("error");
        return;
      }

      setPostData((prev) => ({
        ...prev,
        mediaUrls: [...prev.mediaUrls, ...next],
      }));
      setUploadStatus("uploaded");
    } catch (error) {
      setUploadStatus("error");
    }
  };

  const handleSubmit = async () => {
    if (!token || postData.mediaUrls.length === 0) return;

    const result = await dispatch(
      createPost({
        jwt: token,
        data: postData,
      })
    );
    if (result?.ok) {
      toast({
        title: "Frame published",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      handleClose();
    } else {
      toast({
        title: "Could not publish this frame",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const handleClose = () => {
    onClose();
    setIsDragOver(false);
    setPostData({ mediaUrls: [], caption: "", location: "" });
    setUploadStatus("");
    setCurrentMediaIndex(0);
  };

  const current = postData.mediaUrls[currentMediaIndex];

  return (
    <Modal size={"4xl"} isOpen={isOpen} onClose={handleClose} isCentered>
      <ModalOverlay bg="rgba(7,8,10,0.86)" />
      <ModalContent
        bg="#12151C"
        color="#F4F1EA"
        border="1px solid rgba(255,255,255,0.08)"
        borderRadius="2px"
        mx="0.75rem"
        maxW="min(56rem, calc(100vw - 1.5rem))"
        overflow="hidden"
        maxH="90vh"
      >
        <div className="nl-create-top">
          <p className="nl-serif">Share a frame</p>
          <button
            type="button"
            className="nl-btn-primary"
            onClick={handleSubmit}
            disabled={postData.mediaUrls.length === 0}
          >
            Publish
          </button>
        </div>

        <ModalBody p={0} overflowY="auto">
          <div className="nl-create-layout">
            <div className="nl-create-media">
              {uploadStatus === "" && (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`nl-create-drop ${isDragOver ? "is-over" : ""}`}
                >
                  <FaPhotoVideo className="text-3xl mb-3" aria-hidden="true" />
                  <p>Drop a photograph or video here</p>
                  <label htmlFor="nl-create-upload" className="nl-btn-ghost mt-4">
                    Choose files
                  </label>
                  <input
                    type="file"
                    id="nl-create-upload"
                    className="nl-create-file"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleOnChange}
                  />
                </div>
              )}

              {uploadStatus === "uploading" && (
                <div className="nl-create-drop">
                  <SpinnerCard />
                  <p className="mt-4">Uploading…</p>
                </div>
              )}

              {uploadStatus === "error" && (
                <div className="nl-create-drop">
                  <p>The files could not be prepared. Try an image or video again.</p>
                  <label htmlFor="nl-create-upload-retry" className="nl-btn-primary mt-4">
                    Try again
                  </label>
                  <input
                    type="file"
                    id="nl-create-upload-retry"
                    className="nl-create-file"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleOnChange}
                  />
                </div>
              )}

              {uploadStatus === "uploaded" && current && (
                <div className="nl-create-preview">
                  {isVideoUrl(current) ? (
                    <video src={current} controls className="max-h-full max-w-full object-contain" />
                  ) : (
                    <img src={current} alt="Selected frame preview" />
                  )}
                  {postData.mediaUrls.length > 1 && (
                    <>
                      <button
                        type="button"
                        className="nl-media-nav prev"
                        aria-label="Previous preview"
                        onClick={() =>
                          setCurrentMediaIndex((i) =>
                            i === 0 ? postData.mediaUrls.length - 1 : i - 1
                          )
                        }
                      >
                        ‹
                      </button>
                      <button
                        type="button"
                        className="nl-media-nav next"
                        aria-label="Next preview"
                        onClick={() =>
                          setCurrentMediaIndex((i) =>
                            i === postData.mediaUrls.length - 1 ? 0 : i + 1
                          )
                        }
                      >
                        ›
                      </button>
                      <div className="nl-media-dots">
                        {postData.mediaUrls.map((_, index) => (
                          <button
                            key={index}
                            type="button"
                            className={index === currentMediaIndex ? "is-active" : ""}
                            aria-label={`Go to media ${index + 1}`}
                            onClick={() => setCurrentMediaIndex(index)}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="nl-create-form">
              <div className="nl-post-user mb-4">
                <img
                  className="nl-post-avatar"
                  src={
                    user?.reqUser?.image ||
                    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                  }
                  alt={user?.reqUser?.username ? `${user.reqUser.username} profile` : "Your profile"}
                />
                <span className="nl-post-name">{user?.reqUser?.username}</span>
              </div>

              <label htmlFor="nl-create-caption" className="nl-label">
                Caption
              </label>
              <textarea
                id="nl-create-caption"
                className="nl-input nl-create-caption"
                placeholder="Describe the night…"
                name="caption"
                rows="6"
                value={postData.caption}
                onChange={handleInputChange}
                maxLength={2200}
              />
              <p className="nl-create-count">{postData.caption?.length || 0}/2,200</p>

              <label htmlFor="nl-create-location" className="nl-label">
                Location
              </label>
              <div className="nl-create-location">
                <input
                  id="nl-create-location"
                  className="nl-input"
                  type="text"
                  placeholder="Where was this made?"
                  name="location"
                  value={postData.location}
                  onChange={handleInputChange}
                />
                <GoLocation aria-hidden="true" />
              </div>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CreatePostModal;
