package com.cesur.backend.controller;

import com.cesur.backend.model.Usuario;
import com.cesur.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping
    public List<Usuario> obtenerTodos() {
        return usuarioRepository.findAll();
    }

    @GetMapping("/perfil")
    public ResponseEntity<?> obtenerMiPerfil() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        Usuario user = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return ResponseEntity.ok(new UserProfileDto(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getNombre(),
                user.getApellidos()
        ));
    }

    @PutMapping("/perfil")
    public ResponseEntity<?> actualizarMiPerfil(@RequestBody UserProfileDto datosNuevos) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        Usuario user = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        user.setNombre(datosNuevos.getNombre());
        user.setApellidos(datosNuevos.getApellidos());

        usuarioRepository.save(user);

        return ResponseEntity.ok("Perfil actualizado con éxito");
    }
}

class UserProfileDto {
    private Long id;
    private String username;
    private String email;
    private String nombre;
    private String apellidos;

    public UserProfileDto() {}

    public UserProfileDto(Long id, String username, String email, String nombre, String apellidos) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.nombre = nombre;
        this.apellidos = apellidos;
    }

    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getApellidos() { return apellidos; }
    public void setApellidos(String apellidos) { this.apellidos = apellidos; }
}