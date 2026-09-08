package com.zos.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

import com.zos.exception.GlobleException;
import com.zos.model.LearningPlan;
import com.zos.model.User;
import com.zos.repository.LearningPlanRepository;
import com.zos.repository.ResourceRepository;
import com.zos.repository.TopicRepository;
import com.zos.services.LearningPlanServiceImpl;
import com.zos.services.UserService;

@WebMvcTest(controllers = LearningPlanController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import({LearningPlanServiceImpl.class, GlobleException.class})
class LearningPlanOwnershipTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private LearningPlanRepository learningPlanRepository;

    @MockBean
    private TopicRepository topicRepository;

    @MockBean
    private ResourceRepository resourceRepository;

    @MockBean
    private UserService userService;

    private User owner;
    private User otherUser;
    private LearningPlan plan;

    @BeforeEach
    void setUp() {
        owner = new User();
        owner.setId(1);
        owner.setEmail("owner@example.com");

        otherUser = new User();
        otherUser.setId(2);
        otherUser.setEmail("other@example.com");

        plan = new LearningPlan();
        plan.setId(42L);
        plan.setTitle("Long exposure");
        plan.setUser(owner);
    }

    @Test
    void ownerCanReadOwnLearningPlan() throws Exception {
        when(userService.findUserProfile(any())).thenReturn(owner);
        when(learningPlanRepository.findById(42L)).thenReturn(Optional.of(plan));

        mockMvc.perform(get("/api/learning_plan/42")
                        .header("Authorization", "Bearer test"))
                .andExpect(status().isOk());
    }

    @Test
    void otherUserCannotReadPrivateLearningPlan() throws Exception {
        when(userService.findUserProfile(any())).thenReturn(otherUser);
        when(learningPlanRepository.findById(42L)).thenReturn(Optional.of(plan));

        mockMvc.perform(get("/api/learning_plan/42")
                        .header("Authorization", "Bearer test"))
                .andExpect(status().isForbidden());
    }
}
