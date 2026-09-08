package com.zos.config;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.zos.model.User;
import com.zos.repository.UserRepository;
import com.zos.security.JwtTokenProvider;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    @Value("${frontend.url:http://localhost:3000}")
    private String frontendUrl;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException {
        if (!(authentication instanceof OAuth2AuthenticationToken oauthToken)) {
            response.sendRedirect(frontendUrl + "/login?error=true");
            return;
        }

        Map<String, Object> attributes = oauthToken.getPrincipal().getAttributes();
        String email = (String) attributes.get("email");
        if (email == null || email.isBlank()) {
            response.sendRedirect(frontendUrl + "/login?error=true");
            return;
        }

        User user = userRepository.findByEmail(email).orElseGet(() -> createOAuthUser(email, attributes));
        if (user.getUsername() == null || user.getUsername().isBlank()) {
            user.setUsername(uniqueUsername(email));
            user = userRepository.save(user);
        }

        String jwt = jwtTokenProvider.generateJwtToken(user);
        response.sendRedirect(frontendUrl + "/oauth-success#token=" + jwt);
    }

    private User createOAuthUser(String email, Map<String, Object> attributes) {
        User user = new User();
        user.setEmail(email);
        user.setName((String) attributes.get("name"));
        user.setUsername(uniqueUsername(email));
        if (attributes.get("picture") instanceof String picture) {
            user.setImage(picture);
        }
        return userRepository.save(user);
    }

    private String uniqueUsername(String email) {
        String base = email.split("@")[0].replaceAll("[^a-zA-Z0-9._]", "");
        if (base.isBlank()) {
            base = "photographer";
        }
        String candidate = base;
        int suffix = 1;
        Optional<User> existing = userRepository.findByUsername(candidate);
        while (existing.isPresent()) {
            candidate = base + suffix++;
            existing = userRepository.findByUsername(candidate);
        }
        return candidate;
    }
}
