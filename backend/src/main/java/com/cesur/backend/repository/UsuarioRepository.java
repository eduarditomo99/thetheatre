package com.cesur.backend.repository;

import com.cesur.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    // Método mágico: Spring crea la consulta SQL solo viendo el nombre
    Optional<Usuario> findByEmail(String email);

    // Por si acaso quieres buscar por username también
    Optional<Usuario> findByUsername(String username);

    // Búsqueda de usuarios ampliada
    @org.springframework.data.jpa.repository.Query("SELECT u FROM Usuario u WHERE LOWER(u.username) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(u.nombre) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%'))")
    java.util.List<Usuario> searchByQuery(@org.springframework.data.repository.query.Param("query") String query);
}