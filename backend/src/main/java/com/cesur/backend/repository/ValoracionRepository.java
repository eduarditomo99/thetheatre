package com.cesur.backend.repository;

import com.cesur.backend.model.Valoracion;
import com.cesur.backend.model.Usuario;
import com.cesur.backend.model.Pelicula;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ValoracionRepository extends JpaRepository<Valoracion, Long> {

    // Para saber si el usuario X ya vio la película Y
    Optional<Valoracion> findByUsuarioAndPelicula(Usuario usuario, Pelicula pelicula);

    // Para sacar todo el historial de un usuario
    List<Valoracion> findByUsuario(Usuario usuario);
}