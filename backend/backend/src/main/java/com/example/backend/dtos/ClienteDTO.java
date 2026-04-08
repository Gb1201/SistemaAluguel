package com.example.backend.dtos;

import com.example.backend.model.Cliente;

public class ClienteDTO {

    private Long id;
    private String nome;

    public ClienteDTO() {
    }

    public ClienteDTO(Cliente cliente) {
        this.id   = cliente.getId();
        this.nome = cliente.getNome();
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }
}
