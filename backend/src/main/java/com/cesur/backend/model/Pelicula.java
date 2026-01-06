package com.cesur.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "peliculas")
public class Pelicula {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;
    private String director;
    private Integer duracion; // en minutos
    private String genero;

    @Column(length = 1000)
    private String imagenUrl;

    @Column(length = 2000)
    private String sinopsis;

    // Constructor vacío
    public Pelicula() {
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getDirector() { return director; }
    public void setDirector(String director) { this.director = director; }

    public Integer getDuracion() { return duracion; }
    public void setDuracion(Integer duracion) { this.duracion = duracion; }

    public String getGenero() { return genero; }
    public void setGenero(String genero) { this.genero = genero; }

    public String getImagenUrl() { return imagenUrl; }
    public void setImagenUrl(String imagenUrl) { this.imagenUrl = imagenUrl; }

    public String getSinopsis() { return sinopsis; }
    public void setSinopsis(String sinopsis) { this.sinopsis = sinopsis; }
}