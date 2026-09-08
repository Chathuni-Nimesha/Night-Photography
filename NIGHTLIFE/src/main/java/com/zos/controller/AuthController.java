package com.zos.controller;

import java.security.Principal;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.zos.config.SecurityContest;
import com.zos.exception.UserException;
import com.zos.model.User;
import com.zos.repository.UserRepository;
import com.zos.security.JwtTokenProvider;
import com.zos.services.UserService;

@RestController
public class AuthController {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @GetMapping("/signin")
    public ResponseEntity<User> signinHandler(Authentication auth) throws BadCredentialsException {
        try {
            User user = userRepo.findByEmail(auth.getName())
                    .orElseThrow(() -> new BadCredentialsException("Invalid Username or password"));
            return new ResponseEntity<>(user, HttpStatus.ACCEPTED);
        } catch (BadCredentialsException ex) {
            throw new BadCredentialsException("Invalid username or password");
        }
    }

    @GetMapping("/oauth-user")
    public ResponseEntity<User> getOAuthUser(Principal principal) {
        if (principal instanceof OAuth2AuthenticationToken authToken) {
            Map<String, Object> attributes = authToken.getPrincipal().getAttributes();
            String email = (String) attributes.get("email");
            if (email == null) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not an OAuth2 login");
            }

            User user = userRepo.findByEmail(email).orElseThrow(
                    () -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not an OAuth2 login"));

            String jwt = jwtTokenProvider.generateJwtToken(user);
            return ResponseEntity.ok()
                    .header(SecurityContest.HEADER, "Bearer " + jwt)
                    .body(user);
        }
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not an OAuth2 login");
    }

    @PostMapping("/signup")
    public ResponseEntity<User> registerUserHandler(@RequestBody User user) throws UserException {
        User createdUser = userService.registerUser(user);
        return new ResponseEntity<User>(createdUser, HttpStatus.CREATED);
    }
}
