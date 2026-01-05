package com.cesur.backend.repository;

import com.cesur.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    // Método mágico: Spring crea la consulta SQL solo viendo el nombre
    Optional<Usuario> findByEmail(String email);

    // Por si acaso quieres buscar por username también
    Optional<Usuario> findByUsername(String username);
}