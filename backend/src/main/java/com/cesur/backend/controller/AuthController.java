package com.cesur.backend.controller;

import com.cesur.backend.model.Role;
import com.cesur.backend.model.Usuario;
import com.cesur.backend.repository.UsuarioRepository;
import com.cesur.backend.service.JwtService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UsuarioRepository usuarioRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        UserDetails user = usuarioRepository.findByEmail(request.getEmail()).orElseThrow();
        String token = jwtService.getToken(user);

        return ResponseEntity.ok(new AuthResponse(token));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        // Validar contraseña compleja manualmente si no usamos anotaciones
        // (8 chars, 1 mayus, 1 numero, 1 especial)
        String regex = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\\S+$).{8,}$";
        if (!request.getPassword().matches(regex)) {
            return ResponseEntity.badRequest().build(); // Contraseña débil
        }

        Usuario user = new Usuario();
        user.setUsername(request.getUsername());
        user.setNombre(request.getNombre());
        user.setApellidos(request.getApellidos());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // ¡Encriptamos!
        user.setRole(Role.USER); // Por defecto todos son USER

        usuarioRepository.save(user);

        String token = jwtService.getToken(user);
        return ResponseEntity.ok(new AuthResponse(token));
    }
}

// Clases auxiliares (DTOs) para recibir los datos.
// Ponlas en archivos aparte o al final de este archivo (sin 'public').
// Recuerda generar Getters/Setters si Lombok falla.

@Data
class LoginRequest {
    private String email;
    private String password;
}

@Data
class RegisterRequest {
    private String username;
    private String nombre;
    private String apellidos;
    private String email;
    private String password;
}

@Data
class AuthResponse {
    private String token;

    public AuthResponse(String token) {
        this.token = token;
    }
}