package com.example.backend.service;

import com.example.backend.dtos.LoginRequest;
import com.example.backend.dtos.LoginResponse;
import com.example.backend.model.Cliente;
import com.example.backend.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private ClienteRepository clienteRepository;

    // login fixo e sem banco
    private static final String AGENTE_EMAIL = "agente@alugafacil.com";
    private static final String AGENTE_SENHA = "agente123";

    public LoginResponse login(LoginRequest request) {

        // Verifica se é o agente fixo
        if (AGENTE_EMAIL.equals(request.getEmail())) {
            if (!AGENTE_SENHA.equals(request.getSenha())) {
                throw new RuntimeException("Email ou senha inválidos.");
            }
            return new LoginResponse(null, "Agente", AGENTE_EMAIL, "agente");
        }

        // Caso contrário, busca como cliente no banco
        Cliente cliente = clienteRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("Email ou senha inválidos."));

        if (!cliente.getSenha().equals(request.getSenha())) {
            throw new RuntimeException("Email ou senha inválidos.");
        }

        return new LoginResponse(cliente.getId(), cliente.getNome(), cliente.getEmail(), "cliente");
    }
}