package com.zos.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.zos.dto.UserDto;
import com.zos.exception.PostException;
import com.zos.exception.UserException;
import com.zos.model.Notification;
import com.zos.model.Post;
import com.zos.model.User;
import com.zos.repository.UserRepository;
import com.zos.security.JwtTokenClaims;
import com.zos.security.JwtTokenProvider;
import com.zos.util.UserUtil;

import net.bytebuddy.dynamic.loading.PackageDefinitionStrategy.Definition.Undefined;

@Service
public class UserServiceImplementation implements UserService {

    @Autowired
    private UserRepository repo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    @Lazy
    private NotificationService notificationService;

    @Override
    public User registerUser(User user) throws UserException {

        if (user.getEmail() == null || user.getPassword() == null || user.getUsername() == null || user.getName() == null) {
            throw new UserException("email,password and username are required");
        }

        String email = user.getEmail().trim();
        String username = user.getUsername().trim();
        String name = user.getName().trim();
        String password = user.getPassword();

        if (email.isEmpty() || !email.contains("@") || !email.contains(".")
                || username.length() < 4 || name.length() < 2 || password.length() < 8) {
            throw new UserException("email, password, username and name are invalid");
        }

        Optional<User> isEmailExist = repo.findByEmail(email);

        if (isEmailExist.isPresent()) {
            throw new UserException("Email Already Exist");
        }

        Optional<User> isUsernameTaken = repo.findByUsername(username);

        if (isUsernameTaken.isPresent()) {
            throw new UserException("Username Already Taken");
        }

        String encodedPassword = passwordEncoder.encode(password);

        User newUser = new User();

        newUser.setEmail(email);
        newUser.setPassword(encodedPassword);
        newUser.setUsername(username);
        newUser.setName(name);

        return repo.save(newUser);

    }


    @Override
    public User findUserById(Integer userId) throws UserException {

        Optional<User> opt = repo.findById(userId);

        if (opt.isPresent()) {
            return opt.get();
        }

        throw new UserException("user not found with userid :" + userId);
    }


    @Override
    public String followUser(Integer reqUserId, Integer followUserId) throws UserException {
        User followUser = findUserById(followUserId);
        User reqUser = findUserById(reqUserId);

        UserDto follower = new UserDto();
        follower.setEmail(reqUser.getEmail());
        follower.setUsername(reqUser.getUsername());
        follower.setId(reqUser.getId());
        follower.setName(reqUser.getName());
        follower.setUserImage(reqUser.getImage());


        UserDto following = new UserDto();
        following.setEmail(followUser.getEmail());
        following.setUsername(followUser.getUsername());
        following.setId(followUser.getId());
        following.setName(followUser.getName());
        following.setUserImage(followUser.getImage());


        followUser.getFollower().add(follower);
        reqUser.getFollowing().add(following);

        repo.save(followUser);
        repo.save(reqUser);

        if (!reqUserId.equals(followUserId)) {
            Notification notification = new Notification();
            notification.setMessage(reqUser.getUsername() + " started following you");
            notification.setType("FOLLOW");
            notificationService.createNotification(notification, followUser.getId());
        }

        return "you are following " + followUser.getUsername();
    }


    @Override
    public String unfollowUser(Integer reqUserId, Integer unfollowUserId) throws UserException {


        User unfollowUser = findUserById(unfollowUserId);
        User reqUser = findUserById(reqUserId);

        unfollowUser.getFollower().removeIf(dto -> reqUserId.equals(dto.getId()));
        reqUser.getFollowing().removeIf(dto -> unfollowUserId.equals(dto.getId()));

        repo.save(unfollowUser);
        repo.save(reqUser);

        return "you have unfollow " + unfollowUser.getUsername();


    }


    @Override
    public User findUserProfile(String token) throws UserException {
        if (token != null && token.regionMatches(true, 0, "Bearer ", 0, 7)) {
            token = token.substring(7).trim();
        }
        if (token == null || token.isBlank()) {
            throw new UserException("Invalid authorization token");
        }

        JwtTokenClaims jwtTokenClaims = jwtTokenProvider.getClaimsFromToken(token);

        String username = jwtTokenClaims.getUsername();

        Optional<User> opt = repo.findByEmail(username);

        if (opt.isPresent()) {


            return opt.get();

        }

        throw new UserException("user not exist with email : " + username);


    }


    @Override
    public User findUserByUsername(String username) throws UserException {

        Optional<User> opt = repo.findByUsername(username);

        if (opt.isPresent()) {
            User user = opt.get();
            return user;
        }

        throw new UserException("user not exist with username " + username);
    }


    @Override
    public List<User> findUsersByUserIds(List<Integer> userIds) {
        List<User> users = repo.findAllUserByUserIds(userIds);

        return users;
    }


    @Override
    public List<User> searchUser(String query) throws UserException {
        if (query == null || query.isBlank()) {
            return List.of();
        }
        return repo.findByQuery(query);
    }


    @Override
    public User updateUserDetails(User updatedUser, User existingUser) throws UserException {

        if (updatedUser.getEmail() != null) {
            existingUser.setEmail(updatedUser.getEmail());
        }
        if (updatedUser.getBio() != null) {
            existingUser.setBio(updatedUser.getBio());
        }
        if (updatedUser.getName() != null) {
            existingUser.setName(updatedUser.getName());
        }
        if (updatedUser.getUsername() != null) {
            existingUser.setUsername(updatedUser.getUsername());
        }
        if (updatedUser.getMobile() != null) {
            existingUser.setMobile(updatedUser.getMobile());
        }
        if (updatedUser.getGender() != null) {
            existingUser.setGender(updatedUser.getGender());
        }
        if (updatedUser.getWebsite() != null) {
            existingUser.setWebsite(updatedUser.getWebsite());
        }
        if (updatedUser.getImage() != null) {
            existingUser.setImage(updatedUser.getImage());
        }


        if (!updatedUser.getId().equals(existingUser.getId())) {
            throw new UserException("you can't update another user");
        }


        return repo.save(existingUser);

    }


    @Override
    public List<User> popularUser() {
        List<User> users = repo.findAll();

        UserUtil.sortUserByNumberOfPost(users);

        int numUsers = Math.min(users.size(), 5);
        List<User> populerUsers = users.subList(0, numUsers);

        return populerUsers;

    }


}
