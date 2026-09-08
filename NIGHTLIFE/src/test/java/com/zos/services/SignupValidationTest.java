package com.zos.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.zos.exception.UserException;
import com.zos.model.User;
import com.zos.repository.UserRepository;
import com.zos.security.JwtTokenProvider;

@ExtendWith(MockitoExtension.class)
class SignupValidationTest {

    @Mock
    private UserRepository repo;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private UserServiceImplementation userService;

    private User validSignup;

    @BeforeEach
    void setUp() {
        validSignup = new User();
        validSignup.setEmail("new.shooter@example.com");
        validSignup.setUsername("nightshooter");
        validSignup.setName("Night Shooter");
        validSignup.setPassword("longenough");
    }

    @Test
    void registerUser_rejectsPasswordShorterThanEightCharacters() {
        validSignup.setPassword("short");

        UserException ex = assertThrows(UserException.class, () -> userService.registerUser(validSignup));

        assertEquals("email, password, username and name are invalid", ex.getMessage());
        verify(repo, never()).save(any());
    }

    @Test
    void registerUser_rejectsDuplicateEmail() {
        when(repo.findByEmail("new.shooter@example.com")).thenReturn(Optional.of(new User()));

        UserException ex = assertThrows(UserException.class, () -> userService.registerUser(validSignup));

        assertEquals("Email Already Exist", ex.getMessage());
        verify(repo, never()).save(any());
    }
}
