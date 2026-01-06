package com.cesur.backend.controller;

import com.cesur.backend.model.Role;
import com.cesur.backend.model.Usuario;
import com.cesur.backend.repository.UsuarioRepository;
import com.cesur.backend.service.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioRepository usuarioRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    // Constructor manual (Sustituye a @RequiredArgsConstructor)
    public AuthController(UsuarioRepository usuarioRepository,
                          JwtService jwtService,
                          PasswordEncoder passwordEncoder,
                          AuthenticationManager authenticationManager) {
        this.usuarioRepository = usuarioRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        UserDetails user = usuarioRepository.findByEmail(request.getEmail()).orElseThrow();
        String token = jwtService.getToken(user);

        return ResponseEntity.ok(new AuthResponse(token));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        System.out.println("DEBUG - Username: " + request.getUsername());
        System.out.println("DEBUG - Email: " + request.getEmail());
        System.out.println("DEBUG - Password: " + request.getPassword());
        String regex = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!?])(?=\\S+$).{8,}$";
        if (!request.getPassword().matches(regex)) {
            return ResponseEntity.badRequest().build();
        }

        Usuario user = new Usuario();
        user.setUsername(request.getUsername());
        user.setNombre(request.getNombre());
        user.setApellidos(request.getApellidos());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);

        usuarioRepository.save(user);

        String token = jwtService.getToken(user);
        return ResponseEntity.ok(new AuthResponse(token));
    }
}

// --- CLASES AUXILIARES CON GETTERS Y SETTERS MANUALES ---

class LoginRequest {
    private String email;
    private String password;

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}


class RegisterRequest {
    private String username;
    private String nombre;
    private String apellidos;
    private String email;
    private String password;


    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getApellidos() { return apellidos; }
    public void setApellidos(String apellidos) { this.apellidos = apellidos; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}

class AuthResponse {
    private String token;

    public AuthResponse(String token) { this.token = token; }
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
}