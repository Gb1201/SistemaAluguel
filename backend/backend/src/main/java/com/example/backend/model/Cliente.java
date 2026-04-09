package com.example.backend.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrimaryKeyJoinColumn;

@Entity
@PrimaryKeyJoinColumn(name = "id")
public class Cliente extends Usuario {

    private String rg;
    private String cpf;
    private String endereco;
    private String profissao;

    @JsonManagedReference // serializa normalmente — inclui a lista de rendimentos
    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Rendimento> rendimentos;

    public Cliente() {}

    public Cliente(String nome, String rg, String cpf, String endereco, String profissao) {
        super(nome);
        this.rg  = rg;
        this.cpf= cpf;
        this.endereco  = endereco;
        this.profissao = profissao;
    }

    public String getRg(){ return rg; }
    public void setRg(String rg){ this.rg = rg; }

    public String getCpf(){ return cpf; }
    public void setCpf(String cpf){ this.cpf = cpf; }

    public String getEndereco(){ return endereco; }
    public void setEndereco(String endereco){ this.endereco = endereco; }

    public String getProfissao(){ return profissao; }
    public void setProfissao(String profissao){ this.profissao = profissao; }

    public List<Rendimento> getRendimentos(){ return rendimentos; }
    public void setRendimentos(List<Rendimento> r){ this.rendimentos = r; }
}
