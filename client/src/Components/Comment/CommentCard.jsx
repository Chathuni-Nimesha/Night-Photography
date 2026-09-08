import React, { useEffect, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { isCommentLikedByUser, timeDifference } from "../../Config/Logic";
import { deleteComment, likeComment, unLikeComment, editComment } from "../../Redux/Comment/Action";
import { MdDelete } from "react-icons/md";
import { BsPencil } from "react-icons/bs";


const CommentCard = ({ comment }) => {
  const [isCommentLiked, setIsCommentLike] = useState(false);
  const { user } = useSelector((store) => store);
  const [commentLikes, setCommentLikes] = useState(0);
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("token");
  const [isEditCommentInputOpen, setIsEditCommentInputOpen] = useState(false);
  const [commentContent, setCommentContent] = useState("");

  useEffect(() => {
    setCommentContent(comment?.content);
  }, [comment]);

  const handleLikeComment = () => {
    dispatch(likeComment({ jwt, commentId: comment.id }));
    setIsCommentLike(true);
    setCommentLikes(commentLikes + 1);
  };

  const handleUnLikeComment = () => {
    dispatch(unLikeComment({ jwt, commentId: comment.id }));
    setIsCommentLike(false);
    setCommentLikes(commentLikes - 1);
  };

  useEffect(() => {
    setCommentLikes(comment?.likedByUsers?.length);
  }, [comment]);

  useEffect(() => {
    setIsCommentLike(isCommentLikedByUser(comment, user.reqUser?.id));
  }, [comment, user.reqUser]);

  const handleClickOnEditComment = () => {
    setIsEditCommentInputOpen(!isEditCommentInputOpen);
  };
  const handleCommnetInputChange = (e) => {
    setCommentContent(e.target.value);
  };
  const handleDeleteComment = () => {
    dispatch(deleteComment({ commentId: comment.id, jwt }));
  };

  const handleEditComment = (e) => {
    if(e.key==="Enter"){
      dispatch(
      editComment({ data: { id: comment?.id, content: commentContent }, jwt })
     
    );
     setIsEditCommentInputOpen(false);
    }
    
  };
  return (
    <div>
      <div className="reqUser flex justify-between items-center py-5">
        <div className="flex items-center">
          <div className="">
            <img
              className="w-9 h-9 rounded-full object-cover"
              src={
                comment?.userDto.userImage ||
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
              }
            alt={comment?.userDto?.username ? `${comment.userDto.username} profile` : "Photographer"}
            loading="lazy"
            decoding="async"
            />
          </div>
          <div className="ml-3">
            <p>
              <span className="font-semibold"> {comment.userDto.username}</span>
              <span className="ml-2">{comment.content}</span>
            </p>
            <div className="flex items-center space-x-3 text-xs opacity-60 pt-2">
              <span>{timeDifference(comment?.createdAt)}</span>
              {commentLikes > 0 && <span>{commentLikes} like</span>}
              {user?.reqUser?.id === comment?.userDto?.id && (
                <>
                  <button type="button" className="nl-icon-btn" aria-label="Edit comment" onClick={handleClickOnEditComment}>
                    <BsPencil />
                  </button>
                  <button type="button" className="nl-icon-btn" aria-label="Delete comment" onClick={handleDeleteComment}>
                    <MdDelete />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        {isCommentLiked ? (
          <button type="button" className="nl-icon-btn" aria-label="Unlike comment" onClick={handleUnLikeComment}>
            <AiFillHeart className="text-xs text-red-600" />
          </button>
        ) : (
          <button type="button" className="nl-icon-btn" aria-label="Like comment" onClick={handleLikeComment}>
            <AiOutlineHeart className="text-xs" />
          </button>
        )}
      </div>
      {isEditCommentInputOpen && (
        <div>
          <label htmlFor={`edit-comment-${comment.id}`} className="sr-only">
            Edit comment
          </label>
          <input
            id={`edit-comment-${comment.id}`}
            className="nl-input"
            placeholder="Edit comment"
            type="text"
            onKeyPress={handleEditComment}
            onChange={handleCommnetInputChange}
            value={commentContent}
          />
        </div>
      )}
    </div>
  );
};

export default CommentCard;
