package com.cesur.backend.service;

import com.cesur.backend.model.Pelicula;
import com.cesur.backend.model.Usuario;
import com.cesur.backend.model.Valoracion;
import com.cesur.backend.repository.PeliculaRepository;
import com.cesur.backend.repository.UsuarioRepository;
import com.cesur.backend.repository.ValoracionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ValoracionService {

    private final ValoracionRepository valoracionRepository;
    private final UsuarioRepository usuarioRepository;
    private final PeliculaRepository peliculaRepository;

    // Constructor manual (ya que no usamos Lombok @RequiredArgsConstructor)
    public ValoracionService(ValoracionRepository valoracionRepository,
                             UsuarioRepository usuarioRepository,
                             PeliculaRepository peliculaRepository) {
        this.valoracionRepository = valoracionRepository;
        this.usuarioRepository = usuarioRepository;
        this.peliculaRepository = peliculaRepository;
    }

    public Valoracion crearValoracion(String emailUsuario, Long peliculaId, Valoracion nuevaValoracion) {
        // 1. Buscamos al usuario por su email (que viene del Token)
        Usuario usuario = usuarioRepository.findByEmail(emailUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // 2. Buscamos la película
        Pelicula pelicula = peliculaRepository.findById(peliculaId)
                .orElseThrow(() -> new RuntimeException("Película no encontrada"));

        // 3. Comprobamos si ya existe una valoración para no duplicar
        if (valoracionRepository.findByUsuarioAndPelicula(usuario, pelicula).isPresent()) {
            throw new RuntimeException("Ya has valorado esta película");
        }

        // 4. Asignamos las relaciones
        nuevaValoracion.setUsuario(usuario);
        nuevaValoracion.setPelicula(pelicula);

        return valoracionRepository.save(nuevaValoracion);
    }

    public List<Valoracion> obtenerHistorialUsuario(String emailUsuario) {
        Usuario usuario = usuarioRepository.findByEmail(emailUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return valoracionRepository.findByUsuario(usuario);
    }
}