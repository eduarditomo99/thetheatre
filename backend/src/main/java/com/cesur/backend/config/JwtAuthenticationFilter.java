package com.cesur.backend.config;

import com.cesur.backend.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtService jwtService, UserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        // --- DEBUG: Ver qué ruta se está pidiendo ---
        String path = request.getServletPath();

        // --- SOLUCIÓN: Si es Login o Registro, SALTAMOS este filtro ---
        if (path.contains("/api/auth")) {
            System.out.println("DEBUG JWT: Saltando filtro para ruta de Auth: " + path);
            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        // Si no hay token o no empieza por Bearer, dejamos pasar la petición
        // (Spring Security se encargará de bloquearla si no es pública)
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);

        try {
            // Extraemos el email del token
            userEmail = jwtService.getUsername(jwt);
        } catch (Exception e) {
            System.out.println("DEBUG JWT: Token inválido o expirado");
            filterChain.doFilter(request, response);
            return;
        }

        // Si encontramos email y el usuario no está autenticado todavía en el contexto
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

            // Validamos el token contra el usuario
            if (jwtService.isTokenValid(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // Marcamos al usuario como autenticado
                SecurityContextHolder.getContext().setAuthentication(authToken);
                System.out.println("DEBUG JWT: Usuario autenticado correctamente: " + userEmail);
            }
        }

        // Continuamos con el siguiente filtro
        filterChain.doFilter(request, response);
    }
}