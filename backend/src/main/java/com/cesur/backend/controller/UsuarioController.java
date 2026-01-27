package com.cesur.backend.controller;

import com.cesur.backend.model.Usuario;
import com.cesur.backend.model.Valoracion;
import com.cesur.backend.repository.UsuarioRepository;
import com.cesur.backend.repository.ValoracionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;
    private final ValoracionRepository valoracionRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioController(UsuarioRepository usuarioRepository,
                             ValoracionRepository valoracionRepository,
                             PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.valoracionRepository = valoracionRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/perfil")
    public ResponseEntity<?> obtenerMiPerfil() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        List<Valoracion> valoraciones = valoracionRepository.findByUsuario(usuario);

        PerfilDto perfil = new PerfilDto();
        perfil.setUsername(usuario.getNick() != null ? usuario.getNick() : "Usuario");
        perfil.setNombre(usuario.getNombre());
        perfil.setApellidos(usuario.getApellidos());
        perfil.setEmail(usuario.getEmail());
        // Enviamos la foto al frontend (Base64)
        // Asegúrate de tener el getter/setter en el modelo Usuario para fotoPerfil
        // perfil.setFotoPerfil(usuario.getFotoPerfil());

        List<PeliculaVistaDto> pelisDto = valoraciones.stream().map(v -> {
            PeliculaVistaDto dto = new PeliculaVistaDto();
            dto.setId(v.getId()); // ID de la valoración para poder borrarla
            dto.setTmdbId(v.getTmdbId());
            dto.setPuntuacion(v.getPuntuacion());
            dto.setVisto(v.isVisto());
            dto.setComentario(v.getResena());
            return dto;
        }).collect(Collectors.toList());

        perfil.setHistorial(pelisDto);

        return ResponseEntity.ok(perfil);
    }

    @PutMapping("/perfil")
    public ResponseEntity<?> actualizarPerfil(@RequestBody Map<String, String> datos) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Usuario usuario = usuarioRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (datos.containsKey("nombre")) usuario.setNombre(datos.get("nombre"));
        if (datos.containsKey("apellidos")) usuario.setApellidos(datos.get("apellidos"));

        // Aquí deberías tener el campo en tu modelo Usuario.java
        // if (datos.containsKey("fotoPerfil")) usuario.setFotoPerfil(datos.get("fotoPerfil"));

        if (datos.containsKey("password") && !datos.get("password").isBlank()) {
            usuario.setPassword(passwordEncoder.encode(datos.get("password")));
        }

        usuarioRepository.save(usuario);
        return ResponseEntity.ok("Perfil actualizado correctamente");
    }
}

class PerfilDto {
    private String username;
    private String nombre;
    private String apellidos;
    private String email;
    private String fotoPerfil;
    private List<PeliculaVistaDto> historial = new ArrayList<>();

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getApellidos() { return apellidos; }
    public void setApellidos(String apellidos) { this.apellidos = apellidos; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getFotoPerfil() { return fotoPerfil; }
    public void setFotoPerfil(String fotoPerfil) { this.fotoPerfil = fotoPerfil; }
    public List<PeliculaVistaDto> getHistorial() { return historial; }
    public void setHistorial(List<PeliculaVistaDto> historial) { this.historial = historial; }
}

class PeliculaVistaDto {
    private Long id;
    private Long tmdbId;
    private Integer puntuacion;
    private boolean visto;
    private String comentario;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getTmdbId() { return tmdbId; }
    public void setTmdbId(Long tmdbId) { this.tmdbId = tmdbId; }
    public Integer getPuntuacion() { return puntuacion; }
    public void setPuntuacion(Integer puntuacion) { this.puntuacion = puntuacion; }
    public boolean isVisto() { return visto; }
    public void setVisto(boolean visto) { this.visto = visto; }
    public String getComentario() { return comentario; }
    public void setComentario(String comentario) { this.comentario = comentario; }
}