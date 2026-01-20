package com.cesur.backend.config;

import com.cesur.backend.model.Role;
import com.cesur.backend.model.Usuario;
import com.cesur.backend.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initDatabase(UsuarioRepository repository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Solo creamos el usuario si no existe (aunque con ddl-auto=create siempre estará vacío al inicio)
            if (repository.findByEmail("admin@correo.com").isEmpty()) {
                Usuario admin = new Usuario();
                admin.setUsername("admin");
                admin.setNombre("Administrador");
                admin.setApellidos("Sistema");
                admin.setEmail("admin@correo.com");
                // IMPORTANTE: Aquí encriptamos la contraseña que pediste
                admin.setPassword(passwordEncoder.encode("Prueba123??"));
                admin.setRole(Role.ADMIN); // O Role.USER, según tengas definido tu Enum

                repository.save(admin);
                System.out.println("✅ USUARIO ADMIN CREADO: admin@correo.com / Prueba123??");
            }
        };
    }
}