package com.cesur.backend.config;

import com.cesur.backend.model.Role;
import com.cesur.backend.model.Usuario;
import com.cesur.backend.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Comprobamos si existe el usuario admin por su email
        if (usuarioRepository.findByEmail("admin@correo.com").isEmpty()) {
            Usuario admin = new Usuario();
            admin.setNombre("Administrador");
            admin.setApellidos("Sistema");
            admin.setUsername("admin");
            admin.setEmail("admin@correo.com");
            admin.setPassword(passwordEncoder.encode("Prueba123??"));
            admin.setRole(Role.ADMIN);

            usuarioRepository.save(admin);
            System.out.println("------------------------------------------------");
            System.out.println(" USUARIO ADMIN CREADO AUTOMÁTICAMENTE");
            System.out.println(" Email: admin@correo.com");
            System.out.println(" Pass:  Prueba123??");
            System.out.println("------------------------------------------------");
        } else {
            System.out.println("ℹEl usuario admin ya existe, no es necesario crearlo!");
        }
    }
}