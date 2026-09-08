package com.zos.config;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.zos.model.Post;
import com.zos.model.Reels;
import com.zos.model.Story;
import com.zos.model.User;
import com.zos.repository.PostRepository;
import com.zos.repository.ReelRepository;
import com.zos.repository.StoryRepository;
import com.zos.repository.UserRepository;

/**
 * Development-only: refresh media URLs for existing *@nightlife.demo accounts.
 * Does not recreate users, likes, comments, follows, or saves.
 * Enable once with nightlife.demo-data.refresh-media=true (default false).
 */
@Component
@Order(2)
@ConditionalOnProperty(name = "nightlife.demo-data.refresh-media", havingValue = "true")
public class DemoMediaRefresher implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DemoMediaRefresher.class);

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final StoryRepository storyRepository;
    private final ReelRepository reelRepository;

    public DemoMediaRefresher(
            UserRepository userRepository,
            PostRepository postRepository,
            StoryRepository storyRepository,
            ReelRepository reelRepository) {
        this.userRepository = userRepository;
        this.postRepository = postRepository;
        this.storyRepository = storyRepository;
        this.reelRepository = reelRepository;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        List<User> demoUsers = userRepository.findAll().stream()
                .filter(u -> u.getEmail() != null && u.getEmail().endsWith(DemoMediaCatalog.DEMO_EMAIL_SUFFIX))
                .toList();

        if (demoUsers.isEmpty()) {
            log.warn("Demo media refresh requested, but no *@nightlife.demo users found. Seed first.");
            return;
        }

        int avatars = 0;
        int posts = 0;
        int stories = 0;
        int reels = 0;

        for (User user : demoUsers) {
            String avatar = DemoMediaCatalog.AVATARS.get(user.getUsername());
            if (avatar != null && !avatar.equals(user.getImage())) {
                user.setImage(avatar);
                userRepository.save(user);
                avatars++;
            }

            for (Post post : postRepository.findByUserId(user.getId())) {
                String url = DemoMediaCatalog.POST_MEDIA_BY_CAPTION.get(post.getCaption());
                if (url == null) {
                    continue;
                }
                List<String> media = new ArrayList<>();
                media.add(url);
                post.setMediaUrls(media);
                postRepository.save(post);
                posts++;
            }

            for (Story story : storyRepository.findAllStoriesByUserId(user.getId())) {
                String url = DemoMediaCatalog.STORY_MEDIA_BY_CAPTION.get(story.getCaptions());
                if (url == null) {
                    continue;
                }
                story.setImage(url);
                storyRepository.save(story);
                stories++;
            }
        }

        for (Reels reel : reelRepository.findAll()) {
            if (reel.getUser() == null || reel.getUser().getEmail() == null
                    || !reel.getUser().getEmail().endsWith(DemoMediaCatalog.DEMO_EMAIL_SUFFIX)) {
                continue;
            }
            String video = DemoMediaCatalog.REEL_VIDEO_BY_CAPTION.get(reel.getCaption());
            if (video == null) {
                continue;
            }
            reel.setVideo(video);
            reelRepository.save(reel);
            reels++;
        }

        log.info(
                "Demo media refresh complete: {} avatars, {} posts, {} stories, {} reels updated (demo accounts only).",
                avatars, posts, stories, reels);
    }
}
