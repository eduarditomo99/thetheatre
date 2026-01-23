package com.cesur.backend.controller;

import com.cesur.backend.model.Usuario;
import com.cesur.backend.model.Valoracion;
import com.cesur.backend.repository.UsuarioRepository;
import com.cesur.backend.repository.ValoracionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/valoraciones")
public class ValoracionController {

    @Autowired
    private ValoracionRepository valoracionRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping
    public ResponseEntity<?> guardarValoracion(@RequestBody ValoracionDto dto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Optional<Valoracion> existente = valoracionRepository.findByUsuarioAndTmdbId(usuario, dto.getTmdbId());
        Valoracion valoracion;

        if (existente.isPresent()) {
            valoracion = existente.get();
        } else {
            valoracion = new Valoracion();
            valoracion.setUsuario(usuario);
            valoracion.setTmdbId(dto.getTmdbId());
        }

        valoracion.setPuntuacion(dto.getPuntuacion());
        valoracion.setVisto(dto.isVisto());
        valoracion.setResena(dto.getResena());

        valoracionRepository.save(valoracion);
        return ResponseEntity.ok(valoracion);
    }

    @GetMapping("/pelicula/{tmdbId}")
    public ResponseEntity<?> obtenerValoracion(@PathVariable Long tmdbId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Optional<Valoracion> val = valoracionRepository.findByUsuarioAndTmdbId(usuario, tmdbId);

        if (val.isPresent()) {
            Valoracion v = val.get();
            ValoracionDto dto = new ValoracionDto();
            dto.setTmdbId(v.getTmdbId());
            dto.setPuntuacion(v.getPuntuacion());
            dto.setVisto(v.isVisto());
            dto.setResena(v.getResena());
            return ResponseEntity.ok(dto);
        } else {
            return ResponseEntity.ok(null);
        }
    }
}

class ValoracionDto {
    private Long tmdbId;
    private Integer puntuacion;
    private boolean visto;
    private String resena;

    public ValoracionDto() {}

    public Long getTmdbId() { return tmdbId; }
    public void setTmdbId(Long tmdbId) { this.tmdbId = tmdbId; }
    public Integer getPuntuacion() { return puntuacion; }
    public void setPuntuacion(Integer puntuacion) { this.puntuacion = puntuacion; }
    public boolean isVisto() { return visto; }
    public void setVisto(boolean visto) { this.visto = visto; }
    public String getResena() { return resena; }
    public void setResena(String resena) { this.resena = resena; }
}