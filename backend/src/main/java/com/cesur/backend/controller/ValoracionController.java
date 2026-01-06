package com.cesur.backend.controller;

import com.cesur.backend.model.Valoracion;
import com.cesur.backend.service.ValoracionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/valoraciones")
public class ValoracionController {

    private final ValoracionService valoracionService;

    public ValoracionController(ValoracionService valoracionService) {
        this.valoracionService = valoracionService;
    }

    // POST: Marcar película como vista / puntuar
    // URL: /api/valoraciones/pelicula/1
    @PostMapping("/pelicula/{peliculaId}")
    public ResponseEntity<Valoracion> valorarPelicula(
            @PathVariable Long peliculaId,
            @RequestBody Valoracion valoracion,
            Principal principal) { // 'principal' contiene el usuario del Token

        // Obtenemos el email del usuario logueado
        String email = principal.getName();

        Valoracion guardada = valoracionService.crearValoracion(email, peliculaId, valoracion);
        return ResponseEntity.ok(guardada);
    }

    // GET: Ver mi historial
    @GetMapping("/mi-historial")
    public List<Valoracion> verMiHistorial(Principal principal) {
        return valoracionService.obtenerHistorialUsuario(principal.getName());
    }
}