package com.inscribe.backend.service;

import com.inscribe.backend.config.RedisSettingsProperties;
import com.inscribe.backend.post.PostRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class PostLikeService {

    private static final String POST_LIKES_KEY_PREFIX = "post:likes:";
    private static final String DIRTY_POST_SET_KEY = "post:likes:dirty";

    private final StringRedisTemplate stringRedisTemplate;
    private final RedisService redisService;
    private final PostRepository postRepository;
    private final RedisSettingsProperties redisSettingsProperties;

    public long getLikeCount(Long postId, long databaseFallback) {
        if (!redisSettingsProperties.isEnabled()) {
            return databaseFallback;
        }

        return redisService.execute("get_post_likes",
                        () -> stringRedisTemplate.opsForValue().get(postLikesKey(postId)))
                .map(value -> value == null ? databaseFallback : Long.parseLong(value))
                .orElse(databaseFallback);
    }

    public void incrementLikeCount(Long postId) {
        if (!redisSettingsProperties.isEnabled()) {
            return;
        }

        redisService.run("increment_post_likes", () -> {
            Long likeCount = stringRedisTemplate.opsForValue().increment(postLikesKey(postId));
            if (likeCount != null && likeCount == 1L) {
                stringRedisTemplate.expire(postLikesKey(postId), Duration.ofDays(7));
            }
            stringRedisTemplate.opsForSet().add(DIRTY_POST_SET_KEY, String.valueOf(postId));
        });
    }

    public void decrementLikeCount(Long postId) {
        if (!redisSettingsProperties.isEnabled()) {
            return;
        }

        redisService.run("decrement_post_likes", () -> {
            Long likeCount = stringRedisTemplate.opsForValue().decrement(postLikesKey(postId));
            if (likeCount != null && likeCount < 0) {
                stringRedisTemplate.opsForValue().set(postLikesKey(postId), "0", Duration.ofDays(7));
            }
            stringRedisTemplate.opsForSet().add(DIRTY_POST_SET_KEY, String.valueOf(postId));
        });
    }

    @Transactional
    @Scheduled(
            initialDelayString = "${app.redis.likes-sync-interval-ms:60000}",
            fixedDelayString = "${app.redis.likes-sync-interval-ms:60000}"
    )
    public void syncLikeCountsToDatabase() {
        if (!redisSettingsProperties.isEnabled()) {
            return;
        }

        Set<String> dirtyPostIds = redisService.execute(
                        "get_dirty_like_posts",
                        () -> stringRedisTemplate.opsForSet().members(DIRTY_POST_SET_KEY)
                )
                .orElse(Set.of());

        if (dirtyPostIds.isEmpty()) {
            return;
        }

        for (String postIdValue : dirtyPostIds) {
            try {
                Long postId = Long.valueOf(postIdValue);
                long likeCount = getLikeCount(postId, 0L);
                postRepository.updateLikeCount(postId, likeCount);
                redisService.run(
                        "clear_dirty_like_post",
                        () -> stringRedisTemplate.opsForSet().remove(DIRTY_POST_SET_KEY, postIdValue)
                );
            } catch (RuntimeException ex) {
                log.warn("Failed to synchronize like counter for postId={}", postIdValue, ex);
            }
        }
    }

    private String postLikesKey(Long postId) {
        return POST_LIKES_KEY_PREFIX + postId;
    }
}
