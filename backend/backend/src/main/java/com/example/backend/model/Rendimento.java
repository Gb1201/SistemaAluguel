package com.example.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "rendimento")
public class Rendimento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String entidadeEmpregadora;

    private Double valor;

    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    
    public Rendimento() {
    }

    
    public Rendimento(String entidadeEmpregadora, Double valor, Cliente cliente) {
        this.entidadeEmpregadora = entidadeEmpregadora;
        this.valor = valor;
        this.cliente = cliente;
    }

   

    public Long getId() {
        return id;
    }

    public String getEntidadeEmpregadora() {
        return entidadeEmpregadora;
    }

    public void setEntidadeEmpregadora(String entidadeEmpregadora) {
        this.entidadeEmpregadora = entidadeEmpregadora;
    }

    public Double getValor() {
        return valor;
    }

    public void setValor(Double valor) {
        this.valor = valor;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }
}
