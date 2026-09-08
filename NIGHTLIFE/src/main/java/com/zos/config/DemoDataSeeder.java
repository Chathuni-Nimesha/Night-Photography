package com.zos.config;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.zos.dto.UserDto;
import com.zos.model.Comments;
import com.zos.model.LearningPlan;
import com.zos.model.LearningProgressUpdate;
import com.zos.model.Post;
import com.zos.model.Reels;
import com.zos.model.Story;
import com.zos.model.Topic;
import com.zos.model.User;
import com.zos.repository.PostRepository;
import com.zos.repository.UserRepository;
import com.zos.services.CommentService;
import com.zos.services.LearningPlanService;
import com.zos.services.LearningProgressUpdateService;
import com.zos.services.PostService;
import com.zos.services.ReelService;
import com.zos.services.StoryService;
import com.zos.services.UserService;

/**
 * Local development demo dataset only.
 * Enable with nightlife.demo-data.enabled=true (or NIGHTLIFE_DEMO_DATA=true).
 * Skips if the marker account already exists.
 */
@Component
@Order(1)
@ConditionalOnProperty(name = "nightlife.demo-data.enabled", havingValue = "true")
public class DemoDataSeeder implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DemoDataSeeder.class);

    /** Marker account — presence means seed already ran. */
    public static final String MARKER_EMAIL = "neonaria@nightlife.demo";

    /** Shared password for all demo accounts (local only). */
    public static final String DEMO_PASSWORD = "DemoNight1!";

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserService userService;
    private final PostService postService;
    private final CommentService commentService;
    private final StoryService storyService;
    private final ReelService reelService;
    private final LearningPlanService learningPlanService;
    private final LearningProgressUpdateService progressUpdateService;

    public DemoDataSeeder(
            UserRepository userRepository,
            PostRepository postRepository,
            PasswordEncoder passwordEncoder,
            UserService userService,
            PostService postService,
            CommentService commentService,
            StoryService storyService,
            ReelService reelService,
            LearningPlanService learningPlanService,
            LearningProgressUpdateService progressUpdateService) {
        this.userRepository = userRepository;
        this.postRepository = postRepository;
        this.passwordEncoder = passwordEncoder;
        this.userService = userService;
        this.postService = postService;
        this.commentService = commentService;
        this.storyService = storyService;
        this.reelService = reelService;
        this.learningPlanService = learningPlanService;
        this.progressUpdateService = progressUpdateService;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) throws Exception {
        if (userRepository.findByEmail(MARKER_EMAIL).isPresent()) {
            log.info("Demo data already present (marker {}); skipping seed.", MARKER_EMAIL);
            return;
        }

        log.info("Seeding Nightlife demo data (local development only)...");

        List<User> users = createUsers();
        List<Post> posts = createPosts(users);
        createLikes(users, posts);
        createComments(users, posts);
        createFollows(users);
        createSaves(users, posts);
        createStories(users);
        createReels(users);
        createCraftAndProgress(users);

        log.info(
                "Demo seed complete: {} users, {} posts. Login any *@nightlife.demo account with password {}.",
                users.size(),
                posts.size(),
                DEMO_PASSWORD);
    }

    private List<User> createUsers() {
        List<UserSpec> specs = List.of(
                new UserSpec("neonaria", MARKER_EMAIL, "Neon Aria",
                        "Street frames after midnight. Neon, rain, and empty avenues.",
                        "Female", "https://nightlife.demo/neonaria"),
                new UserSpec("lumenframe", "lumenframe@nightlife.demo", "Lumen Frame",
                        "City lights and long exposures. Architecture after dark.",
                        "Male", "https://nightlife.demo/lumenframe"),
                new UserSpec("duskcircuit", "duskcircuit@nightlife.demo", "Dusk Circuit",
                        "Urban night walks. Bridges, alleys, and sodium lamps.",
                        "Female", "https://nightlife.demo/duskcircuit"),
                new UserSpec("afterglow_lens", "afterglow@nightlife.demo", "Afterglow Lens",
                        "Café windows and wet asphalt. Quiet nightlife studies.",
                        "Male", "https://nightlife.demo/afterglow"),
                new UserSpec("gridlight", "gridlight@nightlife.demo", "Grid Light",
                        "Skyline grids and tower glow. Night architecture.",
                        "Female", "https://nightlife.demo/gridlight"),
                new UserSpec("velvetiso", "velvetiso@nightlife.demo", "Velvet ISO",
                        "High-ISO street portraits and neon color.",
                        "Male", "https://nightlife.demo/velvetiso")
        );

        List<User> users = new ArrayList<>();
        String encoded = passwordEncoder.encode(DEMO_PASSWORD);
        for (UserSpec spec : specs) {
            User user = new User();
            user.setUsername(spec.username());
            user.setEmail(spec.email());
            user.setName(spec.name());
            user.setBio(spec.bio());
            user.setImage(DemoMediaCatalog.AVATARS.get(spec.username()));
            user.setGender(spec.gender());
            user.setWebsite(spec.website());
            user.setPassword(encoded);
            users.add(userRepository.save(user));
        }
        return users;
    }

    private List<Post> createPosts(List<User> users) throws Exception {
        List<PostSpec> specs = List.of(
                new PostSpec(0, "Rain on neon. The street writes its own captions.", "Tokyo side street", -2),
                new PostSpec(1, "Long exposure over the river — light trails as brushstrokes.", "Brooklyn Bridge", -3),
                new PostSpec(2, "Empty platform, full color. Midnight metro study.", "Metro Line 6", -1),
                new PostSpec(3, "Café glass and reflections — a soft night still life.", "East Side Café", -4),
                new PostSpec(0, "Alley lamps and wet asphalt. Quiet after the crowd leaves.", "Old Town Alley", -5),
                new PostSpec(4, "Tower grid at blue hour. Architecture as constellation.", "Financial District", -2),
                new PostSpec(5, "ISO 6400, handheld. Neon portraits without a flash.", "Lantern Market", -6),
                new PostSpec(1, "Harbor lights stacking into the fog.", "Pier 14", -1),
                new PostSpec(2, "Crosswalk blur — people as streaks of color.", "Central Crossing", -3),
                new PostSpec(4, "Rooftop silhouette against the skyline glow.", "North Rooftops", -7),
                new PostSpec(3, "Steam from a late kitchen vent. Warm against the cold street.", "Kitchen Row", -2),
                new PostSpec(5, "Tunnel mouth — one pool of light, everything else waiting.", "West Tunnel", -4)
        );

        List<Post> posts = new ArrayList<>();
        for (PostSpec spec : specs) {
            String mediaUrl = DemoMediaCatalog.POST_MEDIA_BY_CAPTION.get(spec.caption());
            Post post = new Post();
            post.setCaption(spec.caption());
            post.setLocation(spec.location());
            post.setMediaUrls(DemoMediaCatalog.mutableMediaList(mediaUrl));
            Post saved = postService.createPost(post, users.get(spec.authorIndex()).getId());
            saved.setCreatedAt(LocalDateTime.now().plusDays(spec.daysOffset()));
            posts.add(postRepository.save(saved));
        }
        return posts;
    }

    private void createLikes(List<User> users, List<Post> posts) throws Exception {
        // Realistic cross-likes (skips self-like notifications when same author).
        int[][] pairs = {
                {1, 0}, {2, 0}, {3, 0}, {5, 0},
                {0, 1}, {2, 1}, {4, 1},
                {0, 2}, {1, 2}, {5, 2},
                {0, 3}, {4, 3},
                {1, 4}, {2, 4}, {3, 4}, {5, 4},
                {0, 5}, {1, 5},
                {2, 6}, {3, 6}, {4, 6},
                {0, 7}, {5, 7},
                {1, 8}, {3, 8},
                {0, 9}, {2, 9}, {5, 9},
                {1, 10}, {4, 10},
                {0, 11}, {2, 11}, {3, 11}
        };
        for (int[] pair : pairs) {
            postService.likePost(posts.get(pair[1]).getId(), users.get(pair[0]).getId());
        }
    }

    private void createComments(List<User> users, List<Post> posts) throws Exception {
        addComment(users.get(1), posts.get(0), "That neon strip is perfect — what lens?");
        addComment(users.get(2), posts.get(0), "Feels like walking into a film still.");
        addComment(users.get(0), posts.get(1), "Those trails look painted. Exposure time?");
        addComment(users.get(3), posts.get(1), "Harbor nights done right.");
        addComment(users.get(4), posts.get(2), "Love the empty platform mood.");
        addComment(users.get(5), posts.get(3), "Café glass is underrated subject matter.");
        addComment(users.get(1), posts.get(4), "Wet asphalt reflections never miss.");
        addComment(users.get(0), posts.get(5), "Grid as constellation — stealing that line.");
        addComment(users.get(2), posts.get(6), "Handheld neon portraits are hard. Nailed it.");
        addComment(users.get(4), posts.get(8), "Motion as color — beautiful.");
        addComment(users.get(3), posts.get(9), "Rooftops at this hour are magic.");
        addComment(users.get(5), posts.get(10), "Warm steam, cold street — great contrast.");
    }

    private void addComment(User author, Post post, String content) throws Exception {
        Comments comment = new Comments();
        comment.setContent(content);
        commentService.createComment(comment, post.getId(), author.getId());
    }

    private void createFollows(List<User> users) throws Exception {
        // reqUser follows followUser — unique pairs only.
        int[][] pairs = {
                {1, 0}, {2, 0}, {3, 0}, {4, 0}, {5, 0},
                {0, 1}, {0, 2}, {0, 4},
                {1, 2}, {1, 5},
                {2, 3}, {2, 4},
                {3, 5},
                {4, 1}, {4, 5},
                {5, 2}, {5, 3}
        };
        for (int[] pair : pairs) {
            userService.followUser(users.get(pair[0]).getId(), users.get(pair[1]).getId());
        }
    }

    private void createSaves(List<User> users, List<Post> posts) throws Exception {
        postService.savedPost(posts.get(1).getId(), users.get(0).getId());
        postService.savedPost(posts.get(5).getId(), users.get(0).getId());
        postService.savedPost(posts.get(0).getId(), users.get(1).getId());
        postService.savedPost(posts.get(6).getId(), users.get(2).getId());
        postService.savedPost(posts.get(2).getId(), users.get(3).getId());
        postService.savedPost(posts.get(9).getId(), users.get(4).getId());
        postService.savedPost(posts.get(3).getId(), users.get(5).getId());
        postService.savedPost(posts.get(4).getId(), users.get(5).getId());
    }

    private void createStories(List<User> users) throws Exception {
        createStory(users.get(0), "Tonight's neon walk");
        createStory(users.get(1), "Bridge lights");
        createStory(users.get(2), "Late metro");
        createStory(users.get(4), "Blue hour grid");
    }

    private void createStory(User user, String captions) throws Exception {
        Story story = new Story();
        story.setImage(DemoMediaCatalog.STORY_MEDIA_BY_CAPTION.get(captions));
        story.setCaptions(captions);
        storyService.createStory(story, user.getId());
    }

    private void createReels(List<User> users) {
        createReel(users.get(0), "Night traffic as motion study");
        createReel(users.get(1), "City lights reel — handheld test");
    }

    private void createReel(User user, String caption) {
        UserDto dto = toDto(user);
        Reels reel = new Reels();
        reel.setCaption(caption);
        reel.setVideo(DemoMediaCatalog.REEL_VIDEO_BY_CAPTION.get(caption));
        reel.setUser(dto);
        reelService.createReels(reel);
    }

    private void createCraftAndProgress(List<User> users) throws Exception {
        LearningPlan plan1 = new LearningPlan();
        plan1.setTitle("Long exposure night toolkit");
        plan1.setDescription("Tripod work, ND filters, and clean light trails.");
        plan1 = learningPlanService.createLearningPlan(plan1, users.get(0).getId());

        Topic topic1 = new Topic();
        topic1.setTitle("10–30s exposures on city streets");
        topic1.setDescription("Practice on bridges and waterfronts.");
        topic1.setCompleted(false);
        learningPlanService.addTopicToPlan(plan1.getId(), topic1, users.get(0).getId());

        LearningPlan plan2 = new LearningPlan();
        plan2.setTitle("Neon color grading notes");
        plan2.setDescription("Preserve magenta/cyan without crushing shadows.");
        plan2 = learningPlanService.createLearningPlan(plan2, users.get(1).getId());

        Topic topic2 = new Topic();
        topic2.setTitle("White balance under mixed neon");
        topic2.setDescription("Shoot RAW; correct per frame.");
        topic2.setCompleted(true);
        learningPlanService.addTopicToPlan(plan2.getId(), topic2, users.get(1).getId());

        LearningPlan plan3 = new LearningPlan();
        plan3.setTitle("Street night composition");
        plan3.setDescription("Leading lines, silhouettes, and negative space.");
        learningPlanService.createLearningPlan(plan3, users.get(2).getId());

        LearningProgressUpdate p1 = new LearningProgressUpdate();
        p1.setTitle("Week 1 — bridge trails");
        p1.setContent("Shot 40 frames; 6 keepers. Learned to wait for bus light streaks.");
        progressUpdateService.createProgressUpdate(p1, users.get(0).getId());

        LearningProgressUpdate p2 = new LearningProgressUpdate();
        p2.setTitle("Café window series");
        p2.setContent("Reflections work better after rain. Will repeat downtown.");
        progressUpdateService.createProgressUpdate(p2, users.get(3).getId());

        LearningProgressUpdate p3 = new LearningProgressUpdate();
        p3.setTitle("High ISO handheld notes");
        p3.setContent("ISO 3200–6400 usable with careful noise reduction.");
        progressUpdateService.createProgressUpdate(p3, users.get(5).getId());
    }

    private static UserDto toDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setUsername(user.getUsername());
        dto.setName(user.getName());
        dto.setUserImage(user.getImage());
        return dto;
    }

    private record UserSpec(String username, String email, String name, String bio, String gender, String website) {}

    private record PostSpec(int authorIndex, String caption, String location, int daysOffset) {}
}
