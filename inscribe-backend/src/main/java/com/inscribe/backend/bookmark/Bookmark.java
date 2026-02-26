package com.inscribe.backend.bookmark;

import com.inscribe.backend.post.Post;
import com.inscribe.backend.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "bookmarks")
@Getter
@Setter
@IdClass(BookmarkId.class)
public class Bookmark {

    @Id
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Id
    @ManyToOne
    @JoinColumn(name = "post_id")
    private Post post;
}
