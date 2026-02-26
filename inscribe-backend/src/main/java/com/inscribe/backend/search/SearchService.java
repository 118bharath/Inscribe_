package com.inscribe.backend.search;

import com.inscribe.backend.post.Post;
import com.inscribe.backend.post.PostRepository;
import com.inscribe.backend.search.dto.*;
import com.inscribe.backend.user.User;
import com.inscribe.backend.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SearchService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public SearchResponse search(String keyword, int page, int size) {

        Pageable pageable = PageRequest.of(page, size);

        Page<Post> postResults =
                postRepository.searchPosts(keyword, pageable);

        Page<User> userResults =
                userRepository.searchUsers(keyword, pageable);

        return SearchResponse.builder()
                .posts(
                        postResults.stream()
                                .map(this::mapPost)
                                .collect(Collectors.toList())
                )
                .users(
                        userResults.stream()
                                .map(this::mapUser)
                                .collect(Collectors.toList())
                )
                .totalPostResults(postResults.getTotalElements())
                .totalUserResults(userResults.getTotalElements())
                .build();
    }

    private PostSearchResult mapPost(Post post) {
        return PostSearchResult.builder()
                .id(post.getId())
                .title(post.getTitle())
                .slug(post.getSlug())
                .excerpt(post.getExcerpt())
                .authorName(post.getAuthor().getName())
                .build();
    }

    private UserSearchResult mapUser(User user) {
        return UserSearchResult.builder()
                .id(user.getId())
                .name(user.getName())
                .username(user.getUsername())
                .bio(user.getBio())
                .avatar(user.getAvatar())
                .build();
    }
}