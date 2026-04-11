package com.example.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "usuario")
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    @Column(unique = true)
    private String email;

    private String senha;

    public Usuario() {}

    public Usuario(String nome) {
        this.nome = nome;
    }

    public Long getId(){ return id; }
    public void setId(Long id){ this.id = id; }

    public String getNome(){ return nome; }
    public void setNome(String n){ this.nome = n; }

    public String getEmail(){ return email; }
    public void setEmail(String e){ this.email = e; }

    public String getSenha(){ return senha; }
    public void setSenha(String s){ this.senha = s; }
}