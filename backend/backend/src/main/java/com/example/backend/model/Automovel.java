package com.example.backend.model;

import com.example.backend.enums.StatusAutomovel;

import jakarta.persistence.*;

@Entity
@Table(name = "automovel")
public class Automovel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer ano;
    private String marca;
    private String modelo;

    @Column(unique = true)
    private String placa;

    @Enumerated(EnumType.STRING)
    private StatusAutomovel status;

   
    public Automovel() {
    }

    
    public Automovel(Integer ano, String marca, String modelo, String placa) {
        this.ano = ano;
        this.marca = marca;
        this.modelo = modelo;
        this.placa = placa;
        this.status = StatusAutomovel.DISPONIVEL; // padrão
    }

   

    public Long getId() {
        return id;
    }

    public Integer getAno() {
        return ano;
    }

    public void setAno(Integer ano) {
        this.ano = ano;
    }

    public String getMarca() {
        return marca;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public String getModelo() {
        return modelo;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public String getPlaca() {
        return placa;
    }

    public void setPlaca(String placa) {
        this.placa = placa;
    }


    public void setId(Long id) {
        this.id = id;
    }


    public StatusAutomovel getStatus() {
        return status;
    }


    public void setStatus(StatusAutomovel status) {
        this.status = status;
    }

    
}
