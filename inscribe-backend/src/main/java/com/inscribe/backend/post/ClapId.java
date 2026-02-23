package com.inscribe.backend.post;

import java.io.Serializable;
import java.util.Objects;

public class ClapId implements Serializable {

    private Long user;
    private Long post;

    public ClapId() {}

    public ClapId(Long user, Long post) {
        this.user = user;
        this.post = post;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ClapId)) return false;
        ClapId clapId = (ClapId) o;
        return Objects.equals(user, clapId.user) &&
                Objects.equals(post, clapId.post);
    }

    @Override
    public int hashCode() {
        return Objects.hash(user, post);
    }
}