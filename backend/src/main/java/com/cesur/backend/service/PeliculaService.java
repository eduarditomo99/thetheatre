package com.cesur.backend.service;

import com.cesur.backend.model.Pelicula;
import com.cesur.backend.model.Usuario;
import com.cesur.backend.repository.PeliculaRepository;
import com.cesur.backend.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PeliculaService {

    private final PeliculaRepository peliculaRepository;
    private final UsuarioRepository usuarioRepository;

    // Constructor manual (Inyectamos ambos repositorios)
    public PeliculaService(PeliculaRepository peliculaRepository, UsuarioRepository usuarioRepository) {
        this.peliculaRepository = peliculaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    // Método original (para listar todas, por si acaso)
    public List<Pelicula> listarTodas() {
        return peliculaRepository.findAll();
    }

    // --- NUEVO MÉTODO: Filtra las que ya ha visto ---
    public List<Pelicula> listarPeliculasParaHome(String emailUsuario) {
        // 1. Buscamos al usuario por su email
        Usuario usuario = usuarioRepository.findByEmail(emailUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // 2. Usamos la query personalizada que creamos en el Repositorio
        return peliculaRepository.findPeliculasNoVistas(usuario.getId());
    }

    public Pelicula guardarPelicula(Pelicula pelicula) {
        return peliculaRepository.save(pelicula);
    }
}