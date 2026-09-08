package com.zos.controller;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import com.zos.model.Post;
import com.zos.model.User;
import com.zos.services.UserService;

@WebMvcTest(controllers = UserController.class)
@AutoConfigureMockMvc(addFilters = false)
class PublicUserSavedPostPrivacyTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Test
    void usernameLookupDoesNotSerializeSavedPost() throws Exception {
        Post saved = new Post();
        saved.setId(99);
        saved.setCaption("private save");

        User user = new User();
        user.setId(5);
        user.setUsername("nightshooter");
        user.setEmail("nightshooter@example.com");
        user.setName("Night Shooter");
        user.setBio("after dark");
        user.setSavedPost(List.of(saved));

        when(userService.findUserByUsername("nightshooter")).thenReturn(user);

        mockMvc.perform(get("/api/users/username/nightshooter"))
                .andExpect(status().isAccepted())
                .andExpect(jsonPath("$.username").value("nightshooter"))
                .andExpect(jsonPath("$.name").value("Night Shooter"))
                .andExpect(jsonPath("$.bio").value("after dark"))
                .andExpect(jsonPath("$.savedPost").doesNotExist())
                .andExpect(jsonPath("$.password").doesNotExist());
    }
}
