package com.cesur.backend.service;

import com.cesur.backend.model.*;
import com.cesur.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SocialService {

    private final FollowRepository followRepository;
    private final MessageRepository messageRepository;
    private final PrivateCommentRepository privateCommentRepository;
    private final UsuarioRepository usuarioRepository;
    private final ReviewRepository reviewRepository;

    public SocialService(FollowRepository followRepository,
                         MessageRepository messageRepository,
                         PrivateCommentRepository privateCommentRepository,
                         UsuarioRepository usuarioRepository,
                         ReviewRepository reviewRepository) {
        this.followRepository = followRepository;
        this.messageRepository = messageRepository;
        this.privateCommentRepository = privateCommentRepository;
        this.usuarioRepository = usuarioRepository;
        this.reviewRepository = reviewRepository;
    }

    public List<Usuario> searchUsers(String query) {
        return usuarioRepository.searchByQuery(query);
    }

    public boolean areMutuals(Usuario userA, Usuario userB) {
        return followRepository.existsByFollowerAndFollowed(userA, userB) &&
               followRepository.existsByFollowerAndFollowed(userB, userA);
    }

    public boolean isFollowing(Usuario follower, Usuario followed) {
        return followRepository.existsByFollowerAndFollowed(follower, followed);
    }

    @Transactional
    public void toggleFollow(Long followerId, Long followedId) {
        Usuario follower = usuarioRepository.findById(followerId).orElseThrow(() -> new RuntimeException("Follower not found"));
        Usuario followed = usuarioRepository.findById(followedId).orElseThrow(() -> new RuntimeException("Followed not found"));

        followRepository.findByFollowerAndFollowed(follower, followed)
                .ifPresentOrElse(
                        followRepository::delete, // Unfollow si ya lo sigue
                        () -> {
                            Follow follow = new Follow();
                            follow.setFollower(follower);
                            follow.setFollowed(followed);
                            followRepository.save(follow);
                        } // Follow si no lo sigue
                );
    }

    @Transactional(readOnly = true)
    public List<Review> getFeedForUser(Long userId) {
        Usuario currentUser = usuarioRepository.findById(userId).orElseThrow();
        List<Usuario> following = followRepository.findByFollower(currentUser)
                .stream()
                .map(Follow::getFollowed)
                .collect(Collectors.toList());

        if (following.isEmpty()) {
            return List.of();
        }

        return reviewRepository.findByUserInOrderByWatchedAtDesc(following);
    }

    @Transactional
    public Message sendMessage(Long senderId, Long receiverId, String content) {
        Usuario sender = usuarioRepository.findById(senderId).orElseThrow();
        Usuario receiver = usuarioRepository.findById(receiverId).orElseThrow();

        if (!areMutuals(sender, receiver)) {
            throw new RuntimeException("Solo puedes enviar mensajes a tus Mutuals.");
        }

        Message msg = new Message();
        msg.setSender(sender);
        msg.setReceiver(receiver);
        msg.setContent(content);
        return messageRepository.save(msg);
    }

    @Transactional(readOnly = true)
    public List<Message> getChatHistory(Long userId1, Long userId2) {
        Usuario user1 = usuarioRepository.findById(userId1).orElseThrow();
        Usuario user2 = usuarioRepository.findById(userId2).orElseThrow();
        
        if (!areMutuals(user1, user2)) {
            throw new RuntimeException("Solo puedes ver mensajes de tus Mutuals.");
        }

        return messageRepository.findChatHistory(user1, user2);
    }

    @Transactional
    public PrivateComment addPrivateComment(Long authorId, Long reviewId, String content) {
        Usuario author = usuarioRepository.findById(authorId).orElseThrow();
        Review review = reviewRepository.findById(reviewId).orElseThrow();
        Usuario reviewOwner = review.getUser();

        // El usuario dueño de la reseña puede comentarse a sí mismo, o deben ser mutuals
        if (!author.getId().equals(reviewOwner.getId()) && !areMutuals(author, reviewOwner)) {
            throw new RuntimeException("Solo puedes comentar si eres Mutual del autor de la reseña.");
        }

        PrivateComment comment = new PrivateComment();
        comment.setAuthor(author);
        comment.setReview(review);
        comment.setContent(content);
        return privateCommentRepository.save(comment);
    }
    
    @Transactional(readOnly = true)
    public List<PrivateComment> getPrivateCommentsForReview(Long reviewId, Long currentUserId) {
        Review review = reviewRepository.findById(reviewId).orElseThrow();
        Usuario currentUser = usuarioRepository.findById(currentUserId).orElseThrow();
        Usuario reviewOwner = review.getUser();
        
        if (!currentUser.getId().equals(reviewOwner.getId()) && !areMutuals(currentUser, reviewOwner)) {
            throw new RuntimeException("No tienes permiso para ver los comentarios de esta reseña.");
        }
        
        return privateCommentRepository.findByReviewOrderByCreatedAtAsc(review);
    }
}
