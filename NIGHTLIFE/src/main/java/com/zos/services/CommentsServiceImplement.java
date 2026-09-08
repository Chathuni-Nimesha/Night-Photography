package com.zos.services;

import com.zos.dto.UserDto;
import com.zos.exception.CommentException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.zos.model.Notification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.zos.exception.PostException;
import com.zos.exception.UserException;
import com.zos.model.Comments;
import com.zos.model.Post;
import com.zos.model.User;
import com.zos.repository.CommentRepository;
import com.zos.repository.PostRepository;

@Service
public class CommentsServiceImplement implements CommentService {

    @Autowired
    private CommentRepository repo;

    @Autowired
    private UserService userService;

    @Autowired
    private PostService postService;

    @Autowired
    private PostRepository postRepo;


    @Autowired
    private NotificationService notificationService;


    @Override
    public Comments createComment(Comments comment, Integer postId, Integer userId) throws PostException, UserException {

        User user = userService.findUserById(userId);

        Post post = postService.findePostById(postId);

        // TODO Auto-generated method stub

        UserDto userDto = new UserDto();
        userDto.setEmail(user.getEmail());
        userDto.setId(user.getId());
        userDto.setUsername(user.getUsername());
        userDto.setName(user.getName());
        userDto.setUserImage(user.getImage());

        comment.setUserDto(userDto);
        comment.setCreatedAt(LocalDateTime.now());
        comment.setPost(post);

        Comments newComment = repo.save(comment);

        post.getComments().add(newComment);

        postRepo.save(post);

        if (!post.getUser().getId().equals(userId)) {
            Notification notification = new Notification();
            notification.setMessage(user.getUsername() + " commented on your post");
            notification.setType("COMMENT");
            notification.setPostId(postId);
            notification.setCommentId(newComment.getId());
            notificationService.createNotification(notification, post.getUser().getId());
        }

        return newComment;
    }

    @Override
    public Comments findCommentById(Integer commentId) throws CommentException {
        Optional<Comments> opt = repo.findById(commentId);

        if (opt.isPresent()) {
            return opt.get();
        }
        throw new CommentException("comment not exist with id : " + commentId);
    }

    @Override
    public Comments likeComment(Integer commentId, Integer userId) throws UserException, CommentException {
        // TODO Auto-generated method stub

        User user = userService.findUserById(userId);
        Comments comment = findCommentById(commentId);


        UserDto userDto = new UserDto();
        userDto.setEmail(user.getEmail());
        userDto.setId(user.getId());
        userDto.setUsername(user.getUsername());
        userDto.setName(user.getName());
        userDto.setUserImage(user.getImage());

        comment.getLikedByUsers().add(userDto);
        return repo.save(comment);

    }


    @Override
    public Comments unlikeComment(Integer commentId, Integer userId) throws UserException, CommentException {
        User user = userService.findUserById(userId);
        Comments comment = findCommentById(commentId);

        comment.getLikedByUsers().removeIf(dto -> userId.equals(dto.getId()));

        return repo.save(comment);

    }


    @Override
    public String deleteCommentById(Integer commentId, Integer userId) throws CommentException {
        Comments comment = findCommentById(commentId);
        assertCommentOwner(comment, userId);
        repo.deleteById(comment.getId());
        return "Comment Deleted Successfully";
    }


    @Override
    public String editComment(Comments comment, Integer commentId, Integer userId) throws CommentException {
        Comments isComment = findCommentById(commentId);
        assertCommentOwner(isComment, userId);

        if (comment.getContent() != null) {
            isComment.setContent(comment.getContent());
        }
        repo.save(isComment);
        return "Comment Updated Successfully";
    }

    private void assertCommentOwner(Comments comment, Integer userId) {
        Integer ownerId = comment.getUserDto() != null ? comment.getUserDto().getId() : null;
        if (ownerId == null || userId == null || !ownerId.equals(userId)) {
            throw new com.zos.exception.ForbiddenException("You cannot change this comment.");
        }
    }


    @Override
    public List<Comments> findCommentByPostId(Integer postId) throws PostException {
        List<Comments> comments = repo.findCommentsByPostId(postId);
        return comments;
    }


}
