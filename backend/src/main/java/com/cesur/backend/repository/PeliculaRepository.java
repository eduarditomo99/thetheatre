package com.cesur.backend.repository;

import com.cesur.backend.model.Pelicula;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PeliculaRepository extends JpaRepository<Pelicula, Long> {


    @Query("SELECT p FROM Pelicula p WHERE p.id NOT IN (SELECT v.pelicula.id FROM Valoracion v WHERE v.usuario.id = :usuarioId)")
    List<Pelicula> findPeliculasNoVistas(Long usuarioId);
}