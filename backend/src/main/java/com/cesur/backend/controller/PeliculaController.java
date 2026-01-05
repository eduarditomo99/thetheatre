package com.cesur.backend.controller;

import com.cesur.backend.model.Pelicula;
import com.cesur.backend.service.PeliculaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/peliculas")
public class PeliculaController {

    @Autowired
    private PeliculaService peliculaService;

    @GetMapping
    public List<Pelicula> listarPeliculas() {
        return peliculaService.obtenerTodas();
    }

    @GetMapping("/{id}")
    public Optional<Pelicula> obtenerPelicula(@PathVariable Long id) {
        return peliculaService.obtenerPorId(id);
    }

    @PostMapping
    public Pelicula crearPelicula(@RequestBody Pelicula pelicula) {
        return peliculaService.guardarPelicula(pelicula);
    }

    @DeleteMapping("/{id}")
    public void eliminarPelicula(@PathVariable Long id) {
        peliculaService.borrarPelicula(id);
    }
}