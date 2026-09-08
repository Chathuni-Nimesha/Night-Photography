import {
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import {
  BsBookmark,
  BsBookmarkFill,
  BsEmojiSmile,
} from "react-icons/bs";
import { FaRegComment } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { timeDifference } from "../../Config/Logic";
import { getPostMedia, isVideoUrl, postAltText } from "../../Config/media";
import { createComment, getAllComments } from "../../Redux/Comment/Action";
import { findPostByIdAction } from "../../Redux/Post/Action";
import CommentCard from "./CommentCard";
import "./CommentModal.css";

const CommentModal = ({
  isOpen,
  onClose,
  postData,
  handleLikePost,
  handleUnLikePost,
  handleSavePost,
  handleUnSavePost,
  isPostLiked,
  isSaved,
  redirectOnClose = true,
}) => {
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("token");
  const { post, comments, user } = useSelector((store) => store);
  const [commentContent, setCommentContent] = useState("");
  const { postId } = useParams();
  const navigate = useNavigate();
  const activeCommentPostId = postId || postData?.id;

  useEffect(() => {
    if (activeCommentPostId && isOpen) {
      dispatch(
        findPostByIdAction({
          jwt,
          postId: activeCommentPostId,
        })
      );
      dispatch(getAllComments({ jwt, postId: activeCommentPostId }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCommentPostId, isOpen, comments?.createdComment, comments?.deletedComment, comments?.updatedComment, dispatch, jwt]);

  const handleAddComment = () => {
    if (!activeCommentPostId || !commentContent.trim()) return;
    const data = {
      jwt,
      postId: activeCommentPostId,
      data: {
        content: commentContent,
      },
    };
    dispatch(createComment(data));
    setCommentContent("");
  };

  const handleCommnetInputChange = (e) => {
    setCommentContent(e.target.value);
  };
  const handleOnEnterPress = (e) => {
    if (e.key === "Enter") {
      handleAddComment();
    } else return;
  };

  const leavePostView = () => {
    const historyIndex = window.history.state?.idx;
    if (typeof historyIndex === "number" && historyIndex > 0) {
      navigate(-1);
      return;
    }
    navigate("/", { replace: true });
  };

  const handleClose = (event) => {
    event?.stopPropagation?.();
    onClose();
    if (redirectOnClose || postId) {
      leavePostView();
    }
  };

  const matchesActivePost = (item) =>
    item?.id != null && String(item.id) === String(activeCommentPostId);
  const activePost = matchesActivePost(post.singlePost) ? post.singlePost : postData;
  const media = getPostMedia(activePost);
  const frame = media[0];

  return (
    <div>
      <Modal size={"4xl"} onClose={handleClose} isOpen={isOpen} isCentered>
        <ModalOverlay bg="rgba(7,8,10,0.86)" />
        <ModalContent bg="#12151C" color="#F4F1EA" border="1px solid rgba(255,255,255,0.08)" borderRadius="2px">
          <ModalBody>
            <div className="flex flex-col md:flex-row h-auto md:h-[75vh] gap-4">
              <div className="w-full md:w-[55%] flex flex-col justify-center bg-[#050608]">
                {frame && isVideoUrl(frame) ? (
                  <video src={frame} controls className="max-h-full max-w-full object-contain" />
                ) : (
                  frame && (
                    <img
                      className="max-h-full max-w-full object-contain"
                      src={frame}
                      alt={postAltText(activePost)}
                    />
                  )
                )}
              </div>
              <div className="w-full md:w-[45%] md:pl-6 relative">
                <div className="reqUser flex justify-between items-center py-5">
                  <div className="flex items-center">
                    <div className="">
                      <img
                        className="w-9 h-9 rounded-full object-cover"
                        src={
                          activePost?.user?.userImage ||
                          user.reqUser?.image ||
                          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                        }
                        alt={activePost?.user?.username ? `${activePost.user.username} profile` : "Photographer"}
                      />
                    </div>
                    <div className="ml-3">
                      <p>{activePost?.user?.name}</p>
                      <p>{activePost?.user?.username}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="nl-icon-btn"
                    aria-label="Close"
                    onClick={handleClose}
                  >
                    <IoCloseOutline size={22} aria-hidden="true" />
                  </button>
                </div>
                <hr />

                <div className="comments ">
                  {comments.comments?.length > 0 &&
                    comments.comments?.map((item) => (
                      <CommentCard key={item?.id} comment={item} />
                    ))}
                </div>

                <div className=" absolute bottom-0 w-[90%]">
                  <div className="flex justify-between items-center w-full mt-5">
                    <div className="flex items-center space-x-2 ">
                      {isPostLiked ? (
                        <AiFillHeart
                          onClick={handleUnLikePost}
                          className="text-2xl hover:opacity-50 cursor-pointer text-red-600"
                          aria-label="Unlike"
                          role="button"
                        />
                      ) : (
                        <AiOutlineHeart
                          onClick={handleLikePost}
                          className="text-2xl hover:opacity-50 cursor-pointer "
                          aria-label="Like"
                          role="button"
                        />
                      )}

                  <FaRegComment className="text-xl" aria-hidden="true" />
                    </div>
                    <div className="cursor-pointer">
                      {isSaved ? (
                        <BsBookmarkFill
                          onClick={() => handleUnSavePost(activePost?.id)}
                          className="text-xl"
                          aria-label="Unsave"
                          role="button"
                        />
                      ) : (
                        <BsBookmark
                          onClick={() => handleSavePost(activePost?.id)}
                          className="text-xl hover:opacity-50 cursor-pointer"
                          aria-label="Save"
                          role="button"
                        />
                      )}
                    </div>
                  </div>
                  {activePost?.likedByUsers?.length > 0 && (
                    <p className="text-sm font-semibold py-2">
                      {activePost?.likedByUsers?.length} likes{" "}
                    </p>
                  )}
                  <p className="opacity-70 pb-5">
                    {timeDifference(activePost?.createdAt)}
                  </p>
                  <div className=" flex items-center ">
                    <BsEmojiSmile className="mr-3 text-xl" />
                    <input
                      className="commentInput w-[70%]"
                      placeholder="Add Comment..."
                      type="text"
                      onKeyPress={handleOnEnterPress}
                      onChange={handleCommnetInputChange}
                      value={commentContent}
                    />
                  </div>
                </div>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CommentModal;
