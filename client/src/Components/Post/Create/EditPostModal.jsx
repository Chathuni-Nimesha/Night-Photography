import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaPhotoVideo } from "react-icons/fa";
import { GoLocation } from "react-icons/go";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/modal";
import { useToast } from "@chakra-ui/react";
import { editPOst } from "../../../Redux/Post/Action";
import { uploadToCloudinary } from "../../../Config/UploadToCloudinary";
import { getAuthToken } from "../../../Config/auth";
import { isVideoUrl } from "../../../Config/media";
import "./CreatePostModal.css";

const EditPostModal = ({ isOpen, onClose, post }) => {
  const dispatch = useDispatch();
  const token = getAuthToken();
  const { user } = useSelector((store) => store);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const [postData, setPostData] = useState({
    caption: "",
    location: "",
    mediaUrls: [],
    id: null,
  });

  useEffect(() => {
    if (post) {
      setPostData({
        caption: post.caption || "",
        location: post.location || "",
        mediaUrls: post.mediaUrls || [],
        id: post.id,
      });
    }
  }, [post]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPostData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!(file.type.startsWith("image/") || file.type.startsWith("video/"))) {
      toast({
        title: "Choose an image or video",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      const mediaUrl = await uploadToCloudinary(file);
      if (!mediaUrl) throw new Error("Failed to get media URL");
      setPostData((prev) => ({
        ...prev,
        mediaUrls: [mediaUrl],
      }));
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Please try again",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!postData.id) return;

    dispatch(
      editPOst({
        jwt: token,
        data: {
          id: postData.id,
          caption: postData.caption,
          location: postData.location,
          mediaUrls: postData.mediaUrls,
        },
      })
    );
    onClose();
  };

  const preview = postData.mediaUrls?.[0];

  return (
    <Modal size={"4xl"} isOpen={isOpen} onClose={onClose} isCentered>
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
          <p className="nl-serif">Edit frame</p>
          <button type="button" className="nl-btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Updating…" : "Update"}
          </button>
        </div>

        <ModalBody p={0} overflowY="auto">
          <div className="nl-create-layout">
            <div className="nl-create-media">
              <label htmlFor="nl-edit-upload" className="nl-create-drop" style={{ cursor: "pointer" }}>
                {preview ? (
                  isVideoUrl(preview) ? (
                    <video src={preview} controls className="max-h-full max-w-full object-contain" />
                  ) : (
                    <img src={preview} alt="Frame preview" />
                  )
                ) : (
                  <>
                    <FaPhotoVideo className="text-3xl mb-3" aria-hidden="true" />
                    <p>Choose a photograph</p>
                  </>
                )}
                <span className="nl-btn-ghost mt-4">Change media</span>
              </label>
              <input
                id="nl-edit-upload"
                type="file"
                accept="image/*,video/*"
                onChange={handleImageChange}
                className="nl-create-file"
              />
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
              <label htmlFor="nl-edit-caption" className="nl-label">
                Caption
              </label>
              <textarea
                id="nl-edit-caption"
                className="nl-input nl-create-caption"
                placeholder="Describe the night…"
                name="caption"
                rows="6"
                value={postData.caption}
                onChange={handleInputChange}
                maxLength={2200}
              />
              <label htmlFor="nl-edit-location" className="nl-label">
                Location
              </label>
              <div className="nl-create-location">
                <input
                  id="nl-edit-location"
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

export default EditPostModal;
