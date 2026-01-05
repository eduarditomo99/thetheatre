package com.cesur.backend.model;

import com.cesur.backend.model.enums.Plataforma;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
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
    // Usamos Integer (objeto) en vez de int (primitivo) para permitir nulos (null)
    private Integer puntuacion;

    // Reseña opcional
    @Column(length = 2000)
    private String resena;

    // Dónde la vio
    @Enumerated(EnumType.STRING)
    private Plataforma plataforma; // CASA o CINE

    // Fecha en que la vio (se guarda automáticamente la fecha actual al crear)
    private LocalDate fechaVista;

    // Este método se ejecuta justo antes de guardar en la BD
    @PrePersist
    public void prePersist() {
        if (this.fechaVista == null) {
            this.fechaVista = LocalDate.now();
        }
    }
}