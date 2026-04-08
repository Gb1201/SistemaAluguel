package com.example.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;

@Entity
@PrimaryKeyJoinColumn(name = "id")
public class Agente extends Usuario {

    private String cnpj;

   
    public Agente() {
    }

   
    public Agente(String nome, String cnpj) {
        super(nome);
        this.cnpj = cnpj;
    }

    
    public String getCnpj() {
        return cnpj;
    }

    
    public void setCnpj(String cnpj) {
        this.cnpj = cnpj;
    }
}
