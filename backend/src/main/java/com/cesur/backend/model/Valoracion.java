package com.cesur.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "valoraciones")
public class Valoracion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relación con Usuario
    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    // Relación con Película
    @ManyToOne
    @JoinColumn(name = "pelicula_id", nullable = false)
    private Pelicula pelicula;

    // Puntuación opcional (1-10)
    private Integer puntuacion;

    // Reseña opcional
    @Column(length = 2000)
    private String resena;

    // Dónde la vio
    @Enumerated(EnumType.STRING)
    private Plataforma plataforma; // CASA o CINE

    // Fecha en que la vio
    private LocalDate fechaVista;

    // --- CONSTRUCTOR VACÍO (Obligatorio para JPA) ---
    public Valoracion() {
    }

    // --- GETTERS Y SETTERS MANUALES (Aquí está la solución a tu error) ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    // ¡Este es el método que Java no encontraba!
    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Pelicula getPelicula() {
        return pelicula;
    }

    public void setPelicula(Pelicula pelicula) {
        this.pelicula = pelicula;
    }

    public Integer getPuntuacion() {
        return puntuacion;
    }

    public void setPuntuacion(Integer puntuacion) {
        this.puntuacion = puntuacion;
    }

    public String getResena() {
        return resena;
    }

    public void setResena(String resena) {
        this.resena = resena;
    }

    public Plataforma getPlataforma() {
        return plataforma;
    }

    public void setPlataforma(Plataforma plataforma) {
        this.plataforma = plataforma;
    }

    public LocalDate getFechaVista() {
        return fechaVista;
    }

    public void setFechaVista(LocalDate fechaVista) {
        this.fechaVista = fechaVista;
    }

    // --- LÓGICA AUTOMÁTICA ---
    @PrePersist
    public void prePersist() {
        if (this.fechaVista == null) {
            this.fechaVista = LocalDate.now();
        }
    }
}