package com.cesur.backend.controller;

import com.cesur.backend.model.Review;
import com.cesur.backend.model.Usuario;
import com.cesur.backend.repository.ReviewRepository;
import com.cesur.backend.repository.UsuarioRepository;
import com.cesur.backend.service.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final UsuarioRepository usuarioRepository;
    private final JwtService jwtService;

    // --- CONSTRUCTOR MANUAL (Sin Lombok) ---
    public ReviewController(ReviewRepository reviewRepository, UsuarioRepository usuarioRepository, JwtService jwtService) {
        this.reviewRepository = reviewRepository;
        this.usuarioRepository = usuarioRepository;
        this.jwtService = jwtService;
    }

    // 1. Obtener mis propias reviews (Perfil privado)
    @GetMapping("/my-reviews")
    public ResponseEntity<List<Review>> getMyReviews(@RequestHeader("Authorization") String token) {
        String email = jwtService.getUsernameFromToken(token.substring(7));
        Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow();

        return ResponseEntity.ok(reviewRepository.findByUserId(usuario.getId()));
    }

    // 2. Obtener reviews de OTRO usuario (Para ver perfil de un amigo)
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Review>> getUserReviews(@PathVariable Long userId) {
        return ResponseEntity.ok(reviewRepository.findByUserId(userId));
    }

    // 3. Crear una nueva review
    @PostMapping
    public ResponseEntity<Review> addReview(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, Object> payload
    ) {
        String email = jwtService.getUsernameFromToken(token.substring(7));
        Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow();

        Long tmdbId = Long.valueOf(payload.get("tmdbId").toString());
        Double rating = payload.get("rating") != null ? Double.valueOf(payload.get("rating").toString()) : null;
        String comment = (String) payload.get("comment");

        // Usamos constructor y setters manuales
        Review review = new Review();
        review.setUser(usuario);
        review.setTmdbId(tmdbId);
        review.setRating(rating);
        review.setComment(comment);

        return ResponseEntity.ok(reviewRepository.save(review));
    }
}