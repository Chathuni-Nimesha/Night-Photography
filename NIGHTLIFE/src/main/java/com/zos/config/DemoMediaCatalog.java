package com.zos.config;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Curated public CDN media for local Nightlife demo accounts only.
 * URLs verified reachable via HTTP 200 (Unsplash images CDN / public sample MP4s).
 */
final class DemoMediaCatalog {

    private DemoMediaCatalog() {
    }

    static final String DEMO_EMAIL_SUFFIX = "@nightlife.demo";

    /** username -> avatar URL */
    static final Map<String, String> AVATARS = Map.of(
            "neonaria", img(1534528741775L, "53994a69daeb", 400),
            "lumenframe", img(1507003211169L, "0a1dd7228f2d", 400),
            "duskcircuit", img(1494790108377L, "be9c29b29330", 400),
            "afterglow_lens", img(1500648767791L, "00dcc994a43e", 400),
            "gridlight", img(1438761681033L, "6461ffad8d80", 400),
            "velvetiso", img(1472099645785L, "5658abf4ff4e", 400)
    );

    /**
     * Stable post captions (match seeder) -> high-res night / urban photography URLs.
     * Order matches the original demo post set.
     */
    static final Map<String, String> POST_MEDIA_BY_CAPTION;

    static {
        Map<String, String> posts = new LinkedHashMap<>();
        posts.put("Rain on neon. The street writes its own captions.",
                img(1519501025264L, "65ba15a82390", 1080));
        posts.put("Long exposure over the river — light trails as brushstrokes.",
                img(1480714378408L, "67cf0d13bc1b", 1080));
        posts.put("Empty platform, full color. Midnight metro study.",
                img(1514565131L, "fce0801e5785", 1080));
        posts.put("Café glass and reflections — a soft night still life.",
                img(1573455494060L, "c5595004fb6c", 1080));
        posts.put("Alley lamps and wet asphalt. Quiet after the crowd leaves.",
                img(1506146332389L, "18140dc7b2fb", 1080));
        posts.put("Tower grid at blue hour. Architecture as constellation.",
                img(1486406146926L, "c627a92ad1ab", 1080));
        posts.put("ISO 6400, handheld. Neon portraits without a flash.",
                img(1542051841857L, "5f90071e7989", 1080));
        posts.put("Harbor lights stacking into the fog.",
                img(1477959858617L, "67f85cf4f1df", 1080));
        posts.put("Crosswalk blur — people as streaks of color.",
                img(1534430480872L, "3498386e7856", 1080));
        posts.put("Rooftop silhouette against the skyline glow.",
                img(1496442226666L, "8d4d0e62e6e9", 1080));
        posts.put("Steam from a late kitchen vent. Warm against the cold street.",
                img(1555396273L, "367ea4eb4db5", 1080));
        posts.put("Tunnel mouth — one pool of light, everything else waiting.",
                img(1503899036084L, "c55cdd92da26", 1080));
        POST_MEDIA_BY_CAPTION = Map.copyOf(posts);
    }

    static final Map<String, String> STORY_MEDIA_BY_CAPTION = Map.of(
            "Tonight's neon walk", img(1519501025264L, "65ba15a82390", 720),
            "Bridge lights", img(1480714378408L, "67cf0d13bc1b", 720),
            "Late metro", img(1514565131L, "fce0801e5785", 720),
            "Blue hour grid", img(1540959733332L, "eab4deabeeaf", 720)
    );

    /** Public sample MP4s that return HTTP 200 (not themed; only need to play in the viewer). */
    static final Map<String, String> REEL_VIDEO_BY_CAPTION = Map.of(
            "Night traffic as motion study",
            "https://filesamples.com/samples/video/mp4/sample_640x360.mp4",
            "City lights reel — handheld test",
            "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
    );

    static List<String> mutableMediaList(String url) {
        return new java.util.ArrayList<>(java.util.List.of(url));
    }

    private static String img(long id, String hash, int width) {
        return "https://images.unsplash.com/photo-" + id + "-" + hash
                + "?auto=format&fit=crop&w=" + width + "&q=80";
    }
}
