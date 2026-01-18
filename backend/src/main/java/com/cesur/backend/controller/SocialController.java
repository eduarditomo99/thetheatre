package com.cesur.backend.controller;

import com.cesur.backend.model.Follow;
import com.cesur.backend.model.Review;
import com.cesur.backend.model.Usuario;
import com.cesur.backend.repository.FollowRepository;
import com.cesur.backend.repository.ReviewRepository;
import com.cesur.backend.repository.UsuarioRepository;
import com.cesur.backend.service.JwtService;
import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/social")
public class SocialController {

    private final FollowRepository followRepository;
    private final UsuarioRepository usuarioRepository;
    private final ReviewRepository reviewRepository;
    private final JwtService jwtService;

    // --- 1. CONSTRUCTOR MANUAL (Sin Lombok) ---
    public SocialController(FollowRepository followRepository, UsuarioRepository usuarioRepository, ReviewRepository reviewRepository, JwtService jwtService) {
        this.followRepository = followRepository;
        this.usuarioRepository = usuarioRepository;
        this.reviewRepository = reviewRepository;
        this.jwtService = jwtService;
    }

    // --- 2. ENDPOINT SEGUIR USUARIO ---
    @PostMapping("/follow/{userIdToFollow}")
    public ResponseEntity<String> followUser(@RequestHeader("Authorization") String token, @PathVariable Long userIdToFollow) {
        Usuario me = getUsuarioFromToken(token);

        Usuario userToFollow = usuarioRepository.findById(userIdToFollow)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Evitar seguirse a uno mismo
        if (me.getId().equals(userToFollow.getId())) {
            return ResponseEntity.badRequest().body("No puedes seguirte a ti mismo");
        }

        // Evitar duplicados
        if (followRepository.findByFollowerAndFollowed(me, userToFollow).isPresent()) {
            return ResponseEntity.badRequest().body("Ya sigues a este usuario");
        }

        // Crear Follow manualmente (Sin Builder)
        Follow follow = new Follow();
        follow.setFollower(me);
        follow.setFollowed(userToFollow);

        followRepository.save(follow);
        return ResponseEntity.ok("Ahora sigues al usuario " + userToFollow.getUsername());
    }

    // --- 3. ENDPOINT DEJAR DE SEGUIR ---
    @Transactional
    @DeleteMapping("/unfollow/{userIdToUnfollow}")
    public ResponseEntity<String> unfollowUser(@RequestHeader("Authorization") String token, @PathVariable Long userIdToUnfollow) {
        Usuario me = getUsuarioFromToken(token);

        Usuario userToUnfollow = usuarioRepository.findById(userIdToUnfollow)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        followRepository.deleteByFollowerAndFollowed(me, userToUnfollow);
        return ResponseEntity.ok("Has dejado de seguir a " + userToUnfollow.getUsername());
    }

    // --- 4. ENDPOINT FEED (Novedades) ---
    @GetMapping("/feed")
    public ResponseEntity<List<Review>> getFeed(@RequestHeader("Authorization") String token) {
        Usuario me = getUsuarioFromToken(token);

        // A. Obtengo la lista de follows
        List<Follow> follows = followRepository.findByFollower(me);

        // B. Saco los usuarios (amigos) de esa lista
        List<Usuario> followingUsers = follows.stream()
                .map(Follow::getFollowed)
                .collect(Collectors.toList());

        // C. Añado mis propias reviews para verlas también
        followingUsers.add(me);

        // D. Busco reviews de esa lista de Usuarios
        List<Review> feedReviews = reviewRepository.findByUserInOrderByWatchedAtDesc(followingUsers);

        return ResponseEntity.ok(feedReviews);
    }

    // Método auxiliar corregido
    private Usuario getUsuarioFromToken(String token) {
        String email = jwtService.getUsernameFromToken(token.substring(7));
        return usuarioRepository.findByEmail(email).orElseThrow();
    }
}