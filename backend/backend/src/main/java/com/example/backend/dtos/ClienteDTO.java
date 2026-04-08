package com.example.backend.dtos;

import com.example.backend.model.Cliente;

public class ClienteDTO {

    private String nome;

    
    public ClienteDTO() {
    }

    
    public ClienteDTO(Cliente cliente) {
        this.nome = cliente.getNome();
    }

    // Getter e Setter
    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }
}
