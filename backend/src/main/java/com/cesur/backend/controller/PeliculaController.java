package com.cesur.backend.controller;

import com.cesur.backend.model.Pelicula;
import com.cesur.backend.service.PeliculaService;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/peliculas")
public class PeliculaController {

    private final PeliculaService peliculaService;

    // Constructor manual
    public PeliculaController(PeliculaService peliculaService) {
        this.peliculaService = peliculaService;
    }

    // GET MODIFICADO: Ahora detecta quién eres y filtra
    @GetMapping
    public List<Pelicula> obtenerPeliculas(Principal principal) {
        if (principal != null) {
            // Si el usuario está logueado (tiene Token), filtramos las vistas
            return peliculaService.listarPeliculasParaHome(principal.getName());
        } else {
            // Si no está logueado (y la seguridad lo permitiera), mostramos todas
            return peliculaService.listarTodas();
        }
    }

    @PostMapping
    public Pelicula crearPelicula(@RequestBody Pelicula pelicula) {
        return peliculaService.guardarPelicula(pelicula);
    }
}