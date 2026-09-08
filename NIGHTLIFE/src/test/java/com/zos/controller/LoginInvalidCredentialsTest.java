package com.zos.controller;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import com.zos.config.AppConfig;
import com.zos.config.OAuth2LoginSuccessHandler;
import com.zos.config.SecurityContest;
import com.zos.exception.GlobleException;
import com.zos.repository.UserRepository;
import com.zos.security.JwtTokenProvider;
import com.zos.services.UserService;
import com.zos.services.UserUserDetailService;

@WebMvcTest(controllers = AuthController.class)
@Import({
        AppConfig.class,
        SecurityContest.class,
        UserUserDetailService.class,
        OAuth2LoginSuccessHandler.class,
        GlobleException.class
})
@TestPropertySource(properties = {
        "jwt.secret=nightlife-test-jwt-secret-value-32chars",
        "jwt.expiration=86400000",
        "frontend.url=http://localhost:3000",
        "spring.security.oauth2.client.registration.google.client-id=test-google-client-id",
        "spring.security.oauth2.client.registration.google.client-secret=test-google-client-secret",
        "spring.security.oauth2.client.registration.google.scope=profile,email"
})
class LoginInvalidCredentialsTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private UserService userService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @Test
    void signin_withUnknownUser_returns401Not500() throws Exception {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        mockMvc.perform(get("/signin").with(httpBasic("nobody@example.com", "not-a-real-password")))
                .andExpect(status().isUnauthorized());
    }
}
