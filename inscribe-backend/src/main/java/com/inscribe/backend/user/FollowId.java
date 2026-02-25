package com.inscribe.backend.user;

import java.io.Serializable;
import java.util.Objects;

public class FollowId implements Serializable {

    private Long follower;
    private Long following;

    public FollowId() {}

    public FollowId(Long follower, Long following) {
        this.follower = follower;
        this.following = following;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof FollowId)) return false;
        FollowId that = (FollowId) o;
        return Objects.equals(follower, that.follower) &&
                Objects.equals(following, that.following);
    }

    @Override
    public int hashCode() {
        return Objects.hash(follower, following);
    }
}