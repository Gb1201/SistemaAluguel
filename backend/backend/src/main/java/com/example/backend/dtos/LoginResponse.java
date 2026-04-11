package com.example.backend.dtos;

public class LoginResponse {

    private Long id;
    private String nome;
    private String email;
    private String tipo; // "cliente" ou "agente"

    public LoginResponse() {}

    public LoginResponse(Long id, String nome, String email, String tipo) {
        this.id    = id;
        this.nome  = nome;
        this.email = email;
        this.tipo  = tipo;
    }

    public Long getId()     { return id; }
    public String getNome() { return nome; }
    public String getEmail(){ return email; }
    public String getTipo() { return tipo; }
}
