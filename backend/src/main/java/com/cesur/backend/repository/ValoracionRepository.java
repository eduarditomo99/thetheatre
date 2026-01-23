package com.cesur.backend.repository;

import com.cesur.backend.model.Valoracion;
import com.cesur.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ValoracionRepository extends JpaRepository<Valoracion, Long> {
    Optional<Valoracion> findByUsuarioAndTmdbId(Usuario usuario, Long tmdbId);
    List<Valoracion> findByUsuario(Usuario usuario);
}