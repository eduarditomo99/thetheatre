package com.cesur.backend.repository;

import com.cesur.backend.model.Follow;
import com.cesur.backend.model.Usuario; // <--- IMPORTANTE: Usuario
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface FollowRepository extends JpaRepository<Follow, Long> {

    Optional<Follow> findByFollowerAndFollowed(Usuario follower, Usuario followed);

    void deleteByFollowerAndFollowed(Usuario follower, Usuario followed);

    List<Follow> findByFollower(Usuario follower);

    long countByFollower(Usuario follower);
    long countByFollowed(Usuario followed);
}