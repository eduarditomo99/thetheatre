package com.cesur.backend.repository;

import com.cesur.backend.model.Review;
import com.cesur.backend.model.Usuario; // <--- Asegúrate de importar Usuario
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByUserId(Long userId);

    Optional<Review> findByUserIdAndTmdbId(Long userId, Long tmdbId);

    List<Review> findByUserInOrderByWatchedAtDesc(List<Usuario> users);
}