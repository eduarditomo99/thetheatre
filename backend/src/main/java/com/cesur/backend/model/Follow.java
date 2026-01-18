package com.cesur.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "follows", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"follower_id", "followed_id"})
})
public class Follow {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "follower_id", nullable = false)
    private Usuario follower;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "followed_id", nullable = false)
    private Usuario followed;

    private LocalDateTime followedAt;

    // --- CONSTRUCTOR VACÍO ---
    public Follow() {
    }

    @PrePersist
    protected void onCreate() {
        followedAt = LocalDateTime.now();
    }

    // --- GETTERS Y SETTERS MANUALES ---
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Usuario getFollower() {
        return follower;
    }

    public void setFollower(Usuario follower) {
        this.follower = follower;
    }

    public Usuario getFollowed() {
        return followed;
    }

    public void setFollowed(Usuario followed) {
        this.followed = followed;
    }

    public LocalDateTime getFollowedAt() {
        return followedAt;
    }

    public void setFollowedAt(LocalDateTime followedAt) {
        this.followedAt = followedAt;
    }
}