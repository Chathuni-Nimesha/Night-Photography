package com.zos.dto;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import com.zos.model.Story;
import com.zos.model.User;

public class PublicUserDto {

    private Integer id;
    private String username;
    private String email;
    private String name;
    private String mobile;
    private String website;
    private String bio;
    private String gender;
    private String image;
    private Set<UserDto> follower = new HashSet<>();
    private Set<UserDto> following = new HashSet<>();
    private List<Story> stories = new ArrayList<>();

    public PublicUserDto() {
    }

    public static PublicUserDto from(User user) {
        if (user == null) {
            return null;
        }
        PublicUserDto dto = new PublicUserDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setName(user.getName());
        dto.setMobile(user.getMobile());
        dto.setWebsite(user.getWebsite());
        dto.setBio(user.getBio());
        dto.setGender(user.getGender());
        dto.setImage(user.getImage());
        dto.setFollower(user.getFollower() != null ? new HashSet<>(user.getFollower()) : new HashSet<>());
        dto.setFollowing(user.getFollowing() != null ? new HashSet<>(user.getFollowing()) : new HashSet<>());
        dto.setStories(user.getStories() != null ? new ArrayList<>(user.getStories()) : new ArrayList<>());
        return dto;
    }

    public static List<PublicUserDto> from(List<User> users) {
        if (users == null) {
            return List.of();
        }
        return users.stream().map(PublicUserDto::from).collect(Collectors.toList());
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public Set<UserDto> getFollower() {
        return follower;
    }

    public void setFollower(Set<UserDto> follower) {
        this.follower = follower;
    }

    public Set<UserDto> getFollowing() {
        return following;
    }

    public void setFollowing(Set<UserDto> following) {
        this.following = following;
    }

    public List<Story> getStories() {
        return stories;
    }

    public void setStories(List<Story> stories) {
        this.stories = stories;
    }
}
