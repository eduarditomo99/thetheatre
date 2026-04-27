package com.cesur.backend.controller;

import com.cesur.backend.model.Message;
import com.cesur.backend.model.PrivateComment;
import com.cesur.backend.model.Review;
import com.cesur.backend.model.Usuario;
import com.cesur.backend.repository.UsuarioRepository;
import com.cesur.backend.service.JwtService;
import com.cesur.backend.service.SocialService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/social")
public class SocialController {

    private final SocialService socialService;
    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;

    public SocialController(SocialService socialService, JwtService jwtService, UsuarioRepository usuarioRepository) {
        this.socialService = socialService;
        this.jwtService = jwtService;
        this.usuarioRepository = usuarioRepository;
    }

    private Usuario getUsuarioFromToken(String token) {
        String email = jwtService.getUsernameFromToken(token.substring(7));
        return usuarioRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Usuario>> searchUsers(@RequestParam String q) {
        return ResponseEntity.ok(socialService.searchUsers(q));
    }

    @GetMapping("/profile/{userId}")
    public ResponseEntity<?> getUserProfile(@RequestHeader("Authorization") String token, @PathVariable Long userId) {
        Usuario me = getUsuarioFromToken(token);
        Usuario target = usuarioRepository.findById(userId).orElseThrow();
        
        boolean isFollowing = socialService.isFollowing(me, target);
        boolean areMutuals = socialService.areMutuals(me, target);
        
        return ResponseEntity.ok(Map.of(
                "user", target,
                "isFollowing", isFollowing,
                "areMutuals", areMutuals
        ));
    }

    @PostMapping("/follow/{userId}")
    public ResponseEntity<?> toggleFollow(@RequestHeader("Authorization") String token, @PathVariable Long userId) {
        Usuario me = getUsuarioFromToken(token);
        if (me.getId().equals(userId)) {
            return ResponseEntity.badRequest().body(Map.of("error", "No puedes seguirte a ti mismo"));
        }
        socialService.toggleFollow(me.getId(), userId);
        return ResponseEntity.ok(Map.of("message", "Follow state updated"));
    }

    @GetMapping("/feed")
    public ResponseEntity<List<Review>> getFeed(@RequestHeader("Authorization") String token) {
        Usuario me = getUsuarioFromToken(token);
        return ResponseEntity.ok(socialService.getFeedForUser(me.getId()));
    }

    @PostMapping("/messages/{receiverId}")
    public ResponseEntity<?> sendMessage(@RequestHeader("Authorization") String token, 
                                         @PathVariable Long receiverId, 
                                         @RequestBody Map<String, String> payload) {
        try {
            Usuario me = getUsuarioFromToken(token);
            Message msg = socialService.sendMessage(me.getId(), receiverId, payload.get("content"));
            return ResponseEntity.ok(msg);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/messages/history/{userId}")
    public ResponseEntity<?> getChatHistory(@RequestHeader("Authorization") String token, @PathVariable Long userId) {
        try {
            Usuario me = getUsuarioFromToken(token);
            List<Message> history = socialService.getChatHistory(me.getId(), userId);
            return ResponseEntity.ok(history);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/reviews/{reviewId}/comments")
    public ResponseEntity<?> addComment(@RequestHeader("Authorization") String token, 
                                        @PathVariable Long reviewId, 
                                        @RequestBody Map<String, String> payload) {
        try {
            Usuario me = getUsuarioFromToken(token);
            PrivateComment comment = socialService.addPrivateComment(me.getId(), reviewId, payload.get("content"));
            return ResponseEntity.ok(comment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/reviews/{reviewId}/comments")
    public ResponseEntity<?> getComments(@RequestHeader("Authorization") String token, @PathVariable Long reviewId) {
        try {
            Usuario me = getUsuarioFromToken(token);
            List<PrivateComment> comments = socialService.getPrivateCommentsForReview(reviewId, me.getId());
            return ResponseEntity.ok(comments);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}