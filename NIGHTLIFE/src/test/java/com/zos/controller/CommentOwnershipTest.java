package com.zos.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.zos.dto.UserDto;
import com.zos.exception.GlobleException;
import com.zos.model.Comments;
import com.zos.model.User;
import com.zos.repository.CommentRepository;
import com.zos.repository.PostRepository;
import com.zos.services.CommentsServiceImplement;
import com.zos.services.NotificationService;
import com.zos.services.PostService;
import com.zos.services.UserService;

@WebMvcTest(controllers = CommentController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import({CommentsServiceImplement.class, GlobleException.class})
class CommentOwnershipTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CommentRepository commentRepository;

    @MockBean
    private UserService userService;

    @MockBean
    private PostService postService;

    @MockBean
    private PostRepository postRepository;

    @MockBean
    private NotificationService notificationService;

    private User owner;
    private User otherUser;
    private Comments ownedComment;

    @BeforeEach
    void setUp() {
        owner = new User();
        owner.setId(1);
        owner.setEmail("owner@example.com");

        otherUser = new User();
        otherUser.setId(2);
        otherUser.setEmail("other@example.com");

        UserDto ownerDto = new UserDto();
        ownerDto.setId(1);
        ownerDto.setUsername("owner");
        ownerDto.setEmail("owner@example.com");

        ownedComment = new Comments();
        ownedComment.setId(10);
        ownedComment.setContent("original");
        ownedComment.setUserDto(ownerDto);
    }

    @Test
    void ownerCanEditAndDeleteComment() throws Exception {
        when(userService.findUserProfile(any())).thenReturn(owner);
        when(commentRepository.findById(10)).thenReturn(Optional.of(ownedComment));
        when(commentRepository.save(any(Comments.class))).thenReturn(ownedComment);

        mockMvc.perform(put("/api/comments/edit")
                        .header("Authorization", "Bearer test")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"id\":10,\"content\":\"updated\"}"))
                .andExpect(status().isAccepted());

        mockMvc.perform(delete("/api/comments/delete/10")
                        .header("Authorization", "Bearer test"))
                .andExpect(status().isAccepted());

        verify(commentRepository).deleteById(10);
    }

    @Test
    void nonOwnerCannotEditOrDeleteComment() throws Exception {
        when(userService.findUserProfile(any())).thenReturn(otherUser);
        when(commentRepository.findById(10)).thenReturn(Optional.of(ownedComment));

        mockMvc.perform(put("/api/comments/edit")
                        .header("Authorization", "Bearer test")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"id\":10,\"content\":\"hijack\"}"))
                .andExpect(status().isForbidden());

        mockMvc.perform(delete("/api/comments/delete/10")
                        .header("Authorization", "Bearer test"))
                .andExpect(status().isForbidden());

        verify(commentRepository, never()).save(any());
        verify(commentRepository, never()).deleteById(any());
    }
}
