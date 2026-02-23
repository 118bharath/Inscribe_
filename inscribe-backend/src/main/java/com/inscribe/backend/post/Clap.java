package com.inscribe.backend.post;

import com.inscribe.backend.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "claps")
@Getter
@Setter
@IdClass(ClapId.class)
public class Clap {

    @Id
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Id
    @ManyToOne
    @JoinColumn(name = "post_id")
    private Post post;
}