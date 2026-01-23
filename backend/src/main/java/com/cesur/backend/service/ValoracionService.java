package com.cesur.backend.service;

import com.cesur.backend.model.Usuario;
import com.cesur.backend.model.Valoracion;
import com.cesur.backend.repository.UsuarioRepository;
import com.cesur.backend.repository.ValoracionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ValoracionService {

    @Autowired
    private ValoracionRepository valoracionRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public Valoracion crearValoracion(String email, Long tmdbId, Valoracion datosNuevos) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Optional<Valoracion> existente = valoracionRepository.findByUsuarioAndTmdbId(usuario, tmdbId);
        Valoracion valoracion;

        if (existente.isPresent()) {
            valoracion = existente.get();
        } else {
            valoracion = new Valoracion();
            valoracion.setUsuario(usuario);
            valoracion.setTmdbId(tmdbId);
            valoracion.setFechaVista(LocalDate.now());
        }

        if (datosNuevos.getPuntuacion() != null) {
            valoracion.setPuntuacion(datosNuevos.getPuntuacion());
        }

        valoracion.setVisto(datosNuevos.isVisto());

        if (datosNuevos.getResena() != null) {
            valoracion.setResena(datosNuevos.getResena());
        }

        return valoracionRepository.save(valoracion);
    }

    public List<Valoracion> obtenerHistorialUsuario(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return valoracionRepository.findByUsuario(usuario);
    }
}